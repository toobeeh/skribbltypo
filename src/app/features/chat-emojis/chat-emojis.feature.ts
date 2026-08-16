import type { EmojiDto } from "@/api";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { ChatService } from "@/app/services/chat/chat.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ApiDataSetup } from "@/app/setups/api-data/api-data.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import {
  BehaviorSubject,
  withLatestFrom,
  type Subscription,
  firstValueFrom,
  switchMap,
  map,
} from "rxjs";
import ChatEmojis from "./chat-emojis.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import EmojiPicker from "./emoji-picker.svelte";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { ExtensionSetting, TextExtensionSetting } from "@/app/core/settings/setting";

type EmojiScoreMap = Record<string, number>;

interface unicodeEmoji {
  name: string;
  emoji: string;
  unified: string;
  short_name: string;
  short_names: string[];
}

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

  private readonly decayRate = 0.99;
  private readonly boostAmount = 1.0;

  private _inputListener = this.handleInputEvent.bind(this);

  private readonly _customPrefixSetting = this.useSetting(
    new TextExtensionSetting("custom_prefix", ".", this)
      .withName("Unicode Emoji Prefix")
      .withDescription("Set a prefix to trigger unicode search in the emoji picker.")
  );

  private _emojiScoresSetting = new ExtensionSetting<EmojiScoreMap>("emojiScores", {}, this);
  private _subscription?: Subscription;
  private _component?: ChatEmojis;
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;
  private _emojiCandidates$ = new BehaviorSubject<{custom: EmojiDto[], unicode: unicodeEmoji[], mode: "unicode" | "custom"}>({custom: [], unicode: [], mode: "custom"});
  private _emojiScores: EmojiScoreMap = {};
  private _unicodeEmojis?: Promise<unicodeEmoji[]>;
  private readonly _unicodeShortcodeSource= "https://cdn.jsdelivr.net/npm/emoji-datasource@16.0.0/emoji.json";

  protected override async onActivate() {

    /* add handler for typing and picker */
    const elements = await this._elements.complete();
    elements.chatInput.addEventListener("keyup", this._inputListener);

    /* process received messages */
    const emojis = (await this._apiDataSetup.complete()).emojis;
    this._subscription = this._chatService.playerMessageReceived$.pipe(
      withLatestFrom(this._lobbyService.lobby$),
    ).subscribe(([{ contentElement, player }, lobby]) => {
      const isMyMessage = player.id === lobby?.meId;
      this.processAddedMessage(contentElement, emojis, isMyMessage);
    });

    /* add styles */
    this._component = new ChatEmojis({ target: elements.chatArea });

    /* track most frequently used emojis */
    this._emojiScores = await this._emojiScoresSetting.getValue();
    
    /* load unicode emoji shortnames, only once */
    this._unicodeEmojis = this._unicodeEmojis ?? firstValueFrom(
      fromPromise(fetch(this._unicodeShortcodeSource)).pipe(
        switchMap(emojis => emojis.json() as Promise<unicodeEmoji[]>),
        map(emojis => emojis.map(e => ({
          name: e.short_name,
          emoji: String.fromCodePoint(
            ...e.unified.split("-").map(code => parseInt(code, 16))
          ),
          unified: e.unified,
          short_name: e.short_name,
          short_names: e.short_names
        })))
      )
    );
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

    // persist
    this._emojiScoresSetting.setValue(this._emojiScores);
  }

  async handleInputEvent(event: KeyboardEvent) {
    const emojis = (await this._apiDataSetup.complete()).emojis;
    const unicodeEmojis = await this._unicodeEmojis;
    const elements = await this._elements.complete();
    const prefix = await this._customPrefixSetting.getValue();

    /* get emoji candidates and emit event */
    this._logger.debug("Finding emoji candidates for: ", elements.chatInput.value);
    const emojiHead = this.parseUnfinishedEmoji(elements.chatInput.value, prefix);

    const emojiCandidates: {custom: EmojiDto[], unicode: unicodeEmoji[], mode: "unicode" | "custom"} = {custom: [], unicode: [], mode: "custom"};
    if(emojiHead !== undefined && emojiHead.startsWith(prefix)) {
      const unicodeHead = emojiHead.slice(prefix.length);
      emojiCandidates.mode = "unicode";
      emojiCandidates.unicode = (unicodeEmojis ?? [])
        .filter(e => e.short_name.toLowerCase().includes(unicodeHead.toLowerCase()))
        .sort((a, b) => {
          const scoreA = this._emojiScores[a.emoji] ?? 0;
          const scoreB = this._emojiScores[b.emoji] ?? 0;
          return scoreB - scoreA; // descending
        });
    }
    else if(emojiHead !== undefined) {
      emojiCandidates.custom = emojis
        .filter(e => e.name.toLowerCase().includes(emojiHead.toLowerCase()));
    }
    this._emojiCandidates$.next(emojiCandidates);
      
    /* autocomplete emoji */
    if (emojiHead !== undefined &&
      (emojiCandidates.mode === "custom" && emojiCandidates.custom.length > 0
      || emojiCandidates.mode === "unicode" && emojiCandidates.unicode.length) &&
      event.key === "Tab") {
      this.insertEmoji(emojiCandidates.mode === "custom" ? emojiCandidates.custom[0] : emojiCandidates.unicode[0].emoji, elements.chatInput);
    }

    /* show popout if head exists, else close if open */
    if(emojiHead !== undefined && this._flyoutComponent === undefined){

      /* create fly out content */
      const flyoutContent: componentData<EmojiPicker> = {
        componentType: EmojiPicker,
        props: {
          feature: this,
          onSelected: (emoji: EmojiDto | string, keepOpen: boolean) => {
            this.insertEmoji(emoji, elements.chatInput, keepOpen);
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

  private insertEmoji(emoji: EmojiDto | string, chatInput: HTMLInputElement, keepOpen = false) {
    const text = chatInput.value;

    if(typeof emoji === "string"){
      chatInput.value = text.slice(0, text.lastIndexOf(":")) + emoji;
    }
    else {
      chatInput.value = text.slice(0, text.lastIndexOf(":")) + `:${this.getEmojiId(emoji)}:`;
    }

    if (keepOpen) {
      chatInput.value = chatInput.value + text.slice(text.lastIndexOf(":")); /* keep current search query in picker */
    } else {
      this._flyoutComponent?.close();
    }
    chatInput.focus();
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

            /* build tooltip */
            const tooltipWrap = document.createElement("div");
            const tooltipImg = document.createElement("img");
            tooltipImg.src = emojiDto.url;
            tooltipImg.alt = emojiDto.name;
            tooltipImg.className = "typo-emoji-tooltip-img";
            const tooltipNewline = document.createElement("br");
            const tooltipName = document.createElement("span");
            tooltipName.textContent = `:${emojiDto.name}:`;
            tooltipWrap.append(tooltipImg, tooltipNewline, tooltipName);
            this.createTooltip(emojiElement, {title: "",  htmlTitle: tooltipWrap.innerHTML, lock: "Y"});

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

  parseUnfinishedEmoji(text: string, unicodePrefix: string) {

    /* remove all parsed emotes */
    const parsedEmojiPattern = /:([a-zA-Z0-9_-]+):/g;
    text = text.replace(parsedEmojiPattern, "");

    const escapedPrefix = unicodePrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const emojiPattern = new RegExp(`:((?:${escapedPrefix})?[a-zA-Z0-9_-]*)$`);
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
