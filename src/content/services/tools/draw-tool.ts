import { TypoDrawMod } from "@/content/services/tools/draw-mod";

export abstract class TypoDrawTool extends TypoDrawMod {

  public abstract get cursor(): { source: string, x: number, y: number };

  /**
   * Create draw commands from a draw event
   * @param from
   * @param to
   * @param pressure
   */
  public abstract createCommands(from: [number, number], to: [number, number], pressure: number | undefined): number[][] | Promise<number[][]>;
}