import {
  ChoiceExtensionSetting,
  type serializable,
  SettingWithInput,
} from "@/content/core/settings/setting";
import type { BrushLabItem } from "@/content/features/drawing-brush-lab/brush-lab-item.interface";
import { type drawModEffect, type drawModLine, TypoDrawMod } from "@/content/services/tools/draw-mod";
import { type brushStyle, ToolsService } from "@/content/services/tools/tools.service";
import { inject } from "inversify";
import { firstValueFrom } from "rxjs";
export class MandalaMod extends TypoDrawMod implements BrushLabItem {
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  readonly description = "Draws an additional mirrored line to create a mandala effect.";
  readonly icon = "var(--file-img-line-mandala-gif)";
  readonly name = "Mandala";

  private _mirrorCenterSetting = new ChoiceExtensionSetting<"click" | "center">("brushlab.mandala.center", "center")
    .withName("Mandala Mirror Center")
    .withDescription("The center of the mandala mirroring effect")
    .withChoices([{choice: "click", name: "At last click"}, {choice: "center", name: "At canvas center"}]);

  private _axisSetting = new ChoiceExtensionSetting<"x" | "y" | "xy">("brushlab.mandala.axis", "xy")
    .withName("Mandala Mirror Axis")
    .withDescription("The axis where the mandala line will be mirrored on")
    .withChoices([{choice: "x", name: "Horizontal"}, {choice: "y", name: "Vertical"}, {choice: "xy", name: "Both"}]);

  readonly settings = [
    this._mirrorCenterSetting,
    this._axisSetting
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

    const axis = await firstValueFrom(this._axisSetting.changes$);
    const mirrorCenter = await firstValueFrom(this._mirrorCenterSetting.changes$);

    /* create mirrored line */
    let center: [number, number] = [400,300];
    if(mirrorCenter === "click"){
      const event = await firstValueFrom(this._toolsService.lastPointerDownPosition$);
      if(!event) center = line.from;
      else center = [event.offsetX, event.offsetY];
    }

    /* mirror line on axis to center */
    const mirrored = this.calculateMirroredLine(axis, center, line.from, line.to);
    return {
      style,
      lines: [line, mirrored]
    };
  }

  calculateMirroredLine(axis: "x" | "y" | "xy", center: [number, number], from: number[], to: number[]): {from: [number, number], to: [number, number]}{
    if(axis === "y"){
      return {
        from: [center[0] - (from[0] - center[0]), from[1]],
        to: [center[0] - (to[0] - center[0]), to[1]]
      };
    }
    else if(axis === "x"){
      return {
        from: [from[0], center[1] - (from[1] - center[1])],
        to: [to[0], center[1] - (to[1] - center[1])]
      };
    }
    else {
      return {
        from: [center[0] - (from[0] - center[0]), center[1] - (from[1] - center[1])],
        to: [center[0] - (to[0] - center[0]), center[1] - (to[1] - center[1])]
      };
    }
  }
}