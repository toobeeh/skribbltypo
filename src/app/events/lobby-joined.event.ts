import { parseLobbyStateUpdate } from "@/util/skribbl/lobbyState";
import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { parseSkribblLobbyDataEvent, type skribblLobby } from "../../util/skribbl/lobby";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/app/core/extension-container/extension-container";
import { GameSettingsSetup } from "../setups/game-settings/game-settings.setup";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

/**
 * Event emitted when a lobby is joined
 * Practice lobbies are emitted as a synthetic event
 */
export class LobbyJoinedEvent extends ApplicationEvent<skribblLobby> {
  constructor(public readonly data: skribblLobby) { super(); }
}

@injectable()
export class LobbyJoinedEventProcessor extends EventProcessor<skribblLobby, LobbyJoinedEvent>
{
  @inject(GameSettingsSetup) _gameSettingsSetup!: GameSettingsSetup;
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = LobbyJoinedEvent;

  protected async streamEvents(): Promise<Observable<LobbyJoinedEvent>> {
    const events = new Subject<LobbyJoinedEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();
    const gameSettings = await this._gameSettingsSetup.complete();

    skribblMessages.serverMessages$.subscribe((event) => {
      if(event.id === 10){
        const lobby = parseSkribblLobbyDataEvent(event.data, gameSettings.languageSettings);
        const initialUpdate = parseLobbyStateUpdate(event.data.state);

        /* only drawer id relevant for lobby from initial state */
        lobby.drawerId = initialUpdate?.drawingStarted?.drawerId ?? null;

        this._logger.info("Lobby joined", lobby);
        events.next(new LobbyJoinedEvent(lobby));
      }
    });

    /* listen for practice lobby joined events from patched game */
    document.addEventListener("practiceJoined", async (data) => {
      const gameSettings = await this._gameSettingsSetup.complete();
      const lobby = parseSkribblLobbyDataEvent((data as CustomEvent).detail, gameSettings.languageSettings);

      this._logger.info("Practice lobby joined", lobby);
      events.next(new LobbyJoinedEvent(lobby));
    });

    return events;
  }
}

@injectable()
export class LobbyJoinedEventListener extends EventListener<skribblLobby, LobbyJoinedEvent> {
  @inject(LobbyJoinedEventProcessor) protected readonly _processor!: LobbyJoinedEventProcessor;
}

export const lobbyJoinedEventRegistration: EventRegistration<skribblLobby, LobbyJoinedEvent> = {
  listenerType: LobbyJoinedEventListener,
  processorType: LobbyJoinedEventProcessor
};