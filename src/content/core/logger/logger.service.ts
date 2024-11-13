import { TypoFeature } from "@/content/core/feature/feature";
import { injectable } from "inversify";
import { Subject } from "rxjs";

export type logLevel = "debug" | "info" | "warn" | "error";

export interface loggerEvent {
  logLevel: logLevel;
  message: unknown;
  data: unknown[];
  date: Date;
  bindingName: string;
}

@injectable()
export class LoggerService {

  private _level: logLevel = "debug";
  public set level(level: logLevel) {
    this._level = level;
  }
  public get level(): logLevel {
    return this._level ;
  }

  private readonly _levels: {[key in logLevel]: number} = {
    "debug": 1 ,
    "info": 2,
    "warn": 3,
    "error": 4
  };

  private _boundTo?: object;
  public bindTo(value: object) {
    this._boundTo = value;
    return this;
  }
  public get boundTo() {
    return this._boundTo?.constructor.name ?? " / ";
  }
  public get boundType() {
    return this._boundTo instanceof TypoFeature ? "feature" : "other";
  }

  private _events$ = new Subject<loggerEvent>();
  public get events$() {
    return this._events$.asObservable();
  }

  /**
   * Logs a message to the console.
   * @param message The message to log.
   * @param data Additional data that will be inspectable in the console.
   */
  debug(message: unknown, ...data: unknown[]) {
    if(this._levels[this.level] > this._levels["debug"]) return;

    this._events$.next({
      logLevel: "debug",
      message: message,
      data: data,
      date: new Date(),
      bindingName: this.boundTo
    });
  }

  /**
   * Logs a message to the console.
   * @param message The message to log.
   * @param data Additional data that will be inspectable in the console.
   */
  info(message: unknown, ...data: unknown[]) {
    if(this._levels[this.level] > this._levels["info"]) return;

    this._events$.next({
      logLevel: "info",
      message: message,
      data: data,
      date: new Date(),
      bindingName: this.boundTo
    });
  }

  /**
   * Logs a warning to the console.
   * @param message The warning to log.
   * @param data Additional data that will be inspectable in the console.
   */
  warn(message: unknown, ...data: unknown[]) {
    if(this._levels[this.level] > this._levels["warn"]) return;

    this._events$.next({
      logLevel: "warn",
      message: message,
      data: data,
      date: new Date(),
      bindingName: this.boundTo
    });
  }

  /**
   * Logs an error to the console.
   * @param message The error to log.
   * @param data Additional data that will be inspectable in the console.
   */
  error(message: unknown, ...data: unknown[]) {
    if(this._levels[this.level] > this._levels["error"]) return;

    this._events$.next({
      logLevel: "error",
      message: message,
      data: data,
      date: new Date(),
      bindingName: this.boundTo
    });
  }
}
