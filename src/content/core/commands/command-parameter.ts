import type {
  Interpretable,
  interpretableExecutionResult,
  interpretableInterpretationResult,
} from "@/content/core/commands/interpretable";

export abstract class ExtensionCommandParameter<TSource, TParam, TContext>
  implements Interpretable<TSource, TParam, TContext>
{

  private _execute?: (result: TParam & TSource, context: TContext) => interpretableExecutionResult<TSource & TParam, TContext>;

  protected constructor(
    private _name: string,
    private _description: string,
  ){ }

  public get name() {
    return this._name;
  }

  public get description() {
    return this._description;
  }

  public withAction(action: (result: TParam & TSource, context: TContext
  ) => interpretableExecutionResult<TSource & TParam, TContext>) {
    this._execute = action;
    return this;
  }

  interpret(args: string, source: TSource, context: TContext
  ): interpretableInterpretationResult<TSource & TParam, TContext> {
    const { param, remainder } = this.readArg(args);
    return Promise.resolve({
      result: { ...source, ...param },
      context,
      remainder,
    });
  }

  execute(result: TParam & TSource, context: TContext
  ): interpretableExecutionResult<TSource & TParam, TContext> {
    return this._execute?.(result, context) ?? Promise.resolve({});
  }

  /**
   * Read the argument from the string
   * @param args raw remaining args
   * @protected
   */
  protected abstract readArg(args: string): { param: TParam, remainder: string };

}