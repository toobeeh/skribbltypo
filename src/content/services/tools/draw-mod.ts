import { injectable } from "inversify";

@injectable()
export abstract class TypoDrawMod {

  /**
   * Indicator if this mod requires the skribbl sampling throttle to be disabled
   * Needs to be set true if the mod produces many draw commands in a short time
   */
  public readonly disableSkribblSamplingRate = false;

  /**
   * Apply the effect of the mod to a draw event
   * @param from
   * @param to
   * @param pressure
   */
  public abstract applyEffect(from: [number, number], to: [number, number], pressure: number | undefined): void | Promise<void>;
}