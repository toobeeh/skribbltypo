/* Result of an interpretable execution */
export abstract class InterpretableResult {
  constructor(
    readonly interpretable: Interpretable<unknown, unknown, unknown>,
    readonly message?: string
  ) {}
}

export class InterpretableError extends InterpretableResult {};
export class InterpretableSuccess extends InterpretableResult {};

export type interpretableExecutionResult<TResult, TContext> = Promise<{
  next?: Interpretable<TResult, unknown, TContext>,
  result: InterpretableResult;
}>;

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
   * @param args plain args to be interpreted
   * @param source the result of the previously chained interpretable
   * @param context context provided to the interpretation of the args
   */
  interpret(args: string, source: TSource, context: TContext): interpretableInterpretationResult<TSource & TResult, TContext>;

  /**
   * The action that will be executed on the result of the interpretation.
   * Can return a new interpretable which bill be chained onto the current one
   * @param result
   * @param context
   */
  execute(result: TResult & TSource, context: TContext): interpretableExecutionResult<TSource & TResult, TContext>;
}