import { ChatTypedEventListener } from "@/content/events/chat-typed.event";
import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { combineLatestWith, distinctUntilChanged, map, mergeWith, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import GuessCheck from "./guess-check.svelte";

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
      map(event => event?.data.toLowerCase() ?? ""),
      distinctUntilChanged(),
      combineLatestWith(this._drawingService.imageState$.pipe(
        map(image => {
          if(image === null || image.word.solution !== undefined) return null;
          return image.word.hints.toLowerCase();
        }),
        distinctUntilChanged()
      )),
      map(([guess, hints]) => hints === null ? null : ({
        guess,
        hints,
        overlayContent: this.getOverlayContent(guess, hints)})),
      tap(data => this._logger.debug("Guess Check data update", data))
    );
    return fromObservable(events, null);
  }

  /**
   * fills the guess to the same length as the word/hint
   * @param guess
   * @param hints
   * @private
   */
  private getOverlayContent(guess: string, hints: string){
    guess = guess.slice(0, hints.length);
    const filler = "‎".repeat(hints.length - guess.length);
    return guess + filler;
  }

  /**
   * Whether the character matches a revealed hint or blank or is a filler character
   * @param character
   * @param index
   * @param hints
   */
  public guessMatchesHint(character: string, index: number, hints: string){
    return hints[index] === character || character === "‎" || hints[index] === "_";
  }

  /**
   * Whether the character exactly matches a revealed hint
   * @param character
   * @param index
   * @param hints
   */
  public guessCorrectHint(character: string, index: number, hints: string){
    return hints[index] === character && hints[index] !== "_";
  }
}