import type { ExtensionCommand } from "@/content/core/commands/command";
import type { ExtensionCommandParameter } from "@/content/core/commands/command-parameter";
import {
  DeferredInterpretableBuilder
} from "@/content/core/commands/builder/deferred-interpretable-builder";

/***
  * Simplifies the building of commands using a deferred interpretable chain builder
  */
export class CommandArgsBuilder<TSource, TResult, TContext> {

  /**
   * Create a interpretable chain root for a command
   * @param command
   */
  static forCommand<TContext>(command: ExtensionCommand<TContext>) {
    const deferredBuilder = new DeferredInterpretableBuilder<object, object, TContext>(execute => command.setExecute(execute));
    return new CommandArgsBuilder<object, object, TContext>(deferredBuilder);
  }

  constructor(
    private _interpretableDeferred: DeferredInterpretableBuilder<TSource, TResult, TContext>,
    private _precedingArgs: ExtensionCommandParameter<unknown, unknown, unknown>[] = []
  ) { }

  /**
   * Add an argument to the chain and return the builder to append to the new arg
   * @param arg
   */
  public addArg<TNextResult>(arg: ExtensionCommandParameter<TResult & TSource, TNextResult, TContext>){
    const nextDeferredBuilder = this._interpretableDeferred.chainInterpretable<TNextResult>(execute => arg.withAction(execute));
    return new CommandArgsBuilder(
      nextDeferredBuilder,
      [...this._precedingArgs, arg as ExtensionCommandParameter<unknown, unknown, unknown>]
    );
  }


  /**
   * Set the execution of the chain end
   * @param execute
   */
  public execute(execute: (result: TResult & TSource, context: TContext) => Promise<string | undefined>): ExtensionCommandParameter<unknown, unknown, unknown>[] {
    this._interpretableDeferred.setExecute(async (result, context) => {
      const response = await execute(result, context);
      return { message: response };
    });
    return this._precedingArgs;
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