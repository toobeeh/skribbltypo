import type { brushStyle } from "@/content/services/tools/tools.service";
import { injectable } from "inversify";

export interface drawModLine {
  from: [number, number];
  to: [number, number];
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
   */
  public readonly disableSkribblSamplingRate = false;

  /**
   * Process a draw input line with style;
   * output the same, modified or new lines along with processed style
   * @param line
   * @param pressure
   * @param brushStyle
   * @param eventId id of the event. if a mod previously created multiple lines for a single event, they have the same id
   * @param strokeId id of the stroke. each event during a pointer-down to pointer-up cycle shares the same stroke id
   */
  public abstract applyEffect(
    line: drawModLine,
    pressure: number | undefined,
    brushStyle: brushStyle,
    eventId: number,
    strokeId: number
  ): drawModEffect | Promise<drawModEffect>;

  protected noEffect(line: drawModLine, pressure: number | undefined, brushStyle: brushStyle): drawModEffect {
    return {lines: [line], style: brushStyle};
  }
}