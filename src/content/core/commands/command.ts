import { CommandParamsBuilder } from "@/content/core/commands/builder/command-params-builder";
import type { ExtensionCommandParameter } from "@/content/core/commands/command-parameter";
import {
  type Interpretable,
  type interpretableExecutionResult,
  type interpretableInterpretationResult,
} from "@/content/core/commands/interpretable";
import { InterpretableDeferResult } from "@/content/core/commands/results/interpretable-defer-result";
import { InterpretableCommandPartialMatch } from "@/content/core/commands/results/interpretable-command-partial-match";
import { InterpretableResult } from "@/content/core/commands/results/interpretable-result";
import { InterpretableSuccess } from "@/content/core/commands/results/interpretable-success";
import { type TypoFeature } from "@/content/core/feature/feature";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { firstValueFrom } from "rxjs";

/**
 * A context for command and parameter execution
 * Describing the state of the current interpretation chain
 */
export interface commandExecutionContext {

  /**
   * The command that initiated the interpretable chain
   */
  command: ExtensionCommand;

  /**
   * All parameters in the interpretable chain
   */
  parameters: ExtensionCommandParameter<unknown, unknown>[];

  /**
   * The parameter that is currently being interpreted, null if execution has thrown an error
   */
  currentInterpretedParameter?: ExtensionCommandParameter<unknown, unknown>;
}

export class ExtensionCommand implements Interpretable<object, object, commandExecutionContext> {
  private _id: ExtensionSetting<string>;
  private _enabledSetting: ExtensionSetting<boolean>;
  private _execute?: (
    result: object,
    context: commandExecutionContext,
  ) => interpretableExecutionResult<object, commandExecutionContext>;
  private _params: ExtensionCommandParameter<unknown, unknown>[] = [];

  constructor(
    private _defaultId: string,
    private _feature: TypoFeature,
    private _name: string,
    private _description: string,
    private _defaultEnabled = true,
  ) {
    this._id = new ExtensionSetting(`command.${this._defaultId}.name`, this._defaultId, this._feature);

    this._enabledSetting = new ExtensionSetting(
      `command.${this._defaultId}.enabled`,
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
   * The default ID of the command
   */
  public get defaultId() {
    return this._defaultId;
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

    /* if partial match */
    if (args.length > 0 && interpreterName.startsWith(args)) {
      throw new InterpretableCommandPartialMatch(this);
    }

    /* did not match, signalize refused interpretation */
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
    return (
      this._execute?.(result, context) ??
      Promise.resolve({ result: new InterpretableSuccess(this) })
    );
  }

  /**
   * Set the action for the following interpretation chain
   * @param execute
   */
  public setExecute(
    execute: (
      result: object,
      context: commandExecutionContext,
    ) => interpretableExecutionResult<object, commandExecutionContext>,
  ) {
    this._execute = execute;
    return this;
  }

  /**
   * Set an action for immediate execution without further interpretation
   * @param run
   */
  public run(run: (command: ExtensionCommand) => Promise<InterpretableResult>) {
    this.setExecute(async () => {
      /* signalize command interpreted successfully, and provide run function for command invocation */
      const response = new InterpretableDeferResult(this, undefined, () => run(this));
      return { result: response };
    });
    return this;
  }

  /**
   * Add arguments to the command interpretation chain using a builder
   * @param builderAction
   */
  public withParameters(
    builderAction: (
      builder: CommandParamsBuilder<object, object>,
    ) => ExtensionCommandParameter<unknown, unknown>[],
  ) {
    const builder = CommandParamsBuilder.forCommand(this);
    this._params = builderAction(builder);
    builder.build();
    return this;
  }
}