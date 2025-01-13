import { CommandParamsBuilder } from "@/content/core/commands/builder/command-params-builder";
import type { ExtensionCommandParameter } from "@/content/core/commands/command-parameter";
import {
  type Interpretable,
  type interpretableExecutionResult,
  type interpretableInterpretationResult, InterpretableResult, InterpretableSuccess,
} from "@/content/core/commands/interpretable";
import  { type TypoFeature } from "@/content/core/feature/feature";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { firstValueFrom } from "rxjs";

export interface commandExecutionContext {
  parameters: ExtensionCommandParameter<unknown, unknown>[];
  currentInterpretedParameter?: ExtensionCommandParameter<unknown, unknown>;
}

export class ExtensionCommand implements Interpretable<object, object, commandExecutionContext> {
  private _id: ExtensionSetting<string>;
  private _enabledSetting: ExtensionSetting<boolean>;
  private _execute?: (result: object, context: commandExecutionContext) =>
    interpretableExecutionResult<object, commandExecutionContext>;
  private _params: ExtensionCommandParameter<unknown, unknown>[] = [];

  constructor(
    private _key: string,
    private _defaultId: string,
    private _feature: TypoFeature,
    private _name: string,
    private _description: string,
    private _defaultEnabled = true
  ) {
    this._id = new ExtensionSetting(`command.${this._key}.name`, this._defaultId, this._feature);

    this._enabledSetting = new ExtensionSetting(
      `command.${this._key}.enabled`,
      this._defaultEnabled,
      this._feature,
    );
  }

  /**
   * The human-readable name of the command
   */
  public get name() {
    return this._name;
  }

  /**
   * The description of the command
   */
  public get description() {
    return this._description;
  }

  /**
   * The command ID setting, which stores the command interpreter name
   */
  public get idSetting() {
    return this._id.asFrozen;
  }

  /**
   * The enabled setting, which stores whether the command is enabled for interpretation
   */
  public get enabledSetting() {
    return this._enabledSetting.asFrozen;
  }

  /**
   * The parameters of the command
   */
  public get params() {
    return this._params;
  }

  /**
   * Interpret the command by parsing its name and passing down the source context
   * @param args
   * @param source
   * @param context
   */
  async interpret(
    args: string,
    source: object,
    context: commandExecutionContext,
  ): interpretableInterpretationResult<object, commandExecutionContext> {

    /* get command name cached from setting */
    const interpreterName = await firstValueFrom(this._id.changes$);

    /* try to interpret */
    if (args.startsWith(interpreterName)) {
      const remainder = args.substring(interpreterName.length);
      return { context, remainder, result: {} };
    }

    /* ddi not match */
    return null;
  }

  /**
   * Execute the bound action on the result of the interpretation
   * @param result
   * @param context
   */
  execute(
    result: object,
    context: commandExecutionContext,
  ): interpretableExecutionResult<object, commandExecutionContext> {
    return this._execute?.(result, context) ?? Promise.resolve({result: new InterpretableSuccess(this)});
  }

  /**
   * Set the action for the following interpretation chain
   * @param execute
   */
  public setExecute(execute: (result: object, context: commandExecutionContext) =>
    interpretableExecutionResult<object, commandExecutionContext>)
  {
    this._execute = execute;
    return this;
  }

  /**
   * Set an action for immediate execution without further interpretation
   * @param execute
   */
  public action(execute: (command: ExtensionCommand) => Promise<InterpretableResult>){
    this.setExecute(async () => {
      const response = await execute(this);
      return { result: response };
    });
    return this;
  }

  /**
   * Add arguments to the command interpretation chain using a builder
   * @param builderAction
   */
  public withParameters(builderAction: (builder: CommandParamsBuilder<object, object>) => ExtensionCommandParameter<unknown, unknown>[]){
    const builder = CommandParamsBuilder.forCommand(this);
    this._params = builderAction(builder);
    builder.build();
    return this;
  }
}