import { SkribblEmitRelaySetup } from "@/content/setups/skribbl-emit-relay/skribbl-emit-relay.setup";
import { inject, injectable } from "inversify";
import { bufferTime, filter, map, merge, Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

/**
 * Event that is emitted whenever a draw command is executed/received
 * On lobby join, all missing commands of the current drawing are sent
 */
export class DrawEvent extends ApplicationEvent<number[][]> {
  constructor(public readonly data: number[][]) { super(); }
}

@injectable()
export class DrawEventProcessor extends EventProcessor<number[][], DrawEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;
  @inject(SkribblEmitRelaySetup) _skribblEmitRelaySetup!: SkribblEmitRelaySetup;

  public readonly eventType = DrawEvent;

  protected async streamEvents(): Promise<Observable<DrawEvent>> {
    const events = new Subject<DrawEvent>();

    const skribblMessages = await this._skribblMessageRelaySetup.complete();
    const skribblEmit = await this._skribblEmitRelaySetup.complete();

    /* merge own and lobby commands */
    merge(
      skribblEmit.pipe(
        filter(data => data.event === "data"),
        map(data => data.data)),
      skribblMessages.serverMessages$
    ).pipe(
      map(event => {
        /*draw commands event*/
        if(event.id === 19){
          if(typeof event.data[0] === "number") {
            return [event.data as number[]];
          }
          else return event.data as number[][];
        }

        /*draw commands from lobby joined*/
        if(event.id === 10 && event.data.state.id === 4 && event.data.state.data.drawCommands){
          return event.data.state.data.drawCommands as number[][];
        }

        return null;
      }),
      filter(data => data !== null),
      bufferTime(100),  /* debounce to prevent excessive observable spam */
      filter(data => data.length > 0)
    ).subscribe((data) => {
      const flat = data.flat(1);
      events.next(new DrawEvent(flat));
    });

    return events;
  }
}

@injectable()
export class DrawEventListener extends EventListener<number[][], DrawEvent> {
  @inject(DrawEventProcessor) protected readonly _processor!: DrawEventProcessor;
}

export const drawEventRegistration: EventRegistration<number[][], DrawEvent> = {
  listenerType: DrawEventListener,
  processorType: DrawEventProcessor
};