import { type SpriteDto } from "@/api";
import { LobbyItemsService } from "@/content/services/lobby-items/lobby-items.service";
import { MemberService } from "@/content/services/member/member.service";
import { PlayersService } from "@/content/services/players/players.service";
import {
  type anonymousPlayerIdentification, type concretePlayerIdentification, isAnonymousPlayerIdentification,
  type SkribblPlayerDisplay,
} from "@/content/services/players/skribblPlayerDisplay.interface";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { type OnlineItemDto, OnlineItemTypeDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { inject } from "inversify";
import {
  combineLatestWith, firstValueFrom,
  type Subscription,
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
  @inject(PlayersService) private readonly _lobbyPlayersService!: PlayersService;
  @inject(MemberService) private readonly _memberService!: MemberService;

  public readonly name = "Player Sprites";
  public readonly description =
    "Display sprites of typo players in lobbies and on the landing page";
  public readonly featureId = 20;
  public override readonly toggleEnabled = false;
  public override developerFeature = true;

  private _spritesSubscription?: Subscription;
  private readonly _spriteContainers = new Map<SkribblPlayerDisplay, SpriteContainer>();

  protected override async onActivate() {
    const sprites = (await this._apiDataSetup.complete()).sprites;

    this._spritesSubscription = this._lobbyPlayersService.players$.pipe(
      combineLatestWith(this._lobbyItemsService.onlineItems$, this._memberService.memberData$) /* add member data to triggers */
    ).subscribe(([players, items]) => {
      this.updatePlayerSprites(players, items, sprites);
    });
  }

  protected override async onDestroy() {
    this._spritesSubscription?.unsubscribe();

    this._spriteContainers.forEach((container) => container.$destroy());
    this._spriteContainers.clear();
  }

  private async updatePlayerSprites(players: SkribblPlayerDisplay[], items: OnlineItemDto[], sprites: SpriteDto[]){
    this._logger.debug("Updating player sprites", players);

    /* remove player containers that are not present anymore */
    for(const [playerDisplay, container] of this._spriteContainers){
      if(!players.includes(playerDisplay)){
        container.$destroy();
        this._spriteContainers.delete(playerDisplay);
      }
    }

    /* update all current player displays if changed, or add if not existing */
    for(const player of players) {
      const identification = player.typoId;
      let container = this._spriteContainers.get(player);

      if (!container) {
        container = new SpriteContainer({
          target: player.avatarContainer,
          props: {
            sprites: [],
            playerDisplay: player
          }
        });
        this._spriteContainers.set(player, container);
      }

      let playerItems: OnlineItemDto[] = [];

      /* get items for player */
      if (isAnonymousPlayerIdentification(identification)) {
        playerItems = this.getItemsForAnonymousPlayerDisplay(identification, items);
      } else if (!isAnonymousPlayerIdentification(identification)) {
        playerItems = await this.getItemsForConcretePlayerDisplay(identification);
      } else {
        this._logger.warn("Unknown player identification", identification);
      }

      const slots = this.createSpriteSlotsFromItems(playerItems, sprites);
      const existingPlayerSlots: spriteSlot[] = container.getSprites();
      const slotsUpdated = slots.length !== existingPlayerSlots.length || slots.some((slot) => {
        const existingSlot = existingPlayerSlots.find((s) => s.slot === slot.slot);
        return !existingSlot || existingSlot.sprite.id !== slot.sprite.id || existingSlot.shift !== slot.shift;
      });

      if (slotsUpdated) {
        this._logger.info("Updating sprite slots for player", player, slots, playerItems);
        container.$set({ sprites: slots });
      }
    }
  }

  private getItemsForAnonymousPlayerDisplay(identification: anonymousPlayerIdentification, items: OnlineItemDto[]){
    return items.filter((item) => item.lobbyPlayerId === identification.lobbyPlayerId && item.lobbyKey === identification.lobbyKey);
  }

  private async getItemsForConcretePlayerDisplay(identification: concretePlayerIdentification) {
    return await this.createItemsForMember(identification.login);
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
        shift: playerShifts.find((shift) => shift.slot === sprite.slot)?.itemId
      };
    }).filter((slot) => slot !== undefined);

    return playerSlots;
  }

  /**
   * Creates dummy sprite items for the currently logged in member
   * @private
   * @param login
   */
  private async createItemsForMember(login: number): Promise<OnlineItemDto[]> {
    this._logger.debug("Creating demo items for member", login);

    const spriteInventory = (await firstValueFrom(this._memberService.memberData$))?.spriteInventory ?? [];

    const items: OnlineItemDto[] = spriteInventory.map((sprite) => {
      const item = sprite.slot ? {
        itemId: sprite.spriteId,
        type: OnlineItemTypeDto.Sprite,
        lobbyPlayerId: 0,
        slot: sprite.slot,
        lobbyKey: "practice",
      } : undefined;

      const shift = sprite.colorShift && sprite.slot ? {
        itemId: sprite.colorShift,
        type: OnlineItemTypeDto.SpriteShift,
        lobbyPlayerId: 0,
        slot: sprite.slot,
        lobbyKey: "practice",
      } : undefined;

      return [item, shift];
    }).flat().filter(item => item !== undefined);

    return items;
  }
}