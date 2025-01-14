/* Result of an interpretable execution */
import type { Interpretable } from "@/content/core/commands/interpretable";

/**
 * Base class used for all concrete results of an interpretable execution
 * Can also be thrown as error during interpretation
 */
export abstract class InterpretableResult {
  constructor(
    readonly interpretable: Interpretable<unknown, unknown, unknown>,
    readonly message?: string,
  ) {
  }
}