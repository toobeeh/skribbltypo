import { SkribblMessageRelaySetup } from "@/app/setups/skribbl-message-relay/skribbl-message-relay.setup";
import { inject, injectable } from "inversify";
import { filter, map, Observable, tap } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/app/core/extension-container/extension-container";

export interface messageReceivedEvent {
  message: string;
  senderId: number;
}

/**
 * Event that is emitted whenever an incoming chat message from the skribbl server is received
 * Note that these also include own messages!
 */
export class MessageReceivedEvent extends ApplicationEvent<messageReceivedEvent> {
  constructor(public readonly data: messageReceivedEvent) { super(); }
}

@injectable()
export class MessageReceivedEventProcessor extends EventProcessor<messageReceivedEvent, MessageReceivedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = MessageReceivedEvent;

  protected async streamEvents(): Promise<Observable<MessageReceivedEvent>> {
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    return skribblMessages.serverMessages$.pipe(
      filter((event) => event.id == 30),
      map((event) => new MessageReceivedEvent({message: event.data.msg, senderId: event.data.id})),
      tap((data) => this._logger.debug("Message received", data)),
    );
  }
}

@injectable()
export class MessageReceivedEventListener extends EventListener<messageReceivedEvent, MessageReceivedEvent> {
  @inject(MessageReceivedEventProcessor) protected readonly _processor!: MessageReceivedEventProcessor;
}

export const messageReceivedEventRegistration: EventRegistration<messageReceivedEvent, MessageReceivedEvent> = {
  listenerType: MessageReceivedEventListener,
  processorType: MessageReceivedEventProcessor
};