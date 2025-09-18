import { FeatureTag } from "@/app/core/feature/feature-tags";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { fromObservable } from "@/util/store/fromObservable";
import { distinctUntilChanged, exhaustMap, interval, map, of, scan, Subject, type Subscription, switchMap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import ChatPing from "./chat-ping.svelte";

export class ChatPingFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "Ping Display";
  public readonly description =
    "Shows a small box with the current skribbl game ping above the chat input";
  public readonly tags = [FeatureTag.INFORMATION];
  public readonly featureId = 52;
  public override readonly featureEnabledDefault = false;

  private _currentPing$ = new Subject<number | undefined>();
  private _pingSubscription?: Subscription;

  private _pingElement?: ChatPing;

  protected override async onActivate() {
    const elements = await this._elements.complete();

    this._pingElement = new ChatPing({
      target: elements.chatForm,
      props: {
        feature: this,
      },
    });

    this._pingSubscription = this._lobbyService.lobby$.pipe(
      map(lobby => lobby != null),
      distinctUntilChanged(),
      switchMap(inLobby => inLobby ?

        /* if in lobby, measure every 5s and accumulate to past 5 measurements */
        interval(5000).pipe(
          exhaustMap(() => this.measurePing()),
          scan((acc, curr) => [curr, ...acc.slice(0, 5)], [] as number[])
        ) :

        /* if not, don't measure and reset */
        of([])
      ),

      /* map to average time */
      map((pings) => pings.length === 0 ? undefined :
        Math.round(pings.reduce((a, b) => a + b, 0) / pings.length)
      ),
    ).subscribe(ping => this._currentPing$.next(ping));
  }

  protected override async onDestroy() {
    this._pingSubscription?.unsubscribe();
    this._pingSubscription = undefined;
    this._pingElement?.$destroy();
    this._pingElement = undefined;
  }

  public get pingStore() {
    return fromObservable(
      this._currentPing$,0
    );
  }

  private async measurePing(): Promise<number> {
    this._logger.info("Measuring ping");
    const now = performance.now();
    await fetch("./credits?this_is_for_ping_measure&now=" + now, { cache: "no-store" });
    return performance.now() - now;
  }
}