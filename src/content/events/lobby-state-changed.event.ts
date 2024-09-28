import { type lobbyStateUpdate, parseLobbyStateUpdate } from "@/util/skribbl/lobbyState";
import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";
import { GameSettingsSetup } from "../setups/game-settings/game-settings.setup";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

/**
 * Event emitted when the lobby state changes
 * The state is eg drawing, choosing words, words revealed, etc.
 */
export class LobbyStateChangedEvent extends ApplicationEvent<lobbyStateUpdate> {
  constructor(public readonly data: lobbyStateUpdate) { super(); }
}

@injectable()
export class LobbyStateChangedEventProcessor extends EventProcessor<lobbyStateUpdate, LobbyStateChangedEvent>
{
  @inject(GameSettingsSetup) _gameSettingsSetup!: GameSettingsSetup;
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = LobbyStateChangedEvent;

  protected async streamEvents(): Promise<Observable<LobbyStateChangedEvent>> {
    const events = new Subject<LobbyStateChangedEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    skribblMessages.subscribe((event) => {

      /* regular lobby update */
      if(event.id === 11){
        const update = parseLobbyStateUpdate(event.data);
        if(update === undefined) {
          this._logger.warn("Unknown event", event.data);
          return;
        }

        this._logger.info("Lobby updated", update);
        events.next(new LobbyStateChangedEvent(update));
      }

      /* lobby joined, new state received */
      if(event.id === 10){
        const update = parseLobbyStateUpdate(event.data.state);
        if(update === undefined) {
          this._logger.warn("Unknown event", event.data.state);
          return;
        }

        this._logger.info("Lobby joined", update);
        events.next(new LobbyStateChangedEvent(update));
      }
    });

    return events;
  }
}

@injectable()
export class LobbyStateChangedEventListener extends EventListener<lobbyStateUpdate, LobbyStateChangedEvent> {
  @inject(LobbyStateChangedEventProcessor) protected readonly _processor!: LobbyStateChangedEventProcessor;
}

export const lobbyStateChangedEventRegistration: EventRegistration<lobbyStateUpdate, LobbyStateChangedEvent> = {
  listenerType: LobbyStateChangedEventListener,
  processorType: LobbyStateChangedEventProcessor
};