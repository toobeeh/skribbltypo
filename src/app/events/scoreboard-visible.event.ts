import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { inject, injectable } from "inversify";
import { debounceTime, distinctUntilChanged, Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/app/core/extension-container/extension-container";

/**
 * Event that is emitted when the scoreboard visibility changes
 */
export class ScoreboardVisibilityChangedEvent extends ApplicationEvent<boolean> {
  constructor(public readonly data: boolean) { super(); }
}

@injectable()
export class ScoreboardVisibilityChangedEventProcessor extends EventProcessor<boolean, ScoreboardVisibilityChangedEvent>
{
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly eventType = ScoreboardVisibilityChangedEvent;

  protected async streamEvents(): Promise<Observable<ScoreboardVisibilityChangedEvent>> {
    const events = new Subject<ScoreboardVisibilityChangedEvent>();
    const elements = await this._elementsSetup.complete();

    const observer = new MutationObserver(() => {
      if(elements.scoreboardResults.classList.contains("show")) events.next(new ScoreboardVisibilityChangedEvent(true));
      else events.next(new ScoreboardVisibilityChangedEvent(false));
    });

    observer.observe(elements.scoreboardResults, { attributes: true });

    return events.pipe(
      distinctUntilChanged(),
      debounceTime(50)
    );
  }
}

@injectable()
export class ScoreboardVisibilityChangedEventListener extends EventListener<boolean, ScoreboardVisibilityChangedEvent> {
  @inject(ScoreboardVisibilityChangedEventProcessor) protected readonly _processor!: ScoreboardVisibilityChangedEventProcessor;
}

export const scoreboardVisibilityChangedEventRegistration: EventRegistration<boolean, ScoreboardVisibilityChangedEvent> = {
  listenerType: ScoreboardVisibilityChangedEventListener,
  processorType: ScoreboardVisibilityChangedEventProcessor
};