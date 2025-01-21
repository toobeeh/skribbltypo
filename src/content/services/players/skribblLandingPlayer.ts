import type { concretePlayerIdentification, SkribblPlayerDisplay } from "@/content/services/players/skribblPlayerDisplay.interface";

export class SkribblLandingPlayer implements SkribblPlayerDisplay {

  constructor(private readonly _login: number, private _customizerContainer: HTMLElement, private _avatarContainer: HTMLElement) {
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

  set resizeToFitAvatar(value: boolean) {
    /* no implementation */
  }

  set viewPlayerId(value: boolean) {
    /* no implementation */
  }
}