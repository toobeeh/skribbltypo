import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject, injectable } from "inversify";
import { debounceTime, distinctUntilChanged, Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";

/**
 * Event that is emitted when the scoreboard visibility changes
 */
export class TextOverlayVisibilityChangedEvent extends ApplicationEvent<boolean> {
  constructor(public readonly data: boolean) { super(); }
}

@injectable()
export class TextOverlayVisibilityChangedEventProcessor extends EventProcessor<boolean, TextOverlayVisibilityChangedEvent>
{
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly eventType = TextOverlayVisibilityChangedEvent;

  protected async streamEvents(): Promise<Observable<TextOverlayVisibilityChangedEvent>> {
    const events = new Subject<TextOverlayVisibilityChangedEvent>();
    const elements = await this._elementsSetup.complete();

    const observer = new MutationObserver(() => {
      if(elements.canvasOverlay.style.top !== "100%" && elements.textOverlay.classList.contains("show")) {
        events.next(new TextOverlayVisibilityChangedEvent(true));
      }
      else events.next(new TextOverlayVisibilityChangedEvent(false));
    });

    observer.observe(elements.textOverlay, { attributes: true });

    return events.pipe(
      distinctUntilChanged(),
      debounceTime(50)
    );
  }
}

@injectable()
export class TextOverlayVisibilityChangedEventListener extends EventListener<boolean, TextOverlayVisibilityChangedEvent> {
  @inject(TextOverlayVisibilityChangedEventProcessor) protected readonly _processor!: TextOverlayVisibilityChangedEventProcessor;
}

export const textOverlayVisibilityChangedEventRegistration: EventRegistration<boolean, TextOverlayVisibilityChangedEvent> = {
  listenerType: TextOverlayVisibilityChangedEventListener,
  processorType: TextOverlayVisibilityChangedEventProcessor
};