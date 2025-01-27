import { ConstantDrawMod } from "@/content/services/tools/constant-draw-mod";
import { type drawModLine } from "@/content/services/tools/draw-mod";
import type { brushStyle } from "@/content/services/tools/tools.service";

export abstract class TypoDrawTool extends ConstantDrawMod {

  private cursorCanvas = document.createElement("canvas");

  public abstract createCursor(brushStyle: brushStyle): { source: string, x: number, y: number };

  /**
   * Create draw commands from a draw event
   * IMPORTANT that the line numbers are whole numbers
   * @param line
   * @param pressure
   * @param brushStyle
   * @param eventId
   * @param strokeId
   */
  public abstract createCommands(line: drawModLine, pressure: number | undefined, brushStyle: brushStyle, eventId: number, strokeId: number): number[][] | Promise<number[][]>;

  protected noCommands(): number[][] {
    return [];
  }

  /**
   * Create a cursor based on the current brush style that looks like the skribbl cursor
   * @param brushStyle
   * @protected
   */
  protected createSkribblLikeCursor(brushStyle: brushStyle){
    const color = brushStyle.color.rgbArray;

    // Set the alpha component
    color[3] = 0.8;

    // Set the fill style using the adjusted color
    const canvasSize = brushStyle.size + 2;
    const cursorSize = brushStyle.size;
    const canvas = this.cursorCanvas;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const context = canvas.getContext("2d");
    if(!context) throw new Error("Could not get 2d context");

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear any previous drawing
    context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;

    // Begin drawing the filled circle (cursor background)
    context.beginPath();
    context.arc(canvasSize / 2, canvasSize / 2, cursorSize / 2 - 1, 0, 2 * Math.PI);  // Center at (canvasSize/2, canvasSize/2), radius (cursorSize/2 - 1)
    context.fill();

    // Draw the outer white stroke (for visibility)
    context.strokeStyle = "#FFF";
    context.beginPath();
    context.arc(canvasSize / 2, canvasSize / 2, cursorSize / 2 - 1, 0, 2 * Math.PI);
    context.stroke();

    // Draw an inner black stroke (for contrast)
    context.strokeStyle = "#000";
    context.beginPath();
    context.arc(canvasSize / 2, canvasSize / 2, cursorSize / 2, 0, 2 * Math.PI);
    context.stroke();

    // Create the cursor style using the canvas data
    const cursorCenter = canvasSize / 2;
    return {
      source: `url(${canvas.toDataURL()})`,
      x: cursorCenter,
      y: cursorCenter
    };
  }
}