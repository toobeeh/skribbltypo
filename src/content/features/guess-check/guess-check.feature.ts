import { ChatTypedEventListener } from "@/content/events/chat-typed.event";
import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { combineLatestWith, distinctUntilChanged, map, mergeWith, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import GuessCheck from "./guess-check.svelte";
import { getOverlayContent } from "./guess-overlay";

export class GuessCheckFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ChatTypedEventListener) private readonly _chatTypedEventListener!: ChatTypedEventListener;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEventListener!: LobbyLeftEventListener;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  public readonly name = "Guess Check";
  public readonly description = "Shows an overlay over the word hints to compare your current guess";
  public readonly featureId = 18;

  private _component?: GuessCheck;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._component = new GuessCheck({
      target: elements.hints,
      props: {
        feature: this,
      },
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._component?.$destroy();
  }

  /**
   * emits data every time the user types or the hint changes
   */
  public get guessChangedStore() {
    const events = this._chatTypedEventListener.events$.pipe(
      mergeWith(this._lobbyLeftEventListener.events$.pipe(  /* reset when lobby left */
        map(() => null)
      )),
      map(event => event?.data ?? ""),
      distinctUntilChanged(),
      combineLatestWith(this._drawingService.imageState$.pipe(
        map(image => {
          if(image === null || image.word.solution !== undefined) return null;
          return image.word.hints;
        }),
        distinctUntilChanged()
      )),
      map(([guess, hints]) => hints === null ? null : ({
        guess,
        hints,
        overlayContent: getOverlayContent(guess, hints)})),
      tap(data => this._logger.debug("Guess Check data update", data))
    );
    return fromObservable(events, null);
  }

}