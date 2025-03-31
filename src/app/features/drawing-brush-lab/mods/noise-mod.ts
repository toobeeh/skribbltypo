import {
  NumericExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/app/core/settings/setting";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import { ConstantDrawMod, type constantDrawModEffect } from "@/app/services/tools/constant-draw-mod";
import { type drawModLine } from "@/app/services/tools/draw-mod";
import { type brushStyle } from "@/app/services/tools/tools.service";
import { firstValueFrom } from "rxjs";

export class NoiseMod extends ConstantDrawMod implements BrushLabItem {

  readonly description = "Randomly adds noise to drawn lines.";
  readonly icon = "var(--file-img-line-noise-gif)";
  readonly name = "Noise";

  private _scaleSetting = new NumericExtensionSetting("brushlab.noise.scale", 5)
    .withName("Noise Scale")
    .withDescription("Select how much noise is added to the line")
    .withSlider(1)
    .withBounds(1, 100);

  readonly settings = [
    this._scaleSetting
  ] as SettingWithInput<serializable>[];

  public async applyConstantEffect(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle
  ): Promise<constantDrawModEffect> {

    const scale = await firstValueFrom(this._scaleSetting.changes$);

    /* rotate and scale the line randomly around center */
    const randomRotate = (Math.random() - 0.5) * Math.PI;
    const randomScale = 1 + (Math.random() - 0.5) * scale * style.size / 40;

    const centerX = (line.from[0] + line.to[0]) / 2;
    const centerY = (line.from[1] + line.to[1]) / 2;

    const rotatePoint = (x: number, y: number, angle: number): [number, number] => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        cos * (x - centerX) - sin * (y - centerY) + centerX,
        sin * (x - centerX) + cos * (y - centerY) + centerY,
      ];
    };

    const from = rotatePoint(line.from[0], line.from[1], randomRotate);
    const to = rotatePoint(line.to[0], line.to[1], randomRotate);

    from[0] = centerX + (from[0] - centerX) * randomScale;
    from[1] = centerY + (from[1] - centerY) * randomScale;
    to[0] = centerX + (to[0] - centerX) * randomScale;
    to[1] = centerY + (to[1] - centerY) * randomScale;

    return {
      style,
      line: {from, to}
    };
  }
}