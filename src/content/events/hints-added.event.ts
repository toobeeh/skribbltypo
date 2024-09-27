import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "../core/lifetime/lifecycle.service";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

export class HintsAddedEvent extends ApplicationEvent<[string, number][]> {
  constructor(public readonly data: [string, number][]) { super(); }
}

@injectable()
export class HintsAddedEventProcessor extends EventProcessor<[string, number][], HintsAddedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = HintsAddedEvent;

  protected async streamEvents(): Promise<Observable<HintsAddedEvent>> {
    const events = new Subject<HintsAddedEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    skribblMessages.subscribe((event) => {
      if(event.id === 10){
        const hints = (event.data.state.hints ?? []) as [string, number][];
        this._logger.info("Lobby joined", hints);
        events.next(new HintsAddedEvent(hints));
      }
      else if (event.id === 13){
        const hints = (event.data ?? []) as [string, number][];
        this._logger.info("Hints added", hints);
        events.next(new HintsAddedEvent(hints));
      }
    });
    return events;
  }
}

@injectable()
export class HintsAddedEventListener extends EventListener<[string, number][], HintsAddedEvent> {
  @inject(HintsAddedEventProcessor) protected readonly _processor!: HintsAddedEventProcessor;
}

export const hintsAddedEventRegistration: EventRegistration<[string, number][], HintsAddedEvent> = {
  listenerType: HintsAddedEventListener,
  processorType: HintsAddedEventProcessor
};