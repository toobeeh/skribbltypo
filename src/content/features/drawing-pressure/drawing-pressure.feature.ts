import { FeatureTag } from "@/content/core/feature/feature-tags";
import { BooleanExtensionSetting, NumericExtensionSetting } from "@/content/core/settings/setting";
import { PressureMod } from "@/content/features/drawing-pressure/pressure-mod";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToolsService } from "@/content/services/tools/tools.service";
import { calculatePressurePoint } from "@/util/typo/pressure";
import { inject } from "inversify";
import { combineLatestWith, type Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import DrawingPressureInfo from "./drawing-pressure-info.svelte";

export class DrawingPressureFeature extends TypoFeature {
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  public readonly name = "Modified Pen Pressure";
  public readonly description = "Use the full size range and custom sensitivity for pen pressure";
  public readonly tags = [
    FeatureTag.DRAWING,
  ];
  public readonly featureId = 37;

  private _performanceEnabledSubscription?: Subscription;

  public override get featureInfoComponent(): componentData<DrawingPressureInfo>{
    return { componentType: DrawingPressureInfo, props: { feature: this }};
  }

  private readonly _performanceEnabledSetting = this.useSetting(
    new BooleanExtensionSetting("pressure_performance", true, this)
      .withName("Performance Mode")
      .withDescription("Better pressure support for less performant devices, but can't be used in combination with the brush laboratory.")
  );

  private readonly _pressureParamSensitivitySetting = this.useSetting(
    new NumericExtensionSetting("pressure_sensitivity", 6, this)
      .withName("Pressure Sensitivity")
      .withDescription("The sensitivity of pressure change. A higher value means a more dense pressure range.")
      .withBounds(1, 20)
      .withSlider(1)
  );

  private readonly _pressureParamBalanceSetting = this.useSetting(
    new NumericExtensionSetting("pressure_balance", 0.5, this)
      .withName("Pressure Balance")
      .withDescription("The balance of pressure increase. A higher value moves the size range to a higher pressure range.")
      .withBounds(0, 1)
      .withSlider(1/20)
  );

  private _pressureMod?: PressureMod;

  protected override async onActivate() {

    this._performanceEnabledSubscription = this._performanceEnabledSetting.changes$.pipe(
      combineLatestWith(this._pressureParamSensitivitySetting.changes$, this._pressureParamBalanceSetting.changes$)
    ).subscribe(async ([performanceMode, sensitivity, balance]) => {
      if(performanceMode){
        if(this._pressureMod) {
          this._toolsService.removeMod(this._pressureMod);
          this._pressureMod = undefined;
        }

        document.documentElement.dataset["typo_pressure_performance"] = this.getPerformanceFunctionEval(sensitivity, balance);
      }
      else {
        if(!this._pressureMod){
          this._pressureMod = this._toolsService.resolveModOrTool(PressureMod);
          this._toolsService.activateMod(this._pressureMod);
        }
        this._pressureMod.setParams(sensitivity, balance);

        document.documentElement.dataset["typo_pressure_performance"] = "";
      }
    });
  }

  /**
   * An eval function which is used by tha game patch to calculate the typo pressure
   * Probably not the most performant option (ironic), but good enough & prevents duplicating the function.
   * @param s
   * @param b
   * @private
   */
  private getPerformanceFunctionEval(s: number, b: number){
    return `(pressure) => (${calculatePressurePoint.toString()})(pressure, ${s}, ${b})`;
  }

  protected override async onDestroy() {
    if(this._pressureMod){
      this._toolsService.removeMod(this._pressureMod);
      this._pressureMod = undefined;
    }

    document.documentElement.dataset["typo_pressure_performance"] = "";

    this._performanceEnabledSubscription?.unsubscribe();
    this._performanceEnabledSubscription = undefined;
  }

  public get balanceSettingStore(){
    return this._pressureParamBalanceSetting.store;
  }

  public get sensitivitySettingStore(){
    return this._pressureParamSensitivitySetting.store;
  }
}