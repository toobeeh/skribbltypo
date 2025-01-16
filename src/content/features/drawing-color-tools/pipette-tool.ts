import type { constantDrawModEffect } from "@/content/services/tools/constant-draw-mod";
import type { drawModLine } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import type { brushStyle } from "@/content/services/tools/tools.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { Color } from "@/util/color";
import { inject } from "inversify";

/**
 * Tool that allows the user to pick a color from the canvas
 * Produces no draw commands, but sets the current color as mod side effect
 */
export class PipetteTool extends TypoDrawTool {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public createCursor() {
    return { source: "var(--file-img-pipette_cur-png)", x: 7, y: 37 };
  }

  public createCommands = this.noCommands;

  /**
   * Get the pixel color of the canvas at a certain position
   * @param line
   * @param pressure
   * @param style
   */
  public async applyConstantEffect(line: drawModLine, pressure: number | undefined, style: brushStyle): Promise<constantDrawModEffect> {
    const elements = await this._elementsSetup.complete();
    const canvas = elements.canvas;

    const ctx = canvas.getContext("2d");
    if (ctx !== null){
      const imageData = ctx.getImageData(line.to[0], line.to[1], 1, 1);
      const rgb = imageData.data.slice(0, 3);
      style.color = Color.fromRgb(rgb[0], rgb[1], rgb[2]);
    }

    return this.noConstantEffect(line, pressure, style);
  }
}