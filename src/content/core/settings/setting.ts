import type { TypoFeature } from "@/content/core/feature/feature";
import { fromObservable } from "@/util/store/fromObservable";
import { BehaviorSubject, of, switchMap } from "rxjs";

type serializable = string | number | boolean | null | serializable[] | { [key: string]: serializable };

export class ExtensionSetting<TValue extends serializable> {

  private _name?: string;
  private _description?: string;
  private _changes = new BehaviorSubject<TValue | null>(null);

  constructor(
    private readonly key: string,
    private defaultValue: TValue,
    private readonly feature?: TypoFeature
  ) {
    this.feature = feature;
  }

  private get globalKey() {
    const sanitized = this.key.replace(/[^a-zA-Z0-9.]/g, "_");
    return this.feature ?
      `feature_${this.feature.featureId}.${sanitized}` :
      `global.${sanitized}`;
  }

  public async getValue(): Promise<TValue> {
    const string = await chrome.runtime.sendMessage({ type: "get setting", key: this.globalKey });
    if(string === undefined || string === null) return this.defaultValue;
    const value = JSON.parse(string) as TValue;
    return value;
  }

  public async setValue(value: TValue) {
    const json = JSON.stringify(value);
    await chrome.runtime.sendMessage({ type: "set setting", key: this.globalKey, value: json });
    this._changes.next(value);
  }

  public get name() {
    return this._name;
  }

  public get description() {
    return this._description;
  }

  public setDefaultValue(value: TValue) {
    this.defaultValue = value;
  }

  public withName(name: string) {
    this._name = name;
    return this;
  }

  public withDescription(description: string) {
    this._description = description;
    return this;
  }

  public get changes$() {
    return this._changes.pipe(
      switchMap((data) => data === null ? this.getValue() : of(data))
    );
  }

  public get store() {
    return fromObservable(this.changes$, this.defaultValue);
  }

  public get asFrozen(): Omit<ExtensionSetting<TValue>, "withDescription" | "withName">{
    return this;
  }
}