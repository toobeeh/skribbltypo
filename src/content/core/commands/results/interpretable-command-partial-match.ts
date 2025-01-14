import { InterpretableError } from "@/content/core/commands/results/interpretable-error";

/**
 * Error that can be thrown during interpretation of a command
 * when the command name is partially matched, instead of returning null
 */
export class InterpretableCommandPartialMatch extends InterpretableError {
}