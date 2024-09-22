import { inject, injectable } from "inversify";
import { LoggerService } from "../logger/logger.service";
import { EventsService } from "./events.service";
import { Observable } from "rxjs";
import { ApplicationEvent } from "./applicationEvent.interface";

export type EventProcessorImplementationType =  new (...args: ConstructorParameters<typeof EventProcessor>) => EventProcessor<ApplicationEvent>;

@injectable()
export abstract class EventProcessor<TEvent extends ApplicationEvent> {

  /**
   * Observable that contains all events of this type
   * @private
   */
  private readonly _events$;

  /**
   * Name of the event this processor is responsible for
   */
  public abstract readonly eventName: TEvent["name"];

  constructor(
    @inject(LoggerService) protected readonly _logger: LoggerService,
    @inject(EventsService) private readonly _eventsService: EventsService
  ) {
    this._logger.bindTo(this);

    /* create event stream from implementation */
    this._events$ = this.streamEvents();

    /* publish events to the central pipe */
    this._events$.subscribe((event) => {
      this._eventsService.publishEvent(event);
    });
  }

  /**
   * Create a observable that streams all events of this type
   * @protected
   */
  protected abstract streamEvents(): Observable<TEvent>;

  /**
   * Check if the event is of the type this processor is responsible for
   * @param event
   */
  public isProcessorEvent(event: ApplicationEvent): event is TEvent {
    return event.name === this.eventName;
  }
}