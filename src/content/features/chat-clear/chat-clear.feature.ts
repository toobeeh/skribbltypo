
import { ExtensionCommand } from "@/content/core/commands/command";
import { InterpretableSuccess } from "@/content/core/commands/results/interpretable-success";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { NumericExtensionSetting } from "@/content/core/settings/setting";
import { LobbyJoinedEventListener } from "@/content/events/lobby-joined.event";
import { ChatService } from "@/content/services/chat/chat.service";
import { scan, Subject, type Subscription, switchMap, tap, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";

export class ChatClearFeature extends TypoFeature {
  @inject(LobbyJoinedEventListener)
  private readonly _lobbyJoinedEventListener!: LobbyJoinedEventListener;
  @inject(ChatService) private readonly _chatService!: ChatService;

  public readonly name = "Chat Clear";
  public readonly description = "Clears old messages in the chat for better performance";
  public readonly tags = [
    FeatureTag.GAMEPLAY,
    FeatureTag.INTERFACE
  ];
  public readonly featureId = 42;

  private _chatSubscription?: Subscription;
  private _chatCleared$ = new Subject<void>();

  private _clearChatCommand = this.useCommand(
    new ExtensionCommand("clear", this, "Clear Chat", "Clears the chat messages"),
  ).run(async (command) => {
    this._chatCleared$.next(undefined);
    return new InterpretableSuccess(command, "Chat cleared");
  });

  private _clearChatQuotaSetting = this.useSetting(
    new NumericExtensionSetting("clear_quota", 200, this)
      .withName("Message Limit")
      .withDescription(
        "When the chat contains more than this limit, old messages are deleted. Set to 0 to disable.",
      ),
  );

  protected override async onActivate() {
    this._chatSubscription = this._lobbyJoinedEventListener.events$
      .pipe(
        switchMap(() =>
          this._chatService.chatMessageAdded$.pipe(
            withLatestFrom(this._clearChatQuotaSetting.changes$),
            scan((acc, [message, limit]) => {

              /* no limit set or limit not reached, accumulate */
              if (limit <= 0 || acc.length < limit) return [...acc, message.element];

              /* else limit reached, delete last and add new */
              acc[0].remove();
              return [...acc.slice(1), message.element];
            }, [] as HTMLElement[]),

            /* lsiten for clear and modify reduced array in-place */
            switchMap(elements => this._chatCleared$.pipe(
              tap(() => {
                elements.forEach(element => element.remove());
                elements.slice(0, elements.length);
              })
            ))
          ),
        ),
      ).subscribe();
  }

  protected override async onDestroy() {
    this._chatSubscription?.unsubscribe();
    this._chatSubscription = undefined;
  }
}