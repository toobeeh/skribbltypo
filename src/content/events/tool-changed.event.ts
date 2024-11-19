import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";

export type skribblTool = "fill" | "brush" | "deselected" | "other";

/**
 * Event that is emitted whenever an image is cleared or an action is undone
 * The data is the index of first draw command that has been removed
 */
export class ToolChangedEvent extends ApplicationEvent<skribblTool> {
  constructor(public readonly data: skribblTool) { super(); }
}

@injectable()
export class ToolChangedEventProcessor extends EventProcessor<skribblTool, ToolChangedEvent>
{

  public readonly eventType = ToolChangedEvent;

  protected async streamEvents(): Promise<Observable<ToolChangedEvent>> {
    const events = new Subject<ToolChangedEvent>();

    /* listen for custom patched event */
    document.addEventListener("skribblToolChanged", (event: Event) => {
      const tool = (event as CustomEvent<number>).detail;
      const toolName: skribblTool = tool === 0 ? "brush" : tool === 1 ? "fill" : tool === -1 ? "deselected" : "other";
      events.next(new ToolChangedEvent(toolName));
      this._logger.info("Tool changed", toolName);
    });

    return events;
  }
}

@injectable()
export class ToolChangedEventListener extends EventListener<skribblTool, ToolChangedEvent> {
  @inject(ToolChangedEventProcessor) protected readonly _processor!: ToolChangedEventProcessor;
}

export const toolChangedEventRegistration: EventRegistration<skribblTool, ToolChangedEvent> = {
  listenerType: ToolChangedEventListener,
  processorType: ToolChangedEventProcessor
};