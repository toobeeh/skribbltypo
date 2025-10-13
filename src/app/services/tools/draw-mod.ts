import type { brushStyle } from "@/app/services/tools/tools.service";
import { injectable } from "inversify";

export type strokeCause = "move" | "up" | "down";

export interface lineCoordinates {
  from: [number, number];
  to: [number, number];
}

export interface drawModEffect {
  lines: lineCoordinates[],
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

@injectable()
export abstract class TypoDrawMod {

  /**
   * Process a draw input line with style, coming from tools like brush;
   * output the same, modified or new lines along with processed style
   * @param line
   * @param pressure
   * @param brushStyle
   * @param eventId id of the event. if a mod previously created multiple lines for a single event, they have the same id
   * @param strokeId id of the stroke. each event during a pointer-down to pointer-up cycle shares the same stroke id
   * @param strokeCause event that caused the stroke
   * @param secondaryActive whether the stroke was made in secondary mode (eg color)
   */
  public abstract applyEffect(
    line: lineCoordinates,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number,
    strokeId: number,
    strokeCause: strokeCause,
    secondaryActive: boolean
  ): drawModEffect | Promise<drawModEffect>;

  protected noLineEffect(line: lineCoordinates, pressure: number | undefined, brushStyle: brushStyle): drawModEffect {
    return {lines: [line], style: brushStyle};
  }

  /**
   * Get the selected color, considering whether secondary mode is active
   * @param brushStyle
   * @param secondaryActive
   * @private
   */
  protected getSelectedColor(brushStyle: brushStyle, secondaryActive: boolean): number {
    return secondaryActive ? (brushStyle.secondaryColor) : (brushStyle.color);
  }
}