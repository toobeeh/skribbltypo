import { inject, injectable } from "inversify";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { LobbyJoinedEventListener } from "../../events/lobby-joined.event";

@injectable()
export class LobbyNavigationService {

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyJoinedEventListener) private readonly lobbyJoined: LobbyJoinedEventListener
  ) {
    this._logger = loggerFactory(this);
    lobbyJoined.events$.subscribe((event) => {
      this._logger.info("Lobby joined", event.data);
    });
  }
}