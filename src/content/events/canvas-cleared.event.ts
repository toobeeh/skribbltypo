import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";

/**
 * Event that is emitted after the canvas has been cleared,
 * either after drawer change or clear action.
 * Contains the previous image base64 string of the canvas before the clear.
 */
export class CanvasClearedEvent extends ApplicationEvent<string> {
  constructor(public readonly data: string) { super(); }
}

@injectable()
export class CanvasClearedEventProcessor extends EventProcessor<string, CanvasClearedEvent>
{

  public readonly eventType = CanvasClearedEvent;

  protected async streamEvents(): Promise<Observable<CanvasClearedEvent>> {
    const events = new Subject<CanvasClearedEvent>();

    document.addEventListener("logCanvasClear", event => {
      const data = (event as CustomEvent).detail;
      events.next(new CanvasClearedEvent(data));
    });

    return events;
  }
}

@injectable()
export class CanvasClearedEventListener extends EventListener<string, CanvasClearedEvent> {
  @inject(CanvasClearedEventProcessor) protected readonly _processor!: CanvasClearedEventProcessor;
}

export const canvasClearedEventRegistration: EventRegistration<string, CanvasClearedEvent> = {
  listenerType: CanvasClearedEventListener,
  processorType: CanvasClearedEventProcessor
};