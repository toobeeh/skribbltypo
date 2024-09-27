import { inject, injectable } from "inversify";
import { Observable, Subject } from "rxjs";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";
import { EventProcessor } from "../core/event/eventProcessor";
import type { EventRegistration } from "../core/lifetime/lifecycle.service";
import { SkribblMessageRelaySetup } from "../setups/skribbl-message-relay/skribbl-message-relay.setup";

export interface wordGuessed {
  playerId: number,
  word?: string
}

export class WordGuessedEvent extends ApplicationEvent<wordGuessed> {
  constructor(public readonly data: wordGuessed) { super(); }
}

@injectable()
export class WordGuessedEventProcessor extends EventProcessor<wordGuessed, WordGuessedEvent>
{
  @inject(SkribblMessageRelaySetup) _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  public readonly eventType = WordGuessedEvent;

  protected async streamEvents(): Promise<Observable<WordGuessedEvent>> {
    const events = new Subject<WordGuessedEvent>();
    const skribblMessages = await this._skribblMessageRelaySetup.complete();

    skribblMessages.subscribe((event) => {
      if(event.id === 15){
        const guessed: wordGuessed = {
          playerId: event.data.id,
          word: event.data.word ?? undefined
        };

        this._logger.info("Word guessed", guessed);
        events.next(new WordGuessedEvent(guessed));
      }
    });
    return events;
  }
}

@injectable()
export class WordGuessedEventListener extends EventListener<wordGuessed, WordGuessedEvent> {
  @inject(WordGuessedEventProcessor) protected readonly _processor!: WordGuessedEventProcessor;
}

export const wordGuessedEventRegistration: EventRegistration<wordGuessed, WordGuessedEvent> = {
  listenerType: WordGuessedEventListener,
  processorType: WordGuessedEventProcessor
};