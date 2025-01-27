import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { LobbyConnectionService } from "@/content/features/lobby-status/lobby-connection.service";
import { ChatService } from "@/content/services/chat/chat.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import type { DropAnnouncementDto, DropClaimResultDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  BehaviorSubject,
  delay, distinctUntilChanged,
  filter,
  map,
  mergeWith,
  of, pairwise, startWith,
  Subject, type Subscription,
  switchMap,
  tap, withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import DropsComponent from "./drops.svelte";
import DropsInfoComponent from "./drops-info.svelte";

export class DropsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(LobbyConnectionService) private readonly _lobbyConnectionService!: LobbyConnectionService;
  @inject(ChatService) private readonly _chatService!: ChatService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public readonly name = "Drops";
  public readonly description = "Show drops to collect extra bubbles when you're playing";
  public readonly featureId = 40;

  public override get featureManagementComponent(){
    return {componentType: DropsInfoComponent, props: {feature: this}};
  }

  private _component?: DropsComponent;
  private _recordedClaims$ = new BehaviorSubject<DropClaimResultDto[]>([]);
  private _currentDrop$ = new Subject<DropAnnouncementDto | undefined>();
  private _dropSummarySubscription?: Subscription;
  private _dropAnnouncedSubscription?: Subscription;
  private _dropClaimedSubscription?: Subscription;

  private _enableDropSummary = this.useSetting(new BooleanExtensionSetting("drop_summary", true, this)
    .withName("Drop Summary")
    .withDescription("Show a chat message with all drop catches after a drop"));

  private _enableOtherDropNotifications = this.useSetting(new BooleanExtensionSetting("drop_notifications", true, this)
    .withName("Drop Notifications")
    .withDescription("Show a chat message when someone else catches a drop"));

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    const apiData = await this._apiDataSetup.complete();

    this._dropClaimedSubscription = this._lobbyConnectionService.dropClaimed$.subscribe(
      claim => this.processClaim(claim, false)
    );

    this._component = new DropsComponent({
      target: elements.canvasWrapper,
      props: {
        feature: this,
        drops: apiData.drops
      },
    });

    /* process claims and announcements to set/clear the current drop */
    this._dropAnnouncedSubscription = this._lobbyConnectionService.dropAnnounced$.pipe(
      switchMap(drop => of(drop).pipe(
        mergeWith(

          /* set to undefined after timeout of 2s */
          of(undefined).pipe(
            delay(2000)
          ),

          /* set to undefined when someone else clears */
          this._lobbyConnectionService.dropClaimed$.pipe(
            filter(claim => claim.clearedDrop),
            map(() => undefined)
          )
        )
      )),
      tap(drop => this._logger.info("Setting drop", drop))
    ).subscribe(this._currentDrop$);

    /* subscribe to changes in the current drop and build a summary of claims when it's cleared */
    this._dropSummarySubscription = this._currentDrop$.pipe(
      startWith(undefined),
      distinctUntilChanged(),
      pairwise(),
      withLatestFrom(this._recordedClaims$, this._enableDropSummary.changes$)
    ).subscribe(([[prev, current], claims, summaryEnabled]) => {
      if(!summaryEnabled) return;

      const getEmoji = (claim: DropClaimResultDto) => {
        if(claim.clearedDrop) return "🛡️";
        if(claim.firstClaim) return "💎";
        if(claim.leagueMode) return "🧿";
        return "💧";
      };

      /* drop has been cleared */
      if(prev !== undefined && current === undefined){
        const currentClaims = claims.filter(c => c.dropId === prev?.dropId);
        const title = "Drop Summary";
        const content = "\n" + (currentClaims.length === 0 ? "The drop  timed out :(" :  currentClaims
          .map(c => `${getEmoji(c)} ${c.username}: ${c.catchTime}ms (${Math.round(c.leagueWeight * 100)}%)`)
          .join("\n"));

        this._chatService.addChatMessage(content, title, "info");
      }
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._component?.$destroy();
    this._recordedClaims$.next([]);
    this._dropSummarySubscription?.unsubscribe();
    this._dropAnnouncedSubscription?.unsubscribe();
    this._dropClaimedSubscription?.unsubscribe();
    this._dropSummarySubscription = undefined;
    this._dropAnnouncedSubscription = undefined;
    this._dropClaimedSubscription = undefined;
  }

  public get currentDropStore(){
    return fromObservable(
      this._currentDrop$,
      undefined
    );
  }

  public get recordedClaimsStore(){
    return fromObservable(
      this._recordedClaims$,
      []
    );
  }

  /**
   * Send a drop claim and show an error if fails - probably timeout or already cleared
   * @param id
   */
  public async claimDrop(token: string){
    try {
      const result = await this._lobbyConnectionService.connection.hub.claimDrop({ dropToken: token });
      return result;
    }
    catch(e){
      this._logger.error("Failed to claim drop", e);
      await this._toastService.showToast("Failed to claim drop", e + "");
      return undefined;
    }
  }

  /**
   * Add a claim to the recorded claims and show a chat message
   * @param claim
   * @param ownClaim
   */
  public async processClaim(claim: DropClaimResultDto, ownClaim: boolean){
    this._logger.debug("Processing claim", claim);
    this._recordedClaims$.next([...this._recordedClaims$.value, claim]);

    const enabledOtherNotifications = await this._enableOtherDropNotifications.getValue();
    if(!ownClaim && !enabledOtherNotifications) return;

    const title = ownClaim ? "Yeee!" : (claim.clearedDrop ? "Oops.." : "");
    const message = ownClaim ?
      `You caught the drop after ${claim.catchTime}ms (${Math.round(claim.leagueWeight * 100)}%)` :
      (claim.clearedDrop ? `${claim.username} cleared the drop after ${claim.catchTime}ms` :
        `${claim.username} caught the drop after ${claim.catchTime}ms`);

    await this._chatService.addChatMessage(message, title, "info");
  }
}