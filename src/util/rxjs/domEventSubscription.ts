import { Subject } from "rxjs";

/**
 * Wrapper class to retrieve DOM events as an observable stream.
 */
export class DomEventSubscription<TEvent extends keyof HTMLElementEventMap> {

  private readonly _events$ = new Subject<HTMLElementEventMap[TEvent]>();

  private onEvent(arg: HTMLElementEventMap[TEvent]) {
    this._events$.next(arg);
  }

  private _eventListener = this.onEvent.bind(this);

  constructor(private readonly _element: HTMLElement, private readonly _eventType: TEvent) {
    _element.addEventListener(_eventType, this._eventListener);
  }

  public get events$() {
    return this._events$.asObservable();
  }

  /**
   * Unsubscribe from the event and complete the observable.
   * All subscribers will receive a complete notification.
   */
  public unsubscribe() {
    this._element.removeEventListener(this._eventType, this._eventListener);
    this._events$.complete();
  }
}