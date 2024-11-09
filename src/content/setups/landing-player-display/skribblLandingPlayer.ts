import type { SkribblPlayerDisplay } from "@/util/typo/skribblPlayerDisplay.interface";

export class SkribblLandingPlayer implements SkribblPlayerDisplay {

  constructor(private _customizerContainer: HTMLElement, private _avatarContainer: HTMLElement) {
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
}