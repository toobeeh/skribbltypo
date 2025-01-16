import {
  NumericExtensionSetting, type serializable, type SettingWithInput,
} from "@/content/core/settings/setting";
import type { BrushLabItem } from "@/content/features/drawing-brush-lab/brush-lab-item.interface";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import type { brushStyle } from "@/content/services/tools/tools.service";
import { inject } from "inversify";
import { firstValueFrom } from "rxjs";

export class DashTool extends TypoDrawTool implements BrushLabItem {
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  readonly name: string = "Dashed Lines";
  readonly description: string = "Draw dashed lines with a customizable interval";
  readonly icon: string = "var(--file-img-line-dash-gif)";

  private _intervalSetting = new NumericExtensionSetting("brushlab.dash.interval", 10)
    .withName("Dash Interval")
    .withDescription("The time interval between making line blanks in milliseconds")
    .withSlider(1)
    .withBounds(1,1000);

  /*private _modeSetting = new ChoiceExtensionSetting<"dash" | "dot">("brushlab.dash.mode", "dash")
    .withName("Dash Modes")
    .withDescription("Switch between dashed or dotted lines")
    .withChoices([{choice: "dash", name: "Dashed Lines"}, {choice: "dot", name: "Dotted Lines"}]);*/

  readonly settings = [
    this._intervalSetting,
    /*this._modeSetting*/
  ] as SettingWithInput<serializable>[];

  public override createCursor(style: brushStyle): { source: string; x: number; y: number } {
    return this.createSkribblLikeCursor(style);
  }

  private lastDown = Date.now();

  public async applyEffect(): Promise<void> {
    return Promise.resolve();
  }

  public override async createCommands(
    from: [number, number],
    to: [number, number],
    pressure: number | undefined,
    style: brushStyle
  ): Promise<number[][]> {

    const interval = await firstValueFrom(this._intervalSetting.changes$);
    const now = Date.now();

    if(now - this.lastDown > interval) {
      this.lastDown = now;
      return [[0, style.color.typoCode, style.size, ...to, ...to]];
    }
    return [];
  }
}