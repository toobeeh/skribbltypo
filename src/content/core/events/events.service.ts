import { inject, injectable } from "inversify";
import { ApplicationEvent } from "./applicationEvent";
import { Subject } from "rxjs";
import { loggerFactory } from "../logger/loggerFactory.interface";

@injectable()
export class EventsService {

  private readonly _logger;

  /**
   * Subject that contains all application events
   * @private
   */
  private _events$ = new Subject<ApplicationEvent<unknown>>();

  /**
   * Observable that emits all application events that are recognized by registered event processors
   */
  public get events$(){
    return this._events$.asObservable();
  }

  constructor(@inject(loggerFactory) loggerFactory: loggerFactory) {
    this._logger = loggerFactory(this);
  }

  /**
   * Publishes an event to the central application event stream
   * @param event
   */
  public publishEvent(event: ApplicationEvent<unknown>) {
    this._events$.next(event);
  }
}
