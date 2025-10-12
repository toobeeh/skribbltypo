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

  private readonly _brightnessAbsoluteSetting = new BooleanExtensionSetting("brushlab.pressureink.brightnessAbsolute", true)
    .withName("Absolute Brightness")
    .withDescription("When enabled, acts on the full brightness range, regardless of current color brightness.");

  private readonly _brightnessInvertSetting = new BooleanExtensionSetting("brushlab.pressureink.brightnessInvert", false)
    .withName("Invert Brightness Modification")
    .withDescription("When enabled, the color will get darker the more pressure is applied.");

  private _brightnessSensitivitySetting = new NumericExtensionSetting("brushlab.pressureink.brightnessSensitivity", 50)
    .withName("Brightness Sensitivity")
    .withDescription("Select how much the brightness changes with pressure.")
    .withSlider(1)
    .withBounds(0, 100);

  private _brightnessRangeSetting = new NumericExtensionSetting("brushlab.pressureink.brightnessRange", 80)
    .withName("Brightness Pressure range")
    .withDescription("A lower range will cut off low and high pressure, making it easier to use the full brightness range.")
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

  private readonly _degreeInvertSetting = new BooleanExtensionSetting("brushlab.pressureink.degreeInvert", false)
    .withName("Invert Color Modification")
    .withDescription("When enabled, the color will shift in the opposite direction when pressure is enabled.");

  private _degreeRangeSetting = new NumericExtensionSetting("brushlab.pressureink.degreeRange", 80)
    .withName("Color Pressure range")
    .withDescription("A lower range will cut off low and high pressure, making it easier to use the full color range.")
    .withSlider(1)
    .withBounds(0, 100);

  readonly settings = [
    this._brightnessEnabledSetting,
    this._degreeEnabledSetting,
    this._brightnessAbsoluteSetting,
    this._brightnessSensitivitySetting,
    this._degreeSensitivitySetting,
    this._brightnessRangeSetting,
    this._degreeRangeSetting,
    this._brightnessInvertSetting,
    this._degreeInvertSetting
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
      const brightnessInvert = await firstValueFrom(this._brightnessInvertSetting.changes$);
      const brightnessRange = await firstValueFrom(this._brightnessRangeSetting.changes$);

      const startValue = absoluteBrightness ? (brightnessInvert ? 100 : 0) : colorBase[2];
      const value = this.calculateAdjustedOffset(pressure, (50 + brightnessSensitivity) / 100, brightnessRange, brightnessInvert, 100, startValue);
      colorBase[2] = Math.round(Math.max(0, Math.min(100, value)));
    }

    if(degreeEnabled) {
      const degreeSensitivity = await firstValueFrom(this._degreeSensitivitySetting.changes$);
      const degreeInvert = await firstValueFrom(this._degreeInvertSetting.changes$);
      const degreeRange = await firstValueFrom(this._degreeRangeSetting.changes$);
      colorBase[0] = Math.round(this.calculateAdjustedOffset(pressure, (50 + degreeSensitivity) / 100, degreeRange, degreeInvert, 360, colorBase[0]) % 360);
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

  private calculateAdjustedOffset(pressure: number, sensitivity: number, rangePercent: number, invert: boolean, base: number, startValue: number) {
    const adjustedPressure = (pressure - ((1-rangePercent/100)/2)) / (rangePercent / 100); // rescale pressure range around a area in the middle
    const pressureClamped = Math.max(0, Math.min(1, adjustedPressure));
    const offset = pressureClamped * sensitivity * base;
    const value = startValue + (invert ? -offset : offset);
    return value;
  }
}