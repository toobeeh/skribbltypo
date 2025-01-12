import { MessageSentEventListener } from "@/content/events/message-sent.event";
import { TypoChallenge } from "@/content/features/toolbar-challenges/challenge";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { inject } from "inversify";
import {
  combineLatestWith,
  distinctUntilChanged,
  map,
  type Observable,
  of,
  switchMap,
  take,
} from "rxjs";

export class OneShotChallenge extends TypoChallenge<boolean> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(MessageSentEventListener) private readonly _messageSentEventListener!: MessageSentEventListener;

  private _style?: CSSStyleSheet;

  readonly name = "One Shot";
  readonly description = "You have only one try to guess the word.";

  createTriggerObservable(): Observable<boolean> {
    return this._lobbyService.lobby$.pipe(
      combineLatestWith(this._drawingService.drawingState$),
      map(([lobby, drawing]) => {
        return drawing === "drawing"
          && lobby !== null && (lobby.meId !== lobby.drawerId)
          && !lobby.players.some(player => player.id === lobby.meId && player.guessed);
      }),
      distinctUntilChanged(),
      switchMap(trigger => trigger === false ? of(false) :
          this._messageSentEventListener.events$.pipe(
            take(1),
            map(() => true),
          )
      )
    );
  }

  async apply(trigger: boolean): Promise<void> {

    if(trigger) {
      if(!this._style){
        this._style = new CSSStyleSheet();
        this._style.insertRule("#game form.chat-form { display: none }");
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, this._style];
      }
    }
    else {
      if(this._style) {
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter(style => style !== this._style);
        this._style = undefined;
      }
    }

    return;
  }

  destroy(): Promise<void> {
    return this.apply(false);
  }
}