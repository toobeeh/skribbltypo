import type { skribblPlayer } from "@/util/skribbl/lobby";
import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/app/core/extension-container/extension-container";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

export interface lobbyPlayerChanged {
  joined?: skribblPlayer,
  left?: {
    id: number,
    reason: "kicked" | "left";
  }
}

/**
 * Event that is emitted when a player joins or leaves the lobby
 */
export class LobbyPlayerChangedEvent extends ApplicationEvent<lobbyPlayerChanged> {
  constructor(public readonly data: lobbyPlayerChanged) { super(); }
}

@injectable()
export class LobbyPlayerChangedEventProcessor extends EventProcessor<lobbyPlayerChanged, LobbyPlayerChangedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = LobbyPlayerChangedEvent;

  protected async streamEvents(): Promise<Observable<LobbyPlayerChangedEvent>> {
    const events = new Subject<LobbyPlayerChangedEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    skribblMessages.serverMessages$.subscribe((event) => {

      /* player joined lobby */
      if(event.id === 1){
        const data: lobbyPlayerChanged = {
          joined: event.data as skribblPlayer
        };

        this._logger.info("Player joined", data);
        events.next(new LobbyPlayerChangedEvent(data));
      }

      /* player left lobby */
      else if (event.id === 2){
        const data: lobbyPlayerChanged = {
          left: {
            id: event.data.id as number,
            reason: event.data.id === 1 ? "left" : "kicked"
          }
        };

        this._logger.info("Player left", data);
        events.next(new LobbyPlayerChangedEvent(data));
      }
    });
    return events;
  }
}

@injectable()
export class LobbyPlayerChangedEventListener extends EventListener<lobbyPlayerChanged, LobbyPlayerChangedEvent> {
  @inject(LobbyPlayerChangedEventProcessor) protected readonly _processor!: LobbyPlayerChangedEventProcessor;
}

export const lobbyPlayerChangedEventRegistration: EventRegistration<lobbyPlayerChanged, LobbyPlayerChangedEvent> = {
  listenerType: LobbyPlayerChangedEventListener,
  processorType: LobbyPlayerChangedEventProcessor
};