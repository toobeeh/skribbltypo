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

  private readonly _playerStyle: HTMLStyleElement;

  private _backgroundRuleIndex: number | undefined;
  private _fontColorRuleIndex: number | undefined;
  private _resizeRuleIndex: number | undefined;
  private _alignRuleIndex: number | undefined;
  private _playerIdRuleIndex: number | undefined;

  public constructor(private readonly _player: skribblPlayer, private readonly _lobbyKey?: string, private readonly _playerLogin?: number) {

    if(_lobbyKey === undefined && _playerLogin === undefined) throw new Error("No identification provided");

    this._playerContainer = requireElement(`#game-players .player[playerid='${this._player.id}']`);
    this._avatarContainer = requireElement(".avatar", this._playerContainer);
    this._backgroundContainer = requireElement(".player-background", this._playerContainer);

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

  public set useBackground(value: boolean) {
    this._backgroundRuleIndex = this._playerStyle.sheet?.insertRule(
      `.${this._elementId} .player-background { background-color: ${value ? "" : "transparent"} !important; }`,
      this._backgroundRuleIndex
    );
  }

  public set useSafeColor(value: boolean) {
    this._fontColorRuleIndex = this._playerStyle.sheet?.insertRule(`
      .${this._elementId} * { 
        color: ${value ? "White" : ""} !important; 
        text-shadow: ${value ? " 0px 0px 25px black, 0px 0px 10px black, 0px 0px 5px black" : ""} !important
      }`,
      this._fontColorRuleIndex
    );
  }

  public set resizeToFitAvatar(value: boolean) {
    this._resizeRuleIndex = this._playerStyle.sheet?.insertRule(
      `.${this._elementId} { height: ${value ? "56px" : ""} !important; }`,
      this._resizeRuleIndex
    );

    this._alignRuleIndex = this._playerStyle.sheet?.insertRule(
      `.${this._elementId} .player-avatar-container { top: ${value ? "calc((100% - var(--UNIT)) / 2)" : ""} !important; }`,
      this._alignRuleIndex
    );
  }

  public set viewPlayerId(value: boolean) {
    this._playerIdRuleIndex = this._playerStyle.sheet?.insertRule(`
       .${this._elementId} .player-score { 
          display: ${!value ? "" : "none"}; 
       }
       .${this._elementId} .player-info:after { 
          display: ${value ? "" : "none"}; 
          content: "#${this._player.id}"; 
       }`,
      this._playerIdRuleIndex
    );
  }
}