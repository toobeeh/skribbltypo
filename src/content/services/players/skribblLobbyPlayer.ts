import { replaceOrAddCssRule } from "@/util/document/replaceOrAddCssRule";
import { requireElement } from "@/util/document/requiredQuerySelector";
import type { skribblPlayer } from "@/util/skribbl/lobby";
import type {
  SkribblPlayerDisplay,
  typoPlayerIdentification,
} from "@/content/services/players/skribblPlayerDisplay.interface";

/**
 * Implementation of the skribblplayerdisplay
 * for the lobby player containers in-game
 */
export class SkribblLobbyPlayer implements SkribblPlayerDisplay {

  private static idCounter = 0;

  private readonly _elementId;

  private readonly _playerContainer: HTMLElement;
  private readonly _avatarContainer: HTMLElement;
  private readonly _backgroundContainer: HTMLElement;
  private readonly _iconsContainer: HTMLElement;

  private readonly _playerStyle: HTMLStyleElement;

  private _backgroundRuleIndex: number | undefined;
  private _fontColorRuleIndex: number | undefined;
  private _fontColorGuessedRuleIndex: number | undefined;
  private _fontShadowRuleIndex: number | undefined;
  private _resizeRuleIndex: number | undefined;
  private _elevateDrawingRuleIndex: number | undefined;
  private _alignRuleIndex: number | undefined;
  private _playerIdRuleIndex: number | undefined;
  private _playerInfoRuleIndex: number | undefined;
  private _playerHideAvatarRuleIndex: number | undefined;

  public constructor(private readonly _player: skribblPlayer, private readonly _lobbyKey?: string, private readonly _playerLogin?: number) {

    if(_lobbyKey === undefined && _playerLogin === undefined) throw new Error("No identification provided");

    this._playerContainer = requireElement(`#game-players .player[playerid='${this._player.id}']`);
    this._avatarContainer = requireElement(".avatar", this._playerContainer);
    this._backgroundContainer = requireElement(".player-background", this._playerContainer);
    this._iconsContainer = requireElement(".player-icons", this._playerContainer);

    this._elementId = "typo-lobby-player-" + SkribblLobbyPlayer.idCounter++;
    this._playerStyle = document.createElement("style");
    this._playerContainer.classList.add(this._elementId);
    this._playerContainer.appendChild(this._playerStyle);
  }

  public get typoId(): typoPlayerIdentification {
    if(this._playerLogin !== undefined) return { login: this._playerLogin };
    if(this._lobbyKey !== undefined) return { lobbyKey: this._lobbyKey, lobbyPlayerId: this._player.id };
    throw new Error("No identification provided");
  }

  public get lobbyPlayerId() {
    return this._player.id;
  }

  public get name() {
    return this._player.name;
  }

  public get container() {
    return this._playerContainer;
  }

  public get avatarContainer() {
    return this._avatarContainer;
  }

  public get backgroundContainer() {
    return this._backgroundContainer;
  }

  get iconsContainer(): HTMLElement {
    return this._iconsContainer;
  }

  public set useBackground(value: boolean) {
    this._backgroundRuleIndex = replaceOrAddCssRule(this._playerStyle,
      !value ? `.${this._elementId} .player-background { background-color: transparent !important; }` : undefined,
      this._backgroundRuleIndex
    );
  }

  public set useSafeColor(value: boolean) {
    this._fontColorRuleIndex = replaceOrAddCssRule(this._playerStyle, value ? `
      .${this._elementId}:not(.guessed) > :not(.player-bubble) *, .${this._elementId}:not(.guessed) .player-info:after { 
        color: White !important; 
      }` : undefined,
      this._fontColorRuleIndex
    );

    this._fontColorGuessedRuleIndex = replaceOrAddCssRule(this._playerStyle, value ? `
      .${this._elementId}:is(.guessed) > :not(.player-bubble) *, .${this._elementId}:is(.guessed) .player-info:after { 
        color: #56ce27 !important;
      }` : undefined,
      this._fontColorGuessedRuleIndex
    );

    this._fontShadowRuleIndex = replaceOrAddCssRule(this._playerStyle, value ? `
      .${this._elementId} > :not(.player-bubble) *, .${this._elementId} .player-info:after { 
        text-shadow: 0px 0px 25px black, 0px 0px 10px black, 0px 0px 5px black !important;
      }` : undefined,
      this._fontShadowRuleIndex
    );
  }

  public set adjustToContainSprites(value: boolean) {
    this._resizeRuleIndex = replaceOrAddCssRule(this._playerStyle,
      value ? `.${this._elementId} { height: 56px !important; }` : undefined,
      this._resizeRuleIndex
    );

    this._alignRuleIndex = replaceOrAddCssRule(this._playerStyle,
      value ? `.${this._elementId} .player-avatar-container { top: calc((100% - var(--UNIT)) / 2) !important; }` : undefined,
      this._alignRuleIndex
    );

    this._elevateDrawingRuleIndex = replaceOrAddCssRule(this._playerStyle,
      value ? `#game-players .${this._elementId} .player-avatar-container .avatar .drawing { z-index: 100; }` : undefined,
      this._elevateDrawingRuleIndex
    );
  }

  public set viewPlayerId(value: boolean) {
    this._playerIdRuleIndex = replaceOrAddCssRule(this._playerStyle, value ? `
       .${this._elementId} .player-score { 
          display: none; 
       }` : undefined,
      this._playerIdRuleIndex);

    this._playerInfoRuleIndex = replaceOrAddCssRule(this._playerStyle, value ? `
       .${this._elementId} .player-info:after { 
          content: "#${this._player.id}"; 
       }` : undefined,
      this._playerInfoRuleIndex);
  }

  public set hideAvatar(value: boolean) {
    this._playerHideAvatarRuleIndex = replaceOrAddCssRule(this._playerStyle, value ? `
      .${this._elementId} .avatar > :is(.eyes, .mouth, .color) { display: ${value ? "none" : "block"}
      }` : undefined,
      this._playerHideAvatarRuleIndex);
  }
}