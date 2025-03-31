import type { Interpretable } from "@/app/core/commands/interpretable";
import { InterpretableResult } from "@/app/core/commands/results/interpretable-result";
import { InterpretableSuccess } from "@/app/core/commands/results/interpretable-success";

/**
 * Result of a successful interpretable execution,
 * declaring that the actual execution of the command should be deferred
 * Contains a parameterless function that will be called to execute the actual execution
 */
export class InterpretableDeferResult extends InterpretableSuccess {
  constructor(
    interpretable: Interpretable<unknown, unknown, unknown>,
    message: string | undefined,
    public readonly run: () => Promise<InterpretableResult>,
  ) {
    super(interpretable, message);
  }
}