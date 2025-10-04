import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting, ExtensionSetting } from "@/app/core/settings/setting";
import { ChatService, type chatboxEventFilter } from "@/app/services/chat/chat.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import { createElement } from "@/util/document/appendElement";
import { DomEventSubscription } from "@/util/rxjs/domEventSubscription";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  BehaviorSubject,
  combineLatestWith,
  filter,
  map,
  startWith,
  Subscription,
  withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import SuggestionPopover from "./suggestion-popover.svelte";
import VipPlayersManage from "./vip-players-manage.svelte";

export interface VIPPlayer {
  name: string;
  color: string;
  [key: string]: string;
};

const replaceMultiple = (element: Node, children: Node[]) => {
  const parent = element.parentNode;
  if (parent === null) throw new Error("trying to replace element with no parent.");
  const lastChild = children.pop();
  if (lastChild === undefined) throw new Error("provide at least one child");
  parent.replaceChild(lastChild, element);
  let prev = lastChild;
  for (const newChild of children.toReversed()) {
    parent.insertBefore(newChild, prev);
    prev = newChild;
  }
};

const beginIntersect = (s1: string, s2: string) => {
  const loopFor = Math.min(s1.length, s2.length);
  for (let index = 0; index < loopFor; index++) if (s1[index] !== s2[index]) return index;
  return loopFor;
};

