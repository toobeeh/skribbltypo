import {
  type commandExecutionContext,
  type ExtensionCommand,

} from "@/app/core/commands/command";
import type { ExtensionCommandParameter } from "@/app/core/commands/command-parameter";
import {
  DeferredInterpretableBuilder
} from "@/app/core/commands/builder/deferred-interpretable-builder";
import {
  type Interpretable,

} from "@/app/core/commands/interpretable";
import { InterpretableDeferResult } from "@/app/core/commands/results/interpretable-defer-result";
import { InterpretableResult } from "@/app/core/commands/results/interpretable-result";

/***
  * Simplifies the building of command parameters using a deferred interpretable chain builder
 * The builder is holds a interpretable which will be populated with a execution function
 * @typeparam TSource The source type of the current interpretable
 * @typeparam TParam The parameter type which the builder will add to the source
  */
export class CommandParamsBuilder<TSource, TParam> {

  /**
   * Create a interpretable chain root for a command
   * @param command
   */
  static forCommand(command: ExtensionCommand) {
    const deferredBuilder = new DeferredInterpretableBuilder<object, object, commandExecutionContext>(execute => command.setExecute(execute));
    return new CommandParamsBuilder<object, object>(deferredBuilder);
  }

  constructor(
    private _interpretableDeferred: DeferredInterpretableBuilder<TSource, TSource & TParam, commandExecutionContext>,
    private _precedingParams: ExtensionCommandParameter<unknown, unknown>[] = []
  ) { }

  /**
   * Add a parameter to the chain and return the builder to append to the new param
   * @param param
   */
  public addParam<TNextParam>(param: ExtensionCommandParameter<TSource & TParam, TNextParam>){
    const nextDeferredBuilder = this._interpretableDeferred
      .chainInterpretable<TSource & TParam & TNextParam>(execute => {
        return param.withAction(execute);
      });

    return new CommandParamsBuilder<TSource & TParam, TSource & TParam & TNextParam>(
      nextDeferredBuilder,
      [...this._precedingParams, param as ExtensionCommandParameter<unknown, unknown>]
    );
  }

  /**
   * Set the execution of the chain end
   * @param run
   */
  public run(run: (
    result: TParam & TSource,
    interpretable: Interpretable<TSource, TSource & TParam, commandExecutionContext>
                 ) => Promise<InterpretableResult>
  ):
    ExtensionCommandParameter<unknown, unknown>[]
  {
    this._interpretableDeferred.setExecute(async (result) => {
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