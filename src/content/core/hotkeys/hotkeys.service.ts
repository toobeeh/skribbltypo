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

  public registerHotkey(hotkey: HotkeyAction) {
    if(this._registeredHotkeys.includes(hotkey)) {
      this._logger.warn("Attempted to register a hotkey that was already registered", hotkey);
      return;
    }

    this._registeredHotkeys.push(hotkey);
    this._logger.debug("Registered hotkey", hotkey);
  }

  public removeHotkey(hotkey: HotkeyAction) {
    const lengthBefore = this._registeredHotkeys.length;
    this._registeredHotkeys = this._registeredHotkeys.filter(h => h !== hotkey);
    if (lengthBefore === this._registeredHotkeys.length) {
      this._logger.warn("Attempted to remove a hotkey that was not registered", hotkey);
    }

    this._logger.debug("Removed hotkey", hotkey);
  }

  public executeHotkeys(keys: string[]) {
    return forkJoin(this._registeredHotkeys.map(h =>
      h.executeIfMatches(keys).pipe(
        map(executed => ({ hotkey: h, executed }))
      )
    ));
  }
}