import { FeatureTag } from "@/app/core/feature/feature-tags";
import { ChatService, type pendingElement, type pendingMessage } from "@/app/services/chat/chat.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { PlayersService } from "@/app/services/players/players.service";
import { SkribblChatPlayer } from "@/app/services/players/skribblChatPlayer";
import type { SkribblPlayerDisplay } from "@/app/services/players/skribblPlayerDisplay.interface";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { createElement } from "@/util/document/appendElement";
import { calculateLobbyKey } from "@/util/typo/lobbyKey";
import { filter, map, type Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import SkribblAvatar from "@/lib/skribbl-avatar/skribbl-avatar.svelte";

export class ChatAvatarsFeature extends TypoFeature {
  @inject(ChatService) private readonly _chatService!: ChatService;
  @inject(PlayersService) private readonly _playersService!: PlayersService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly name = "Chat Avatars";
  public readonly description = "Display the avatar of a player next to their chat messages.";
  public readonly tags = [FeatureTag.INTERFACE];
  public readonly featureId = 50;
  private readonly _avatarContainers = new Set<{element: HTMLElement, player: SkribblPlayerDisplay }>();
  protected override readonly featureEnabledDefault = false;

  private _chatSubscription?: Subscription;
  private _chatMutationObserver?: MutationObserver;
  protected override async onActivate() {
    this._chatSubscription = this._chatService.playerMessageReceived$
      .pipe(
        withLatestFrom(
          this._lobbyService.lobby$.pipe(
            map((lobby) => (lobby?.id ? calculateLobbyKey(lobby.id) : null)),
          ),
        ),
        filter(([, key]) => key !== null),
      )
      .subscribe(async ([message, key]) => this.processNewMessage(message, key));

    /* observe removed messages from chat and destroy avatars */
    this.observeRemovedMessages();
  }

  protected override async onDestroy() {
    this._chatSubscription?.unsubscribe();
    this._chatSubscription = undefined;
    this._playersService.clearChatPlayers();

    for (const container of this._avatarContainers) {
      container.element.remove();
    }
    this._avatarContainers.clear();
    this._chatMutationObserver?.disconnect();
    this._chatMutationObserver = undefined;
  }

  private async processNewMessage(message:  pendingMessage & pendingElement, key: string | null){
    this._logger.info("Processing new chat message", message);
    if (key === null) {
      this._logger.warn("No lobby key found for chat message", message);
      return;
    }

    /* create a wrapper to display next to chat name */
    const skribblPlayer = message.player.player;
    const container = createElement(`<div
        style="display: inline-flex; align-items: center; height: 0; vertical-align: middle; margin-right: .5rem"
      ></div>`);

    /* create a avatar display */
    const avatar = new SkribblAvatar({
      target: container,
      props: {
        avatar: skribblPlayer.avatar,
        size: "1rem",
      },
    });
    message.element.insertAdjacentElement("afterbegin", container);
    const avatarContainer = await avatar.element;

    /* create a sprite display and register */
    const display = new SkribblChatPlayer(skribblPlayer, key, avatarContainer);
    this._avatarContainers.add({element: container, player: display});
    this._playersService.addChatPlayer(display);
  }

  private async observeRemovedMessages() {
    const elements = await this._elementsSetup.complete();
    this._chatMutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {

        /* find disconnected elements after a chat element got removed */
        if (mutation.removedNodes.length > 0) {
          this._avatarContainers.forEach((container) => {
            if(!container.element.isConnected) {
              this._playersService.removeChatPlayer(container.player);
              this._avatarContainers.delete(container);
            }
          });
        }
      }
    });

    this._chatMutationObserver.observe(elements.chatContent, {
      childList: true,
      subtree: true,
    });
  }
}