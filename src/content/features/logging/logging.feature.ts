import { TypoFeature } from "@/content/core/feature/feature";
import type { componentData } from "@/content/services/modal/modal.service";
import LoggingSettings from "./logging-settings.svelte";

export class LoggingFeature extends TypoFeature {

  public readonly name = "Logging";
  public readonly description = "Collect logs of services, features, setups and event processors.";
  public readonly featureId = 24;
  public override readonly toggleEnabled = false;

  public override get featureSettingsComponent(): componentData<LoggingSettings> {
    return {
      componentType: LoggingSettings,
      props: {
        feature: this
      }
    };
  }
}