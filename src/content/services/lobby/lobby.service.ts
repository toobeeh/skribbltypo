import { inject, injectable } from "inversify";
import { BehaviorSubject, merge } from "rxjs";
import type { skribblLobby } from "../../../util/skribbl/lobby";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { LobbyJoinedEventListener } from "../../events/lobby-joined.event";
import { LobbyLeftEventListener } from "../../events/lobby-left.event";
import { ElementsSetup } from "../../setups/elements/elements.setup";

@injectable()
export class LobbyService {

  private readonly _logger;

  private _currentLobby = new BehaviorSubject<skribblLobby | null>(null);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyJoinedEventListener) private readonly lobbyJoined: LobbyJoinedEventListener,
    @inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener,
    @inject(ElementsSetup) private readonly elementsSetup: ElementsSetup
  ) {
    this._logger = loggerFactory(this);

    merge(
      lobbyLeft.events$,
      lobbyJoined.events$
    ).subscribe((event) => {
      this._logger.info("Lobby event", event);
      this._currentLobby.next(event.data);
    });
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
    return this._currentLobby.asObservable();
  }
}