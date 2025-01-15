import type { BrushLabItem } from "@/content/features/drawing-brush-lab/brush-lab-item.interface";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { TypoDrawMod } from "@/content/services/tools/draw-mod";
import { type brushStyle, ToolsService } from "@/content/services/tools/tools.service";
import { inject } from "inversify";

/**
 * 
 */
export class TestMod extends TypoDrawMod implements BrushLabItem {
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  readonly description = "adasdasd asdasd";
  readonly icon = "var(--file-img-wand-gif)";
  readonly name = "test Mod";
  readonly settings = [];

  /**
   * Set the brush size depending on the pressure
   * @param from
   * @param to
   * @param pressure
   * @param style
   */
  public async applyEffect(
    from: [number, number],
    to: [number, number],
    pressure: number | undefined,
    style: brushStyle
  ): Promise<void> {

    /* create shifted line */
    const fromShift = [from[0] + style.size * 2, from[1] + style.size * 2] as const;
    const toShift = [to[0] + style.size * 2, to[1] + style.size * 2] as const;
    await this._drawingService.drawLine([...fromShift, ...toShift], style.color.typoCode, style.size);
  }
}