import { injectable } from "inversify";

@injectable()
export abstract class TypoDrawMod {

  /**
   * Apply the effect of the mod to a draw event
   * @param from
   * @param to
   * @param pressure
   */
  public abstract applyEffect(from: [number, number], to: [number, number], pressure: number | undefined): void | Promise<void>;
}