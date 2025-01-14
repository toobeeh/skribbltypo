import type { commandExecutionContext } from "@/content/core/commands/command";
import {
  type Interpretable,
  type interpretableExecutionResult,
  type interpretableInterpretationResult,
} from "@/content/core/commands/interpretable";
import { InterpretableSuccess } from "@/content/core/commands/results/interpretable-success";

export abstract class ExtensionCommandParameter<TSource, TParam>
  implements Interpretable<TSource, TParam, commandExecutionContext>
{
  private _execute?: (
    result: TParam & TSource,
    context: commandExecutionContext,
  ) => interpretableExecutionResult<TSource & TParam, commandExecutionContext>;

  protected constructor(
    private _name: string,
    private _description: string,
  ) {}

  public get name() {
    return this._name;
  }

  public get description() {
    return this._description;
  }

  /**
   * Set the action to be executed after interpretation
   * @param action
   */
  public withAction(
    action: (
      result: TParam & TSource,
      context: commandExecutionContext,
    ) => interpretableExecutionResult<TSource & TParam, commandExecutionContext>,
  ) {
    this._execute = action;
    return this;
  }

  interpret(
    args: string,
    source: TSource,
    context: commandExecutionContext,
  ): interpretableInterpretationResult<TSource & TParam, commandExecutionContext> {
    const { argument, remainder } = this.readArg(args);
    return Promise.resolve({
      result: { ...source, ...argument },
      context,
      remainder,
    });
  }

  execute(
    result: TParam & TSource,
    context: commandExecutionContext,
  ): interpretableExecutionResult<TSource & TParam, commandExecutionContext> {
    return (
      this._execute?.(result, context) ??
      Promise.resolve({ result: new InterpretableSuccess(this) })
    );
  }


  /**
   * Parse arguments for this parameter type during interpretable interpretation
   * @param args
   * @protected
   */
  protected abstract readArg(args: string): { argument: TParam; remainder: string };
}