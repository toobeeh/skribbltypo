import { ExtensionCommandParameter } from "@/content/core/commands/command-parameter";

export class NumericCommandParameter<TSource, TMapped, TContext> extends ExtensionCommandParameter<TSource, TMapped, TContext>{

  constructor(_context: TContext, name: string, description: string, private _mapping: (number: number) => TMapped){
    super(name, description);
  }

  protected readArg(args: string): { param: TMapped; remainder: string } {

    /* get next arg */
    const split = args.trim().split(" ");
    if(split.length < 1 ){
      throw new Error("No number argument found in args: " + args);
    }

    /* check if whitespace */
    const arg = split[0].trim();
    if(arg.length < 1 ){
      throw new Error("Empty argument found in args: " + args);
    }

    /* parse arg */
    const number = Number(arg);
    if(isNaN(number)){
      throw new Error("Failed to parse number from args: " + args);
    }
    const param = this._mapping(number);

    /* return with remainder args */
    const remainder = split.slice(1).join(" ");
    return { remainder, param };
  }
}