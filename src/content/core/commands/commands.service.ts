import { ExtensionCommand } from "@/content/core/commands/command";
import type { Interpretable } from "@/content/core/commands/interpretable";
import { NumericCommandParameter } from "@/content/core/commands/params/numeric-command-parameter";
import type { TypoFeature } from "@/content/core/feature/feature";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { inject, injectable } from "inversify";
@injectable()
export class CommandsService {

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);

    const command = new ExtensionCommand<this>("test", "test", 1 as unknown as TypoFeature, "Test", "Test Command", this, true)
      .withArgs(builder => builder
        .addArg(new NumericCommandParameter(this, "number 1", "A first number", num => ({a: num})))
        .addArg(new NumericCommandParameter(this, "number 2", "A second number", num => ({b: num})))
        .addArg(new NumericCommandParameter(this, "number 3", "A 3 number", num => ({x: num})))
        .execute(async result => `Number is ${result.a} and ${result.b}`));

    const commands: ((args: string) => Promise<string | undefined | null>)[] = [(args: string) => this.executeInterpretable(command, args, undefined, command.context)];
    const args = prompt("Enter command") ?? "";

    commands.forEach(async command => {
      const result = await command(args);
      alert(result);
    });

  }

  /**
   * Execute an interpretable chain
   * @param interpretable
   * @param args
   * @param source
   * @param context
   */
  async executeInterpretable<TSource, TResult, TContext>(
    interpretable: Interpretable<TSource, TResult, TContext>,
    args: string, source: TSource, context: TContext
  ): Promise<string | undefined | null> {
    const interpretation = await interpretable.interpret(args, source, context);
    console.log("got interpretation", interpretation, interpretable);


    /* interpretable did not match */
    if(interpretation === null) {
      return null;
    }

    const result = await interpretable.execute(interpretation.result, context);
    if(result.next !== undefined){
      return await this.executeInterpretable(result.next, interpretation.remainder, interpretation.result, context);
    }
    else return result.message;
  }

}