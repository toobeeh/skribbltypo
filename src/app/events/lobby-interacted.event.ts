import { SkribblMessageRelaySetup } from "@/app/setups/skribbl-message-relay/skribbl-message-relay.setup";
import { parseSkribblLobbyInteractedEvent } from "@/util/skribbl/lobbyInteraction";
import { inject, injectable } from "inversify";
import { filter, map, Observable, tap } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/app/core/extension-container/extension-container";

export interface lobbyInteractedEvent {
  votekickInteraction?: {
    targetPlayerId: number,
    sourcePlayerId: number,
    totalVotes: number,
    requiredVotes: number
  },
  likeInteraction?: {
    sourcePlayerId: number
  },
  dislikeInteraction?: {
    sourcePlayerId: number
  },
}

/**
 * Event that is emitted whenever an interaction in a lobby happened
 * interactions include like, dislike, votekick
 */
export class LobbyInteractedEvent extends ApplicationEvent<lobbyInteractedEvent> {
  constructor(public readonly data: lobbyInteractedEvent) { super(); }
}

@injectable()
export class LobbyInteractedEventProcessor extends EventProcessor<lobbyInteractedEvent, LobbyInteractedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = LobbyInteractedEvent;

  protected async streamEvents(): Promise<Observable<LobbyInteractedEvent>> {
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    return skribblMessages.serverMessages$.pipe(
      map(message => parseSkribblLobbyInteractedEvent(message)),
      filter(event => event !== undefined),
      map(event => new LobbyInteractedEvent(event)),
      tap(data => this._logger.debug("Lobby interacted", data)),
    );
  }
}

@injectable()
export class LobbyInteractedEventListener extends EventListener<lobbyInteractedEvent, LobbyInteractedEvent> {
  @inject(LobbyInteractedEventProcessor) protected readonly _processor!: LobbyInteractedEventProcessor;
}

export const lobbyInteractedEventRegistration: EventRegistration<lobbyInteractedEvent, LobbyInteractedEvent> = {
  listenerType: LobbyInteractedEventListener,
  processorType: LobbyInteractedEventProcessor
};