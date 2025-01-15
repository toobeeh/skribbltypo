import type { commandExecutionContext } from "@/content/core/commands/command";
import {
  type Interpretable,
  type interpretableExecutionResult,
  type interpretableInterpretationResult,
} from "@/content/core/commands/interpretable";
import { InterpretableEmptyRemainder } from "@/content/core/commands/results/interpretable-empty-remainder";
import { InterpretableSuccess } from "@/content/core/commands/results/interpretable-success";


/**
 * An interpretable that represents a command parameter
 * @typeparam TSource The type of all previous interpretable (parameters) in the chain
 * @typeparam TParam The type of the parameter that this interpretable represents and adds to the source
 */
export abstract class ExtensionCommandParameter<TSource, TParam>
  implements Interpretable<TSource, TSource & TParam, commandExecutionContext>
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

  public abstract readonly typeName: string;

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

    let skipMarkAsInterpreting = false;

    /* parse arg */
    try {
      const { argument, remainder } = this.readArg(args, () => skipMarkAsInterpreting = true);

      /* set param as interpreting in context */
      if(!skipMarkAsInterpreting) context.currentInterpretedParameter = this as ExtensionCommandParameter<unknown, unknown>;

      return Promise.resolve({
        result: { ...source, ...argument },
        context,
        remainder,
      });
    }
    catch(e){

      /* if param did not signalize empty, set as being interpreted regardless of error */
      if(!(e instanceof InterpretableEmptyRemainder)){
        context.currentInterpretedParameter = this as ExtensionCommandParameter<unknown, unknown>;
      }

      throw e;
    }
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
   * Return null when argument was not found but optional
   * @param args
   * @param dontMarkInterpreting skip marking this param as interpreting in context
   * @protected
   */
  protected abstract readArg(args: string, dontMarkInterpreting: () => void): { argument: TParam; remainder: string };
}