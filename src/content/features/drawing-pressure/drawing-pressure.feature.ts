import { NumericExtensionSetting } from "@/content/core/settings/setting";
import { PressureMod } from "@/content/features/drawing-pressure/pressure-mod";
import type { componentData } from "@/content/services/modal/modal.service";
import type { TypoDrawMod } from "@/content/services/tools/draw-mod";
import { ToolsService } from "@/content/services/tools/tools.service";
import { inject } from "inversify";
import { combineLatestWith, type Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import DrawingPressureInfo from "./drawing-pressure-info.svelte";

export class DrawingPressureFeature extends TypoFeature {
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  public readonly name = "Modified Pen Pressure";
  public readonly description = "Use the full size range and custom sensitivity for pen pressure";
  public readonly featureId = 37;

  private _paramsSubscription?: Subscription;

  public override get featureInfoComponent(): componentData<DrawingPressureInfo>{
    return { componentType: DrawingPressureInfo, props: { feature: this }};
  }

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

  private _pressureMod?: TypoDrawMod;

  protected override async onActivate() {
    const mod = this._pressureMod = this._toolsService.resolveModOrTool(PressureMod);
    this._toolsService.activateMod(this._pressureMod);

    this._paramsSubscription = this._pressureParamSensitivitySetting.changes$.pipe(
      combineLatestWith(this._pressureParamBalanceSetting.changes$)
    ).subscribe(([sensitivity, balance]) => {
      mod.setParams(sensitivity, balance);
    });
  }

  protected override async onDestroy() {
    if(this._pressureMod){
      this._toolsService.removeMod(this._pressureMod);
      this._pressureMod = undefined;
    }

    this._paramsSubscription?.unsubscribe();
    this._paramsSubscription = undefined;
  }

  public get balanceSettingStore(){
    return this._pressureParamBalanceSetting.store;
  }

  public get sensitivitySettingStore(){
    return this._pressureParamSensitivitySetting.store;
  }
}