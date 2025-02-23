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
export class SculptMod extends TypoDrawMod implements BrushLabItem {
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  readonly description = "Creates a figure by mirroring and connecting the line on a axis.";
  readonly icon = "var(--file-img-line-sculpt-gif)";
  readonly name = "Sculpt";

  private _mirrorCenterSetting = new ChoiceExtensionSetting<"click" | "center">("brushlab.sculpt.center", "center")
    .withName("Sculpt Mirror Center")
    .withDescription("The center of the sculpt figure mirroring effect")
    .withChoices([{choice: "click", name: "At last click"}, {choice: "center", name: "At canvas center"}]);

  private _axisSetting = new ChoiceExtensionSetting<"x" | "y" | "xy">("brushlab.sculpt.axis", "xy")
    .withName("Sculpt Mirror Axis")
    .withDescription("The axis where the sculpt figure will be mirrored on")
    .withChoices([{choice: "x", name: "Horizontal"}, {choice: "y", name: "Vertical"}, {choice: "xy", name: "Both"}]);

  readonly settings = [
    this._mirrorCenterSetting,
    this._axisSetting
  ] as SettingWithInput<serializable>[];

  public async applyEffect(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle
  ): Promise<drawModEffect> {

    const axis = await firstValueFrom(this._axisSetting.changes$);
    const mirrorCenter = await firstValueFrom(this._mirrorCenterSetting.changes$);

    /* calculate center */
    let center: [number, number] = [400,300];
    if(mirrorCenter === "click"){
      const event = await firstValueFrom(this._toolsService.lastPointerDownPosition$);
      if(!event) center = line.from;
      else center = [event.offsetX, event.offsetY];
    }

    /* calculate the mirrored point between from and to, and create a line from-mirror and mirror-to */
    const originalLineCenter = [(line.from[0] + line.to[0]) / 2, (line.from[1] + line.to[1]) / 2] as [number, number];
    const mirroredLineCenter = this.calculateMirroredPoint(center, originalLineCenter, axis);

    return {
      style,
      lines: [
        {from: line.from, to: mirroredLineCenter},
        {from: mirroredLineCenter, to: line.to},
      ]
    };
  }

  private calculateMirroredPoint(center: [number, number], point: [number, number], axis: "x" | "y" | "xy"): [number, number] {
    if(axis === "x") {
      return [point[0], 2 * center[1] - point[1]];
    } else if(axis === "y") {
      return [2 * center[0] - point[0], point[1]];
    } else {
      return [2 * center[0] - point[0], 2 * center[1] - point[1]];
    }
  }
}