export class ChatMessageHighlightingFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbySvc!: LobbyService;
  @inject(ChatService) private readonly _chatSvc!: ChatService;

  public readonly name = "Chat Highlighting";
  public readonly description =
    "Mentions like in Discord and highlighting your and friends' messages.";
  public readonly tags = [FeatureTag.INTERFACE, FeatureTag.SOCIAL];
  public readonly featureId = 54;

  private _enablePopover = this.useSetting(
    new BooleanExtensionSetting("ping_suggestions", true, this)
      .withName("Ping Autocomplete")
      .withDescription("Shows an keyboard-navigable autocomplete window for pings."),
  );

  private _enableSelfHighlighting = this.useSetting(
    new BooleanExtensionSetting("highlight_my_messages", false, this)
      .withName("Highlight My Messages")
      .withDescription("Highlights your own messages.")
  );

  private _enableReplyButton = this.useSetting(
    new BooleanExtensionSetting("enable_reply_button", true, this)
      .withName("Reply Button")
      .withDescription("Add a reply button to ping people from their messages.")
  );

  private chatSubscription?: Subscription;

  private _flyoutComponent?: AreaFlyout = undefined;
  private _flyoutSubscription?: Subscription;

  private _playerCandidates$ = new BehaviorSubject<string[]>([]);
  private _kbSelectedPlayerIndex$ = new BehaviorSubject<number>(0);
  private _kbSelectedPlayerIndex = 0;
  private _replyButton?: HTMLButtonElement;

  private _vipPlayersSetting = new ExtensionSetting<VIPPlayer[]>("vip_players", []);

  private _keyupEvents?: DomEventSubscription<"keyup">;
  private _keydownEvents?: DomEventSubscription<"keydown">;

  private _messagePointeroverEvents?: DomEventSubscription<"pointerover">;
  private _messagePointerleaveEvents?: DomEventSubscription<"pointerleave">;
  private _registeredMessageElements$ = new BehaviorSubject<Set<HTMLElement>>(new Set<HTMLElement>());
  private _currentHoveringMessage$ = new BehaviorSubject<HTMLElement | undefined>(undefined);

  public override get featureManagementComponent(): componentData<VipPlayersManage> {
    return { componentType: VipPlayersManage, props: { feature: this } };
  }

  protected override async onActivate() {
    const elements = await this._elements.complete();

    // reusable observable pipe for mentions
    const mentionData$ = this._chatSvc.playerMessageReceived$.pipe(
      startWith(undefined),
      combineLatestWith(this._lobbySvc.lobby$),
      map(([msg, lobby]) => {
        if(!lobby) return undefined;

        const players = lobby.players.map((person) => person.name);
        const self = lobby.players.find((x) => x.id == lobby?.meId);

        if(self === undefined) return undefined;

        return {msg, players, self};
      })
    );

    this.chatSubscription = mentionData$
      .pipe(filter((data) => data !== undefined))
      .subscribe(({ msg, self, players }) => {
        if (!msg) return; // skip initial value
        this.onMessage(msg.contentElement, msg.player.name, msg.content, self.name, players);
      });

    this._keyupEvents = new DomEventSubscription(elements.chatInput, "keyup");
    this._keydownEvents = new DomEventSubscription(elements.chatInput, "keydown");

    /* DomEventSubscription observable are completed in onDestroy, no unsubscription needed */
    this._keyupEvents.events$.pipe(
      withLatestFrom(mentionData$.pipe(filter(data => data !== undefined)))
    ).subscribe(([, data]) => this.onChatInput(data.players));
    this._keydownEvents.events$.pipe(
      withLatestFrom(this._playerCandidates$)
    ).subscribe(([event, candidates]) => this.specialKeyboardHandling(event, candidates));

    this._messagePointeroverEvents = new DomEventSubscription(elements.chatContent, "pointerover");
    this._messagePointerleaveEvents = new DomEventSubscription(elements.chatContent, "pointerleave");

    this._messagePointeroverEvents.events$.pipe(
      combineLatestWith(this._registeredMessageElements$),
      withLatestFrom(this._enableReplyButton.changes$)
    ).subscribe(([[event, registeredElements], replyBtnEnabled]) => {
      if (!replyBtnEnabled) return;

      const hovered = event.target;
      //if(hovered === null) this._currentHoveringMessage$.next(undefined);

      for(const element of registeredElements) {
        if(element.contains(hovered as Node)) {
          this._currentHoveringMessage$.next(element);
          if (!this._replyButton) return this._logger.error("reply button is not set?");
          element.appendChild(this._replyButton);
          element.style.position = "relative";
          return;
        }
      }

      this._currentHoveringMessage$.next(undefined);
    });

    this._messagePointerleaveEvents.events$.pipe(
      combineLatestWith(this._currentHoveringMessage$)
    ).subscribe(([event, currentHovering]) => {
      if (currentHovering == event.target) {
        currentHovering.style.position = "block";
        this._currentHoveringMessage$.next(undefined);
      }
      this._replyButton?.remove();
    });


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

    this._messagePointerleaveEvents?.unsubscribe();
    this._messagePointeroverEvents?.unsubscribe();
    this._messagePointerleaveEvents = undefined;
    this._messagePointeroverEvents = undefined;
    this._registeredMessageElements$.getValue().clear();
  }

  private async createReplyButton() {
    const input = (await this._elements.complete()).chatInput;

    const button = createElement(`
      <button type="button">
        <img src="/img/undo.gif" width="25" height="25" />
      </button>
    `) as HTMLButtonElement;

    button.style.position = "absolute";
    button.style.right = "0";
    button.style.bottom = "0";
    button.style.backgroundColor = "transparent";

    this._replyButton = button;
    this._replyButton.onclick = () => {
      const senderEle = this._currentHoveringMessage$.value;
      if (!senderEle) return;
      const prepend = `@${senderEle.querySelector("b")?.innerText.slice(0, -2)} `;
      if (input === undefined) return;
      let iv = input.value;
      if (iv === undefined) return this._logger.error("input value is undefined somehow");
      if (!iv.startsWith(prepend)) iv = prepend + iv;

      this._chatSvc.replaceChatboxContent(iv);
    };
  }

  private addMouseoverListenerToMessage(element: HTMLElement) {
   this._registeredMessageElements$.next(this._registeredMessageElements$.value.add(element));
  }

  private async onMessage(
    element: HTMLElement, 
    senderName: string, 
    content: string, 
    myName: string, 
    players: string[],
  ) {
    const eleParent = element.parentElement;
    if (eleParent === null) return this._logger.warn("why doesn't the parent exist");

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.parentElement?.classList.contains("typo-emoji")) continue;
      const textSplit = currentNode.textContent?.split("@") || [];
      if (textSplit.length <= 1) continue;
      const elements: (Text | HTMLSpanElement)[] = [];
      for (const [index, text] of textSplit.entries()) {
        if (index === 0) {
          elements.push(document.createTextNode(text));
          continue;
        }

        let foundPlayer: string | null = null;
        for (const player of players) {
          if (!text.startsWith(player)) continue;
          if (player.length > (foundPlayer?.length || -1)) foundPlayer = player;
        }

        if (!foundPlayer) {
          elements.push(document.createTextNode(`@${text}`));
          continue;
        }

        const bolden = document.createElement("b");
        bolden.innerText = `@${foundPlayer}`;
        elements.push(bolden);
        elements.push(document.createTextNode(text.slice(foundPlayer.length)));
      }

      replaceMultiple(currentNode, elements);
    }

    this.addMouseoverListenerToMessage(eleParent);

    const vipPlayers = await this._vipPlayersSetting.getValue();
    for (const player of vipPlayers) {
      if (player.name !== senderName) continue;
      eleParent.style.backgroundColor = player.color + "88";
      return;
    }

    const selfHl = await this._enableSelfHighlighting.getValue();
    const lookFor = `@${myName} `;

    const isPingingMe = (content + " ").includes(lookFor);
    const shouldHighlightSelf = selfHl && myName === senderName;
    this._logger.debug(vipPlayers);
    if (isPingingMe || shouldHighlightSelf) eleParent.classList.add("guessed");
  }

  private specialKeyboardHandling(evt: KeyboardEvent, candidates: string[]) {
    if (this._flyoutComponent === undefined) return;

    switch (evt.key) {
      case "ArrowUp": {
        let newValue = this._kbSelectedPlayerIndex - 1;
        if (newValue == -1) newValue = candidates.length - 1;
        this._kbSelectedPlayerIndex = newValue;
        this._kbSelectedPlayerIndex$.next(newValue);
        break;
      }
      case "ArrowDown": {
        let newValue = this._kbSelectedPlayerIndex + 1;
        if (newValue >= candidates.length) newValue = 0;
        this._kbSelectedPlayerIndex = newValue;
        this._kbSelectedPlayerIndex$.next(newValue);
        break;
      }
      case "Enter":
      case "Tab":
        this.autocompleteSelected(
          candidates[this._kbSelectedPlayerIndex$.getValue() || 0],
        );
        break;

      case "Escape":
        this._flyoutComponent?.close();
        break;
    }
  }

  private async onChatInput(players: string[]) {
    const input = (await this._elements.complete()).chatInput;
    const value = input.value.toLowerCase();

    if (input.selectionStart !== input.selectionEnd) return this.hideAutocomplete();

    const userSelection = input.selectionStart;
    if (!userSelection) return this.hideAutocomplete();

    const startIndex = value.lastIndexOf("@", userSelection) + 1;
    if (startIndex > userSelection) return this.hideAutocomplete();

    const toComplete = value.slice(startIndex, userSelection);

    const matches = players.filter(
      (person) => person.toLowerCase().startsWith(toComplete) && person != toComplete,
    );
    if (matches.length == 0) return this.hideAutocomplete();

    this._logger.debug("matches:", matches);

    this._playerCandidates$.next(matches);
    await this.showAutocomplete();
  }

  private filterChatboxEvents(event: KeyboardEvent): chatboxEventFilter {
    if(event.key === "Tab" || event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") return "preventDefault";
  }

  private hideAutocomplete() {
    this._flyoutComponent?.close();
    this._flyoutComponent = undefined;
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

    if(!this._chatSvc.requestChatboxLock(this, this.filterChatboxEvents)){
      this._logger.error("Could not get chatbox lock, not opening mention flyout");
      return;
    }

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
      this._chatSvc.releaseChatboxLock(this);
    });
  }

  public async autocompleteSelected(name: string) {
    const input = (await this._elements.complete()).chatInput;

    const val = input.value;
    const atIndex = val.lastIndexOf("@", input.selectionStart ?? 0);
    if (atIndex === -1) return;
    const insert = `@${name} `;
    const start = val.slice(0, atIndex);
    const ogEnd = val.slice(atIndex + 1);
    const deleteFromEnd = beginIntersect(ogEnd, name);
    const end = ogEnd.slice(deleteFromEnd);

    this._chatSvc.replaceChatboxContent(start + insert + end, this);
    this._chatSvc.moveChatboxCursor(atIndex + insert.length, this);

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

  public get vipPlayersStore() {
    return this._vipPlayersSetting.store;
  }
}
