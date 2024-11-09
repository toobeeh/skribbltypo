import { InventoryApi, type MemberDto, type SpriteDto } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { LobbyItemsService } from "@/content/services/lobby-items/lobby-items.service";
import { LobbyPlayersService } from "@/content/services/lobby-players/lobby-players.service";
import type { SkribblLobbyPlayer } from "@/content/services/lobby-players/skribblLobbyPlayer";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { MemberService } from "@/content/services/member/member.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { LandingPlayerDisplaySetup } from "@/content/setups/landing-player-display/landing-player-display.setup";
import { type OnlineItemDto, OnlineItemTypeDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { calculateLobbyKey } from "@/util/typo/lobbyKey";
import { inject } from "inversify";
import {
  combineLatestWith,
  distinctUntilChanged,
  map,
  type Subscription,
  switchMap
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import SpriteContainer from "./sprite-container.svelte";

export interface spriteSlot {
  sprite: SpriteDto;
  slot: number;
  shift: number | undefined;
}

export class PlayerSpritesFeature extends TypoFeature {
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(LandingPlayerDisplaySetup) private readonly _landingPlayerSetup!: LandingPlayerDisplaySetup;
  @inject(LobbyItemsService) private readonly _lobbyItemsService!: LobbyItemsService;
  @inject(LobbyPlayersService) private readonly _lobbyPlayersService!: LobbyPlayersService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;

  public readonly name = "Player Sprites";
  public readonly description =
    "Display sprites of typo players in lobbies and on the landing page";
  public readonly featureId = 20;
  public override readonly toggleEnabled = false;

  private _spritesSubscription?: Subscription;
  private readonly _lobbyPlayerSpriteContainers = new Map<HTMLElement, SpriteContainer>();
  private _landingSpriteContainer?: SpriteContainer;

  protected override async onActivate() {
    const sprites = (await this._apiDataSetup.complete()).sprites;
    const landingPlayer = await this._landingPlayerSetup.complete();

    this._landingSpriteContainer = new SpriteContainer({
      target: landingPlayer.avatarContainer,
      props: {
        sprites: [],
        playerDisplay: landingPlayer
      }
    });

    this._spritesSubscription = this._lobbyPlayersService.players$
      .pipe(

        /* add lobby key to each player update */
        combineLatestWith(this._lobbyService.lobby$.pipe(
          map((lobby) => lobby?.id),
          map((lobbyId) => (lobbyId ? calculateLobbyKey(lobbyId) : lobbyId))
        )),

        /* do not update while still in practice or landing*/
        distinctUntilChanged(([, key1], [, key2]) =>  key2 === null && key1 === null || key1 === undefined && key2 === undefined),

        /* if practice lobby, create items from player data, else combine with real lobby items */
        switchMap(([players, key]) => key === null || key === undefined ?
          this._memberService.member$.pipe(
            switchMap(async (member) => {
              if(!member) return {items: [], players, landing: key === undefined};
              const items = member ? await this.createDemoItems(member) : [];
              return {items, players, landing: key === undefined};
            })
          ) : this._lobbyItemsService.onlineItems$.pipe(
            map((items) => ({
              items: key ? items.filter((item) => item.lobbyKey === key) : [],
              players,
              landing: false
            }))
          )
        )
      )
      .subscribe(({items, players, landing}) => {

        /* update landing sprites if landing entered */
        if(landing) {
          this.updateLandingSprites(items, sprites);
        }

        /* else update sprites of players in lobby*/
        else {
          this.updateLobbySprites(
            players,
            items,
            sprites,
          );
        }
      });
  }

  protected override async onDestroy() {
    this._spritesSubscription?.unsubscribe();
    this._landingSpriteContainer?.$destroy();
  }

  private updateLandingSprites(items: OnlineItemDto[], sprites: SpriteDto[]){
    const slots = this.createSpriteSlotsFromItems(items, sprites);
    this._landingSpriteContainer?.$set({ sprites: slots });

    this._logger.debug("Updated landing sprites", items);
  }

  /**
   * Updates the sprites of the players in the lobby
   * @param players
   * @param lobbyItems
   * @param sprites
   * @private
   */
  private updateLobbySprites(players: SkribblLobbyPlayer[], lobbyItems: OnlineItemDto[], sprites: SpriteDto[]) {

    // add new players to map with empty sprite container
    for (const player of players) {
      if (!this._lobbyPlayerSpriteContainers.has(player.avatarContainer)) {
        this._lobbyPlayerSpriteContainers.set(player.avatarContainer, new SpriteContainer({
          target: player.avatarContainer,
          props: {
            sprites: [],
            playerDisplay: player
          }
        }));
      }
    }

    // update sprite containers
    for (const [anchor, container] of this._lobbyPlayerSpriteContainers) {
      const player = players.find((player) => player.avatarContainer === anchor);

      // remove container if player is not in lobby anymore
      if (!player) {
        container.$destroy();
        this._lobbyPlayerSpriteContainers.delete(anchor);
      }

      // update container if player is in lobby
      else {
        const playerItems = lobbyItems.filter((sprite) => sprite.lobbyPlayerId === player.id);
        const playerSlots = this.createSpriteSlotsFromItems(playerItems, sprites);

        const existingPlayerSlots: spriteSlot[] = container.getSprites();
        const slotsUpdated = playerSlots.length !== existingPlayerSlots.length || playerSlots.some((slot) => {
          const existingSlot = existingPlayerSlots.find((s) => s.slot === slot.slot);
          return !existingSlot || existingSlot.sprite.id !== slot.sprite.id || existingSlot.shift !== slot.shift;
        });

        if(slotsUpdated){
          container.$set({ sprites: playerSlots });
        }
      }
    }

    this._logger.debug("Updated lobby sprites", players, lobbyItems);
  }

  /**
   * Creates sprite slot data from the online items of a player
   * @param playerItems
   * @param sprites
   * @private
   */
  private createSpriteSlotsFromItems(playerItems: OnlineItemDto[], sprites: SpriteDto[]){
    const playerSprites = playerItems.filter((sprite) =>
      sprite.type === OnlineItemTypeDto.Sprite);
    const playerShifts = playerItems.filter((sprite) =>
      sprite.type === OnlineItemTypeDto.SpriteShift);

    const playerSlots: spriteSlot[] = playerSprites.map((sprite) => {
      const spriteData = sprites.find((s) => s.id === sprite.itemId);
      if(spriteData === undefined) {
        this._logger.warn(`Sprite with id ${sprite.itemId} not found`);
        return undefined;
      }

      return {
        sprite: spriteData,
        slot: sprite.slot,
        shift: playerShifts.find((shift) => shift.slot === sprite.itemId)?.itemId
      };
    }).filter((slot) => slot !== undefined);

    return playerSlots;
  }

  /**
   * Creates dummy sprite items for the currently logged in member
   * @param member
   * @private
   */
  private async createDemoItems(member: MemberDto): Promise<OnlineItemDto[]> {
    this._logger.debug("Creating demo items for member", member);

    const api = this._apiService.getApi(InventoryApi);
    const spriteInventory = await api.getMemberSpriteInventory({ login: Number(member.userLogin) });

    const items: OnlineItemDto[] = spriteInventory.map((sprite) => {
      const item = sprite.slot ? {
        itemId: sprite.spriteId,
        type: OnlineItemTypeDto.Sprite,
        lobbyPlayerId: 0,
        slot: sprite.slot,
        lobbyKey: "practice",
      } : undefined;

      const shift = sprite.colorShift ? {
        itemId: sprite.colorShift,
        type: OnlineItemTypeDto.SpriteShift,
        lobbyPlayerId: 0,
        slot: sprite.spriteId,
        lobbyKey: "practice",
      } : undefined;

      return [item, shift];
    }).flat().filter(item => item !== undefined);

    return items;
  }
}