import { type AwardDto, type AwardInventoryDto, InventoryApi, type MemberDto } from "@/api";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { CloudService } from "@/content/features/controls-cloud/cloud.service";
import { LobbyConnectionService } from "@/content/features/lobby-status/lobby-connection.service";
import { ApiService } from "@/content/services/api/api.service";
import { ChatService } from "@/content/services/chat/chat.service";
import { LobbyItemsService } from "@/content/services/lobby-items/lobby-items.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { MemberService } from "@/content/services/member/member.service";
import { type componentDataFactory, ModalService } from "@/content/services/modal/modal.service";
import { PlayersService } from "@/content/services/players/players.service";
import {
  type anonymousPlayerIdentification,
  isAnonymousPlayerIdentification,
  type SkribblPlayerDisplay,
} from "@/content/services/players/skribblPlayerDisplay.interface";
import { ToastService } from "@/content/services/toast/toast.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { type OnlineItemDto, OnlineItemTypeDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { fromObservable } from "@/util/store/fromObservable";
import { calculateLobbyKey } from "@/util/typo/lobbyKey";
import { inject } from "inversify";
import { combineLatestWith, map, type Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import AwardsDisplay from "./awards-display.svelte";
import AwardsComponent from "./player-awards.svelte";
import AwardPicker from "./player-awards-award-picker.svelte";

export class PlayerAwardsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(LobbyConnectionService) private readonly _lobbyConnectionService!: LobbyConnectionService;
  @inject(ChatService) private readonly _chatService!: ChatService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(LobbyItemsService) private readonly _lobbyItemsService!: LobbyItemsService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(PlayersService) private readonly _lobbyPlayersService!: PlayersService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(CloudService) private readonly _cloudService!: CloudService;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEventListener!: LobbyLeftEventListener;

  public readonly name = "Awards";
  public readonly description = "Award drawings of other typo players with special awards";
  public readonly tags = [
    FeatureTag.SOCIAL,
    FeatureTag.PALANTIR
  ];
  public readonly featureId = 41;

  public override readonly toggleEnabled = false;

  private _enableAwardAnimationSetting = this.useSetting(
    new BooleanExtensionSetting("animation", true, this)
      .withName("Award Animation")
      .withDescription("Show an animation over the canvas when a player is awarded"),
  );

  private _awardedSubscription?: Subscription;
  private _lobbyItemsSubscription?: Subscription;
  private _lobbyLeftSubscription?: Subscription;
  private _awardsContainers = new Map<SkribblPlayerDisplay, AwardsDisplay>();
  private _awardsComponent?: AwardsComponent;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    const apiData = await this._apiDataSetup.complete();

    /* component for picker and animation */
    const component = this._awardsComponent = new AwardsComponent({
      target: elements.canvasWrapper,
      props: {
        feature: this,
        currentAwardPresentation: undefined as (AwardDto | undefined)
      },
    });

    /* listen to lobby left and reset current award or pending awards */
    this._lobbyLeftSubscription = this._lobbyLeftEventListener.events$.subscribe(() => {
      this._cloudService.clearPendingAwardInventoryIds();
      component.$set({ currentAwardPresentation: undefined });
    });

    /* listen to received awards, print message and show animation */
    this._awardedSubscription = this._lobbyConnectionService.awardGifted$.pipe(
      withLatestFrom(this._lobbyService.lobby$)
    ).subscribe(([award, lobby]) => {
      const awardDto = apiData.awards.find((a) => a.id === award.awardId);

      const awarder = lobby?.players.find(p => p.id === award.awarderLobbyPlayerId)?.name ?? "Unknown";
      const title = `${awarder} awarded this with a ${awardDto?.name ?? "Award"}!`;
      const message = `\n${awardDto?.description}`;
      this._chatService.addChatMessage(message, title, "info");
      component.$set({ currentAwardPresentation: structuredClone(awardDto) });
      this._cloudService.addPendingAwardInventoryId(award.awardInventoryId);
    });

    /* update award icons */
    this._lobbyItemsSubscription = this._lobbyItemsService.onlineItems$.pipe(
      withLatestFrom(this._lobbyPlayersService.players$)
    ).subscribe(([items, players]) => {
      this.updatePlayerAwards(players, items, apiData.awards);
    });
  }

  protected override async onDestroy(): Promise<void> {
    this._awardsComponent?.$destroy();
    this._awardedSubscription?.unsubscribe();
    this._lobbyItemsSubscription?.unsubscribe();
    this._lobbyLeftSubscription?.unsubscribe();
    this._awardedSubscription = undefined;
    this._lobbyItemsSubscription = undefined;
    this._awardsComponent = undefined;
    this._lobbyLeftSubscription = undefined;

    this._cloudService.clearPendingAwardInventoryIds();

    this._awardsContainers.forEach((container) => container.$destroy());
    this._awardsContainers.clear();
  }

  public get memberStore() {
    return fromObservable(this._memberService.member$, undefined);
  }

  /**
   * A store that determines whether it is currently allowed to gift an award
   */
  public get playerAwardableStore() {
    return fromObservable(
      this._lobbyItemsService.onlineItems$.pipe(
        combineLatestWith(this._lobbyService.lobby$),
        map(([items, lobby]) => {
          if (
            lobby === null || lobby.id === null
            || lobby.drawerId === undefined
            || lobby.drawerId === lobby.meId
          ) return false;

          const lobbyKey = calculateLobbyKey(lobby.id);
          const isAwardee = items.some(
            (item) => item.lobbyKey === lobbyKey && item.lobbyPlayerId === lobby.drawerId,
          );
          return isAwardee;
        }),
      ),
      false,
    );
  }

  get awardsAnimationSettingStore(){
    return this._enableAwardAnimationSetting.store;
  }

  /**
   * Updates the player award icons according to onlineitems and playerdisplays
   * @param players
   * @param items
   * @param awards
   * @private
   */
  private async updatePlayerAwards(
    players: SkribblPlayerDisplay[],
    items: OnlineItemDto[],
    awards: AwardDto[],
  ) {
    this._logger.debug("Updating player awards", players);

    /* remove player containers that are not present anymore */
    for (const [playerDisplay, container] of this._awardsContainers) {
      if (!players.includes(playerDisplay)) {
        container.$destroy();
        this._awardsContainers.delete(playerDisplay);
      }
    }

    /* update all current player displays if changed, or add if not existing */
    for (const player of players) {

      /* update display without icons display */
      const iconsDisplay = player.iconsContainer;
      if(iconsDisplay === null) continue;

      const identification = player.typoId;
      let container = this._awardsContainers.get(player);

      if (!container) {
        container = new AwardsDisplay({
          target: iconsDisplay,
          props: {
            awards: [],
            playerDisplay: player,
          },
        });
        this._awardsContainers.set(player, container);
      }

      let playerAwards: AwardDto[] = [];

      /* get items for player */
      if (isAnonymousPlayerIdentification(identification)) {
        playerAwards = this.getAwardsForAnonymousPlayerDisplay(identification, items, awards);
      } else if (!isAnonymousPlayerIdentification(identification)) {
        playerAwards = [];
      } else {
        this._logger.warn("Unknown player identification", identification);
      }

      const existingAwards = container.getAwards();
      const awardsUpdated = playerAwards.length !== existingAwards.length || playerAwards.some((award, index) => existingAwards[index].id !== award.id);

      if(awardsUpdated){
        container.$set({ awards: playerAwards });
      }
    }
  }

  /**
   * Get award dtos for player based on current online items
   * @param identification
   * @param items
   * @param awards
   * @private
   */
  private getAwardsForAnonymousPlayerDisplay(
    identification: anonymousPlayerIdentification,
    items: OnlineItemDto[],
    awards: AwardDto[],
  ) {
    const playerItems = items.filter(
      (item) =>
        item.lobbyPlayerId === identification.lobbyPlayerId &&
        item.lobbyKey === identification.lobbyKey,
    );
    const playerAwards = playerItems.filter((item) => item.type === OnlineItemTypeDto.Award);
    return playerAwards
      .map(awardItem => awards.find(award => awardItem.itemId === award.id))
      .filter(award => award !== undefined
    );
  }

  /**
   * Open the award picker to select an award from  the current inventory
   * @param member
   */
  public async promptAwardSelection(member: MemberDto): Promise<AwardInventoryDto | undefined> {
    this._logger.debug("Opening award picker");

    const awardInventory = await this._apiService.getApi(InventoryApi).getMemberAvailableAwardInventory({login: Number(member.userLogin)});
    const pickerComponent: componentDataFactory<AwardPicker, AwardInventoryDto> = {
      componentType: AwardPicker,
      propsFactory: submit => ({
        awards: awardInventory,
        onPick: submit.bind(this),
      }),
    };

    const award = await this._modalService.showPrompt(
      pickerComponent.componentType,
      pickerComponent.propsFactory,
      "Award Picker",
      "card"
    );

    this._logger.debug("Award picker closed", award);
    return award;
  }

  /**
   * Give an award to the current drawer
   * @param inventoryId
   */
  public async giveAward(inventoryId: number){
    this._logger.debug("Giving award to current drawer", inventoryId);

    try {
      await this._lobbyConnectionService.connection.hub.giftAward({awardInventoryId: inventoryId});
    }
    catch(e){
      this._logger.error("Failed to gift award", e);
      await this._toastService.showToast("Failed to gift award");
    }
  }
}