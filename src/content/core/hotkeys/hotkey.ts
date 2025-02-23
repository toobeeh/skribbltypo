import type { TypoFeature } from "@/content/core/feature/feature";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { map, of, switchMap, take, tap, withLatestFrom } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

export class HotkeyAction {

  private _enabledSetting: ExtensionSetting<boolean>;
  private _comboSetting: ExtensionSetting<string[]>;
  private _onceListeners: (() => (void | Promise<void>))[] = [];

  constructor(
    private _key: string,
    private _name: string,
    private _description: string,
    private _feature: TypoFeature | undefined,
    private _action: () => (void | Promise<void>),
    defaultEnabled?: boolean,
    private _defaultCombo?: string[],
    private _releaseAction?: () => (void | Promise<void>),
    private _preventWhenInputActive = true
  ) {
    this._enabledSetting = new ExtensionSetting(
      `hotkey.${this._key}.enabled`,
      defaultEnabled === true && this._defaultCombo !== undefined && this._defaultCombo.length > 0,
      this._feature
    );

    this._comboSetting = new ExtensionSetting(
      `hotkey.${this._key}.combo`,
      this._defaultCombo ?? [],
      this._feature
    );
  }

  public get disabledOnInputs(){
    return this._preventWhenInputActive;
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

  public once(action: () => (void | Promise<void>)) {
    this._onceListeners.push(action);
  }

  /**
   * checks if a key combination is active and matches, and executes if positive
   * return observable holds the result, if executed or not
   * @param keys a combination of key codes, see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
   * @param inputActive
   */
  public executeIfMatches(keys: string[], inputActive: boolean) {
    return this._enabledSetting.changes$.pipe(
      take(1),
      switchMap(enabled => {
        if(!enabled) return of(false);

        return this._comboSetting.changes$.pipe(
          take(1),
          map((combo) => !(this._preventWhenInputActive && inputActive) && combo.length > 0 ? combo : null),
          map(combo => combo ? combo.length === keys.length && combo.every(key => keys.includes(key)) : false),
        );
      }),
      switchMap(matches => {
        if(!matches) return of(false);
        const result = this._action();

        const onceListeners = [...this._onceListeners];
        this._onceListeners = [];
        const results = onceListeners.map(listener => listener());
        results.push(result);

        return Promise.all(results);
      })
    );
  }

  /**
   * Release the hotkey action if the current combo does not match the given keys
   * will also release if the hotkey is disabled
   * @param keys
   */
  public releaseIfNotMatches(keys: string[]) {
    return this._comboSetting.changes$.pipe(
      take(1),
      map(combo => combo ? combo.length === keys.length && combo.every(key => keys.includes(key)) : false),
      switchMap(matches => {
        if(matches) return of(false);
        if(this._releaseAction) {
          const result = this._releaseAction();
          return result instanceof Promise ? fromPromise(result).pipe(map(() => true)) : of(true);
        }
        return of(true);
      })
    );
  }
}