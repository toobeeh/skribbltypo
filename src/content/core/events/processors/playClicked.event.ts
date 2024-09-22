import { EventProcessor } from "../event-processor";
import { Observable, Subject } from "rxjs";
import { injectable } from "inversify";
import { ApplicationEvent } from "../applicationEvent.interface";
import { ApplicationEventProcessor } from "../applicationEvent.decorator";

export const PlayClickedEvent = Symbol("PlayClickedEvent");
export interface PlayClickedEvent extends ApplicationEvent {
  name: "playClicked";
  data: {
    url: string;
  };
}

@ApplicationEventProcessor(PlayClickedEvent)
@injectable()
export class PlayClickedEventProcessor extends EventProcessor<PlayClickedEvent>
{
  public readonly eventName = "playClicked";

  protected streamEvents(): Observable<PlayClickedEvent> {
    const obs = new Subject<PlayClickedEvent>();
    document.addEventListener("click", () => {
      obs.next({name: "playClicked", data: {url: window.location.href}});
    });

    return obs;
  }

}