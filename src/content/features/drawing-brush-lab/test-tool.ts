import { DrawingService } from "@/content/services/drawing/drawing.service";
import { TypoDrawMod } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import type { brushStyle } from "@/content/services/tools/tools.service";
import { calculatePressurePoint } from "@/util/typo/pressure";
import { inject } from "inversify";

/**
 * 
 */
export class TestTool extends TypoDrawTool {
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  public override createCursor(style: brushStyle): { source: string; x: number; y: number } {
    return this.createSkribblLikeCursor(style);
  }

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
  ): Promise<void> {}

  public override createCommands(
    from: [number, number],
    to: [number, number],
    pressure: number | undefined,
  ): number[][] | Promise<number[][]> {
    return [];
  }
}