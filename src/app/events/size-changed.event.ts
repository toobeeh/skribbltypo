import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/app/core/extension-container/extension-container";

/**
 * Event that is emitted whenever an image is cleared or an action is undone
 * The data is the index of first draw command that has been removed
 */
export class SizeChangedEvent extends ApplicationEvent<number> {
  constructor(public readonly data: number) { super(); }
}

@injectable()
export class SizeChangedEventProcessor extends EventProcessor<number, SizeChangedEvent>
{

  public readonly eventType = SizeChangedEvent;

  protected async streamEvents(): Promise<Observable<SizeChangedEvent>> {
    const events = new Subject<SizeChangedEvent>();

    /* listen for custom patched event */
    document.addEventListener("skribblSizeChanged", (event: Event) => {
      const size = Number((event as CustomEvent<number>).detail);
      events.next(new SizeChangedEvent(size));
      this._logger.info("Size changed", size);
    });

    return events;
  }
}

@injectable()
export class SizeChangedEventListener extends EventListener<number, SizeChangedEvent> {
  @inject(SizeChangedEventProcessor) protected readonly _processor!: SizeChangedEventProcessor;
}

export const sizeChangedEventRegistration: EventRegistration<number, SizeChangedEvent> = {
  listenerType: SizeChangedEventListener,
  processorType: SizeChangedEventProcessor
};