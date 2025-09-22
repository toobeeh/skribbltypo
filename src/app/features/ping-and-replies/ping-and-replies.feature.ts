import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { ChatService } from "@/app/services/chat/chat.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { BehaviorSubject, Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import SuggestionPopover from "./suggestion-popover.svelte";

export class PingAndRepliesFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbySvc!: LobbyService;
  @inject(ChatService) private readonly _chatSvc!: ChatService;

  public readonly name = "Pings and Replies";
  public readonly description =
    "Lets you reply to messages, ping others, and highlights when you're pinged.";
  public readonly tags = [FeatureTag.INTERFACE, FeatureTag.SOCIAL];
  public readonly featureId = 52;

  private _enablePopover = this.useSetting(
    new BooleanExtensionSetting("ping_suggestions", true, this)
      .withName("Ping Autocomplete")
      .withDescription("Shows an keyboard-navigable autocomplete window for pings."),
  );

  private input: HTMLInputElement | undefined;

  private chatSubscription?: Subscription;

  // TODO: currently set on chat message, find api for that
  private currentLobby = ["loading"];
  private _flyoutComponent?: AreaFlyout = undefined;
  private _flyoutSubscription?: Subscription;

  private _playerCandidates$ = new BehaviorSubject<string[]>([]);
  private playerCandidates: string[] = [];
  private _kbSelectedPlayerIndex$ = new BehaviorSubject<number>(0);
  private kbSelectedPlayerIndex = 0;
  private replyButton?: HTMLButtonElement;
  private currentHoveringMessage?: HTMLElement;

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this.input = elements.chatInput;
    this.chatSubscription = this._chatSvc.playerMessageReceived$
      .pipe(withLatestFrom(this._lobbySvc.lobby$))
      .subscribe(([msg, lobby]) => {
        if (!lobby) return;
        this.currentLobby = lobby.players.map((person) => person.name);
        const myName = lobby.players.find((x) => x.id == lobby?.meId);
        if (!myName) return;
        this.onMessage(msg.contentElement, msg.content, myName.name);
      });

    this.input.addEventListener("keyup", () => this.onChatInput());
    this.input.addEventListener("keydown", (e) => this.specialKeyboardHandling(e));
    this.createReplyButton();
    for (const e of elements.chatContent.children)
      this.addMouseoverListenerToMessage(e as HTMLElement);
  }

  protected override async onDestroy() {
    this.chatSubscription?.unsubscribe();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
  }

  private createReplyButton() {
    const button = document.createElement("button");
    // eslint-disable-next-line quotes
    button.innerHTML = '<img src="/img/undo.gif" width="25" height="25" />';
    button.setAttribute("style", "position:absolute;right:0;bottom:0;");
    this.replyButton = button;
    this.replyButton.onclick = () => {
      const senderEle = this.currentHoveringMessage?.children[0] as HTMLElement;
      if (!senderEle) return;
      console.log(
        "replying to person",
        senderEle.innerText.slice(0, -2),
      );
    };
  }

  private addMouseoverListenerToMessage(element: HTMLElement) {
    element.addEventListener("mouseover", () => {
      this.currentHoveringMessage = element;
      if (!this.replyButton) return this._logger.error("reply button is not set?");
      this.currentHoveringMessage.appendChild(this.replyButton);
      this.currentHoveringMessage.style.position = "relative";
    });
    element.addEventListener("mouseleave", () => {
      if (this.currentHoveringMessage == element) {
        this.currentHoveringMessage.style.position = "block";
        this.currentHoveringMessage = undefined;
      }
      this.replyButton?.remove();
    });
  }

  private onMessage(element: HTMLElement, content: string, myName: string) {
    const newElement = document.createElement("span");
    const textSplit = content.split("@");
    for (const [index, text] of textSplit.entries()) {
      const ele = document.createElement("span");
      if (index == 0) {
        ele.innerText = text;
        newElement.append(ele);
        continue;
      }

      let foundPlayer: string | null = null;
      for (const player of this.currentLobby) {
        if (!text.startsWith(player)) continue;
        if (player.length > (foundPlayer?.length || -1)) foundPlayer = player;
      }

      if (!foundPlayer) {
        ele.innerText = `@${text}`;
        newElement.append(ele);
        continue;
      }

      const bolden = document.createElement("b");
      bolden.innerText = `@${foundPlayer}`;
      ele.append(bolden);
      ele.append(document.createTextNode(text.slice(foundPlayer.length)));
      newElement.append(ele);
    }
    element.parentElement?.append(newElement);
    element.remove();
    if (newElement.parentElement !== null)
      this.addMouseoverListenerToMessage(newElement.parentElement);

    const lookFor = `@${myName} `;
    // adding a space for pings at end of message
    if (!(content + " ").includes(lookFor)) return;
    element.parentElement?.classList.add("guessed");
  }

  private specialKeyboardHandling(evt: KeyboardEvent) {
    if (this._flyoutComponent === undefined) return;

    switch (evt.key) {
      case "ArrowUp": {
        let newValue = this.kbSelectedPlayerIndex - 1;
        if (newValue == -1) newValue = this.playerCandidates.length - 1;
        this.kbSelectedPlayerIndex = newValue;
        this._kbSelectedPlayerIndex$.next(newValue);
        evt.preventDefault();
        break;
      }
      case "ArrowDown": {
        let newValue = this.kbSelectedPlayerIndex + 1;
        if (newValue >= this.playerCandidates.length) newValue = 0;
        this.kbSelectedPlayerIndex = newValue;
        this._kbSelectedPlayerIndex$.next(newValue);
        evt.preventDefault();
        break;
      }
      case "Enter":
      case "Tab":
        this.autocompleteSelected(
          this.playerCandidates[this._kbSelectedPlayerIndex$.getValue() || 0],
        );
        evt.preventDefault();
        break;

      case "Escape":
        this._flyoutComponent?.close();
        break;
    }
  }

  private onChatInput() {
    const v = this.input?.value;
    if (v === undefined) return;

    if (v.indexOf("@") == -1) return;
    const toComplete = v.split("@").at(-1);
    if (!toComplete) {
      this._flyoutComponent?.close();
      this._flyoutComponent = undefined;
      return;
    }

    const matches = this.currentLobby.filter(
      (person) => person.startsWith(toComplete) && person != toComplete,
    );
    if (matches.length == 0) {
      this._flyoutComponent?.close();
      this._flyoutComponent = undefined;
      return;
    }

    console.log(matches);
    this.playerCandidates = matches;
    this._playerCandidates$.next(matches);
    this.showAutocomplete();
  }

  private async showAutocomplete() {
    if (!(await this._enablePopover.getValue())) return;
    if (this._flyoutComponent !== undefined) return;

    const elements = await this._elements.complete();

    /* create fly out content */
    const flyoutContent: componentData<SuggestionPopover> = {
      componentType: SuggestionPopover,
      props: {
        feature: this,
        onSelected: (n: string) => this.autocompleteSelected(n),
      },
    };

    /* open flyout and destroy when clicked out */
    this._flyoutComponent = new AreaFlyout({
      target: elements.gameWrapper,
      props: {
        componentData: flyoutContent,
        areaName: "chat",
        maxHeight: "600px",
        maxWidth: "300px",
        marginY: "2.5rem",
        title: "",
        closeStrategy: "explicit",
      },
    });

    this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
      this._flyoutComponent?.$destroy();
      this._flyoutSubscription?.unsubscribe();
      this._flyoutComponent = undefined;
    });
  }

  private autocompleteSelected(name: string) {
    if (this.input === undefined) return;
    const val = this.input.value;
    const atIndex = val.lastIndexOf("@");
    if (atIndex === -1) return;
    const strip = val.slice(0, atIndex);
    const newval = `${strip}@${name}`;
    this.input.value = newval;

    this._flyoutComponent?.close();
    this.input.focus();
    this._kbSelectedPlayerIndex$.next(0);
  }

  public get playerCandidatesStore() {
    return fromObservable(this._playerCandidates$, this._playerCandidates$.value);
  }

  public get kbSelectedPlayerIndexStore() {
    return fromObservable(this._kbSelectedPlayerIndex$, this._kbSelectedPlayerIndex$.value);
  }
}
