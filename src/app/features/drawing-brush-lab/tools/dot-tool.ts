import {
  NumericExtensionSetting, type serializable, type SettingWithInput,
} from "@/app/core/settings/setting";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import type { drawModLine } from "@/app/services/tools/draw-mod";
import { TypoDrawTool } from "@/app/services/tools/draw-tool";
import type { brushStyle } from "@/app/services/tools/tools.service";
import { firstValueFrom } from "rxjs";

export class DotTool extends TypoDrawTool implements BrushLabItem {

  readonly name: string = "Dotted Lines";
  readonly description: string = "Draw dotted lines with a customizable interval";
  readonly icon: string = "var(--file-img-line-dot-gif)";

  private _intervalSetting = new NumericExtensionSetting("brushlab.dot.interval", 10)
    .withName("Dot Interval")
    .withDescription("The time interval between making dots in milliseconds")
    .withSlider(1)
    .withBounds(1,1000);

  readonly settings = [this._intervalSetting] as SettingWithInput<serializable>[];

  public override createCursor(style: brushStyle): { source: string; x: number; y: number } {
    return this.createSkribblLikeCursor(style);
  }

  private lastDown = { eventId: 0, time: Date.now() };
  public applyConstantEffect = this.noConstantEffect;

  public override async createCommands(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle,
    eventId: number
  ): Promise<number[][]> {

    const interval = await firstValueFrom(this._intervalSetting.changes$);
    const now = Date.now();

    if(this.lastDown.eventId === eventId){
      return [[0, style.color, style.size, ...line.to, ...line.to]];
    }
    else if(now - this.lastDown.time > interval) {
      this.lastDown.time = now;
      this.lastDown.eventId = eventId;
      return [[0, style.color, style.size, ...line.to, ...line.to]];
    }
    return [];
  }
}