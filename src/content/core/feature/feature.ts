import type { featureBinding } from "@/content/core/feature/featureBinding";
import { HotkeysService } from "@/content/core/hotkeys/hotkeys.service";
import { ExtensionSetting } from "@/content/core/settings/setting";
import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import type { componentData } from "@/content/services/modal/modal.service";
import { inject, injectable, postConstruct } from "inversify";
import type { SvelteComponent } from "svelte";
import { loggerFactory } from "../logger/loggerFactory.interface";

@injectable()
export abstract class TypoFeature {

  protected readonly featureEnabledDefault: boolean = true;

  /**
   * Services that are bound to the lifecycle of the feature with init/reset methods
   * @protected
   */
  protected get boundServices(): featureBinding[] { return []; }

  private _isActivatedSetting = new ExtensionSetting<boolean>("isActivated", this.featureEnabledDefault, this);

  private _isActivated = false;
  private _isRun = false;
  private _hotkeys: HotkeyAction[] = [];

  public abstract readonly name: string;
  public abstract readonly description: string;
  public readonly toggleEnabled: boolean = true;

  protected useHotkey(action: HotkeyAction) {
    this._hotkeys.push(action);
    return action;
  }

  /**
   * All configured hotkeys for this feature
   */
  public get hotkeys(): readonly HotkeyAction[] {
    return this._hotkeys;
  }

  /**
   * A component to display feature customization settings
   */
  public get featureSettingsComponent(): componentData<SvelteComponent> | undefined {
    return undefined;
  }

  /**
   * A component to display feature information or tutorial
   */
  public get featureInfoComponent(): componentData<SvelteComponent> | undefined {
    return undefined;
  }

  public get hasDetailComponents() {
    return this.hotkeys.length > 0 || this.featureSettingsComponent !== undefined || this.featureInfoComponent !== undefined;
  }

  /**
   * unique feature ID, to store settings
   */
  public abstract readonly featureId: number;

  protected onRun(): Promise<void> | void {
    this._logger.debug("onRun not implemented");
  }
  protected onFreeze(): Promise<void> | void {
    this._logger.debug("onFreeze not implemented");
  }

  protected onActivate(): Promise<void> | void {
    this._logger.debug("onActivate not implemented");
  }
  protected onDestroy(): Promise<void> | void {
    this._logger.debug("onDestroy not implemented");
  };

  protected readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(HotkeysService) protected readonly _hotkeysService: HotkeysService
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  public init() {
    this._isActivatedSetting.setDefaultValue(this.featureEnabledDefault); // derived class properties are not earlier available!
    this._isActivatedSetting.getValue().then((value) => {
      this._logger.debug("Feature loaded with activation state", value);
      if(value) this.activate();
    });
  }

  /**
   * Run the feature.
   * The feature needs to be activated before running.
   */
  public async run() {
    if(!this._isActivated) {
      this._logger.warn("Attempted to activate feature without activation");
      throw new Error("Feature is not activated");
    }

    if(this._isRun) {
      this._logger.warn("Attempted to run feature while already running");
      throw new Error("Feature is already running");
    }

    this._logger.info("Running feature");
    const run = this.onRun();
    if(run instanceof Promise) await run;

    this._isRun = true;
  }

  /**
   * Freeze the feature.
   * The feature needs to be activated before freezing.
   * A frozen feature can be activated again.
   */
  public async freeze() {
    if(!this._isActivated) {
      this._logger.warn("Attempted to freeze feature without activation");
      throw new Error("Feature is not activated");
    }

    if(!this._isRun) {
      this._logger.warn("Attempted to freeze feature while not running");
      throw new Error("Feature is not running");
    }

    this._logger.info("Freezing feature");
    const freeze = this.onFreeze();
    if(freeze instanceof Promise) await freeze;

    this._isRun = false;
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

    const run = this.onRun();
    if(run instanceof Promise) await run;
    this._isRun = true;

    /* register hotkeys */
    if(this._hotkeys.length !== 0) {
      this._logger.debug("Registering feature hotkeys", this._hotkeys);
      this._hotkeys.forEach((hotkey) => this._hotkeysService.registerHotkey(hotkey));
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

    const freeze = this.onFreeze();
    if(freeze instanceof Promise) await freeze;
    this._isRun = false;

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
  }

  public get state() {
    return this._isActivated ? (this._isRun ? "running" : "frozen") : "destroyed";
  }

  public get activated$() {
    return this._isActivatedSetting.changes$;
  }
}