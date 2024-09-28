import { inject, injectable } from "inversify";
import { loggerFactory } from "../logger/loggerFactory.interface";

@injectable()
export abstract class TypoFeature {

  private _isActivated = false;
  private is_Run = false;

  public abstract readonly name: string;
  public abstract readonly description: string;

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
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  /**
   * Run the feature.
   * The feature needs to be activated before running.
   */
  public run() {
    if(!this._isActivated) {
      this._logger.warn("Attempted to activate feature without activation");
      throw new Error("Feature is not activated");
    }

    if(this.is_Run) {
      this._logger.warn("Attempted to run feature while already running");
      throw new Error("Feature is already running");
    }

    this._logger.info("Running feature");
    this.onRun();
  }

  /**
   * Freeze the feature.
   * The feature needs to be activated before freezing.
   * A frozen feature can be activated again.
   */
  public freeze() {
    if(!this._isActivated) {
      this._logger.warn("Attempted to freeze feature without activation");
      throw new Error("Feature is not activated");
    }

    if(!this.is_Run) {
      this._logger.warn("Attempted to freeze feature while not running");
      throw new Error("Feature is not running");
    }

    this._logger.info("Freezing feature");
    this.onFreeze();
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

    const activate = this.onActivate();
    if(activate instanceof Promise) await activate;

   const run = this.onRun();
   if(run instanceof Promise) await run;
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

    const destroy = this.onDestroy();
    if(destroy instanceof Promise) await destroy;
  }
}