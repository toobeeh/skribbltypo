import { InterpretableError } from "@/app/core/commands/results/interpretable-error";

/**
 * Error to be thrown during interpretation when the remainder arg string is empty
 */
export class InterpretableEmptyRemainder extends InterpretableError {
}