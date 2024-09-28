import { SkribblEmitRelaySetup } from "@/content/setups/skribbl-emit-relay/skribbl-emit-relay.setup";
import { inject, injectable } from "inversify";
import { filter, map, merge, Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

/**
 * Event that is emitted whenever an image is cleared or an action is undone
 * The data is the index of first draw command that has been removed
 */
export class ImageResetEvent extends ApplicationEvent<number> {
  constructor(public readonly data: number) { super(); }
}

@injectable()
export class ImageResetEventProcessor extends EventProcessor<number, ImageResetEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;
  @inject(SkribblEmitRelaySetup) _skribblEmitRelaySetup!: SkribblEmitRelaySetup;

  public readonly eventType = ImageResetEvent;

  protected async streamEvents(): Promise<Observable<ImageResetEvent>> {
    const events = new Subject<ImageResetEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();
    const skribblEmit = await this._skribblEmitRelaySetup.complete();

    /* merge own and lobby commands */
    merge(
      skribblEmit.pipe(
        filter(data => data.event === "data"),
        map(data => data.data)),
      skribblMessages
    ).subscribe((event) => {

      /* clear event*/
      if(event.id === 20){
        this._logger.info("Image cleared");
        events.next(new ImageResetEvent(0));
      }

      /* undo event - did somehow not work, what is the event data? */
      if(event.id === 21){
        this._logger.info("Undo action", event.data);
        events.next(new ImageResetEvent(event.data));
      }
    });

    return events;
  }
}

@injectable()
export class ImageResetEventListener extends EventListener<number, ImageResetEvent> {
  @inject(ImageResetEventProcessor) protected readonly _processor!: ImageResetEventProcessor;
}

export const imageResetEventRegistration: EventRegistration<number, ImageResetEvent> = {
  listenerType: ImageResetEventListener,
  processorType: ImageResetEventProcessor
};