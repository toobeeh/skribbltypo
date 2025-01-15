import {
  ExtensionCommandParameter,
} from "@/content/core/commands/command-parameter";
import { InterpretableEmptyRemainder } from "@/content/core/commands/results/interpretable-empty-remainder";

export class StringCommandParameter<TSource, TMapped> extends ExtensionCommandParameter<TSource, TMapped>{

  constructor(name: string, description: string, private _mapping: (number: string) => TMapped){
    super(name, description);
  }

  public readonly typeName = "word";

  protected readArg(args: string): { argument: TMapped; remainder: string } {

    /* get next arg */
    const split = args.trim().split(" ");

    /* check if whitespace */
    const arg = split[0].trim();
    if(arg.length < 1 ){
      throw new InterpretableEmptyRemainder(this);
    }

    /* parse arg */
    const argument = this._mapping(arg);

    /* return with remainder args */
    const remainder = split.slice(1).join(" ");
    return { remainder, argument };
  }
}