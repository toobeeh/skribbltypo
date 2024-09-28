import { SkribblEmitRelaySetup } from "@/content/setups/skribbl-emit-relay/skribbl-emit-relay.setup";
import { inject, injectable } from "inversify";
import { filter, map, Observable } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";

/**
 * Event that is emitted whenever the user sent a message to the skribbl socket server
 */
export class MessageSentEvent extends ApplicationEvent<string> {
  constructor(public readonly data: string) { super(); }
}

@injectable()
export class MessageSentEventProcessor extends EventProcessor<string, MessageSentEvent>
{
  @inject(SkribblEmitRelaySetup) _skribblEmitRelaySetup!: SkribblEmitRelaySetup;

  public readonly eventType = MessageSentEvent;

  protected async streamEvents(): Promise<Observable<MessageSentEvent>> {
    const skribblEmit = await this._skribblEmitRelaySetup.complete();
    return skribblEmit.pipe(
      filter((event) => event.event === "data" && event.data.id == 30),
      map((emit) => new MessageSentEvent(emit.data.data))
    );
  }
}

@injectable()
export class MessageSentEventListener extends EventListener<string, MessageSentEvent> {
  @inject(MessageSentEventProcessor) protected readonly _processor!: MessageSentEventProcessor;
}

export const messageSentEventRegistration: EventRegistration<string, MessageSentEvent> = {
  listenerType: MessageSentEventListener,
  processorType: MessageSentEventProcessor
};