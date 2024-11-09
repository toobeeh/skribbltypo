import { InventoryApi, type MemberDto, type SceneDto } from "@/api";
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
import SceneContainer from "./scene-container.svelte";

export interface activeScene {
  scene: SceneDto;
  shift: number | undefined;
}

export class PlayerScenesFeature extends TypoFeature {
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(LandingPlayerDisplaySetup) private readonly _landingPlayerSetup!: LandingPlayerDisplaySetup;
  @inject(LobbyItemsService) private readonly _lobbyItemsService!: LobbyItemsService;
  @inject(LobbyPlayersService) private readonly _lobbyPlayersService!: LobbyPlayersService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;

  public readonly name = "Player Scenes";
  public readonly description =
    "Display scenes of typo players in lobbies and on the landing page";
  public readonly featureId = 21;
  public override readonly toggleEnabled = false;

  private _scenesSubscription?: Subscription;
  private readonly _lobbyPlayerSceneContainers = new Map<HTMLElement, SceneContainer>();
  private _landingSceneContainer?: SceneContainer;

  protected override async onActivate() {
    const scenes = (await this._apiDataSetup.complete()).scenes;
    const landingPlayer = await this._landingPlayerSetup.complete();

    this._landingSceneContainer = new SceneContainer({
      target: landingPlayer.container,
      props: {
        scene: undefined,
        playerDisplay: landingPlayer
      }
    });

    this._scenesSubscription = this._lobbyPlayersService.players$
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
          this.updateLandingScenes(items, scenes);
        }

        /* else update sprites of players in lobby*/
        else {
          this.updateLobbyScenes(
            players,
            items,
            scenes,
          );
        }
      });
  }

  protected override async onDestroy() {
    this._scenesSubscription?.unsubscribe();
    this._landingSceneContainer?.$destroy();
  }

  private updateLandingScenes(items: OnlineItemDto[], scenes: SceneDto[]){
    const scene = this.createSceneFromItems(items, scenes);
    this._landingSceneContainer?.$set({ scene: scene });

    this._logger.debug("Updated landing scene", scene);
  }

  /**
   * Updates the scenes of the players in the lobby
   * @param players
   * @param lobbyItems
   * @param scenes
   * @private
   */
  private updateLobbyScenes(players: SkribblLobbyPlayer[], lobbyItems: OnlineItemDto[], scenes: SceneDto[]) {

    // add new players to map with empty scene container
    for (const player of players) {
      if (!this._lobbyPlayerSceneContainers.has(player.avatarContainer)) {
        this._lobbyPlayerSceneContainers.set(player.avatarContainer, new SceneContainer({
          target: player.backgroundContainer,
          props: {
            scene: undefined,
            playerDisplay: player
          }
        }));
      }
    }

    // update scene containers
    for (const [anchor, container] of this._lobbyPlayerSceneContainers) {
      const player = players.find((player) => player.avatarContainer === anchor);

      // remove container if player is not in lobby anymore
      if (!player) {
        container.$destroy();
        this._lobbyPlayerSceneContainers.delete(anchor);
      }

      // update container if player is in lobby
      else {
        const playerItems = lobbyItems.filter((sprite) => sprite.lobbyPlayerId === player.id);
        const playerScene = this.createSceneFromItems(playerItems, scenes);

        const currentScene = container.getScene();
        const updated = playerScene?.scene !== currentScene?.scene || playerScene?.shift !== currentScene?.shift;

        if(updated){
          container.$set({ scene: playerScene });
        }
      }
    }

    this._logger.debug("Updated lobby scenes", players, lobbyItems);
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
   * @param member
   * @private
   */
  private async createDemoItems(member: MemberDto): Promise<OnlineItemDto[]> {
    this._logger.debug("Creating demo scene items for member", member);

    const api = this._apiService.getApi(InventoryApi);
    const sceneInventory = await api.getMemberSceneInventory({ login: Number(member.userLogin) });
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