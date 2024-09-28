import { SkribblMessageRelaySetup } from "@/content/setups/skribbl-message-relay/skribbl-message-relay.setup";
import { inject, injectable } from "inversify";
import { filter, map, Observable } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";

/**
 * Event that is emitted whenever an incoming chat message from the skribbl server is received
 * Note that these also include own messages!
 */
export class MessageReceivedEvent extends ApplicationEvent<string> {
  constructor(public readonly data: string) { super(); }
}

@injectable()
export class MessageReceivedEventProcessor extends EventProcessor<string, MessageReceivedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = MessageReceivedEvent;

  protected async streamEvents(): Promise<Observable<MessageReceivedEvent>> {
    const skribblEmit = await this._skribblMessageRelaySetup.complete();
    return skribblEmit.pipe(
      filter((event) => event.id == 30),
      map((event) => new MessageReceivedEvent(event.data))
    );
  }
}

@injectable()
export class MessageReceivedEventListener extends EventListener<string, MessageReceivedEvent> {
  @inject(MessageReceivedEventProcessor) protected readonly _processor!: MessageReceivedEventProcessor;
}

export const messageReceivedEventRegistration: EventRegistration<string, MessageReceivedEvent> = {
  listenerType: MessageReceivedEventListener,
  processorType: MessageReceivedEventProcessor
};