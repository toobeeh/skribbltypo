import type { concretePlayerIdentification, SkribblPlayerDisplay } from "@/content/services/players/skribblPlayerDisplay.interface";
import { replaceOrAddCssRule } from "@/util/document/replaceOrAddCssRule";

export class SkribblLandingPlayer implements SkribblPlayerDisplay {

  private _playerHideAvatarRuleIndex: number | undefined;
  private readonly _playerStyle: HTMLStyleElement;
  private readonly _containerId = "typo-customize-player-display";

  constructor(private readonly _login: number, private _customizerContainer: HTMLElement, private _avatarContainer: HTMLElement) {
    this._customizerContainer.classList.add(this._containerId);
    this._playerStyle = document.createElement("style");
    this._customizerContainer.appendChild(this._playerStyle);
  }

  get typoId(): concretePlayerIdentification {
    return { login: this._login };
  }

  get avatarContainer(): HTMLElement {
    return this._avatarContainer;
  }

  get backgroundContainer(): HTMLElement {
    return this._customizerContainer;
  }

  get container(): HTMLElement {
    return this._customizerContainer;
  }

  readonly iconsContainer = null;

  set useBackground(value: boolean) {
    this._customizerContainer.style.backgroundColor = value ? "" : "transparent";
    this._customizerContainer.style.zIndex = value ? "" : "1";
  }

  set useSafeColor(value: boolean) {
    /* no implementation */
  }

  set adjustToContainSprites(value: boolean) {
    /* no implementation */
  }

  set viewPlayerId(value: boolean) {
    /* no implementation */
  }

  public set hideAvatar(value: boolean) {
    this._playerHideAvatarRuleIndex = replaceOrAddCssRule(this._playerStyle, value ? `
      .${this._containerId} .avatar > :is(.eyes, .mouth, .color) { display: ${value ? "none" : "block"}
      }` : undefined,
      this._playerHideAvatarRuleIndex);
  }
}