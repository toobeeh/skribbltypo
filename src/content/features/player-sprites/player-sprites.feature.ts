import { InventoryApi, type MemberDto, type SpriteDto } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { LobbyItemsService } from "@/content/services/lobby-items/lobby-items.service";
import { LobbyPlayersService } from "@/content/services/lobby-players/lobby-players.service";
import type { SkribblLobbyPlayer } from "@/content/services/lobby-players/skribblLobbyPlayer";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { MemberService } from "@/content/services/member/member.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
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
  @inject(LobbyItemsService) private readonly _lobbyItemsService!: LobbyItemsService;
  @inject(LobbyPlayersService) private readonly _lobbyPlayersService!: LobbyPlayersService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;

  public readonly name = "Player Sprites";
  public readonly description =
    "Display sprites of typo players in lobbies and on the landing page";
  public readonly featureId = 20;

  private _spritesSubscription?: Subscription;
  private readonly _lobbyPlayerSpriteContainers = new Map<number, SpriteContainer>();

  protected override async onActivate() {
    const sprites = (await this._apiDataSetup.complete()).sprites;

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
        switchMap(([players, key]) => key === null ?
          this._memberService.member$.pipe(
            switchMap(async (member) => {
              if(!member) return {items: [], players};
              const items = member ? await this.createPracticeItems(member) : [];
              return {items, players};
            })
          ) : this._lobbyItemsService.onlineItems$.pipe(
            map((items) => ({
              items: key ? items.filter((item) => item.lobbyKey === key) : [],
              players
            }))
          )
        )
      )
      .subscribe(({items, players}) => {
        this.updateLobbySprites(
          players,
          items,
          sprites,
        );
      });
  }

  protected override async onDestroy() {
    this._spritesSubscription?.unsubscribe();
  }

  private updateLobbySprites(players: SkribblLobbyPlayer[], lobbyItems: OnlineItemDto[], sprites: SpriteDto[]) {

    // add new players to map with empty sprite container
    for (const player of players) {
      if (!this._lobbyPlayerSpriteContainers.has(player.id)) {
        this._lobbyPlayerSpriteContainers.set(player.id, new SpriteContainer({
          target: player.avatarContainer,
          props: {
            sprites: []
          }
        }));
      }
    }

    // update sprite containers
    for (const [id, container] of this._lobbyPlayerSpriteContainers) {
      const player = players.find((player) => player.id === id);

      // remove container if player is not in lobby anymore
      if (!player) {
        container.$destroy();
        this._lobbyPlayerSpriteContainers.delete(id);
      }

      // update container if player is in lobby
      else {
        const playerSprites = lobbyItems.filter((sprite) =>
          sprite.type === OnlineItemTypeDto.Sprite && sprite.lobbyPlayerId === id);
        const playerShifts = lobbyItems.filter((sprite) =>
          sprite.type === OnlineItemTypeDto.SpriteShift && sprite.lobbyPlayerId === id);

        const playerSlots: spriteSlot[] = playerSprites.map((sprite) => {
          const spriteData = sprites.find((s) => s.id === sprite.itemId);
          if(spriteData === undefined) throw new Error(`Sprite with id ${sprite.itemId} not found`);

          return {
            sprite: spriteData,
            slot: sprite.slot,
            shift: playerShifts.find((shift) => shift.slot === sprite.itemId)?.itemId
          };
        });

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

    this._logger.info("Updated lobby sprites", players, lobbyItems);
  }

  private async createPracticeItems(member: MemberDto): Promise<OnlineItemDto[]> {
    this._logger.debug("Creating practice items for member", member);

    const api = this._apiService.getApi(InventoryApi);
    const spriteInventory = await api.getMemberSpriteInventory({ login: Number(member.userLogin) });
    const sceneInventory = await api.getMemberSceneInventory({ login: Number(member.userLogin) });

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

    if(sceneInventory.activeId !== undefined){
      items.push({
        itemId: sceneInventory.activeId,
        type: OnlineItemTypeDto.Scene,
        lobbyPlayerId: 0,
        slot: 0,
        lobbyKey: "practice",
      });

      if(sceneInventory.activeShift !== undefined){
        items.push({
          itemId: sceneInventory.activeShift,
          type: OnlineItemTypeDto.SceneTheme,
          lobbyPlayerId: 0,
          slot: sceneInventory.activeId,
          lobbyKey: "practice",
        });
      }
    }

    return items;
  }
}