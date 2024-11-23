import type {
  anonymousPlayerIdentification,
  SkribblPlayerDisplay,
} from "@/content/services/players/skribblPlayerDisplay.interface";
import { createElement } from "@/util/document/appendElement";
import { requireElement } from "@/util/document/requiredQuerySelector";
import type { skribblPlayer } from "@/util/skribbl/lobby";

export class SkribblScoreboardPodiumPlayer implements SkribblPlayerDisplay {

  private readonly _playerContainer: HTMLElement;
  private readonly _avatarContainer: HTMLElement;
  private _placeholderBackgroundContainer: HTMLElement;

  constructor(private readonly _player: skribblPlayer, private readonly _lobbyKey: string) {
    this._playerContainer = requireElement(`.overlay-content .result.show .podests > div:has(.avatar[playerid='${this._player.id}'])`);
    this._avatarContainer = requireElement(".avatar", this._playerContainer);
    this._placeholderBackgroundContainer = createElement("<div style=\"display: none;\"></div>");
    this._playerContainer.appendChild(this._placeholderBackgroundContainer);
  }

  get typoId(): anonymousPlayerIdentification {
    return { lobbyKey: this._lobbyKey, lobbyPlayerId: this._player.id };
  }

  get avatarContainer(): HTMLElement {
    return this._avatarContainer;
  }

  get backgroundContainer(): HTMLElement {
    return this._placeholderBackgroundContainer;
  }

  get container(): HTMLElement {
    return this._playerContainer;
  }

  set useBackground(value: boolean) {
    /* no implementation */
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