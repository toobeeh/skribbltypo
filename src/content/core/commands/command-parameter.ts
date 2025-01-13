import type { commandExecutionContext } from "@/content/core/commands/command";
import {
  type Interpretable, InterpretableError,
  type interpretableExecutionResult,
  type interpretableInterpretationResult, InterpretableSuccess,
} from "@/content/core/commands/interpretable";

export class InterpretableArgumentParsingError extends InterpretableError {}

export abstract class ExtensionCommandParameter<TSource, TParam>
  implements Interpretable<TSource, TParam, commandExecutionContext>
{

  private _execute?: (result: TParam & TSource, context: commandExecutionContext) =>
    interpretableExecutionResult<TSource & TParam, commandExecutionContext>;

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

  public withAction(action: (result: TParam & TSource, context: commandExecutionContext
  ) => interpretableExecutionResult<TSource & TParam, commandExecutionContext>) {
    this._execute = action;
    return this;
  }

  interpret(args: string, source: TSource, context: commandExecutionContext
  ): interpretableInterpretationResult<TSource & TParam, commandExecutionContext> {
    const { argument, remainder } = this.readArg(args);
    return Promise.resolve({
      result: { ...source, ...argument },
      context,
      remainder,
    });
  }

  execute(result: TParam & TSource, context: commandExecutionContext
  ): interpretableExecutionResult<TSource & TParam, commandExecutionContext> {
    return this._execute?.(result, context) ?? Promise.resolve({result: new InterpretableSuccess(this)});
  }

  /**
   * Read the argument from the string
   * @param args raw remaining args
   * @protected
   */
  protected abstract readArg(args: string): { argument: TParam, remainder: string };

}