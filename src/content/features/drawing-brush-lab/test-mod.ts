import { skribblTool } from "@/content/events/tool-changed.event";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { TypoDrawMod } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ToolsService } from "@/content/services/tools/tools.service";
import { calculatePressurePoint } from "@/util/typo/pressure";
import { inject } from "inversify";
import { firstValueFrom } from "rxjs";

/**
 * 
 */
export class TestMod extends TypoDrawMod {
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  private _lastTool: {
    tool: TypoDrawTool | skribblTool | undefined,
    date: number
  } = {
    tool: undefined,
    date: Date.now()
  };

  /**
   * Set the brush size depending on the pressure
   * @param from
   * @param to
   * @param pressure
   */
  public async applyEffect(
    from: [number, number],
    to: [number, number],
    pressure: number | undefined,
  ): Promise<void> {

    /* create shifted line */
    const fromShift = [from[0] + 10, from[1] + 10] as const;
    const toShift = [to[0] + 10, to[1] + 10] as const;
    await this._drawingService.drawLine([...fromShift, ...toShift]);
  }
}