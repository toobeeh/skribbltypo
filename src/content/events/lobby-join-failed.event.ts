import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";
import { GameSettingsSetup } from "../setups/game-settings/game-settings.setup";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

/**
 * Event emitted when a lobby is joined
 * Practice lobbies are emitted as a synthetic event
 */
export class LobbyJoinFailedEvent extends ApplicationEvent<null> {
  constructor(public readonly data: null) { super(); }
}

@injectable()
export class LobbyJoinFailedEventProcessor extends EventProcessor<null, LobbyJoinFailedEvent>
{
  @inject(GameSettingsSetup) _gameSettingsSetup!: GameSettingsSetup;
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = LobbyJoinFailedEvent;

  protected async streamEvents(): Promise<Observable<LobbyJoinFailedEvent>> {
    const events = new Subject<LobbyJoinFailedEvent>();

    /* listen for practice lobby joined events from patched game */
    document.addEventListener("joinLobbyFailed", () => {
      events.next(new LobbyJoinFailedEvent(null));
    });

    return events;
  }
}

@injectable()
export class LobbyJoinFailedListener extends EventListener<null, LobbyJoinFailedEvent> {
  @inject(LobbyJoinFailedEventProcessor) protected readonly _processor!: LobbyJoinFailedEventProcessor;
}

export const lobbyJoinFailedEventRegistration: EventRegistration<null, LobbyJoinFailedEvent> = {
  listenerType: LobbyJoinFailedListener,
  processorType: LobbyJoinFailedEventProcessor
};