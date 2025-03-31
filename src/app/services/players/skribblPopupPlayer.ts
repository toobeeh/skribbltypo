import type {
  SkribblPlayerDisplay, typoPlayerIdentification,
} from "@/app/services/players/skribblPlayerDisplay.interface";
import { createElement } from "@/util/document/appendElement";
import { elements, requireElement } from "@/util/document/requiredQuerySelector";
import type { skribblPlayer } from "@/util/skribbl/lobby";

export class SkribblPopupPlayer implements SkribblPlayerDisplay {
  private readonly _avatarContainer: HTMLElement;
  private _placeholderBackgroundContainer: HTMLElement;

  constructor(
    private readonly _player: skribblPlayer,
    private readonly _playerPopup: HTMLElement,
    private readonly _lobbyKey?: string,
    private readonly _playerLogin?: number,
  ) {
    if (_lobbyKey === undefined && _playerLogin === undefined)
      throw new Error("No identification provided");

    this._avatarContainer = requireElement(".avatar", this._playerPopup);
    this._placeholderBackgroundContainer = createElement("<div style=\"display: none;\"></div>");
    this._playerPopup.appendChild(this._placeholderBackgroundContainer);
  }

  destroy() {
    this._placeholderBackgroundContainer.remove();
  }

  get typoId(): typoPlayerIdentification {
    if (this._playerLogin !== undefined) return { login: this._playerLogin };
    if (this._lobbyKey !== undefined)
      return { lobbyKey: this._lobbyKey, lobbyPlayerId: this._player.id };
    throw new Error("No identification provided");
  }

  get avatarContainer(): HTMLElement {
    return this._avatarContainer;
  }

  get backgroundContainer(): HTMLElement {
    return this._placeholderBackgroundContainer;
  }

  get container(): HTMLElement {
    return this._playerPopup;
  }

  readonly iconsContainer = null;

  set useBackground(value: boolean) {
    /* no implementation */
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

  /**
   * remove the elements; as container is disposable and updates in the short timespan it is shown can be ignored
   * @param value
   */
  set hideAvatar(value: boolean) {
    if (value) {
      elements(":is(.eyes, .mouth, .color)", this._avatarContainer).forEach((element) =>
        element.remove(),
      );
    }
  }
}