import {
  type drawModEffect,
  type lineCoordinates, type strokeCause,
  TypoDrawMod,
} from "@/app/services/tools/draw-mod";
import type { brushStyle } from "@/app/services/tools/tools.service";

export interface constantDrawModEffect {
  line: lineCoordinates,
  style: brushStyle,

  /**
   * when true, won't propagate the color change out of the current cycle
   * (won't change the actual brush style & preview)
   */
  disableColorUpdate?: boolean,

  /**
   * when true, won't propagate the size change out of the current cycle
   * (won't change the actual brush style & preview)
   */
  disableSizeUpdate?: boolean,
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
   * @param strokeId
   * @param strokeCause
   * @param secondaryActive
   */
  public async applyEffect(
    line: lineCoordinates,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number,
    strokeId: number,
    strokeCause: strokeCause,
    secondaryActive: boolean
  ): Promise<drawModEffect>{
    const effect = this.applyConstantEffect(line, pressure, brushStyle, eventId, strokeId, strokeCause, secondaryActive);
    const awaited = effect instanceof Promise ? await effect : effect;
    return {
      lines: [awaited.line],
      style: awaited.style,
      disableSizeUpdate: awaited.disableSizeUpdate,
      disableColorUpdate: awaited.disableSizeUpdate
    };
  }

  /**
   * Apply an effect to a line, returning the modified line and style
   * @param line
   * @param pressure
   * @param brushStyle
   * @param eventId
   * @param strokeId
   * @param strokeCause
   * @param secondaryActive
   * @protected
   */
  protected abstract applyConstantEffect(
    line: lineCoordinates,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number,
    strokeId: number,
    strokeCause: strokeCause,
    secondaryActive: boolean
  ): constantDrawModEffect | Promise<constantDrawModEffect>;

  protected noConstantEffect(
    line: lineCoordinates,
    pressure: number | undefined,
    brushStyle: brushStyle
  ): constantDrawModEffect | Promise<constantDrawModEffect> {
    return {line, style: brushStyle};
  }
}