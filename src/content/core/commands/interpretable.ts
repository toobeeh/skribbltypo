import type { InterpretableResult } from "@/content/core/commands/results/interpretable-result";

/**
 * Result of an interpretable execution
 */
export type interpretableExecutionResult<TResult, TContext> = Promise<{
  next?: Interpretable<TResult, unknown, TContext>,
  result: InterpretableResult;
}>;

/**
 * Result of an interpretable execution
 * Null if interpretation refused and chain interpretation is cancelled,
 * or object if interpretation was successful
 */
export type interpretableInterpretationResult<TResult, TContext> = Promise<{
  result: TResult,
  context: TContext,
  remainder: string
} | null>;

/**
 * Object that is part of an interpretation chain
 */
export interface Interpretable<TSource, TResult, TContext>{

  /**
   * Process a string and append the result to a preceding source
   * Can throw an instance of InterpretableError if the interpretation was attempted but fails
   * @param args plain args to be interpreted
   * @param source the result of the previously chained interpretable
   * @param context context provided to the interpretation of the args
   * @return null if the interpretation refused,
   * or an object containing the cumulated source, the (possibly modified) context and the remaining args
   */
  interpret(args: string, source: TSource, context: TContext): interpretableInterpretationResult<TResult, TContext>;

  /**
   * The action that will be executed on the result of the interpretation.
   * Can return a new interpretable which will be chained onto the current one, and a result indicating success
   * or failure of the interpretation
   * @param result the result of the interpretation
   * @param context the context provided to the interpretation execution
   * @return a result containing the success or failure of the execution, and an optional next interpretable to chain
   */
  execute(result: TResult, context: TContext): interpretableExecutionResult<TResult, TContext>;
}