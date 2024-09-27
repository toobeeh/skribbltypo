import {
  LobbyPlayerChangedEvent,
  LobbyPlayerChangedEventListener,
} from "@/content/events/lobby-player-changed.event";
import { inject, injectable } from "inversify";
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, merge, withLatestFrom } from "rxjs";
import type { skribblLobby } from "@/util/skribbl/lobby";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { LobbyJoinedEvent, LobbyJoinedEventListener } from "../../events/lobby-joined.event";
import { LobbyLeftEvent, LobbyLeftEventListener } from "../../events/lobby-left.event";
import { ElementsSetup } from "../../setups/elements/elements.setup";

@injectable()
export class LobbyService {

  private readonly _logger;

  private _currentLobby = new BehaviorSubject<skribblLobby | null>(null);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyJoinedEventListener) private readonly lobbyJoined: LobbyJoinedEventListener,
    @inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener,
    @inject(LobbyPlayerChangedEventListener) private readonly lobbyPlayerChanged: LobbyPlayerChangedEventListener,
    @inject(ElementsSetup) private readonly elementsSetup: ElementsSetup
  ) {
    this._logger = loggerFactory(this);

    /* combine updates and calculate updated lobby state */
    merge(
      lobbyLeft.events$,
      lobbyJoined.events$,
      lobbyPlayerChanged.events$
    ).pipe(
      withLatestFrom(this._currentLobby), /* compare updates with current lobby */
      map(data => ({update: data[0], currentLobby: data[1]})),
    ).subscribe(({update, currentLobby}) => {

      /* prevent reference issues */
      currentLobby = currentLobby === null ? null : structuredClone(currentLobby);

      /* lobby left, reset lobby */
      if(update instanceof LobbyLeftEvent) {
        this._currentLobby.next(null);
      }

      /* lobby joined, set new lobby */
      else if(update instanceof LobbyJoinedEvent) {
        this._currentLobby.next(update.data);
      }

      /* player changed, update list */
      else if(currentLobby !== null && update instanceof LobbyPlayerChangedEvent) {
        const data = update.data;
        if(data.left) {
          const left = data.left;
          currentLobby.players = currentLobby.players.filter(user => user.id !== left.id);
          this._currentLobby.next(currentLobby);
        }
        else if(data.joined) {
          currentLobby.players.push(data.joined);
          this._currentLobby.next(currentLobby);
        }
      }
    });

    this.lobby$.subscribe(data => this._logger.info("Lobby changed", data));
  }

  public async joinLobby(id?: string){

    if(this._currentLobby.value !== null) {
      this._logger.warn("Attempted to join a lobby while already in one");
      throw new Error("Already in a lobby");
    }

    /* show loading */
    const elements = await this.elementsSetup.complete();
    elements.load.style.display = "block";
    elements.home.style.display = "none";

    document.dispatchEvent(new CustomEvent("joinLobby", {detail: id}));
  }

  public leaveLobby(){
    if(this._currentLobby.value === null) {
      this._logger.warn("Attempted to leave a lobby while not in one");
      throw new Error("Not in a lobby");
    }
    document.dispatchEvent(new CustomEvent("leaveLobby"));
  }

  public get lobby$(){
    return this._currentLobby.pipe(
      debounceTime(100), /* debounce to prevent spamming */
      distinctUntilChanged((curr, prev) => JSON.stringify(curr) === JSON.stringify(prev)) /* if join-leave spam debounced, take only changes */
    );
  }
}