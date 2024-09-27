import { HintsAddedEventListener } from "@/content/events/hints-added.event";
import { LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { inject, injectable } from "inversify";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { LobbyJoinedEventListener } from "../../events/lobby-joined.event";
import { LobbyLeftEventListener } from "../../events/lobby-left.event";

/*interface image {
  ownerId
}*/

@injectable()
export class DrawingService {

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyJoinedEventListener) private readonly lobbyJoined: LobbyJoinedEventListener,
    @inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener,
    @inject(LobbyStateChangedEventListener) private readonly lobbyChanged: LobbyStateChangedEventListener,
    @inject(HintsAddedEventListener) private readonly hintsAdded: HintsAddedEventListener
  ) {
    this._logger = loggerFactory(this);

  }

}