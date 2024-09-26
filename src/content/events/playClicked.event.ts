import { EventProcessor } from "../core/event/eventProcessor";
import { Observable, Subject } from "rxjs";
import { inject, injectable } from "inversify";
import { ApplicationEvent } from "../core/event/applicationEvent";
import { EventListener } from "../core/event/eventListener";

interface playClickedData {
  url: string;
}

export class PlayClickedEvent extends ApplicationEvent<playClickedData> {
  public readonly name = "playClicked";

  constructor(public readonly data: playClickedData) {
    super();
  }
}

@injectable()
export class PlayClickedEventProcessor extends EventProcessor<playClickedData, PlayClickedEvent>
{
  public readonly eventType = PlayClickedEvent;

  protected streamEvents(): Observable<PlayClickedEvent> {
    const obs = new Subject<PlayClickedEvent>();
    document.addEventListener("click", () => {
      obs.next(new PlayClickedEvent({ url: window.location.href }));
    });

    return obs;
  }
}

@injectable()
export class PlayClickedEventListener extends EventListener<playClickedData, PlayClickedEvent> {

  @inject(PlayClickedEventProcessor)
  protected readonly _processor!: PlayClickedEventProcessor;

}