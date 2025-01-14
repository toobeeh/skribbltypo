import {
  ExtensionCommandParameter,

} from "@/content/core/commands/command-parameter";
import {
  InterpretableArgumentParsingError
} from "@/content/core/commands/results/interpretable-argument-parsing-error";
import { InterpretableEmptyRemainder } from "@/content/core/commands/results/interpretable-empty-remainder";

export class NumericCommandParameter<TSource, TMapped> extends ExtensionCommandParameter<TSource, TMapped>{

  constructor(name: string, description: string, private _mapping: (number: number) => TMapped){
    super(name, description);
  }

  protected readArg(args: string): { argument: TMapped; remainder: string } {

    /* get next arg */
    const split = args.trim().split(" ");

    /* check if whitespace */
    const arg = split[0].trim();
    if(arg.length < 1 ){
      throw new InterpretableEmptyRemainder(this);
    }

    /* parse arg */
    const number = Number(arg);
    if(isNaN(number)){
      throw new InterpretableArgumentParsingError(this, "Failed to parse number from args: " + args);
    }
    const argument = this._mapping(number);

    /* return with remainder args */
    const remainder = split.slice(1).join(" ");
    return { remainder, argument };
  }
}