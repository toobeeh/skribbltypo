import type { ExtensionCommand } from "@/content/core/commands/command";
import { CommandsService } from "@/content/core/commands/commands.service";
import type { featureBinding } from "@/content/core/feature/featureBinding";
import { HotkeysService } from "@/content/core/hotkeys/hotkeys.service";
import {
  BooleanExtensionSetting, type serializable, SettingWithInput,
} from "@/content/core/settings/setting";
import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { type tooltipParams, TooltipsService } from "@/content/core/tooltips/tooltips.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { inject, injectable, postConstruct } from "inversify";
import type { SvelteComponent } from "svelte";
import type { Action } from "svelte/action";
import { loggerFactory } from "../logger/loggerFactory.interface";

export type tooltipAction = Action<HTMLElement, tooltipParams, object>;

@injectable()
export abstract class TypoFeature {

  protected readonly featureEnabledDefault: boolean = true;

  /**
   * Services that are bound to the lifecycle of the feature with init/reset methods
   * @protected
   */
  protected get boundServices(): featureBinding[] { return []; }

  private _isActivated = false;
  private _hotkeys: HotkeyAction[] = [];
  private _settings: SettingWithInput<serializable>[] = [];
  private _commands: ExtensionCommand[] = [];

  public abstract readonly name: string;
  public abstract readonly description: string;
  public readonly toggleEnabled: boolean = true;
  public readonly developerFeature: boolean = false;

  private _isActivatedSetting = new BooleanExtensionSetting("isActivated", this.featureEnabledDefault, this)
      .withName("Activated")
      .withDescription("Enable or disable the feature. Disabled features will reset and remove every functionality, mods and hotkeys.");

  /**
   * Add a hotkey to the user accessible hotkey configuration
   * @param action
   * @protected
   */
  protected useHotkey(action: HotkeyAction) {
    this._hotkeys.push(action);
    return action;
  }

  /**
   * Add a command to the feature command configuration
   * @param command
   * @protected
   */
  protected useCommand(command: ExtensionCommand) {
    this._commands.push(command);
    return command;
  }

  /**
   * Add a setting to the user accessible setting configuration
   * @param setting
   * @protected
   */
  protected useSetting<TSetting extends serializable>(
    setting: SettingWithInput<TSetting>){
    this._settings.push(setting as unknown as SettingWithInput<serializable>); /* what's wrong with polymorphism here? */

    return setting;
  }

  /**
   * All configured hotkeys for this feature
   */
  public get hotkeys(): readonly HotkeyAction[] {
    return this._hotkeys;
  }

  public get settings(): readonly SettingWithInput<serializable>[] {
    return this._settings;
  }

  public get commands(): readonly ExtensionCommand[] {
    return this._commands;
  }

  /**
   * A component to display feature customization settings
   */
  public get featureManagementComponent(): componentData<SvelteComponent> | undefined {
    return undefined;
  }

  /**
   * A component to display feature information or tutorial
   */
  public get featureInfoComponent(): componentData<SvelteComponent> | undefined {
    return undefined;
  }

  public get hasDetailComponents() {
    return this.hotkeys.length > 0 ||
      this.commands.length > 0 ||
      this.featureManagementComponent !== undefined ||
      this.featureInfoComponent !== undefined ||
      this._settings.length > 0;
  }

  /**
   * unique feature ID, to store settings
   */
  public abstract readonly featureId: number;

  protected postConstruct(): Promise<void> | void {
    this._logger.debug("onConstruct not implemented");
  };

  protected onActivate(): Promise<void> | void {
    this._logger.debug("onActivate not implemented");
  }
  protected onDestroy(): Promise<void> | void {
    this._logger.debug("onDestroy not implemented");
  };

  protected readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(HotkeysService) protected readonly _hotkeysService: HotkeysService,
    @inject(TooltipsService) protected readonly _tooltipsService: TooltipsService,
    @inject(CommandsService) protected readonly _commandsService: CommandsService
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  public init() {
    this._isActivatedSetting.setDefaultValue(this.featureEnabledDefault); // derived class properties are not earlier available!

    const loadActivation = () => {
      this._isActivatedSetting.getValue().then((value) => {
        this._logger.debug("Feature loaded with activation state", value);
        if(value) this.activate();
      });
    };

    const postConstruct = this.postConstruct();
    if(postConstruct instanceof Promise) postConstruct.then(loadActivation);
    else loadActivation();
  }

  /**
   * Activate the feature.
   * The feature will be activated and run.
   */
  public async activate() {
    if(this._isActivated) {
      this._logger.warn("Attempted to activate feature while already activated");
      throw new Error("Feature is already activated");
    }

    this._logger.info("Activating feature");

    /* init bound services */
    await Promise.all(this.boundServices.map((service) => service.onFeatureActivate()));

    const activate = this.onActivate();
    if(activate instanceof Promise) await activate;
    this._isActivated = true;
    await this._isActivatedSetting.setValue(true);

    /* register hotkeys */
    if(this._hotkeys.length !== 0) {
      this._logger.debug("Registering feature hotkeys", this._hotkeys);
      this._hotkeys.forEach((hotkey) => this._hotkeysService.registerHotkey(hotkey));
    }

    /* register commands */
    for(const command of this._commands) {
      this._commandsService.registerCommand(command);
    }
  }

  /**
   * Destroy the feature.
   * The feature will be frozen and destroyed.
   * To re-run the feature, it needs to be activated again.
   */
  public async destroy() {
    if(!this._isActivated) {
      this._logger.warn("Attempted to destroy feature without activation");
      throw new Error("Feature is not activated");
    }

    this._logger.info("Destroying feature");

    const destroy = this.onDestroy();
    if(destroy instanceof Promise) await destroy;
    this._isActivated = false;
    await this._isActivatedSetting.setValue(false);

    /* reset bound services */
    await Promise.all(this.boundServices.map((service) => service.onFeatureDestroy()));

    /* remove hotkeys */
    if(this._hotkeys.length !== 0) {
      this._logger.debug("Removing feature hotkeys", this._hotkeys);
      this._hotkeys.forEach((hotkey) => this._hotkeysService.removeHotkey(hotkey));
    }

    /* deregister commands */
    for(const command of this._commands) {
      this._commandsService.removeCommand(command);
    }
  }

  public get activated$() {
    return this._isActivatedSetting.changes$;
  }

  private registerTooltip(node: HTMLElement, params: tooltipParams) {
    this._logger.debug("Registering tooltip", node, params);
    this._tooltipsService.registerTooltip(node, params, this);
  }

  public get createTooltip(): tooltipAction {
    return (node, params) => {
      this.registerTooltip(node, params);

      /* when action updated, re-register tooltip */
      return {
        update: (params: tooltipParams) => {
          this.registerTooltip(node, params);
        }
      };
    };
  }
}