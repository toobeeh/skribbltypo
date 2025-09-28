import {
  BooleanExtensionSetting,
  ChoiceExtensionSetting, NumericExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/app/core/settings/setting";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import { ConstantDrawMod, type constantDrawModEffect } from "@/app/services/tools/constant-draw-mod";
import { type drawModLine } from "@/app/services/tools/draw-mod";
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
    .withBounds(1,100);

  private lastSwitch?: { eventId: number, position: [number, number], index: number, strokeId: number };

  readonly settings = [
    this._rainbowModeSetting,
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

    const mode = await firstValueFrom(this._rainbowModeSetting.changes$);
    const strokeMode = await firstValueFrom(this._strokeModeSetting.changes$);
    const distance = await firstValueFrom(this._colorSwitchSetting.changes$);
    const colors = Color.skribblColors.filter((color, index) => index % 2 === 0 ? (mode === "light") : (mode === "dark"));

    if(this.lastSwitch === undefined || this.lastSwitch.strokeId !== strokeId || strokeMode == false && this.lastSwitch.eventId !== eventId && this.getDistance(this.lastSwitch.position, line.from) > (style.size / 10 * distance)){

      /* cycle through */
      let index = ((this.lastSwitch?.index ?? -1) + 1) % (colors.length - 1);

      /* skip first two indexes (monochromes)*/
      if(index < 2) index = 2;

      /* map index back to original palette index */
      style.color = index * 2 + (mode === "light" ? 0 : 1);

      this.lastSwitch = {
        eventId: eventId,
        position: line.from,
        index: index,
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