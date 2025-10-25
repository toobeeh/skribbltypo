import {
  BooleanExtensionSetting,
  ChoiceExtensionSetting, NumericExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/app/core/settings/setting";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import { ConstantDrawMod, type constantDrawModEffect } from "@/app/services/tools/constant-draw-mod";
import type { lineCoordinates, strokeCause } from "@/app/services/tools/draw-mod";
import { type brushStyle } from "@/app/services/tools/tools.service";
import { Color } from "@/util/color";
import { firstValueFrom } from "rxjs";

export class RainbowMod extends ConstantDrawMod implements BrushLabItem {

  readonly description = "Switches colors while drawing to create a rainbow effect.";
  readonly icon = "var(--file-img-line-rainbow-gif)";
  readonly name = "Rainbow";

  private _rainbowModeSetting = new ChoiceExtensionSetting<"dark" | "light">("brushlab.rainbow.mode", "light")
    .withName("Rainbow Colors")
    .withDescription("Choose between the rainbow color shades")
    .withChoices([{choice: "light", name: "Light Colors"}, {choice: "dark", name: "Dark Colors"}]);

  private readonly _strokeModeSetting = new BooleanExtensionSetting("brushlab.rainbow.strokeMode", false)
    .withName("Change Per Stroke")
    .withDescription("If enabled, the color will change per stroke instead of continuously.");

  private _colorSwitchSetting = new NumericExtensionSetting("brushlab.rainbow.distance", 20)
    .withName("Color Switch Distance")
    .withDescription("The distance between the color switches")
    .withSlider(1)
    .withBounds(0,100);

  private strokeSwitches = new Map<number, { eventId: number, position: [number, number], index: number }>;
  private initIndex = -1;

  readonly settings = [
    this._rainbowModeSetting,
    this._colorSwitchSetting,
    this._strokeModeSetting
  ] as SettingWithInput<serializable>[];

  public async applyConstantEffect(
    line: lineCoordinates,
    pressure: number | undefined,
    style: brushStyle,
    eventId: number,
    strokeId: number,
    cause: strokeCause
  ): Promise<constantDrawModEffect> {

    const mode = await firstValueFrom(this._rainbowModeSetting.changes$);
    const strokeMode = await firstValueFrom(this._strokeModeSetting.changes$);
    const distance = await firstValueFrom(this._colorSwitchSetting.changes$);
    const colors = Color.skribblColors.filter((color, index) => index % 2 === 0 ? (mode === "light") : (mode === "dark"));

    const lastStrokeSwitch = this.strokeSwitches.get(strokeId);
    if(lastStrokeSwitch !== undefined && cause === "up") this.strokeSwitches.delete(strokeId);

    if(lastStrokeSwitch === undefined || strokeMode == false && (distance <= 0 || this.getDistance(lastStrokeSwitch.position, line.from) > (style.size / 10 * distance))){

      /* cycle through */
      const index = (((lastStrokeSwitch?.index ?? (this.initIndex++ % (colors.length - 2))) + 1) % (colors.length - 2));

      /* skip first two indexes (monochromes)*/
      const actualIndex = index + 2;

      /* map index back to original palette index */
      style.color = actualIndex * 2 + (mode === "light" ? 0 : 1);

      const newStrokeSwitch = {
        eventId: eventId,
        position: line.from,
        index: index
      };
      this.strokeSwitches.set(strokeId, newStrokeSwitch);
    }

    else {
      style.color = (lastStrokeSwitch.index + 2) * 2 + (mode === "light" ? 0 : 1);
    }

    return {
      style,
      line: line,
      disableColorUpdate: false
    };
  }

  private getDistance(from: [number, number], to: [number, number]): number {
    return Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2));
  }
}