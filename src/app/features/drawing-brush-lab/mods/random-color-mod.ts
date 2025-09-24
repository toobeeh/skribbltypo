import {
  BooleanExtensionSetting,
  NumericExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/app/core/settings/setting";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import { defaultPalettes } from "@/app/features/drawing-color-palettes/default-palettes";
import { ColorsService } from "@/app/services/colors/colors.service";
import { ConstantDrawMod, type constantDrawModEffect } from "@/app/services/tools/constant-draw-mod";
import { type drawModLine } from "@/app/services/tools/draw-mod";
import { type brushStyle } from "@/app/services/tools/tools.service";
import { Color } from "@/util/color";
import { inject } from "inversify";
import { firstValueFrom } from "rxjs";

export class RandomColorMod extends ConstantDrawMod implements BrushLabItem {
  @inject(ColorsService) private readonly _colorsService!: ColorsService;

  readonly description = "Switches colors of the current palette randomly while drawing.";
  readonly icon = "var(--file-img-line-random-color-gif)";
  readonly name = "Random Colors";

  private _colorSwitchSetting = new NumericExtensionSetting("brushlab.randomcolor.distance", 20)
    .withName("Color Switch Distance")
    .withDescription("The distance between the color switches")
    .withSlider(1)
    .withBounds(1,100);

  private readonly _strokeModeSetting = new BooleanExtensionSetting("brushlab.randomcolor.strokeMode", false)
    .withName("Change Per Stroke")
    .withDescription("If enabled, the color will change per stroke instead of continuously.");

  private lastSwitch?: { eventId: number, position: [number, number], strokeId: number };

  readonly settings = [
    this._colorSwitchSetting,
    this._strokeModeSetting
  ] as SettingWithInput<serializable>[];

  public async applyConstantEffect(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle,
    eventId: number,
    strokeId: number,
  ): Promise<constantDrawModEffect> {

    const distance = await firstValueFrom(this._colorSwitchSetting.changes$);
    const strokeMode = await firstValueFrom(this._strokeModeSetting.changes$);
    const colors = await firstValueFrom(this._colorsService.pickerColors$) ?? defaultPalettes.skribblPalette;

    if(this.lastSwitch === undefined || this.lastSwitch.strokeId !== strokeId || strokeMode === false && this.lastSwitch.eventId !== eventId && this.getDistance(this.lastSwitch.position, line.from) > (style.size / 10 * distance)){

      /* random index */
      const index = Math.floor(Math.random() * colors.colorHexCodes.length);
      const color = Color.fromHex(colors.colorHexCodes[index]);
      style.color = color.typoCode;

      this.lastSwitch = {
        eventId: eventId,
        position: line.from,
        strokeId: strokeId
      };
    }

    return {
      style,
      line: line
    };
  }

  private getDistance(from: [number, number], to: [number, number]): number {
    return Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2));
  }
}