import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "../core/lifetime/lifecycle.service";

/**
 * Event emitted when the user leaves a lobby
 * Practice leave is also emitted as synthetic event
 */
export class LobbyLeftEvent extends ApplicationEvent<null> {
  constructor(public readonly data: null) { super(); }
}

@injectable()
export class LobbyLeftEventProcessor extends EventProcessor<null, LobbyLeftEvent>
{
  public readonly eventType = LobbyLeftEvent;

  protected streamEvents(): Observable<LobbyLeftEvent> {
    const events = new Subject<LobbyLeftEvent>();

    /* listen for skribbl lobby left events from patched game */
    document.addEventListener("leftLobby", async () => {

      this._logger.info("Lobby left");
      events.next(new LobbyLeftEvent(null));
    });

    return events;
  }
}

@injectable()
export class LobbyLeftEventListener extends EventListener<null, LobbyLeftEvent> {
  @inject(LobbyLeftEventProcessor) protected readonly _processor!: LobbyLeftEventProcessor;
}

export const lobbyLeftEventRegistration: EventRegistration<null, LobbyLeftEvent> = {
  listenerType: LobbyLeftEventListener,
  processorType: LobbyLeftEventProcessor
};