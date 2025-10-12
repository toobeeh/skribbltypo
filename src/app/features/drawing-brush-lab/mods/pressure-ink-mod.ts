import {
  BooleanExtensionSetting, NumericExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/app/core/settings/setting";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import { ConstantDrawMod, type constantDrawModEffect } from "@/app/services/tools/constant-draw-mod";
import { type drawModLine, type strokeCause } from "@/app/services/tools/draw-mod";
import { type brushStyle } from "@/app/services/tools/tools.service";
import { Color } from "@/util/color";
import { firstValueFrom } from "rxjs";

export class PressureInkMod extends ConstantDrawMod implements BrushLabItem {

  readonly description = "Changes color brightness or hue channel depending on pen pressure.";
  readonly icon = "var(--file-img-line-pressure-ink-gif)";
  readonly name = "Pressure Ink";

  private readonly _brightnessEnabledSetting = new BooleanExtensionSetting("brushlab.pressureink.brightness", true)
    .withName("Brightness")
    .withDescription("Changes the luminance of the selected color depending on pressure.");

  private readonly _brightnessAbsoluteSetting = new BooleanExtensionSetting("brushlab.pressureink.brightnessAbsolute", false)
    .withName("Absolute Brightness")
    .withDescription("When enabled, acts on the full brightness range, regardless of current color brightness.");

  private _brightnessSensitivitySetting = new NumericExtensionSetting("brushlab.pressureink.brightnessSensitivity", 50)
    .withName("Brightness Sensitivity")
    .withDescription("Select how much the brightness changes with pressure.")
    .withSlider(1)
    .withBounds(0, 100);

  private readonly _degreeEnabledSetting = new BooleanExtensionSetting("brushlab.pressureink.degree", false)
    .withName("Color")
    .withDescription("Changes the HUE of the selected color depending on pressure.");

  private _degreeSensitivitySetting = new NumericExtensionSetting("brushlab.pressureink.degreeSensitivity", 50)
    .withName("Color Sensitivity")
    .withDescription("Select how much the color changes with pressure.")
    .withSlider(1)
    .withBounds(0, 100);

  readonly settings = [
    this._brightnessEnabledSetting,
    this._brightnessSensitivitySetting,
    this._brightnessAbsoluteSetting,
    this._degreeEnabledSetting,
    this._degreeSensitivitySetting,
  ] as SettingWithInput<serializable>[];

  public async applyConstantEffect(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle,
    eventId: number,
    strokeId: number,
    strokeCause: strokeCause,
    secondaryActive: boolean
  ): Promise<constantDrawModEffect> {

    const brightnessEnabled = await firstValueFrom(this._brightnessEnabledSetting.changes$);
    const degreeEnabled = await firstValueFrom(this._degreeEnabledSetting.changes$);

    if(pressure === undefined || (!brightnessEnabled && !degreeEnabled)) {
      return {
        style,
        line
      };
    }

    const colorCode = this.getSelectedColor(line.styleOverride, style, secondaryActive);
    const colorBase = Color.fromSkribblCode(colorCode).hsl;

    if(brightnessEnabled) {
      const brightnessSensitivity = await firstValueFrom(this._brightnessSensitivitySetting.changes$);
      const absoluteBrightness = await firstValueFrom(this._brightnessAbsoluteSetting.changes$);
      const factor = (50 + brightnessSensitivity) / 100;
      colorBase[2] = Math.round(absoluteBrightness ? Math.min(100, 100 * pressure * factor) : Math.min(colorBase[2] + 100 * pressure * factor, 100));
    }

    if(degreeEnabled) {
      const degreeSensitivity = await firstValueFrom(this._degreeSensitivitySetting.changes$);
      const factor = (50 + degreeSensitivity) / 100;
      colorBase[0] = Math.round((colorBase[0] + (pressure * 360 * factor)) % 360);
    }

    const color = Color.fromHsl(colorBase[0], colorBase[1], colorBase[2], colorBase[3]);

    /* use previous override if set and set new override with colors */
    style = {
      size: style.size,
      color: secondaryActive ? style.color : color.typoCode,
      secondaryColor: (!secondaryActive) ? style.color : color.typoCode,
    };

    return {
      style,
      line,
      disableColorUpdate: true
    };
  }
}