import type { constantDrawModEffect } from "@/app/services/tools/constant-draw-mod";
import type { lineCoordinates, strokeCause } from "@/app/services/tools/draw-mod";
import { TypoDrawTool } from "@/app/services/tools/draw-tool";
import type { brushStyle } from "@/app/services/tools/tools.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
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
   * @param brushStyle
   * @param eventId
   * @param strokeId
   * @param strokeCause
   * @param secondaryActive
   */
  public async applyConstantEffect(
    line: lineCoordinates,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number,
    strokeId: number,
    strokeCause: strokeCause,
    secondaryActive: boolean
  ): Promise<constantDrawModEffect> {
    const elements = await this._elementsSetup.complete();
    const canvas = elements.canvas;

    const ctx = canvas.getContext("2d");
    if (ctx !== null){
      const imageData = ctx.getImageData(line.to[0], line.to[1], 1, 1);
      const rgb = imageData.data.slice(0, 3);
      if(!secondaryActive) brushStyle.color = Color.fromRgb(rgb[0], rgb[1], rgb[2]).skribblCode;
      else brushStyle.secondaryColor = Color.fromRgb(rgb[0], rgb[1], rgb[2]).skribblCode;
    }

    return this.noConstantEffect(line, pressure, brushStyle);
  }
}