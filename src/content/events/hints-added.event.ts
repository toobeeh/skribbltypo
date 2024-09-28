import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

/**
 * Event that contains hint characters at their position, when new hints are added
 * On lobby join, already existing hints are emitted
 */
export class HintsAddedEvent extends ApplicationEvent<[number, string][]> {
  constructor(public readonly data: [number, string][]) { super(); }
}

@injectable()
export class HintsAddedEventProcessor extends EventProcessor<[number, string][], HintsAddedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = HintsAddedEvent;

  protected async streamEvents(): Promise<Observable<HintsAddedEvent>> {
    const events = new Subject<HintsAddedEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    skribblMessages.subscribe((event) => {

      /* inital lobby hints */
      if(event.id === 10 && event.data.state.id === 4 && event.data.state.data.hints){
        const hints = event.data.state.data.hints as [number, string][];
        this._logger.info("Lobby joined", hints);
        events.next(new HintsAddedEvent(hints));
      }

      /* new hints added */
      else if (event.id === 13){
        const hints = (event.data ?? []) as [number, string][];
        this._logger.info("Hints added", hints);
        events.next(new HintsAddedEvent(hints));
      }
    });
    return events;
  }
}

@injectable()
export class HintsAddedEventListener extends EventListener<[number, string][], HintsAddedEvent> {
  @inject(HintsAddedEventProcessor) protected readonly _processor!: HintsAddedEventProcessor;
}

export const hintsAddedEventRegistration: EventRegistration<[number, string][], HintsAddedEvent> = {
  listenerType: HintsAddedEventListener,
  processorType: HintsAddedEventProcessor
};