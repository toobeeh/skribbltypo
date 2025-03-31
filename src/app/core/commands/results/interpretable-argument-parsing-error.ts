import { InterpretableError } from "@/app/core/commands/results/interpretable-error";

/**
 * Error to be thrown during interpretation of a command parameter,
 * indicating the interpretation was not successful, instead of returning null
 */
export class InterpretableArgumentParsingError extends InterpretableError {
}