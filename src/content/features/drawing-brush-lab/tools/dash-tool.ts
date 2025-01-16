import {
  NumericExtensionSetting, type serializable, type SettingWithInput,
} from "@/content/core/settings/setting";
import type { BrushLabItem } from "@/content/features/drawing-brush-lab/brush-lab-item.interface";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import type { drawModLine } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import type { brushStyle } from "@/content/services/tools/tools.service";
import { inject } from "inversify";
import { firstValueFrom } from "rxjs";

export class DashTool extends TypoDrawTool implements BrushLabItem {
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  readonly name: string = "Dashed Lines";
  readonly description: string = "Draw dashed lines with a customizable interval and blank size";
  readonly icon: string = "var(--file-img-line-dash-gif)";

  /*private _modeSetting = new ChoiceExtensionSetting<"dash" | "dot">("brushlab.dash.mode", "dash")
    .withName("Dash Modes")
    .withDescription("Switch between dashed or dotted lines")
    .withChoices([{choice: "dash", name: "Dashed Lines"}, {choice: "dot", name: "Dotted Lines"}]);*/

  private _intervalSetting = new NumericExtensionSetting("brushlab.dash.interval", 10)
    .withName("Dash Interval")
    .withDescription("The time interval between making line blanks in milliseconds")
    .withSlider(1)
    .withBounds(1,300);

  private _blankSizeSetting = new NumericExtensionSetting("brushlab.dash.blank", 20)
    .withName("Blank Size")
    .withDescription("The size of the blanks between dashes, depending on brush size")
    .withSlider(1)
    .withBounds(1,100);

  readonly settings = [
    this._intervalSetting,
    this._blankSizeSetting
    /*this._modeSetting*/
  ] as SettingWithInput<serializable>[];

  public override createCursor(style: brushStyle): { source: string; x: number; y: number } {
    return this.createSkribblLikeCursor(style);
  }

  private dashStart?: { eventId: number, position: [number, number] };
  private lineStart?: {eventId: number, time: number};

  public applyEffect = this.noEffect;

  public override async createCommands(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle,
    eventId: number
  ): Promise<number[][]> {

    const interval = await firstValueFrom(this._intervalSetting.changes$);
    const blankSize = await firstValueFrom(this._blankSizeSetting.changes$);
    const now = Date.now();

    /* if currently drawing dash */
    if(this.dashStart !== undefined) {

      /* stop dash if distance big enough */
      if(this.getDistance(this.dashStart.position as [number, number], line.from) > (style.size / 10 * blankSize)) {
        this.dashStart = undefined;
      }
      return [];
    }

    /* if currently drawing line, end line after time passed; start dash */
    if(this.lineStart !== undefined && now - this.lineStart.time > interval) {
      this.lineStart = undefined;
      this.dashStart = {eventId, position: line.to};
      return [];
    }

    /* init a line */
    if(this.lineStart === undefined) {
      this.lineStart = {eventId, time: now};
    }

    /* line drawing */
    return [[0, style.color.typoCode, style.size, ...line.from, ...line.to]];
  }

  private getDistance(from: [number, number], to: [number, number]): number {
    return Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2));
  }
}