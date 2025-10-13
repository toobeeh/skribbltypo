import { Color } from "@/util/color";
import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/app/core/extension-container/extension-container";

export interface colorChangedEventData {
  color: Color;
  target: "secondary" | "primary";
}

/**
 * Event that is emitted whenever an image is cleared or an action is undone
 * The data is the index of first draw command that has been removed
 */
export class ColorChangedEvent extends ApplicationEvent<colorChangedEventData> {
  constructor(public readonly data: colorChangedEventData) { super(); }
}

@injectable()
export class ColorChangedEventProcessor extends EventProcessor<colorChangedEventData, ColorChangedEvent>
{

  public readonly eventType = ColorChangedEvent;

  protected async streamEvents(): Promise<Observable<ColorChangedEvent>> {
    const events = new Subject<ColorChangedEvent>();

    /* listen for custom patched event of primary color */
    document.addEventListener("skribblColorChanged", (event: Event) => {
      const rgb = (event as CustomEvent<string>).detail;
      const color = Color.fromRgbString(rgb);
      events.next(new ColorChangedEvent({ color, target: "primary" }));
      this._logger.info("prim Color changed", color);
    });

    /* listen for custom patched event of secondary color */
    document.addEventListener("skribblSecondaryColorChanged", (event: Event) => {
      const rgb = (event as CustomEvent<string>).detail;
      const color = Color.fromRgbString(rgb);
      events.next(new ColorChangedEvent({ color, target: "secondary" }));
      this._logger.info("sec Color changed", color);
    });

    return events;
  }
}

@injectable()
export class ColorChangedEventListener extends EventListener<colorChangedEventData, ColorChangedEvent> {
  @inject(ColorChangedEventProcessor) protected readonly _processor!: ColorChangedEventProcessor;
}

export const colorChangedEventRegistration: EventRegistration<colorChangedEventData, ColorChangedEvent> = {
  listenerType: ColorChangedEventListener,
  processorType: ColorChangedEventProcessor
};