import {
  type Interpretable,
  type interpretableExecutionResult,
  InterpretableSuccess,
} from "@/content/core/commands/interpretable";

export type executeNextFunction<TResult, TContext> = (result: TResult, context: TContext) => interpretableExecutionResult<TResult, TContext>;

/**
 * Helper class to build chained interpretables
 */
export class DeferredInterpretableBuilder<TSource, TResult, TContext> {

  private _execute?: (result: TResult & TSource, context: TContext) => interpretableExecutionResult<TResult & TSource, TContext>;
  protected _builtInterpretable?: Interpretable<TSource, TResult, TContext>;

  /**
   * Create a new interpretable chain builder
   * @param _interpretableBuilder factory for an interpretable which provides a execution context that can be set later in the builder
   */
  constructor(
    private _interpretableBuilder: (executionContext: executeNextFunction<TResult & TSource, TContext>) =>
      Interpretable<TSource, TResult & TSource, TContext>
  ){ }

  /**
   * Set the execution function of the interpretable to a new interpretable
   * and return the new builder
   * @param nextInterpretableBuilder
   */
  chainInterpretable<TNextResult>(
    nextInterpretableBuilder: (executionContext: executeNextFunction<TNextResult & TResult & TSource, TContext>) =>
      Interpretable<TResult & TSource, TResult & TNextResult & TSource, TContext>
  ){
    const builder = new DeferredInterpretableBuilder<TResult & TSource, TResult & TNextResult & TSource, TContext>(nextInterpretableBuilder);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.setExecute(async (result, context) => {
      return {next: builder.build(), result: new InterpretableSuccess(this.interpretable)};
    });

    return builder;
  }

  /**
   * Set the execution function of the interpretable to a final function
   * @param execute
   */
  setExecute(execute: (result: TResult & TSource, context: TContext) => interpretableExecutionResult<TResult & TSource, TContext>){
    this._execute = execute;
    return this;
  }

  /**
   * Build the current deferred interpretable and return it
   */
  build() {
    if(!this._execute || !this._interpretableBuilder) throw new Error("Cannot build interpretable without execute function");
    const execute = this._execute;
    this._builtInterpretable = this._interpretableBuilder((result, context) => execute(result, context));
    return this._builtInterpretable;
  }

  /**
   * The built interpretable, if built, else undefined
   */
  get interpretable(){
    if(!this._builtInterpretable) throw new Error("Interpretable has not yet been built");
    return this._builtInterpretable;
  }
}
