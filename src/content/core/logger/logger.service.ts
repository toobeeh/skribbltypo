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

  /**
   * Logs a message to the console.
   * @param message The message to log.
   */
  debug(message: unknown) {
    if(this._levels[LoggerService._level] > this._levels["debug"]) return;

    console.log(`%c ${new Date().toLocaleTimeString()} %c[${this._prefix}] [DEB]  (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.debug, message);
  }

  /**
   * Logs a message to the console.
   * @param message The message to log.
   */
  info(message: unknown) {
    if(this._levels[LoggerService._level] > this._levels["info"]) return;

    console.log(`%c ${new Date().toLocaleTimeString()} %c[${this._prefix}] [INFO] (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.info, message);
  }

  /**
   * Logs a warning to the console.
   * @param message The warning to log.
   */
  warn(message: unknown) {
    if(this._levels[LoggerService._level] > this._levels["warn"]) return;

    console.warn(`%c ${new Date().toLocaleTimeString()} %c[${this._prefix}] [WARN] (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.warn, message);
  }

  /**
   * Logs an error to the console.
   * @param message The error to log.
   */
  error(message: unknown) {
    if(this._levels[LoggerService._level] > this._levels["error"]) return;

    console.error(`%c ${new Date().toLocaleTimeString()} %c[${this._prefix}] [ERR]  (${this._boundTo})`, LoggerService.styles.date, LoggerService.styles.error, message);
  }
}
