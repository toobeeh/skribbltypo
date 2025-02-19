import {
  NumericExtensionSetting, type serializable, type SettingWithInput,
} from "@/content/core/settings/setting";
import type { BrushLabItem } from "@/content/features/drawing-brush-lab/brush-lab-item.interface";
import type { drawModLine } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { type brushStyle, ToolsService } from "@/content/services/tools/tools.service";
import { inject } from "inversify";
import { firstValueFrom } from "rxjs";

export class GridTool extends TypoDrawTool implements BrushLabItem {
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  readonly name: string = "Grid Generator";
  readonly description: string = "Draw dotted lines with a customizable interval";
  readonly icon: string = "var(--file-img-line-grid-gif)";

  private _rowsSetting = new NumericExtensionSetting("brushlab.grid.rows", 6)
    .withName("Row Count")
    .withDescription("The amount of rows in the grid")
    .withSlider(1)
    .withBounds(1,30);

  private _columnsSetting = new NumericExtensionSetting("brushlab.grid.columns", 8)
    .withName("Column Count")
    .withDescription("The amount of columns in the grid")
    .withSlider(1)
    .withBounds(1,30);

  readonly settings = [
    this._rowsSetting,
    this._columnsSetting
  ] as SettingWithInput<serializable>[];

  public createCursor() {
    return { source: "var(--file-img-grid_cur-png)", x: 7, y: 37 };
  }

  private _lastDownEvent: PointerEvent | null = null;
  public applyConstantEffect = this.noConstantEffect;

  public override async createCommands(
    line: drawModLine,
    pressure: number | undefined,
    style: brushStyle
  ): Promise<number[][]> {

    const lastPointerDown = await firstValueFrom(this._toolsService.lastPointerDownPosition$);
    if(this._lastDownEvent === lastPointerDown){
      return [];
    }

    this._lastDownEvent = lastPointerDown;
    const canvasWidth = 800;
    const canvasHeight = 600;
    const rows = await firstValueFrom(this._rowsSetting.changes$);
    const columns = await firstValueFrom(this._columnsSetting.changes$);
    const rowHeight = canvasHeight / rows;
    const columnWidth = canvasWidth / columns;

    const commands = [];
    for(let i = 1; i < rows; i++){
      commands.push([0, style.color.skribblCode, style.size, 0, i * rowHeight, canvasWidth, i * rowHeight]);
    }
    for(let i = 1; i < columns; i++){
      commands.push([0, style.color.skribblCode, style.size, i * columnWidth, 0, i * columnWidth, canvasHeight]);
    }

    return commands;
  }
}