import { Color } from "@/util/color";
import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";

/**
 * Event that is emitted whenever an image is cleared or an action is undone
 * The data is the index of first draw command that has been removed
 */
export class ColorChangedEvent extends ApplicationEvent<Color> {
  constructor(public readonly data: Color) { super(); }
}

@injectable()
export class ColorChangedEventProcessor extends EventProcessor<Color, ColorChangedEvent>
{

  public readonly eventType = ColorChangedEvent;

  protected async streamEvents(): Promise<Observable<ColorChangedEvent>> {
    const events = new Subject<ColorChangedEvent>();

    /* listen for custom patched event */
    document.addEventListener("skribblColorChanged", (event: Event) => {
      const rgb = (event as CustomEvent<string>).detail;
      const color = Color.fromRgbString(rgb);
      events.next(new ColorChangedEvent(color));
      this._logger.info("Color changed", color);
    });

    return events;
  }
}

@injectable()
export class ColorChangedEventListener extends EventListener<Color, ColorChangedEvent> {
  @inject(ColorChangedEventProcessor) protected readonly _processor!: ColorChangedEventProcessor;
}

export const colorChangedEventRegistration: EventRegistration<Color, ColorChangedEvent> = {
  listenerType: ColorChangedEventListener,
  processorType: ColorChangedEventProcessor
};