import type { TypoFeature } from "@/content/core/feature/feature";
import { typoRuntime } from "@/content/core/runtime/runtime";
import type { componentData } from "@/content/services/modal/modal.service";
import { fromObservable } from "@/util/store/fromObservable";
import { BehaviorSubject, from, of, switchMap } from "rxjs";
import BooleanSettingInput from "@/lib/settings/boolean-setting-input.svelte";
import NumericSettingInput from "@/lib/settings/numeric-setting-input.svelte";
import ChoiceSettingInput from "@/lib/settings/choice-setting-input.svelte";
import TextSettingInput from "@/lib/settings/text-setting-input.svelte";
import ColorHexSettingInput from "@/lib/settings/color-hex-setting-input.svelte";
import type { SvelteComponent } from "svelte";

export type primitive = string | number | boolean;
export type serializable = undefined | primitive | serializable[] | { [key: string]: serializable };

export type serializableObject = Record<string, serializable>;

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
    const string = await typoRuntime.getSetting(this.globalKey);
    if(string === undefined || string === null) return this.defaultValue;
    const value = JSON.parse(string) as TValue;

    /* update cached value */
    this._changes.next(value);

    return value;
  }

  public async setValue(value: TValue) {
    const json = JSON.stringify(value);
    await typoRuntime.writeSetting(this.globalKey, json);
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
      switchMap((data) => data === null ? from(this.getValue()) : of(data))
    );
  }

  public get store() {
    return fromObservable(this.changes$, this.defaultValue, value => this.setValue(value), false);
  }

  public get asFrozen(): Omit<ExtensionSetting<TValue>, "withDescription" | "withName">{
    return this;
  }
}

export abstract class SettingWithInput<TSetting extends serializable> extends ExtensionSetting<TSetting> {
  public abstract get componentData(): componentData<SvelteComponent<{setting: ExtensionSetting<TSetting>}>>;
}

export class BooleanExtensionSetting extends SettingWithInput<boolean> {
  public override get componentData()  {
    return {
      componentType: BooleanSettingInput,
      props: { setting: this }
    };
  }
}

export class TextExtensionSetting extends SettingWithInput<string> {
  public override get componentData()  {
    return {
      componentType: TextSettingInput,
      props: { setting: this }
    };
  }
}

export class HexColorExtensionSetting extends SettingWithInput<string> {
  public override get componentData()  {
    return {
      componentType: ColorHexSettingInput,
      props: { setting: this }
    };
  }
}

export class NumericExtensionSetting extends SettingWithInput<number> {

  private _min?: number;
  private _max?: number;
  private _sliderWithSteps?: number;

  public override get componentData()  {
    return {
      componentType: NumericSettingInput,
      props: {
        setting: this,
        withSliderAndSteps: this._sliderWithSteps,
        bounds: this._min !== undefined && this._max !== undefined ? {min: this._min, max: this._max} : undefined
      }
    };
  }

  public withBounds(min: number, max: number) {
    this._min = min;
    this._max = max;
    return this;
  }

  public withSlider(steps = 1) {
    this._sliderWithSteps = steps;
    return this;
  }
}

export class ChoiceExtensionSetting<TChoice extends string> extends SettingWithInput<TChoice> {
  private _choices: { choice: TChoice, name: string }[] = [];

  public override get componentData() {
    return {
      componentType: ChoiceSettingInput,
      props: {
        setting: this,
        choices: this._choices
      },
    };
  }

  public withChoices(choices: { choice: TChoice, name: string }[]) {
    this._choices = choices;
    return this;
  }
}