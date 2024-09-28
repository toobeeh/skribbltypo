import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "../core/lifetime/lifecycle.service";
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

  public readonly eventType = DrawEvent;

  protected async streamEvents(): Promise<Observable<DrawEvent>> {
    const events = new Subject<DrawEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    skribblMessages.subscribe((event) => {

      /*draw commands event*/
      if(event.id === 19){
        const commands = event.data as number[][];
        events.next(new DrawEvent(commands));
      }
      /*draw commands from lobby joined*/
      if(event.id === 10 && event.data.data.id === 4 && event.data.data.drawCommands){
        const commands = event.data.data.drawCommands as number[][];
        events.next(new DrawEvent(commands));
      }
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