import type { EmojiDto } from "@/api";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { ChatService } from "@/app/services/chat/chat.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ApiDataSetup } from "@/app/setups/api-data/api-data.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import { BehaviorSubject, withLatestFrom, type Subscription } from "rxjs";
import ChatEmojis from "./chat-emojis.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import EmojiPicker from "./emoji-picker.svelte";
import { LobbyService } from "@/app/services/lobby/lobby.service";

type EmojiScoreMap = Record<string, number>;

export class ChatEmojisFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(ChatService) private readonly _chatService!: ChatService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "Chat Emojis";
  public readonly description = "Adds support for emojis using ':emoji-name:' format in the chat.";
  public readonly tags = [
    FeatureTag.SOCIAL
  ];
  public readonly featureId = 22;

  private readonly storageKey = "emojiScores";
  private readonly decayRate = 0.99;
  private readonly boostAmount = 1.0;

  private _inputListener = this.handleInputEvent.bind(this);

  private _subscription?: Subscription;
  private _component?: ChatEmojis;
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;
  private _emojiCandidates$ = new BehaviorSubject<EmojiDto[]>([]);
  private _emojiScores: EmojiScoreMap = {};

  protected override async onActivate() {

    /* add handler for typing and picker */
    const elements = await this._elements.complete();
    elements.chatInput.addEventListener("keyup", this._inputListener);

    /* process received messages */
    const emojis = (await this._apiDataSetup.complete()).emojis;
    this._subscription = this._chatService.playerMessageReceived$.pipe(
      withLatestFrom(this._lobbyService.lobby$),
    ).subscribe(([{ contentElement, player }, lobby]) => {
      const isMyMessage = player.lobbyPlayerId === lobby?.meId;
      this.processAddedMessage(contentElement, emojis, isMyMessage);
    });

    /* add styles */
    this._component = new ChatEmojis({ target: elements.chatArea });

    /* track most frequently used emojis */
    this._emojiScores = this.loadScores();
  }

  protected override async onDestroy() {
    const elements = await this._elements.complete();
    elements.chatInput.removeEventListener("keyup", this._inputListener);

    this._subscription?.unsubscribe();
    this._component?.$destroy();
    this._component = undefined;
    this._subscription = undefined;

    this._flyoutSubscription?.unsubscribe();
    this._flyoutComponent?.$destroy();
    this._flyoutComponent = undefined;
    this._flyoutSubscription = undefined;
  }

  private loadScores(): EmojiScoreMap {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveScores() {
    localStorage.setItem(this.storageKey, JSON.stringify(this._emojiScores));
  }

  private updateScores(usedEmoji: string) {
    // decay all scores
    for (const key in this._emojiScores) {
      this._emojiScores[key] *= this.decayRate;
      this._emojiScores[key] = parseFloat(this._emojiScores[key].toFixed(4));  // round to 4 decimals for storage
    }

    // boost used emoji
    if (!this._emojiScores[usedEmoji]) {
      this._emojiScores[usedEmoji] = 0;
    }
    this._emojiScores[usedEmoji] += this.boostAmount;

    this.saveScores();
  }

  async handleInputEvent() {
    const emojis = (await this._apiDataSetup.complete()).emojis;
    const elements = await this._elements.complete();

    /* get emoji candidates and emit event */
    this._logger.debug("Finding emoji candidates for: ", elements.chatInput.value);
    const emojiHead = this.parseUnfinishedEmoji(elements.chatInput.value);
    const emojiCandidates = emojiHead !== undefined 
      ? emojis
        .filter(e => e.name.toLowerCase().includes(emojiHead.toLowerCase()))
        .sort((a, b) => {
          const scoreA = this._emojiScores[this.getEmojiId(a)] ?? 0;
          const scoreB = this._emojiScores[this.getEmojiId(b)] ?? 0;
          return scoreB - scoreA; // descending
        })
      : [];
    this._emojiCandidates$.next(emojiCandidates);

    /* show popout if head exists, else close if open */
    if(emojiHead !== undefined && this._flyoutComponent === undefined){

      /* create fly out content */
      const flyoutContent: componentData<EmojiPicker> = {
        componentType: EmojiPicker,
        props: {
          feature: this,
          onSelected: (emoji: EmojiDto) => {
            const text = elements.chatInput.value;
            elements.chatInput.value = text.slice(0, text.lastIndexOf(":")) + `:${this.getEmojiId(emoji)}:`;
            this._flyoutComponent?.close();
            elements.chatInput.focus();
          }
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
          title: "Emoji Picker",
          closeStrategy: "explicit"
        },
      });

      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
        this._logger.info("Destroyed flyout");
        this._flyoutComponent?.$destroy();
        this._flyoutSubscription?.unsubscribe();
        this._flyoutComponent = undefined;
      });
    }
    else if (this._flyoutComponent !== undefined && emojiHead === undefined){
      this._flyoutComponent.close();
    }
  }

  processAddedMessage(message: HTMLElement, emojis: EmojiDto[], isMyMessage: boolean) {
    const textNodes = Array.from(message.childNodes).filter(node => node.nodeType === Node.TEXT_NODE) as Text[];
    textNodes.forEach(node => {
      const parsedEmojis = this.parseTextWithEmojis(node.textContent ?? "");
      if(parsedEmojis.filter(e => e.emoji !== undefined).length === 0) return; // no emojis found

      const newTextNode = document.createElement("span");
      newTextNode.classList.add("typo-emoji-container");

      parsedEmojis.forEach(({emoji, plain}) => {
        if(plain) {
          newTextNode.appendChild(document.createTextNode(plain));
        }

        if(emoji) {
          const emojiDto = emojis.find(e => `:${this.getEmojiId(e)}:` === emoji);
          if(emojiDto) {
            const emojiElement = document.createElement("span");
            emojiElement.textContent = emoji;
            emojiElement.style.setProperty("--typo-emoji-url", `url(${emojiDto.url})`);
            emojiElement.style.setProperty("--typo-emoji-name", emojiDto.name);
            emojiElement.classList.add("typo-emoji");
            newTextNode.appendChild(emojiElement);
            this.createTooltip(emojiElement, { title: emoji, lock: "Y" });

            if (isMyMessage) {
              this.updateScores(this.getEmojiId(emojiDto));
            }
          }
          else {
            newTextNode.appendChild(document.createTextNode(emoji));
          }
        }
      });

      node.replaceWith(newTextNode);
    });
  }

  parseTextWithEmojis(text: string) {
    const emojiPattern = /:([a-zA-Z0-9_-]+):/g;
    const result: {emoji?: string, plain?: string}[] = [];
    let lastIndex = 0;

    let match;
    while ((match = emojiPattern.exec(text)) !== null) {
      // Add plain text before the emoji
      if (match.index > lastIndex) {
        result.push({plain: text.slice(lastIndex, match.index)});
      }

      // Add the matched emoji placeholder, including the colons
      result.push({emoji: match[0]});

      // Update lastIndex to the end of the current match
      lastIndex = match.index + match[0].length;
    }

    // Add any remaining plain text after the last emoji
    if (lastIndex < text.length) {
      result.push({ plain: text.slice(lastIndex) });
    }

    return result;
  }

  parseUnfinishedEmoji(text: string) {

    /* remove all parsed emotes */
    const parsedEmojiPattern = /:([a-zA-Z0-9_-]+):/g;
    text = text.replace(parsedEmojiPattern, "");

    const emojiPattern = /:([a-zA-Z0-9_-]*)$/;
    const match = emojiPattern.exec(text);
    return match?.[1];
  }

  getEmojiId(emoji: EmojiDto){
    return emoji.nameId > 0 ? `${emoji.name}-${emoji.nameId}` : emoji.name;
  }

  public get emojiCandidatesStore() {
    return fromObservable(this._emojiCandidates$, this._emojiCandidates$.value);
  }
}