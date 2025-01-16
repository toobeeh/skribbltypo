import type { BrushLabItem } from "@/content/features/drawing-brush-lab/brush-lab-item.interface";
import { type drawModEffect, type drawModLine, TypoDrawMod } from "@/content/services/tools/draw-mod";
import { type brushStyle } from "@/content/services/tools/tools.service";
export class ParallelLineMod extends TypoDrawMod implements BrushLabItem {

  readonly description = "Draw Parallel Lines";
  readonly icon = "var(--file-img-line-parallel-gif)";
  readonly name = "Parallel Lines";
  readonly settings = [];

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

    /* create shifted line */
    const fromShift = [line.from[0] + style.size * 2, line.from[1] + style.size * 2] as [number, number];
    const toShift = [line.to[0] + style.size * 2, line.to[1] + style.size * 2] as [number, number];

    return {
      style,
      lines: [line, { from: fromShift, to: toShift }]
    };
  }
}