import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { LobbyConnectionService } from "@/content/features/lobby-status/lobby-connection.service";
import { ChatService } from "@/content/services/chat/chat.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import type { DropAnnouncementDto, DropClaimResultDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { parseSignalRError } from "@/util/signalr/parseErrorOrThrow";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  BehaviorSubject, delay,
  distinctUntilChanged,
  filter,
  map, mergeMap,
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

  public override get featureManagementComponent() {
    return { componentType: DropsInfoComponent, props: { feature: this } };
  }

  private _component?: DropsComponent;
  private _recordedClaims$ = new BehaviorSubject<(DropClaimResultDto & {own: boolean})[]>([]);
  private _currentDrop$ = new Subject<{ drop: DropAnnouncementDto, timestamp: number, ownClaimed: boolean } | undefined>();
  private _dropSummarySubscription?: Subscription;
  private _dropAnnouncedSubscription?: Subscription;

  private _enableDropSummary = this.useSetting(
    new BooleanExtensionSetting("drop_summary", true, this)
      .withName("Drop Summary")
      .withDescription("Show a chat message with all drop catches after a drop"),
  );

  private _enableOtherDropNotifications = this.useSetting(
    new BooleanExtensionSetting("drop_notifications", true, this)
      .withName("Drop Notifications")
      .withDescription("Show a chat message when someone else catches a drop"),
  );

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    const apiData = await this._apiDataSetup.complete();

    this._component = new DropsComponent({
      target: elements.canvasWrapper,
      props: {
        feature: this,
        drops: apiData.drops,
      },
    });

    /* process claims and announcements to set/clear the current drop */
    this._dropAnnouncedSubscription = this._lobbyConnectionService.dropAnnounced$
      .pipe(
        switchMap((drop) =>
          of(drop).pipe(
            mergeWith(
              /* set to undefined after timeout of 2s */
              this._lobbyConnectionService.dropCleared$.pipe(
                filter((clear) => clear.dropId === drop.dropId),
                tap(() => this._logger.info("Drop cleared by server event", drop)),
                map(() => undefined),
                delay(1000) /* delay to make sure all claims have arrived (ping..) */,
              ),

              /* set to undefined when someone else clears */
              this._lobbyConnectionService.dropClaimed$.pipe(
                tap((claim) => this._logger.info("Other claim arrived", claim)),
                mergeMap(async (claim) => {
                  await this.processClaim(claim, false);
                  return claim;
                }),
                filter((claim) => claim.clearedDrop),
                map(() => undefined),
              ),
            ),
          ),
        ),
        tap((drop) => this._logger.info("Setting drop", drop)),
      )
      .subscribe((drop) =>
        this._currentDrop$.next(
          drop === undefined ? undefined : { drop, timestamp: Date.now(), ownClaimed: false },
        ),
      );

    /* subscribe to changes in the current drop and build a summary of claims when it's cleared */
    this._dropSummarySubscription = this._currentDrop$
      .pipe(
        startWith(undefined),
        distinctUntilChanged(),
        pairwise(),
        withLatestFrom(this._recordedClaims$, this._enableDropSummary.changes$),
      )
      .subscribe(([[prev, current], claims, summaryEnabled]) => {
        if (!summaryEnabled) return;

        /* drop has been cleared */
        if (prev !== undefined && current === undefined) {

          const getEmoji = (claim: DropClaimResultDto) => {
            if (claim.clearedDrop) return "🛡️";
            if (claim.firstClaim) return "💎";
            if (claim.leagueMode) return "🧿";
            return "💧";
          };

          const currentClaims = claims.filter((c) => c.dropId === prev?.drop.dropId);
          const title = "Drop Summary";
          const content =
            "\n" +
            (currentClaims.length === 0
              ? "The drop timed out :("
              : currentClaims
                  .map(
                    (c) =>
                      `${getEmoji(c)} ${c.username}: ${c.catchTime}ms (${Math.round(c.leagueWeight * 100)}%)`,
                  )
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
    this._dropSummarySubscription = undefined;
    this._dropAnnouncedSubscription = undefined;
  }

  public get currentDropStore() {
    return fromObservable(this._currentDrop$, undefined);
  }

  public get recordedClaimsStore() {
    return fromObservable(this._recordedClaims$, []);
  }

  /**
   * Send a drop claim and show an error if fails - probably timeout or already cleared
   * @param drop
   * @param timestamp
   */
  public async claimDrop(drop: DropAnnouncementDto, timestamp: number) {
    this._logger.info("Claiming drop after delay", Date.now() - timestamp);

    this._currentDrop$.next({drop, ownClaimed: true, timestamp}); /* claiming phase not finished, but player cannot claim anymore */

    try {
      const result = await this._lobbyConnectionService.connection.hub.claimDrop({
        dropToken: drop.dropToken,
      });
      return result;
    } catch (e) {
      const error = parseSignalRError(e);
      this._logger.error("Failed to claim drop", error);
      await this._toastService.showToast(error.message);
      return undefined;
    }
  }

  /**
   * Add a claim to the recorded claims and show a chat message
   * @param claim
   * @param ownClaim
   */
  public async processClaim(claim: DropClaimResultDto, ownClaim: boolean) {
    this._logger.debug("Processing claim", claim);

    const recordedClaims = [...this._recordedClaims$.value, { ...claim, own: ownClaim }];
    this._recordedClaims$.next(recordedClaims);
    const enabledOtherNotifications = await this._enableOtherDropNotifications.getValue();

    if (ownClaim || enabledOtherNotifications) {
      const previouslyClaimed = recordedClaims.some(c => c.own);
      const title = ownClaim ? "Yeee!" : (claim.clearedDrop && !previouslyClaimed ? "Oops.." : "");
      const message = ownClaim
        ? `You ${claim.clearedDrop ? "cleared" : "caught"} the drop after ${claim.catchTime}ms (${Math.round(claim.leagueWeight * 100)}%)`
        : claim.clearedDrop
          ? `${claim.username} cleared the drop after ${claim.catchTime}ms`
          : `${claim.username} caught the drop after ${claim.catchTime}ms`;
      await this._chatService.addChatMessage(message, title, "info");
    }

    if(ownClaim && claim.clearedDrop) this._currentDrop$.next(undefined); /* finish claiming phase - other than own claim automatically in pipeline cleared */
  }
}