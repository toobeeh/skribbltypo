import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "../core/lifetime/lifecycle.service";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

export class RoundStartedEvent extends ApplicationEvent<number> {
  constructor(public readonly data: number) { super(); }
}

@injectable()
export class RoundStartedEventProcessor extends EventProcessor<number, RoundStartedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = RoundStartedEvent;

  protected async streamEvents(): Promise<Observable<RoundStartedEvent>> {
    const events = new Subject<RoundStartedEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    skribblMessages.subscribe((event) => {
      if(event.id === 11 && event.data.id == 2){
        const round =( event.data.data as number) + 1;
        this._logger.info("Round started", round);
        events.next(new RoundStartedEvent(round));
      }
    });
    return events;
  }
}

@injectable()
export class RoundStartedEventListener extends EventListener<number, RoundStartedEvent> {
  @inject(RoundStartedEventProcessor) protected readonly _processor!: RoundStartedEventProcessor;
}

export const roundStartedEventRegistration: EventRegistration<number, RoundStartedEvent> = {
  listenerType: RoundStartedEventListener,
  processorType: RoundStartedEventProcessor
};