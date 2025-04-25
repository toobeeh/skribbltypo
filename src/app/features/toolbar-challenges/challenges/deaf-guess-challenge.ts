import { TypoChallenge } from "@/app/features/toolbar-challenges/challenge";
import { ChatService } from "@/app/services/chat/chat.service";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { createStylesheet, type stylesheetHandle } from "@/util/document/applyStylesheet";
import { inject } from "inversify";
import { combineLatestWith, distinctUntilChanged, map, type Observable, type Subscription } from "rxjs";

export class DeafGuessChallenge extends TypoChallenge<boolean> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ChatService) private readonly _chatService!: ChatService;

  private _blurredMessages?: HTMLElement[];
  private _style?: stylesheetHandle;
  private _messagesSubscription?: Subscription;

  readonly name = "Deaf Guess";
  readonly description = "When guessing, you don't see hints or messages from other people.";

  createTriggerObservable(): Observable<boolean> {
    return this._lobbyService.lobby$.pipe(
      combineLatestWith(this._drawingService.drawingState$),
      map(([lobby, drawing]) => {
        return drawing === "drawing"
          && lobby !== null && (lobby.meId !== lobby.drawerId)
          && !lobby.players.some(player => player.id === lobby.meId && player.guessed);
      }),
      distinctUntilChanged(),
    );
  }

  async apply(trigger: boolean): Promise<void> {

    if(trigger) {

      /* subscribe to new chat messages and collect content elements */
      if(!this._messagesSubscription){
        this._messagesSubscription = this._chatService.playerMessageReceived$.subscribe(message => {
          if(this._blurredMessages){
            this._blurredMessages.push(message.contentElement);
          }
          else {
            this._blurredMessages = [message.contentElement];
          }
          message.element.classList.add("typo-challenge-deaf-guess-hidden");
        });
      }

      /* set the style for the challenge effects */
      if(!this._style){
        this._style = createStylesheet();
        this._style.sheet.insertRule(".typo-challenge-deaf-guess-hidden span, .player-bubble .content .text { filter: blur(3px); }");
        this._style.sheet.insertRule("#game form.chat-form .characters, #game-word .hints { opacity: 0 }");
      }
    }

    else {

      /* stop subscription, remove blurred messages and style */
      this._messagesSubscription?.unsubscribe();
      this._messagesSubscription = undefined;
      this._blurredMessages?.forEach(message => message.classList.remove("typo-challenge-deaf-guess-hidden"));
      this._blurredMessages = undefined;
      this._style?.remove();
      this._style = undefined;
    }

    return;
  }

  destroy(): Promise<void> {
    return this.apply(false);
  }
}