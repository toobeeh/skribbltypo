import {
  ExtensionCommandParameter,
} from "@/app/core/commands/command-parameter";
import { InterpretableEmptyRemainder } from "@/app/core/commands/results/interpretable-empty-remainder";

export class StringCommandParameter<TSource, TMapped> extends ExtensionCommandParameter<TSource, TMapped>{

  constructor(name: string, description: string, private _mapping: (number: string) => TMapped){
    super(name, description);
  }

  public readonly typeName = "text";
  public readonly typeDescription = "a single word or text wrapped in quotes";

  protected readArg(args: string): { argument: TMapped; remainder: string } {

    /* get next arg */
    const regex = /^\s*(["'])(.*?)\1/;

    let arg = "";
    let remainder = "";
    const matchQuoted = args.trim().match(regex);

    if(matchQuoted !== null){
      arg = matchQuoted[2];
      remainder = args.trim().slice(matchQuoted[0].length).trim();
    }
    else {
      const split = args.trim().split(" ");
      arg = split[0].trim();
      remainder = split.slice(1).join(" ");
    }

    /* check if whitespace */
    if(arg.length < 1 ){
      throw new InterpretableEmptyRemainder(this);
    }

    /* parse arg */
    const argument = this._mapping(arg);

    /* return with remainder args */
    return { remainder, argument };
  }
}