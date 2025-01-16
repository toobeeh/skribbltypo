import { type drawModEffect, type drawModLine, TypoDrawMod } from "@/content/services/tools/draw-mod";
import type { brushStyle } from "@/content/services/tools/tools.service";

export interface constantDrawModEffect {
  line: drawModLine,
  style: brushStyle
}

/**
 * a mod that does not produce additional lines; only modified style and given line
 */
export abstract class ConstantDrawMod extends TypoDrawMod {

  /**
   * @param line
   * @param pressure
   * @param brushStyle
   * @param eventId
   */
  public async applyEffect(
    line: drawModLine,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number
  ): Promise<drawModEffect>{
    const effect = this.applyConstantEffect(line, pressure, brushStyle, eventId);
    const awaited = effect instanceof Promise ? await effect : effect;
    return {
      lines: [awaited.line],
      style: awaited.style
    };
  }

  /**
   * Apply an effect to a line, returning the modified line and style
   * @param line
   * @param pressure
   * @param brushStyle
   * @protected
   */
  protected abstract applyConstantEffect(
    line: drawModLine,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number
  ): constantDrawModEffect | Promise<constantDrawModEffect>;

  protected noConstantEffect(
    line: drawModLine,
    pressure: number | undefined,
    brushStyle: brushStyle
  ): constantDrawModEffect | Promise<constantDrawModEffect> {
    return {line, style: brushStyle};
  }
}