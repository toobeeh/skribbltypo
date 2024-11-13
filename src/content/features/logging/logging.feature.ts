import { TypoFeature } from "@/content/core/feature/feature";
import type { LoggerService } from "@/content/core/logger/logger.service";
import { LoggingService } from "@/content/core/logger/logging.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { inject } from "inversify";
import LoggingSettings from "./logging-settings.svelte";
import LoggingInfo from "./logging-info.svelte";

export class LoggingFeature extends TypoFeature {

  public readonly name = "Logging";
  public readonly description = "Collect logs of services, features, setups and event processors.";
  public readonly featureId = 24;
  public override readonly toggleEnabled = false;

  @inject(LoggingService) private readonly _loggingService!: LoggingService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public override get featureSettingsComponent(): componentData<LoggingSettings> {
    return { componentType: LoggingSettings, props: { feature: this }};
  }

  public override get featureInfoComponent(): componentData<LoggingInfo> {
    return {componentType: LoggingInfo, props: { }};
  }

  public get loggers() {
    return this._loggingService.loggers;
  }

  public async copyLogsToClipboard(asJson: boolean) {
    const logs = this._loggingService.recordedEvents;
    const logsText = asJson ?
      JSON.stringify(logs) :
      logs.map(event => `[${event.date.toISOString()}] [${event.logLevel}] (${event.bindingName}) ${event.message} ${event.data.join(", ")}`).join("\n");
    await navigator.clipboard.writeText(logsText);
    await this._toastService.showToast("Logs copied to clipboard");
  }

  public async setLogLevelOfLogger(logger: LoggerService, level: string){

    /* check log level*/
    if(level !== "debug" && level !== "info" && level !== "warn" && level !== "error"){
      await this._toastService.showToast("Invalid log level");
      return;
    }

    /* update log level */
    try {
      const setting = this._loggingService.getLogLevelSetting(logger);
      await setting.setValue(level);
    }
    catch (e) {
      this._logger.error("Error updating log level", e);
      await this._toastService.showToast("Error updating log level");
      return;
    }

    await this._toastService.showToast("Updated Logger", `Log level of ${logger.boundTo} set to ${level}`);
  }

  public get consolePrintEnabledStore(){
    return this._loggingService.printEnabledSetting.store;
  }

  public async resetAllLogLevels(level: string) {

    /* check log level*/
    if(level !== "debug" && level !== "info" && level !== "warn" && level !== "error"){
      await this._toastService.showToast("Invalid log level");
      return;
    }

    const toast = await this._toastService.showLoadingToast("Resetting log levels to " + level);

    /* update log level */
    const promises = this._loggingService.loggers.map(logger => {
      const setting = this._loggingService.getLogLevelSetting(logger);
      return setting.setValue(level);
    });

    try {
      await Promise.all(promises);
    }
    catch (e) {
      this._logger.error("Error resetting log level to " + level, e);
      toast.reject("Error resetting log levels");
      return;
    }

    toast.resolve();
  }
}