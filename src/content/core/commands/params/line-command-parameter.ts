import {
  ExtensionCommandParameter,
} from "@/content/core/commands/command-parameter";

export class LineCommandParameter<TSource, TMapped> extends ExtensionCommandParameter<TSource, TMapped>{

  constructor(name: string, description: string, private _mapping: (line: string | undefined) => TMapped){
    super(name, description);
  }

  public readonly typeName = "text";
  public readonly typeDescription = "any text";

  protected readArg(args: string): { argument: TMapped; remainder: string } {

    /* return remainder as arg and empty next remainder */
    const arg = args.trim().length === 0 ? undefined : args.trim();
    const argument = this._mapping(arg);
    return { remainder: "", argument };
  }
}