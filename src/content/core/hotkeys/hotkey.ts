import type { TypoFeature } from "@/content/core/feature/feature";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { map, of, switchMap, take, withLatestFrom } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

export class HotkeyAction {

  private _enabledSetting: ExtensionSetting<boolean>;
  private _comboSetting: ExtensionSetting<string[]>;

  constructor(
    private _key: string,
    private _name: string,
    private _description: string,
    private _feature: TypoFeature,
    private _action: () => (void | Promise<void>),
    defaultEnabled?: boolean,
    private _defaultCombo?: string[],
  ) {
    this._enabledSetting = new ExtensionSetting(`
    hotkey.${this._key}.enabled`,
      defaultEnabled === true && this._defaultCombo !== undefined && this._defaultCombo.length > 0,
      this._feature
    );

    this._comboSetting = new ExtensionSetting(
      `hotkey.${this._key}.combo`,
      this._defaultCombo ?? [],
      this._feature
    );
  }

  public get name() {
    return this._name;
  }

  public get description() {
    return this._description;
  }

  public get enabledSetting() {
    return this._enabledSetting.asFrozen;
  }

  public get comboSetting() {
    return this._comboSetting.asFrozen;
  }

  public get defaultCombo(): readonly string[] | undefined {
    return this._defaultCombo;
  }

  /**
   * checks if a key combination is active and matches, and executes if positive
   * return observable holds the result, if executed or not
   * @param keys a combination of key codes, see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
   */
  public executeIfMatches(keys: string[]) {
    return this._enabledSetting.changes$.pipe(
      take(1),
      withLatestFrom(this._comboSetting.changes$),
      map(([enabled, combo]) => enabled && combo.length > 0 ? combo : null),
      map(combo => combo ? combo.length === keys.length && combo.every(key => keys.includes(key)) : false),
      switchMap(matches => {
        if(!matches) return of(false);
        const result = this._action();
        return result instanceof Promise ? fromPromise(result).pipe(map(() => true)) : of(null);
      })
    );
  }
}