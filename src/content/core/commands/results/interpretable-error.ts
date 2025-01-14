import { InterpretableResult } from "@/content/core/commands/results/interpretable-result";

/**
 * A result of a failed interpretable execution without any other concrete meaning
 * Can be used to indicate a failed interpretation by throwing this during interpretation
 */
export class InterpretableError extends InterpretableResult {
}