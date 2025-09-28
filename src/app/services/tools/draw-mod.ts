import type { brushStyle } from "@/app/services/tools/tools.service";
import { injectable } from "inversify";

export type strokeCause = "move" | "up" | "down";

export interface lineCoordinates {
  from: [number, number];
  to: [number, number];
}

export interface drawModLine extends lineCoordinates {
  styleOverride?: brushStyle;
}

export interface drawModEffect {
  lines: drawModLine[],
  style: brushStyle
}

@injectable()
export abstract class TypoDrawMod {

  /**
   * Indicator if this mod requires the skribbl sampling throttle to be disabled
   * Needs to be set true if the mod produces many draw commands in a short time
   * TODO remove? seems unused
   */
  public readonly disableSkribblSamplingRate = false;

  /**
   * Process a draw input line with style, coming from tools like brush;
   * output the same, modified or new lines along with processed style
   * @param line
   * @param pressure
   * @param brushStyle
   * @param eventId id of the event. if a mod previously created multiple lines for a single event, they have the same id
   * @param strokeId id of the stroke. each event during a pointer-down to pointer-up cycle shares the same stroke id
   * @param strokeCause event that caused the stroke
   */
  public abstract applyEffect(
    line: lineCoordinates,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number,
    strokeId: number,
    strokeCause: strokeCause
  ): drawModEffect | Promise<drawModEffect>;

  protected noLineEffect(line: drawModLine, pressure: number | undefined, brushStyle: brushStyle): drawModEffect {
    return {lines: [line], style: brushStyle};
  }
}