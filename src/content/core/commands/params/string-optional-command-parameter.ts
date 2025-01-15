import {
  ExtensionCommandParameter,

} from "@/content/core/commands/command-parameter";

export class StringOptionalCommandParameter<TSource, TMapped> extends ExtensionCommandParameter<TSource, TMapped>{

  constructor(name: string, description: string, private _mapping: (string: string | undefined) => TMapped){
    super(name, description);
  }

  public readonly typeName = "word?";

  protected readArg(args: string, dontMarkAsInterpreting: () => void): { argument: TMapped; remainder: string } {

    /* get next arg */
    const split = args.trim().split(" ");

    /* check if whitespace - return undefined */
    const arg = split[0].trim();
    if(arg.length < 1 ){
      dontMarkAsInterpreting();
      return {remainder: "", argument: this._mapping(undefined)};
    }

    /* parse arg */
    const argument = this._mapping(arg);

    /* return with remainder args */
    const remainder = split.slice(1).join(" ");
    return { remainder, argument };
  }
}