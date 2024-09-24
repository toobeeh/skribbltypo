import { inject, injectable } from "inversify";
import { EventsService } from "./events.service";
import { EventProcessor } from "./event-processor";
import { filter } from "rxjs";
import { loggerFactory } from "../logger/loggerFactory.interface";
import { ApplicationEvent } from "./applicationEvent";

@injectable()
export abstract class EventListener<TData, TEvent extends ApplicationEvent<TData>> {

  protected abstract readonly _processor: EventProcessor<TData, TEvent>;

  /**
   * Reference to the event observable that filters all events from the event service that are of this type
   * @private
   */
  private readonly _events$;

  private readonly _logger;

  /**
   * Observable that emits all events of this type
   */
  public get events$() {
    return this._events$;
  }

  constructor(
    @inject(EventsService) private readonly _eventsService: EventsService,
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);

    /* filter all events from the central event pipe */
    this._events$ = _eventsService.events$.pipe(
      filter((event) => this._processor.isProcessorEvent(event))
    );
  }
}