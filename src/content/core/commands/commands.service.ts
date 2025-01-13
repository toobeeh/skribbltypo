import { type commandExecutionContext, ExtensionCommand } from "@/content/core/commands/command";
import {
  type Interpretable, InterpretableError,
  type interpretableExecutionResult,
  InterpretableResult,
  InterpretableSuccess,
} from "@/content/core/commands/interpretable";
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

    const command = new ExtensionCommand("test", "test", 1 as unknown as TypoFeature, "Test", "Test Command", true)
      .withParameters(builder => builder
        .addParam(new NumericCommandParameter("number 1", "A first number", num => ({a: num})))
        .addParam(new NumericCommandParameter("number 2", "A second number", num => ({b: num})))
        .addParam(new NumericCommandParameter("number 3", "A 3 number", num => ({x: num})))
        .execute(async (result, interpretable) => new InterpretableSuccess(interpretable, `Number is ${result.a} and ${result.b}`)));

    const commands: ((args: string) => Promise<InterpretableResult | null>)[] = [
      (args: string) => this.executeCommand(command, args)
    ];
    const args = prompt("Enter command") ?? "";

    commands.forEach(async command => {
      const result = await command(args);
      console.log(result);
    });
  }

  async executeCommand(command: ExtensionCommand, args: string){
    const context: commandExecutionContext = {
      parameters: command.params,
    };

    return this.executeInterpretable(command, args, {}, context);
  }

  /**
   * Execute an interpretable chain on given args and context
   * @param interpretable
   * @param args
   * @param source
   * @param context
   */
  async executeInterpretable<TSource, TResult, TContext>(
    interpretable: Interpretable<TSource, TResult, TContext>,
    args: string, source: TSource, context: TContext,
  ): Promise<InterpretableResult | null> {

    /* try to interpret the args */
    let interpretation;
    try {
      interpretation = await interpretable.interpret(args, source, context);
    }

    /* if an error is thrown, return it */
    catch(e: unknown){
      if(e instanceof InterpretableError) return e;
      else throw e;
    }

    /* interpretable did not match */
    if(interpretation === null) {
      return null;
    }

    /* execute interpretable action with interpreted args */
    let result: Awaited<interpretableExecutionResult<TSource & TResult, TContext>>;
    try {
      result = await interpretable.execute(interpretation.result, context);
    }

    /* if an error is thrown, return it */
    catch(e: unknown){
      if(e instanceof InterpretableError) return e;
      else throw e;
    }

    /* if interpretable provided chain, follow */
    if(result.next !== undefined){
      return await this.executeInterpretable(result.next, interpretation.remainder, interpretation.result, context);
    }

    /* else return a final status message */
    else return result.result;
  }

}