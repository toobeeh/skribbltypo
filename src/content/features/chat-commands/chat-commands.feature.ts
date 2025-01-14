import {
  ExtensionCommand
} from "@/content/core/commands/command";
import {
  type ExtensionCommandParameter,

} from "@/content/core/commands/command-parameter";
import { type CommandExecutionResult } from "@/content/core/commands/commands.service";
import { NumericCommandParameter } from "@/content/core/commands/params/numeric-command-parameter";
import {
  InterpretableArgumentParsingError
} from "@/content/core/commands/results/interpretable-argument-parsing-error";
import { InterpretableDeferResult } from "@/content/core/commands/results/interpretable-defer-result";
import { InterpretableCommandPartialMatch } from "@/content/core/commands/results/interpretable-command-partial-match";
import { InterpretableEmptyRemainder } from "@/content/core/commands/results/interpretable-empty-remainder";
import { InterpretableError } from "@/content/core/commands/results/interpretable-error";
import { InterpretableSuccess } from "@/content/core/commands/results/interpretable-success";
import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { Subject, type Subscription, switchMap, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import CommandPreview from "./command-preview.svelte";

export class ChatCommandsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public readonly name = "Chat Commands";
  public readonly description = "Execute actions of other features with chat commands";
  public readonly featureId = 38;

  private _interpreterSubscription?: Subscription;
  private _submitSubscription?: Subscription;
  private _chatEvents = new Subject();
  private _hotkeySubmitted = new Subject();
  private _commandResults = new Subject<CommandExecutionResult[]>();
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

  private readonly _submitCommandHotkey = this.useHotkey(
    new HotkeyAction(
      "submit_command",
      "Submit Command",
      "When pressed, the currently typed command will be submitted",
      this,
      async () => {
        const elements = await this._elements.complete();
        elements.chatInput.value = "";
        this._hotkeySubmitted.next(undefined);
        this._chatEvents.next(undefined);
      },
      true,
      ["Enter"],
    ),
  );

  private readonly _testCommand = this.useCommand(
    new ExtensionCommand("add", "add", this, "Add Numbers", "Adds two numbers and outputs the result"),
  ).withParameters((params) =>
    params
      .addParam(new NumericCommandParameter("a", "The first number", (a) => ({ a })))
      .addParam(new NumericCommandParameter("b", "The second number", (b) => ({ b })))
      .run(async (result, command) => {
        return new InterpretableSuccess(command, `The sum is ${result.a + result.b}`);
      }),
  );

  /**
   * chat received input
   */
  async handleInputEvent() {
    this._chatEvents.next(undefined);
  }

  inputChangeListener = this.handleInputEvent.bind(this);

  protected override async onActivate() {
    /* add handler for arrow up/down */
    const elements = await this._elements.complete();
    elements.chatInput.addEventListener("input", this.inputChangeListener);

    this._interpreterSubscription = this._chatEvents
      .pipe(
        withLatestFrom(this._commandsService.commands$),
        switchMap(async ([, commands]) => {
          const text = elements.chatInput.value;

          if (text.startsWith("/")) {
            const args = text.substring(1);
            return Promise.all(
              commands.map(async (command) => this._commandsService.executeCommand(command, args)),
            );
          } else {
            return [];
          }
        }),
      )
      .subscribe((results) => {
        this.setFlyoutState(results.length > 0, elements);
        this._commandResults.next(results);
        this._logger.debug("Command results", results);
      });

    this._submitSubscription = this._hotkeySubmitted
      .pipe(withLatestFrom(this._commandResults))
      .subscribe(async ([, results]) => {
        this._logger.info("Commands submitted", results);

        const match = results.find((result) => result.result instanceof InterpretableSuccess);
        if(match !== undefined && match.result instanceof InterpretableSuccess){

          if(match.result instanceof InterpretableDeferResult){
            const toast = await this._toastService.showLoadingToast(`Command: ${match.context.command.name}`);
            const result = await match.result.run();
            toast.resolve(result.message);
          }
          else {
            if(match.result.message) await this._toastService.showToast(`${match.result.message}`);
            else await this._toastService.showToast(`${match.context.command.name}`);
          }
        }
        else {
          await this._toastService.showToast("No valid command entered");
        }
      });
  }

  protected override async onDestroy() {
    const elements = await this._elements.complete();
    elements.chatInput.removeEventListener("change", this.inputChangeListener);
    this._interpreterSubscription?.unsubscribe();
    this._interpreterSubscription = undefined;
    this._submitSubscription?.unsubscribe();
    this._submitSubscription = undefined;
    this.setFlyoutState(false, elements);
  }

  public get commandResultStore() {
    return fromObservable(this._commandResults, []);
  }

  public get submitHotkeyStorage(){
    return this._submitCommandHotkey.comboSetting.store;
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
      this._flyoutComponent = undefined;
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
    if (result.context.currentInterpretedParameter === param) return true;

    if (result.result instanceof InterpretableEmptyRemainder) {
      const currentIndex = result.context.parameters.findIndex(
        (param) => param === result.context.currentInterpretedParameter,
      );
      return currentIndex > 0 && result.context.parameters[currentIndex - 1] === param;
    }

    if (result.result instanceof InterpretableError) {
      return result.result.interpretable === param;
    }

    return false;
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