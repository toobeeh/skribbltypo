import { ExtensionCommand } from "@/content/core/commands/command";
import {
  type ExtensionCommandParameter,

} from "@/content/core/commands/command-parameter";
import { type CommandExecutionResult } from "@/content/core/commands/commands.service";
import { StringCommandParameter } from "@/content/core/commands/params/string-command-parameter";
import {
  InterpretableArgumentParsingError
} from "@/content/core/commands/results/interpretable-argument-parsing-error";
import { InterpretableDeferResult } from "@/content/core/commands/results/interpretable-defer-result";
import { InterpretableCommandPartialMatch } from "@/content/core/commands/results/interpretable-command-partial-match";
import { InterpretableEmptyRemainder } from "@/content/core/commands/results/interpretable-empty-remainder";
import { InterpretableError } from "@/content/core/commands/results/interpretable-error";
import { InterpretableSilentSuccess } from "@/content/core/commands/results/interpretable-silent-success";
import { InterpretableSuccess } from "@/content/core/commands/results/interpretable-success";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { TextExtensionSetting } from "@/content/core/settings/setting";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { filter, Subject, type Subscription, switchMap, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import CommandPreview from "./command-preview.svelte";
import CommandInput from "./command-input.svelte";

export class ChatCommandsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public readonly name = "Chat Commands";
  public readonly description = "Execute actions of other features with chat commands";
  public readonly tags = [
    FeatureTag.GAMEPLAY
  ];
  public readonly featureId = 38;

  private _interpreterSubscription?: Subscription;
  private _submitSubscription?: Subscription;
  private _commandArgs$ = new Subject<string>();
  private _hotkeySubmitted$ = new Subject();
  private _commandResults$ = new Subject<CommandExecutionResult[]>();
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;
  private _commandInput?: CommandInput;
  private readonly _inputChangeListener = this.handleInputEvent.bind(this);

  private readonly _submitCommandHotkey = this.useHotkey(
    new HotkeyAction(
      "submit_command",
      "Submit Command",
      "When pressed, the currently typed command will be submitted",
      this,
      async () => {
        /* only process when interpreting */
        if(!this._flyoutComponent) return;
        const elements = await this._elements.complete();
        elements.chatInput.value = "";
        this._hotkeySubmitted$.next(undefined);
      },
      true,
      ["Enter"],
      undefined,
      false
    ),
  );

  private readonly _customPrefixSetting = this.useSetting(
    new TextExtensionSetting("custom_prefix", "", this)
      .withName("Custom Command Prefix")
      .withDescription("Set a custom prefix for chat commands that will trigger the command prompt, additionally to ' / '")
  );

  private readonly _echoCommand = this.useCommand(
    new ExtensionCommand("echo", this, "Echo", "Echo a text :)"),
  ).withParameters(params => params
    .addParam(new StringCommandParameter("text", "The text to echo", text => ({text})))
    .run(async ({text}, command) => {
          return new InterpretableSuccess(command, text);
    })
  );

  protected override async onActivate() {

    const elements = await this._elements.complete();
    elements.chatInput.addEventListener("input", this._inputChangeListener);

    /* listen for new command arguments, interpret them and set flyout state */
    this._interpreterSubscription = this._commandArgs$
      .pipe(
        withLatestFrom(this._commandsService.commands$),
        switchMap(async ([args, commands]) => {

          /* command is still being entered */
          if (args.startsWith("/")) {
            args = args.substring(1);
            return Promise.all(
              commands.map(async (command) => this._commandsService.executeCommand(command, args)),
            );
          }

          /* / has been deleted, close input */
          else {
            this._commandInput?.$destroy();
            this._commandInput = undefined;
            elements.chatInput.focus();
            return [];
          }
        }),
      )
      .subscribe((results) => {
        this._logger.debug("Command results changed", results);
        this.setFlyoutState(results.length > 0, elements);
        const sorted = [...results]
          .sort((a, b) => {
            const aIsSuccess = a.result instanceof InterpretableSuccess;
            const bIsSuccess = b.result instanceof InterpretableSuccess;

            if (aIsSuccess === bIsSuccess) return 0;
            return aIsSuccess ? -1 : 1;
          });
        this._commandResults$.next(sorted);
      });

    /**
     * execute interpreted command on hotkey submission
     */
    this._submitSubscription = this._hotkeySubmitted$
      .pipe(
        withLatestFrom(this._commandResults$, this._commandArgs$),
        filter(([, , args]) => args.startsWith("/")),
      )
      .subscribe(async ([, results]) => this.commandSubmitted(results));
  }

  protected override async onDestroy() {
    const elements = await this._elements.complete();
    elements.chatInput.removeEventListener("input", this._inputChangeListener);
    this._interpreterSubscription?.unsubscribe();
    this._interpreterSubscription = undefined;
    this._submitSubscription?.unsubscribe();
    this._submitSubscription = undefined;
    this._commandInput?.$destroy();
    this._commandInput = undefined;
    this.setFlyoutState(false, elements);
  }

  public get commandResultStore() {
    return fromObservable(this._commandResults$, []);
  }

  public get submitHotkeyStore(){
    return this._submitCommandHotkey.comboSetting.store;
  }

  /**
   * chat received input
   * check if starts with / and show command input instead
   */
  async handleInputEvent(event: Event ) {
    const target = event.currentTarget as HTMLInputElement | null;
    const customPrefix = await this._customPrefixSetting.getValue();
    if(target !== null && (target.value === "/" || customPrefix !== "" && target.value === customPrefix)){
      await this.switchToCommandMode();
    }
  }

  /**
   * Hide the original chat input and open the command input
   * @private
   */
  private async switchToCommandMode() {
    const elements = await this._elements.complete();
    elements.chatInput.value = "";
    elements.chatInput.dispatchEvent(new Event("input"));
    if(!this._commandInput){
      this._commandInput = new CommandInput({
        target: elements.chatForm,
        props: {
          onInput: (args: string) => this._commandArgs$.next(args),
        },
      });
      this._commandArgs$.next("/");
    }
  }

  /**
   * Callback when the command submit hotkey has been pressed
   * Check interpretation results and run valid command
   * @param interpretationResults
   */
  public async commandSubmitted(interpretationResults: CommandExecutionResult[]) {
    this._logger.info("Commands submitted", interpretationResults);

    this._commandInput?.$destroy();
    this._commandArgs$.next("");
    const match = interpretationResults.find((result) => result.result instanceof InterpretableSuccess);
    if(match !== undefined && match.result instanceof InterpretableSuccess){

      /* match returned an action to be executed later */
      if(match.result instanceof InterpretableDeferResult){
        const toast = await this._toastService.showLoadingToast(`Command: ${match.context.command.name}`);
        const result = await match.result.run();

        if(!(result instanceof InterpretableSilentSuccess)) toast.resolve(result.message);
        else toast.close();
      }

      /* match executed during interpretation resolution.
        should actually not be used for commands; would execute on every type event */
      else {
        if(match.result.message) await this._toastService.showToast(`${match.result.message}`);
        else if(!(match.result instanceof InterpretableSilentSuccess)) await this._toastService.showToast(`${match.context.command.name}`);
      }
    }
    else {
      await this._toastService.showToast("No valid command entered");
    }
  }

  /**
   * Create or destroy the command preview flyout
   * @param state
   * @param elements
   */
  setFlyoutState(
    state: boolean,
    elements: Awaited<ReturnType<(typeof this._elements)["complete"]>>,
  ) {
    if (state && this._flyoutComponent === undefined) {

      /* create fly out content */
      const flyoutContent: componentData<CommandPreview> = {
        componentType: CommandPreview,
        props: {
          feature: this,
        },
      };

      /* open flyout and destroy when clicked out */
      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          marginY: "2.5rem",
          title: "Command Preview",
          closeStrategy: "implicit",

        },
      });

      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
        this._logger.info("Destroyed flyout");
        this._flyoutComponent?.$destroy();
        this._flyoutSubscription?.unsubscribe();
        this._flyoutComponent = undefined;
      });
    } else if (this._flyoutComponent !== undefined && !state) {
      this._flyoutComponent.close();
    }
  }

  /**
   * Check if the parameter is currently interpreting the user input
   * @param result
   * @param param
   */
  public isActiveTypingParam(
    result: CommandExecutionResult,
    param: ExtensionCommandParameter<unknown, unknown>,
  ) {
    this._logger.debug("Checking if param is active", result, param);
    return result.context.currentInterpretedParameter === param;
  }

  /**
   * Check if the command (name) is currently interpreting the user input
   * @param result
   */
  public isActiveTypingId(result: CommandExecutionResult) {
    return result.result === undefined;
  }

  /**
   * Check if the command is currently interpreting
   * @param result
   */
  public isValidCommand(result: CommandExecutionResult) {
    return result.result instanceof InterpretableSuccess;
  }

  /**
   * Check if there are other commands that are the current execution target
   * @param result
   * @param commands
   */
  public otherHasExecutionTarget(result: CommandExecutionResult, commands: CommandExecutionResult[]) {
    const successes = commands.filter((command) => command.result instanceof InterpretableSuccess);
    return successes.length == 0 || successes[0] !== result;
  }

  /**
   * Get a human readable status message of a command interpretation context
   * @param result
   * @param hotkeys
   */
  public getResultStateMessage(result: CommandExecutionResult, hotkeys: string[]) {
    if (result.result instanceof InterpretableSuccess) {
      return `Press ${hotkeys.join(" + ")} to submit`;
    }
    if (result.result instanceof InterpretableArgumentParsingError) {
      return "The current argument is invalid";
    }
    if (result.result instanceof InterpretableCommandPartialMatch) {
      return "The command id is incomplete";
    }
    if (result.result instanceof InterpretableEmptyRemainder) {
      return "Some arguments are missing";
    }
    if (result.result instanceof InterpretableError) {
      return result.result.message;
    }
  }
}