import {
  BooleanExtensionSetting,
  NumericExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/content/core/settings/setting";
import type { BrushLabItem } from "@/content/features/drawing-brush-lab/brush-lab-item.interface";
import { type drawModEffect, type drawModLine, TypoDrawMod } from "@/content/services/tools/draw-mod";
import { type brushStyle } from "@/content/services/tools/tools.service";
import { firstValueFrom } from "rxjs";
export class ParallelLineMod extends TypoDrawMod implements BrushLabItem {

  readonly description = "Draws additional parallel lines in a angle and distance. In public lobbies, a max of 1 parallel line should be used.";
  readonly icon = "var(--file-img-line-parallel-gif)";
  readonly name = "Parallel";

  private _distanceSetting = new NumericExtensionSetting("brushlab.parallel.distance", 20)
    .withName("Line Distance")
    .withDescription("The distance between the lines")
    .withSlider(1)
    .withBounds(1,100);

  private _distanceDependencySetting = new BooleanExtensionSetting("brushlab.parallel.dependency", false)
    .withName("Size Dependency")
    .withDescription("Make line distance proportionally dependent on brush size");

  private _angleSetting = new NumericExtensionSetting("brushlab.parallel.angle", 180)
    .withName("Line Angle")
    .withDescription("The clockwise angle where the parallel lines are drawn with the distance offset")
    .withSlider(1)
    .withBounds(1, 360);

  private _lineCountSetting = new NumericExtensionSetting("brushlab.parallel.count", 1)
    .withName("Line Count")
    .withDescription("The amount of parallel lines drawn")
    .withSlider(1)
    .withBounds(1,4);

  readonly settings = [
    this._distanceSetting,
    this._distanceDependencySetting,
    this._angleSetting,
    this._lineCountSetting
  ] as SettingWithInput<serializable>[];

  /**
   * Set the brush size depending on the pressure
   * @param line
   * @param pressure
   * @param style
   */
  public async applyEffect(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle
  ): Promise<drawModEffect> {

    const distance = await firstValueFrom(this._distanceSetting.changes$);
    const angle = await firstValueFrom(this._angleSetting.changes$);
    const count = await firstValueFrom(this._lineCountSetting.changes$);
    const dependency = await firstValueFrom(this._distanceDependencySetting.changes$);

    /* create n parallel lines with offset and angle to original line*/
    const lines = [];
    const offset = this.getOffset(distance, angle);
    if(dependency) {
      offset[0] *= style.size / 40;
      offset[1] *= style.size / 40;
    }

    for (let i = 0; i < count; i++) {
      const offsetLine = {
        from: [line.from[0] + (offset[0] * (i+1)), line.from[1] + (offset[1] *( i+1))] as [number, number],
        to: [line.to[0] + (offset[0] * (i+1)), line.to[1] + (offset[1] * (i+1))] as [number, number],
      };
      lines.push(offsetLine);
    }

    return  {
      style,
      lines: [line, ...lines]
    };
  }

  private getOffset(distance: number, angle: number): [number, number] {
    const angleRad = angle * Math.PI / 180;
    const x = Math.cos(angleRad) * distance;
    const y = Math.sin(angleRad) * distance;
    return [x, y];
  }
}