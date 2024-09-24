import { injectable } from "inversify";

type level = "debug" | "info" | "warn" | "error";

@injectable()
export class LoggerService {

  private static readonly styles = {
    debug: "color: lightGray; font-weight: bold;",
    info: "color: lightBlue; font-weight: bold;",
    warn: "color: orange; font-weight: bold;",
    error: "color: red; font-weight: bold;",
    date: "color: darkGrey; font-weight: light;"
  };
  private static _level: level = "error";

  public static set level(level: level) {
    this._level = level;
  }

  private readonly _prefix = "skribbltypo";
  private readonly _levels: {[key in level]: number} = {
    "debug": 1 ,
    "info": 2,
    "warn": 3,
    "error": 4
  };

  private _boundTo = " / ";
  public bindTo(value: object) {
    this._boundTo = value.constructor.name;
    return this;
  }

  private getTimestamp() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  }

  /**
   * Logs a message to the console.
   * @param message The message to log.
   * @param data Additional data that will be inspectable in the console.
   */
  debug(message: unknown, ...data: unknown[]) {
    if(this._levels[LoggerService._level] > this._levels["debug"]) return;

    console.log(`%c ${this.getTimestamp()} %c[${this._prefix}] [DEB]  (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.debug, message, ...data);
  }

  /**
   * Logs a message to the console.
   * @param message The message to log.
   * @param data Additional data that will be inspectable in the console.
   */
  info(message: unknown, ...data: unknown[]) {
    if(this._levels[LoggerService._level] > this._levels["info"]) return;

    console.log(`%c ${this.getTimestamp()} %c[${this._prefix}] [INFO] (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.info, message, ...data);
  }

  /**
   * Logs a warning to the console.
   * @param message The warning to log.
   * @param data Additional data that will be inspectable in the console.
   */
  warn(message: unknown, ...data: unknown[]) {
    if(this._levels[LoggerService._level] > this._levels["warn"]) return;

    console.warn(`%c ${this.getTimestamp()} %c[${this._prefix}] [WARN] (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.warn, message, ...data);
  }

  /**
   * Logs an error to the console.
   * @param message The error to log.
   * @param data Additional data that will be inspectable in the console.
   */
  error(message: unknown, ...data: unknown[]) {
    if(this._levels[LoggerService._level] > this._levels["error"]) return;

    console.error(`%c ${this.getTimestamp()} %c[${this._prefix}] [ERR]  (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.error, message, ...data);
  }
}
