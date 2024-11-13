import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { inject, injectable } from "inversify";
import { forkJoin, map } from "rxjs";

@injectable()
export class HotkeysService {

  private readonly _logger;
  private _registeredHotkeys: HotkeyAction[] = [];

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  /**
   * Register a hotkey to be executed when the combo is pressed
   * @param hotkey
   */
  public registerHotkey(hotkey: HotkeyAction) {
    if(this._registeredHotkeys.includes(hotkey)) {
      this._logger.warn("Attempted to register a hotkey that was already registered", hotkey);
      return;
    }

    this._registeredHotkeys.push(hotkey);
    this._logger.debug("Registered hotkey", hotkey);
  }

  /**
   * Remove a hotkey from the registered hotkeys; will no longer be listened for
   * @param hotkey
   */
  public removeHotkey(hotkey: HotkeyAction) {
    const lengthBefore = this._registeredHotkeys.length;
    this._registeredHotkeys = this._registeredHotkeys.filter(h => h !== hotkey);
    if (lengthBefore === this._registeredHotkeys.length) {
      this._logger.warn("Attempted to remove a hotkey that was not registered", hotkey);
    }

    this._logger.debug("Removed hotkey", hotkey);
  }

  /**
   * Execute all registered hotkeys that match the given keys
   * @param keys
   */
  public executeHotkeys(keys: string[]) {
    return forkJoin(this._registeredHotkeys.map(h =>
      h.executeIfMatches(keys).pipe(
        map(executed => ({ hotkey: h, executed }))
      )
    ));
  }

  /**
   * Set the hotkey combo for a hotkey action
   * @param hotkey
   * @param value
   */
  public async setHotkeyCombo(hotkey: HotkeyAction, value: string[]){
    try {
      if(value.length === 0){
        this._logger.debug("Saving empty hotkey combo; disabling hotkey");
        await hotkey.enabledSetting.setValue(false);
      }
      await hotkey.comboSetting.setValue(value);
    }
    catch (e) {
      this._logger.error("Error updating hotkey combo", e);
      throw e;
    }

    this._logger.info("Updated hotkey combo", hotkey.name, value);
  }

  /**
   * Resets the hotkey combo to the default value
   * @param hotkey
   */
  public async resetHotkeyCombo(hotkey: HotkeyAction){
    try {
      await hotkey.comboSetting.setValue([...hotkey.defaultCombo ?? []]);
      if(hotkey.defaultCombo === undefined || hotkey.defaultCombo.length === 0){
        this._logger.debug("Resetting hotkey combo to empty; disabling hotkey");
        await hotkey.enabledSetting.setValue(false);
      }
    }
    catch (e) {
      this._logger.error("Error updating hotkey combo", e);
      throw e;
    }

    this._logger.info("Reset hotkey combo", hotkey.name);
    return [...hotkey.defaultCombo ?? []];
  }
}