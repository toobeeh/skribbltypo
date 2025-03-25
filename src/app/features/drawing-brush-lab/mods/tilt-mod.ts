import {
  BooleanExtensionSetting,
  NumericExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/app/core/settings/setting";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import { ConstantDrawMod, type constantDrawModEffect } from "@/app/services/tools/constant-draw-mod";
import { type drawModLine } from "@/app/services/tools/draw-mod";
import { type brushStyle } from "@/app/services/tools/tools.service";
import { firstValueFrom } from "rxjs";

export class TiltMod extends ConstantDrawMod implements BrushLabItem {

  readonly description = "Tilt the line into a direction.";
  readonly icon = "var(--file-img-line-tilt-gif)";
  readonly name = "Tilt";

  private _distanceSetting = new NumericExtensionSetting("brushlab.tilt.size", 20)
    .withName("Tilt Size")
    .withDescription("The size of the tilted line")
    .withSlider(1)
    .withBounds(1,100);

  private _distanceDependencySetting = new BooleanExtensionSetting("brushlab.tilt.dependency", false)
    .withName("Size Dependency")
    .withDescription("Make tilt size proportionally dependent on brush size");

  private _angleSetting = new NumericExtensionSetting("brushlab.tilt.angle", 180)
    .withName("Tilt Angle")
    .withDescription("The clockwise angle where the tilt lines created")
    .withSlider(1)
    .withBounds(1, 360);

  readonly settings = [
    this._distanceSetting,
    this._distanceDependencySetting,
    this._angleSetting
  ] as SettingWithInput<serializable>[];

  public async applyConstantEffect(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle
  ): Promise<constantDrawModEffect> {

    const distance = await firstValueFrom(this._distanceSetting.changes$);
    const angle = await firstValueFrom(this._angleSetting.changes$);
    const dependency = await firstValueFrom(this._distanceDependencySetting.changes$);

    const offset = this.getOffset(distance, angle - 90);
    if(dependency) {
      offset[0] *= style.size / 40;
      offset[1] *= style.size / 40;
    }

    const offsetLine = {
      from: line.from,
      to: [line.to[0] + offset[0], line.to[1] + offset[1]] as [number, number]
    };

    return  {
      style,
      line: offsetLine
    };
  }

  private getOffset(distance: number, angle: number): [number, number] {
    const angleRad = angle * Math.PI / 180;
    const x = Math.cos(angleRad) * distance;
    const y = Math.sin(angleRad) * distance;
    return [x, y];
  }
}