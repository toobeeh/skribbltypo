import type { Interpretable } from "@/content/core/commands/interpretable";
import { InterpretableResult } from "@/content/core/commands/results/interpretable-result";

/**
 * A successful result of an interpretable execution, indicating that the command does not need UI feedback
 */
export class InterpretableSilentSuccess extends InterpretableResult {
  constructor(interpretable: Interpretable<unknown, unknown, unknown>) {
    super(interpretable, undefined);
  }
}