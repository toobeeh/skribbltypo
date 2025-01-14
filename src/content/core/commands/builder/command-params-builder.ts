import {
  type commandExecutionContext,
  type ExtensionCommand,

} from "@/content/core/commands/command";
import type { ExtensionCommandParameter } from "@/content/core/commands/command-parameter";
import {
  DeferredInterpretableBuilder
} from "@/content/core/commands/builder/deferred-interpretable-builder";
import {
  type Interpretable,

} from "@/content/core/commands/interpretable";
import { InterpretableDeferResult } from "@/content/core/commands/results/interpretable-defer-result";
import { InterpretableResult } from "@/content/core/commands/results/interpretable-result";

/***
  * Simplifies the building of command parameters using a deferred interpretable chain builder
  */
export class CommandParamsBuilder<TSource, TResult> {

  /**
   * Create a interpretable chain root for a command
   * @param command
   */
  static forCommand(command: ExtensionCommand) {
    const deferredBuilder = new DeferredInterpretableBuilder<object, object, commandExecutionContext>(execute => command.setExecute(execute));
    return new CommandParamsBuilder<object, object>(deferredBuilder);
  }

  constructor(
    private _interpretableDeferred: DeferredInterpretableBuilder<TSource, TResult, commandExecutionContext>,
    private _precedingParams: ExtensionCommandParameter<unknown, unknown>[] = []
  ) { }

  /**
   * Add a parameter to the chain and return the builder to append to the new param
   * @param param
   */
  public addParam<TNextResult>(param: ExtensionCommandParameter<TResult & TSource, TNextResult>){
    const nextDeferredBuilder = this._interpretableDeferred
      .chainInterpretable<TNextResult>(execute => {

        const executeProxy = async (result: TNextResult & TResult & TSource, context: commandExecutionContext) => {
          context.currentInterpretedParameter = param as ExtensionCommandParameter<unknown, unknown>;
          return execute(result, context);
        };

        return param.withAction(executeProxy);
      });

    return new CommandParamsBuilder(
      nextDeferredBuilder,
      [...this._precedingParams, param as ExtensionCommandParameter<unknown, unknown>]
    );
  }

  /**
   * Set the execution of the chain end
   * @param run
   */
  public run(run: (
    result: TResult & TSource,
    interpretable: Interpretable<TSource, TResult, commandExecutionContext>
                 ) => Promise<InterpretableResult>
  ):
    ExtensionCommandParameter<unknown, unknown>[]
  {
    this._interpretableDeferred.setExecute(async (result, context) => {
      context.currentInterpretedParameter = this._precedingParams[this._precedingParams.length - 1];
      const interpretable = this._interpretableDeferred.interpretable;
      const response = new InterpretableDeferResult(interpretable, undefined, () => run(result, interpretable));
      return { result: response };
    });
    return this._precedingParams;
  };

  /**
   * Build the current chain end or beginning
   * Can only be used after the whole chain up to this point has been initialized
   * Returns all arguments in the chain in correct order
   */
  public build() {
    this._interpretableDeferred.build();
  }
}