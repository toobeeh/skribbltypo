import { FeatureTag } from "@/app/core/feature/feature-tags";
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
  }

  protected override async onDestroy() {
    this.chatSubscription?.unsubscribe();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
  }

  private onMessage(element: HTMLElement, content: string, myName: string) {
    const lookFor = `@${myName} `;
    // adding a space for pings at end of message
    if (!(content + " ").includes(lookFor)) return;
    element.parentElement?.classList.add("guessed");
  }

  private specialKeyboardHandling(evt: KeyboardEvent) {
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
        if (this._flyoutComponent !== undefined) {
          this.autocompleteSelected(
            this.playerCandidates[this._kbSelectedPlayerIndex$.getValue() || 0],
          );
          evt.preventDefault();
        }
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
