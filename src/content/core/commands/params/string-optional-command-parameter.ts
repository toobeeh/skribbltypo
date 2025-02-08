import {
  ExtensionCommandParameter,
} from "@/content/core/commands/command-parameter";

export class StringOptionalCommandParameter<TSource, TMapped> extends ExtensionCommandParameter<TSource, TMapped>{

  constructor(name: string, description: string, private _mapping: (string: string | undefined) => TMapped){
    super(name, description);
  }

  public readonly typeName = "text?";
  public readonly typeDescription = "empty, a single word or text wrapped in quotes";

  protected readArg(args: string, dontMarkAsInterpreting: () => void): { argument: TMapped; remainder: string } {
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

    /* check if whitespace - return undefined */
    if(arg.length < 1 ){
      dontMarkAsInterpreting();
      return {remainder: "", argument: this._mapping(undefined)};
    }

    /* parse arg */
    const argument = this._mapping(arg);

    /* return with remainder args */
    return { remainder, argument };
  }
}