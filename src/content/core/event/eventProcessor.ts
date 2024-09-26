import { inject, injectable } from "inversify";
import { EventsService } from "./events.service";
import { Observable } from "rxjs";
import { ApplicationEvent } from "./applicationEvent";
import type { Type } from "../../../util/types/type";
import { loggerFactory } from "../logger/loggerFactory.interface";

export type EventProcessorImplementationType<TData> =
  new (...args: ConstructorParameters<typeof EventProcessor>) => EventProcessor<TData, ApplicationEvent<TData>>;

@injectable()
export abstract class EventProcessor<TData, TEvent extends ApplicationEvent<TData>> {

  private readonly _logger;

  /**
   * Observable that contains all events of this type
   * @private
   */
  private readonly _events$;

  /**
   * Type of the event this processor emits
   */
  public abstract readonly eventType: Type<ApplicationEvent<TData>>;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(EventsService) private readonly _eventsService: EventsService
  ) {
    this._logger = loggerFactory(this);

    /* create event stream from implementation */
    this._events$ = this.streamEvents();

    /* publish events to the central pipe */
    this._events$.subscribe((event) => {
      this._eventsService.publishEvent(event);
    });
  }

  /**
   * Create an observable that streams all events of this type
   * @protected
   */
  protected abstract streamEvents(): Observable<TEvent>;

  /**
   * Check if an event is of the type this processor emits
   * @param event
   */
  public isProcessorEvent(event: ApplicationEvent<unknown>): event is TEvent {
    return event instanceof this.eventType;
  }
}