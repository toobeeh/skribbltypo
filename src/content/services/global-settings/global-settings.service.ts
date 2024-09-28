import { ExtensionSetting } from "@/content/core/settings/setting";
import { inject, injectable } from "inversify";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class GlobalSettingsService {

  private _settings = {
    devMode: new ExtensionSetting<boolean>("devMode", false)
      .withName("Developer Mode")
      .withDescription("Enable some developer features & settings"),
  };

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  public get settings(){
    return this._settings;
  }

  public get settingsList(){
    return Object.values(this._settings);
  }
}