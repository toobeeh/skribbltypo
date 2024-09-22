import { inject, injectable } from "inversify";
import { LoggerService } from "../logger/logger.service";
import { ApplicationEvent } from "./applicationEvent.interface";
import { Subject } from "rxjs";

@injectable()
export class EventsService {

  /**
   * Subject that contains all application events
   * @private
   */
  private _events$ = new Subject<ApplicationEvent>();

  /**
   * Observable that emits all application events that are recognized by registered event processors
   */
  public get events$(){
    return this._events$.asObservable();
  }

  constructor(@inject(LoggerService) private _logger: LoggerService) {
    this._logger.bindTo(this);
  }

  /**
   * Publishes an event to the central application event stream
   * @param event
   */
  public publishEvent(event: ApplicationEvent) {
    this._events$.next(event);
  }
}
