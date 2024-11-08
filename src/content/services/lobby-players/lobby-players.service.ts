import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { LobbyJoinedEventListener } from "@/content/events/lobby-joined.event";
import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { LobbyPlayerChangedEventListener } from "@/content/events/lobby-player-changed.event";
import { SkribblLobbyPlayer } from "@/content/services/lobby-players/skribblLobbyPlayer";
import { inject, injectable, postConstruct } from "inversify";
import { BehaviorSubject } from "rxjs";

@injectable()
export class LobbyPlayersService {

  @inject(LobbyJoinedEventListener) private readonly _lobbyJoinedEvent!: LobbyJoinedEventListener;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEvent!: LobbyLeftEventListener;
  @inject(LobbyPlayerChangedEventListener) private readonly _playerChangedEvent!: LobbyPlayerChangedEventListener;

  private readonly _logger;
  private readonly _players$ = new BehaviorSubject<SkribblLobbyPlayer[]>([]);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {

    /* listen for player joined/left event */
    this._playerChangedEvent.events$.subscribe((event) => {

      /* add new player to players */
      if(event.data.joined){
        const current = this._players$.value;

        let newPlayer;
        try {
          newPlayer = new SkribblLobbyPlayer(event.data.joined);
        }
        catch (e) {
          this._logger.error("Failed to create player", event.data.joined, e);
          return;
        }

        current.push(newPlayer);
        this._players$.next(current);
        this._logger.info("Player joined", newPlayer);
      }

      /* remove player from players */
      if(event.data.left){

        const id = event.data.left.id;
        const left = this._players$.value.find((player) => player.id === id);
        const current = this._players$.value.filter((player) => player != left);
        this._players$.next(current);
        this._logger.info("Player left", left);
      }
    });

    /* listen for lobby joined event and init players */
    this._lobbyJoinedEvent.events$.subscribe((event) => {

      const players = event.data.players.map((player) => {
        try {
          return new SkribblLobbyPlayer(player);
        }
        catch (e) {
          this._logger.error("Failed to create player", player, e);
          return null;
        }
      }).filter(player => player !== null);

      this._players$.next(players);
      this._logger.info("Lobby joined", players);
    });

    /* reset players on lobby left */
    this._lobbyLeftEvent.events$.subscribe(() => {
      this._players$.next([]);
      this._logger.info("Lobby left");
    });
  }

  public get players$() {
    return this._players$.asObservable();
  }
}