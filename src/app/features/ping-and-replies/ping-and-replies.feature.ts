import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { ChatService } from "@/app/services/chat/chat.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { inject } from "inversify";
import { BehaviorSubject, Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";

export class PingAndRepliesFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbySvc!: LobbyService;
  @inject(ChatService) private readonly _chatSvc!: ChatService;

  public readonly name = "Pings and Replies";
  public readonly description =
    "Lets you reply to messages, ping others, and highlights when you're pinged.";
  public readonly tags = [FeatureTag.INTERFACE, FeatureTag.SOCIAL];
  public readonly featureId = 52;

  private readonly _nameCompletionSetting = this.useSetting(
    new BooleanExtensionSetting("ping_and_replies_complete", true, this),
  )
    .withName("Enable suggestions")
    .withDescription("Shows an autocomplete window above the text box when pinging people.");

  private input: HTMLInputElement | undefined;

  private chatSubscription?: Subscription;

  private _playerCandidates$ = new BehaviorSubject<string[] | null>([]);

  protected override async onActivate() {
    this._playerCandidates$.next(null);
    const elements = await this._elements.complete();
    this.input = elements.chatInput;
    this.chatSubscription = this._chatSvc.playerMessageReceived$
      .pipe(withLatestFrom(this._lobbySvc.lobby$))
      .subscribe(([msg, lobby]) => {
        if (!lobby) return;
        const myName = lobby.players.find((x) => x.id == lobby?.meId);
        if (!myName) return;
        this.onMessage(msg.contentElement, msg.content, myName.name);
      });
  }

  protected override async onDestroy() {
    this.chatSubscription?.unsubscribe();
  }

  private onMessage(element: HTMLElement, content: string, myName: string) {
    const lookFor = `@${myName} `;
    // adding a space for pings at end of message
    if (!(content + " ").includes(lookFor)) return;
    element.parentElement?.classList.add("guessed");
  }
}
