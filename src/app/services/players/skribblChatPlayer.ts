import { replaceOrAddCssRule } from "@/util/document/replaceOrAddCssRule";
import type { skribblPlayer } from "@/util/skribbl/lobby";
import type {
  SkribblPlayerDisplay,
  typoPlayerIdentification,
} from "@/app/services/players/skribblPlayerDisplay.interface";

/**
 * Implementation of the skribblplayerdisplay
 * for the player avatars in the chat
 */
export class SkribblChatPlayer implements SkribblPlayerDisplay {
  private static idCounter = 0;

  private readonly _elementId;
  private readonly _placeholderBackgroundContainer: HTMLElement;

  private readonly _playerStyle: HTMLStyleElement;
  private _playerHideAvatarRuleIndex: number | undefined;

  public constructor(
    private readonly _player: skribblPlayer,
    private readonly _lobbyKey: string,
    private readonly _container: HTMLDivElement
  ) {
    this._placeholderBackgroundContainer = document.createElement("div");

    this._elementId = "typo-chat-player-" + SkribblChatPlayer.idCounter++;
    this._playerStyle = document.createElement("style");
    this._container.appendChild(this._playerStyle);
  }

  destroy() {
    this._container.classList.remove(this._elementId);
    this._playerStyle.remove();
  }

  public get typoId(): typoPlayerIdentification {
    return { lobbyKey: this._lobbyKey, lobbyPlayerId: this._player.id };
  }

  public get player() {
    return this._player;
  }

  public get lobbyPlayerId() {
    return this._player.id;
  }

  public get name() {
    return this._player.name;
  }

  public get container() {
    return this._container;
  }

  public get avatarContainer() {
    return this._container;
  }

  public get backgroundContainer() {
    return this._placeholderBackgroundContainer;
  }

  readonly iconsContainer = null;

  public set useBackground(value: boolean) {
    /* no implementation */
  }

  public set useSafeColor(value: boolean) {
    /* no implementation */
  }

  public set adjustToContainSprites(value: boolean) {
    /* no implementation */
  }

  public set viewPlayerId(value: boolean) {
    /* no implementation */
  }

  public set hideAvatar(value: boolean) {
    this._playerHideAvatarRuleIndex = replaceOrAddCssRule(
      this._playerStyle,
      value
        ? `
      .${this._elementId} :is(.eyes, .mouth, .color) { 
        display: ${value ? "none" : "block"}
      }`
        : undefined,
      this._playerHideAvatarRuleIndex,
    );
  }
}