import { DrawingService } from "@/content/services/drawing/drawing.service";
import { ConstantDrawMod, type constantDrawModEffect } from "@/content/services/tools/constant-draw-mod";
import { type drawModLine } from "@/content/services/tools/draw-mod";
import type { brushStyle } from "@/content/services/tools/tools.service";
import { calculatePressurePoint } from "@/util/typo/pressure";
import { inject } from "inversify";

/**
 * Tool that allows the user to pick a color from the canvas
 * Produces no draw commands, but sets the current color as mod side effect
 */
export class PressureMod extends ConstantDrawMod {

  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  private readonly _maxSize = 40;
  private readonly _minSize = 4;

  private _sensitivity = 6;
  private _balance = 0.5;

  /**
   * Set the brush size depending on the pressure
   * @param line
   * @param pressure
   * @param style
   */
  public async applyConstantEffect(line: drawModLine, pressure: number | undefined, style: brushStyle): Promise<constantDrawModEffect> {

    if(pressure === undefined) {
      return {
        style,
        line,
      };
    }

    const point = calculatePressurePoint(pressure, this._sensitivity, this._balance);
    const size = this._minSize + (this._maxSize - this._minSize) * point;
    style.size = size;

    return {
      style,
      line
    };
  }

  /**
   * Set the sensitivity and balance of the pressure point function
   * @param sensitivity
   * @param balance
   */
  public setParams(sensitivity: number, balance: number){
    this._sensitivity = sensitivity;
    this._balance = balance;
  }
}