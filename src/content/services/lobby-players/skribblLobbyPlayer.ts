import { requireElement } from "@/util/document/requiredQuerySelector";
import type { skribblPlayer } from "@/util/skribbl/lobby";

export class SkribblLobbyPlayer {

  private readonly _playerContainer: HTMLElement;
  private readonly _avatarContainer: HTMLElement;

  public constructor(private _player: skribblPlayer) {
    this._playerContainer = requireElement(`#game-players .player[playerid='${this._player.id}']`);
    this._avatarContainer = requireElement(".avatar", this._playerContainer);
  }

  public get id() {
    return this._player.id;
  }

  public get container() {
    return this._playerContainer;
  }

  public get avatarContainer() {
    return this._avatarContainer;
  }
}