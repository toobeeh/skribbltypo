import { type SceneDto } from "@/api";
import { LobbyItemsService } from "@/content/services/lobby-items/lobby-items.service";
import { MemberService } from "@/content/services/member/member.service";
import { PlayersService } from "@/content/services/players/players.service";
import {
  type anonymousPlayerIdentification,
  type concretePlayerIdentification, isAnonymousPlayerIdentification, type SkribblPlayerDisplay,
} from "@/content/services/players/skribblPlayerDisplay.interface";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { type OnlineItemDto, OnlineItemTypeDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { inject } from "inversify";
import {
  combineLatestWith, firstValueFrom,
  type Subscription,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import SceneContainer from "./scene-container.svelte";

export interface activeScene {
  scene: SceneDto;
  shift: number | undefined;
}

export class PlayerScenesFeature extends TypoFeature {
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(LobbyItemsService) private readonly _lobbyItemsService!: LobbyItemsService;
  @inject(PlayersService) private readonly _lobbyPlayersService!: PlayersService;
  @inject(MemberService) private readonly _memberService!: MemberService;

  public readonly name = "Player Scenes";
  public readonly description =
    "Display scenes of typo players in lobbies and on the landing page";
  public readonly featureId = 21;
  public override readonly toggleEnabled = false;
  public override developerFeature = true;

  private _scenesSubscription?: Subscription;
  private readonly _sceneContainers = new Map<SkribblPlayerDisplay, SceneContainer>();

  protected override async onActivate() {
    const scenes = (await this._apiDataSetup.complete()).scenes;

    this._scenesSubscription = this._lobbyPlayersService.players$.pipe(
      combineLatestWith(this._lobbyItemsService.onlineItems$, this._memberService.memberData$) /* add member data to triggers */
    ).subscribe(([players, items]) => {
      this.updatePlayerScenes(players, items, scenes);
    });
  }

  protected override async onDestroy() {
    this._scenesSubscription?.unsubscribe();

    this._sceneContainers.forEach((container) => container.$destroy());
    this._sceneContainers.clear();
  }

  /**
   * Updates the scenes of the players in the lobby
   * @param players
   * @param lobbyItems
   * @param scenes
   * @private
   */
  private async updatePlayerScenes(players: SkribblPlayerDisplay[], lobbyItems: OnlineItemDto[], scenes: SceneDto[]) {
    this._logger.debug("Updating player scenes", players);

    /* remove player containers that are not present anymore */
    for(const [playerDisplay, container] of this._sceneContainers){
      if(!players.includes(playerDisplay)){
        container.$destroy();
        this._sceneContainers.delete(playerDisplay);
      }
    }

    /* update all current player displays if changed, or add if not existing */
    for(const player of players) {
      const identification = player.typoId;
      let container = this._sceneContainers.get(player);

      if (!container) {
        container = new SceneContainer({
          target: player.backgroundContainer,
          props: {
            scene: undefined,
            playerDisplay: player
          }
        });
        this._sceneContainers.set(player, container);
      }

      let playerItems: OnlineItemDto[] = [];

      /* get items for player */
      if (isAnonymousPlayerIdentification(identification)) {
        playerItems = this.getItemsForAnonymousPlayerDisplay(identification, lobbyItems);
      } else if (!isAnonymousPlayerIdentification(identification)) {
        playerItems = await this.getItemsForConcretePlayerDisplay(identification);
      } else {
        this._logger.warn("Unknown player identification", identification);
      }

      /* create scene from items */
      const scene = this.createSceneFromItems(playerItems, scenes);
      const sceneUpdated = container.getScene()?.scene.id !== scene?.scene.id || container.getScene()?.shift !== scene?.shift;

      if(sceneUpdated){
        this._logger.info("Updating scene for player", player, scene, playerItems);
        container.$set({ scene: scene });
      }
    }

  }

  public getItemsForAnonymousPlayerDisplay(identification: anonymousPlayerIdentification, items: OnlineItemDto[]){
    return items.filter((item) => item.lobbyPlayerId === identification.lobbyPlayerId && item.lobbyKey === identification.lobbyKey);
  }

  private async getItemsForConcretePlayerDisplay(identification: concretePlayerIdentification) {
    return await this.createItemsForMember(identification.login);
  }

  /**
   * Creates scene data from the online items of a player
   * @param playerItems
   * @param scenes
   * @private
   */
  private createSceneFromItems(playerItems: OnlineItemDto[], scenes: SceneDto[]): activeScene | undefined {
    const playerScene = playerItems.find((scene) =>
      scene.type === OnlineItemTypeDto.Scene);
    const playerShift = playerItems.find((item) =>
      item.type === OnlineItemTypeDto.SceneTheme && item.slot === playerScene?.itemId);

    if(playerScene === undefined) return undefined;

    const scene = scenes.find((scene) => scene.id === playerScene.itemId);
    if(scene === undefined) {
      this._logger.warn("Scene not found", playerScene.itemId);
      return undefined;
    }

    return {
      scene: scene,
      shift: playerShift?.itemId
    };
  }

  /**
   * Creates dummy scene items for the currently logged in member
   * @private
   * @param login
   */
  private async createItemsForMember(login: number): Promise<OnlineItemDto[]> {
    this._logger.debug("Creating demo scene items for member", login);

    const sceneInventory = (await firstValueFrom(this._memberService.memberData$))?.sceneInventory;
    if(sceneInventory === undefined) return [];

    const items: OnlineItemDto[] = [];
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