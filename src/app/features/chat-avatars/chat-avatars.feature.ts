import { FeatureTag } from "@/app/core/feature/feature-tags";
import { LobbyJoinedEventListener } from "@/app/events/lobby-joined.event";
import { ChatService } from "@/app/services/chat/chat.service";
import { type Subscription} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";

export class ChatAvatarsFeature extends TypoFeature {
  @inject(LobbyJoinedEventListener)
  private readonly _lobbyJoinedEventListener!: LobbyJoinedEventListener;
  @inject(ChatService) private readonly _chatService!: ChatService;

  public readonly name = "Chat Avatars";
  public readonly description = "Display the avatar of a player next to their chat messages.";
  public readonly tags = [
    FeatureTag.INTERFACE
  ];
  public readonly featureId = 42;

  private _chatSubscription?: Subscription;
  protected override async onActivate() {

    this._chatService.playerMessageReceived$.subscribe((message) => {
      const skribblPlayer = message.player.player;
    });
  }

  protected override async onDestroy() {
    this._chatSubscription?.unsubscribe();
    this._chatSubscription = undefined;
  }
}