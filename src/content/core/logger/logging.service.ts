import type { loggerEvent, LoggerService, logLevel } from "@/content/core/logger/logger.service";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { injectable } from "inversify";
import { Subject, withLatestFrom } from "rxjs";

@injectable()
export class LoggingService {

  public static defaultLogLevel: logLevel = "debug";

  private static readonly styles = {
    debug: "color: lightGray; font-weight: bold;",
    info: "color: lightBlue; font-weight: bold;",
    warn: "color: orange; font-weight: bold;",
    error: "color: red; font-weight: bold;",
    date: "color: darkGrey; font-weight: light;"
  };
  private readonly _prefix = "skribbltypo";
  private readonly _printEnabledSetting = new ExtensionSetting<boolean>("logging.printLogEnabled", true)
    .withName("Print Logs")
    .withDescription("Whether to print extension event logs to the console");

  private _loggers: LoggerService[] = [];
  private _logLevelSettings = new Map<LoggerService, ExtensionSetting<logLevel>>();
  private _events$ = new Subject<loggerEvent>();
  private _recordedEvents: loggerEvent[] = [];

  constructor() {
    this._events$.subscribe(event => {
      this.printEvent(event);
      this.recordedEvents.push(event);
    });
    console.log(this);
  }

  public trackLoggerInstance(logger: LoggerService){
    const setting = new ExtensionSetting(`logging.logLevel.${logger.boundTo}`, LoggingService.defaultLogLevel)
      .withName(`Log level for ${logger.boundTo}`)
      .withDescription(`The minimum log level filter for the logger bound to ${logger.boundTo}`);
    setting.changes$.subscribe(level => logger.level = level);
    this._logLevelSettings.set(logger, setting);

    this._loggers.push(logger);
    logger.events$.pipe(
      withLatestFrom(this._printEnabledSetting.changes$)
    ).subscribe(([event, printEnabled]) => {
      if(printEnabled) this._events$.next(event);
    });
  }

  private getTimestamp(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  }

  private getLevelString(level: logLevel){
    switch(level){
      case "debug":
        return "DEB ";
      case "info":
        return "INFO";
      case "warn":
        return "WARN";
      case "error":
        return "ERR ";
    }
  }

  private printEvent(event: loggerEvent){
    console.log(`%c ${this.getTimestamp(event.date)} %c[${this._prefix}] [${this.getLevelString(event.logLevel)}]  (${event.bindingName})`,
      LoggingService.styles.date,
      LoggingService.styles[event.logLevel],
      event.message,
      ...event.data
    );
  }

  public get recordedEvents() {
    return this._recordedEvents;
  }

  public get loggers(): readonly LoggerService[] {
    return this._loggers;
  }

  public get printEnabledSetting() {
    return this._printEnabledSetting.asFrozen;
  }
}