import { DrawingService } from "@/content/services/drawing/drawing.service";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { Color } from "@/util/color";
import { inject } from "inversify";

/**
 * Tool that allows the user to pick a color from the canvas
 * Produces no draw commands, but sets the current color as mod side effect
 */
export class PipetteTool extends TypoDrawTool {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  public createCursor() {
    return { source: "var(--file-img-pipette_cur-png)", x: 7, y: 37 };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public createCommands(from: [number, number], to: [number, number], pressure: number | undefined): number[][] {
    return [];
  }

  /**
   * Get the pixel color of the canvas at a certain position
   * @param from
   * @param to
   * @param pressure
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async applyEffect(from: [number, number], to: [number, number], pressure: number | undefined): Promise<void> {
    const elements = await this._elementsSetup.complete();
    const canvas = elements.canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const imageData = ctx.getImageData(to[0], to[1], 1, 1);
    const rgb = imageData.data.slice(0, 3);
    const color = Color.fromRgb(rgb[0], rgb[1], rgb[2]);
    this._drawingService.setColor(color);
  }
}