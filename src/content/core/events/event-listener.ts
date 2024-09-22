import { ApplicationEvent } from "./applicationEvent.interface";
import { inject, injectable } from "inversify";
import { EventsService } from "./events.service";
import { EventProcessor } from "./event-processor";
import { filter } from "rxjs";
import { LoggerService } from "../logger/logger.service";

@injectable()
export class EventListener<TEvent extends ApplicationEvent> {

  /**
   * Reference to the event observable that filters all events from the event service that are of this type
   * @private
   */
  private readonly _events$;

  /**
   * Observable that emits all events of this type
   */
  public get events$() {
    return this._events$;
  }

  constructor(
    @inject(EventProcessor) private readonly _processor: EventProcessor<TEvent>,
    @inject(EventsService) private readonly _eventsService: EventsService,
    @inject(LoggerService) protected readonly _logger: LoggerService,
  ) {
    this._logger.bindTo(this);

    /* filter all events from the central event pipe */
    this._events$ = _eventsService.events$.pipe(
      filter((event) => _processor.isProcessorEvent(event))
    );
  }
}