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
export class PlayerPopupVisibilityChangedEvent extends ApplicationEvent<boolean> {
  constructor(public readonly data: boolean) { super(); }
}

@injectable()
export class PlayerPopupVisibilityChangedEventProcessor extends EventProcessor<boolean, PlayerPopupVisibilityChangedEvent>
{
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly eventType = PlayerPopupVisibilityChangedEvent;

  protected async streamEvents(): Promise<Observable<PlayerPopupVisibilityChangedEvent>> {
    const events = new Subject<PlayerPopupVisibilityChangedEvent>();
    const elements = await this._elementsSetup.complete();

    const observer = new MutationObserver(() => {
      if(elements.skribblModal.style.display !== "none" && elements.playerPopup.style.display === "flex") {
        events.next(new PlayerPopupVisibilityChangedEvent(true));
      }
      else events.next(new PlayerPopupVisibilityChangedEvent(false));
    });

    observer.observe(elements.playerPopup, { attributes: true });

    return events.pipe(
      distinctUntilChanged(),
      debounceTime(50)
    );
  }
}

@injectable()
export class PlayerPopupVisibilityChangedEventListener extends EventListener<boolean, PlayerPopupVisibilityChangedEvent> {
  @inject(PlayerPopupVisibilityChangedEventProcessor) protected readonly _processor!: PlayerPopupVisibilityChangedEventProcessor;
}

export const playerPopupVisibilityChangedEventRegistration: EventRegistration<boolean, PlayerPopupVisibilityChangedEvent> = {
  listenerType: PlayerPopupVisibilityChangedEventListener,
  processorType: PlayerPopupVisibilityChangedEventProcessor
};