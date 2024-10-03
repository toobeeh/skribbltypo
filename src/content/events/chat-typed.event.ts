import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject, injectable } from "inversify";
import { distinctUntilChanged, Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "@/content/core/extension-container/extension-container";

/**
 * Event emitted when the content in the chat input changed (user typed)
 */
export class ChatTypedEvent extends ApplicationEvent<string> {
  constructor(public readonly data: string) { super(); }
}

@injectable()
export class ChatTypedEventProcessor extends EventProcessor<string, ChatTypedEvent>
{
  @inject(ElementsSetup) _elementsSetup!: ElementsSetup;

  public readonly eventType = ChatTypedEvent;

  protected async streamEvents(): Promise<Observable<ChatTypedEvent>> {
    const events = new Subject<ChatTypedEvent>();
    const {chatInput} = await this._elementsSetup.complete();

    /* listen for value change */
    chatInput.addEventListener("input", () => {
      const value = chatInput.value;
      events.next(new ChatTypedEvent(value));
    });

    return events.pipe(
      distinctUntilChanged((a, b) => a.data === b.data)
    );
  }
}

@injectable()
export class ChatTypedEventListener extends EventListener<string, ChatTypedEvent> {
  @inject(ChatTypedEventProcessor) protected readonly _processor!: ChatTypedEventProcessor;
}

export const chatTypedEventRegistration: EventRegistration<string, ChatTypedEvent> = {
  listenerType: ChatTypedEventListener,
  processorType: ChatTypedEventProcessor
};