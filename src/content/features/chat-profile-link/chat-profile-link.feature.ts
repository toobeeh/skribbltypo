import { ChatService } from "@/content/services/chat/chat.service";
import type { SkribblLobbyPlayer } from "@/content/services/lobby-players/skribblLobbyPlayer";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import type { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import ChatProfileLink from "./chat-profile-link.svelte";

export class ChatProfileLinkFeature extends TypoFeature {

  @inject(ChatService) private readonly _chatService!: ChatService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(ElementsSetup) private _elementsSetup!: ElementsSetup;

  public readonly name = "Chat Profile Link";
  public readonly description = "Open player profiles by clicking their name in the chat.";
  public readonly featureId = 23;

  private _subscription?: Subscription;
  private _addedElements: {titleElement: HTMLElement, player: SkribblLobbyPlayer}[] = [];
  private _component?: ChatProfileLink;
  private _clickHandler = this.chatClicked.bind(this);

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    this._component = new ChatProfileLink({target: elements.chatContent});

    /* listen for messages and add handler for click */
    this._subscription = this._chatService.messageReceived$.subscribe(({titleElement, player}) => {
      titleElement.classList.add("typo-chat-profile-link");
      this._addedElements.push({ titleElement, player });
    });
    elements.chatContent.addEventListener("click", this._clickHandler);
  }

  protected override async onDestroy() {
    const elements = await this._elementsSetup.complete();
    elements.chatContent.removeEventListener("click", this._clickHandler);
    this._subscription?.unsubscribe();

    this._addedElements.forEach(({titleElement}) => titleElement.classList.remove("typo-chat-profile-link"));
    this._addedElements = [];
    this._component?.$destroy();
  }

  private async chatClicked(event: MouseEvent) {
    if(event.target instanceof HTMLElement && event.target.classList.contains("typo-chat-profile-link")) {
      const element = this._addedElements.find(e => e.titleElement === event.target);
      if (element) {
        element.player.container.click();
      }
      else {
        await this._toastService.showToast("Player Profile not found");
      }
    }
  }
}