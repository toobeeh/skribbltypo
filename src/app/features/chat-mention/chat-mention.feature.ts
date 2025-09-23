import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { ChatService } from "@/app/services/chat/chat.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import { createElement } from "@/util/document/appendElement";
import { DomEventSubscription } from "@/util/rxjs/domEventSubscription";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { BehaviorSubject, filter, map, Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import SuggestionPopover from "./suggestion-popover.svelte";

export class ChatMentionFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbySvc!: LobbyService;
  @inject(ChatService) private readonly _chatSvc!: ChatService;

  public readonly name = "Pings and Replies";
  public readonly description =
    "Lets you reply to messages, ping others, and highlights when you're pinged.";
  public readonly tags = [FeatureTag.INTERFACE, FeatureTag.SOCIAL];
  public readonly featureId = 53;

  private _enablePopover = this.useSetting(
    new BooleanExtensionSetting("ping_suggestions", true, this)
      .withName("Ping Autocomplete")
      .withDescription("Shows an keyboard-navigable autocomplete window for pings."),
  );

  private chatSubscription?: Subscription;

  private _flyoutComponent?: AreaFlyout = undefined;
  private _flyoutSubscription?: Subscription;

  private _playerCandidates$ = new BehaviorSubject<string[]>([]);
  private playerCandidates: string[] = [];
  private _kbSelectedPlayerIndex$ = new BehaviorSubject<number>(0);
  private kbSelectedPlayerIndex = 0;
  private replyButton?: HTMLButtonElement;
  private currentHoveringMessage?: HTMLElement;

  private _keyupEvents?: DomEventSubscription<"keyup">;
  private _keydownEvents?: DomEventSubscription<"keydown">;

  protected override async onActivate() {
    const elements = await this._elements.complete();

    // reusable observable pipe for mentions
    const mentionData$ = this._chatSvc.playerMessageReceived$.pipe(
      withLatestFrom(this._lobbySvc.lobby$),
      map(([msg, lobby]) => {
        if(!lobby) return undefined;

        const players = lobby.players.map((person) => person.name);
        const self = lobby.players.find((x) => x.id == lobby?.meId);

        if(self === undefined) return undefined;

        return {msg, players, self};
      })
    );

    this.chatSubscription = mentionData$.pipe(
      filter(data => data !== undefined)
    ).subscribe(data => {
      this.onMessage(data.msg.contentElement, data.msg.content, data.self.name, data.players);
    });

    this._keyupEvents = new DomEventSubscription(elements.chatInput, "keyup");
    this._keydownEvents = new DomEventSubscription(elements.chatInput, "keydown");

    /* DomEventSubscription observable are completed in onDestroy, no unsubscription needed */
    this._keyupEvents.events$.pipe(
      withLatestFrom(mentionData$.pipe(filter(data => data !== undefined)))
    ).subscribe(([, data]) => this.onChatInput(data.players));
    this._keydownEvents.events$.subscribe((e) => this.specialKeyboardHandling(e));

    this.createReplyButton();
    for (const e of elements.chatContent.children)
      this.addMouseoverListenerToMessage(e as HTMLElement);
  }

  protected override async onDestroy() {
    this.chatSubscription?.unsubscribe();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();

    this._keyupEvents?.unsubscribe();
    this._keydownEvents?.unsubscribe();
    this._keyupEvents = undefined;
    this._keydownEvents = undefined;
  }

  private async createReplyButton() {
    const input = (await this._elements.complete()).chatInput;

    const button = createElement(`
      <button style="position:absolute; right:0; bottom:0;">
        <img src="/img/undo.gif" width="25" height="25" />
      </button>
    `) as HTMLButtonElement;

    this.replyButton = button;
    this.replyButton.onclick = () => {
      const senderEle = this.currentHoveringMessage?.children[0] as HTMLElement;
      if (!senderEle) return;
      const prepend = `@${senderEle.innerText.slice(0, -2)} `;
      if (input === undefined) return;
      let iv = input.value;
      if (iv === undefined) return this._logger.error("input value is undefined somehow");
      if (!iv.startsWith(prepend)) iv = prepend + iv;
      input.value = iv;
    };
  }

  private addMouseoverListenerToMessage(element: HTMLElement) {
    element.addEventListener("pointerover", () => {
      this.currentHoveringMessage = element;
      if (!this.replyButton) return this._logger.error("reply button is not set?");
      this.currentHoveringMessage.appendChild(this.replyButton);
      this.currentHoveringMessage.style.position = "relative";
    });
    element.addEventListener("pointerleave", () => {
      if (this.currentHoveringMessage == element) {
        this.currentHoveringMessage.style.position = "block";
        this.currentHoveringMessage = undefined;
      }
      this.replyButton?.remove();
    });
  }

  private onMessage(element: HTMLElement, content: string, myName: string, players: string[]) {
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
      for (const player of players) {
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

  private async onChatInput(players: string[]) {
    const input = (await this._elements.complete()).chatInput;
    const value = input.value;
    if (value.trim().length === 0) return;

    if (value.indexOf("@") == -1) return;
    const toComplete = value.split("@").at(-1);
    if (!toComplete) {
      this._flyoutComponent?.close();
      this._flyoutComponent = undefined;
      return;
    }

    const matches = players.filter(
      (person) => person.startsWith(toComplete) && person != toComplete,
    );
    if (matches.length == 0) {
      this._flyoutComponent?.close();
      this._flyoutComponent = undefined;
      return;
    }

    this._logger.debug("matches:", matches);

    this.playerCandidates = matches;
    this._playerCandidates$.next(matches);
    await this.showAutocomplete();
  }

  private async showAutocomplete() {
    if (!(await this._enablePopover.getValue())) return;
    if (this._flyoutComponent !== undefined) return;

    const elements = await this._elements.complete();

    /* create fly out content */
    const flyoutContent: componentData<SuggestionPopover> = {
      componentType: SuggestionPopover,
      props: {
        feature: this
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

  public async autocompleteSelected(name: string) {
    const input = (await this._elements.complete()).chatInput;

    const val = input.value;
    const atIndex = val.lastIndexOf("@");
    if (atIndex === -1) return;
    const strip = val.slice(0, atIndex);
    const newval = `${strip}@${name}`;
    input.value = newval;

    this._flyoutComponent?.close();
    input.focus();
    this._kbSelectedPlayerIndex$.next(0);
  }

  public get playerCandidatesStore() {
    return fromObservable(this._playerCandidates$, this._playerCandidates$.value);
  }

  public get kbSelectedPlayerIndexStore() {
    return fromObservable(this._kbSelectedPlayerIndex$, this._kbSelectedPlayerIndex$.value);
  }
}
