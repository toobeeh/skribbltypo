import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";

export class DeveloperModeFeature extends TypoFeature {

  @inject(GlobalSettingsService) private readonly _settingsService!: GlobalSettingsService;

  protected override readonly featureEnabledDefault = false;
  public readonly name = "Developer Mode";
  public readonly description = "Adds some additional settings & experimental things";
  public readonly featureId = 16;

  protected override async onActivate() {
    await this._settingsService.settings.devMode.setValue(true);
  }

  protected override async onDestroy() {
    await this._settingsService.settings.devMode.setValue(false);
  }
}