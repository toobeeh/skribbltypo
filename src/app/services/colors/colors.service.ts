import type { featureBinding } from "@/app/core/feature/featureBinding";
import { FeaturesService } from "@/app/core/feature/features.service";
import { ExtensionSetting, type serializable } from "@/app/core/settings/setting";
import { defaultPalettes } from "@/app/features/drawing-color-palettes/default-palettes";
import { DrawingColorPalettesFeature } from "@/app/features/drawing-color-palettes/drawing-color-palettes.feature";
import { ToastService } from "@/app/services/toast/toast.service";
import { inject, injectable } from "inversify";
import { BehaviorSubject, combineLatestWith, distinctUntilChanged, map, tap } from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

export interface palette extends pickerColors {
  name: string;
  [key: string]: serializable;  /* needed to pass as serializable */
}

export interface pickerColors {

  /** the amount of columns the available colors will be divided */
  columns: number,

  /** the preferred width of the color display; eg if 2 columns should be stretched to the width of 4 columns */
  preferredColumnWidth?: number

  /** the color hex codes to display */
  colorHexCodes: string[]
}

@injectable()
export class ColorsService implements featureBinding {

  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(FeaturesService) private readonly _featuresService!: FeaturesService;

  private readonly _logger;

  private _savedPalettesSetting = new ExtensionSetting<palette[]>("colors_saved_palettes", []);
  private _activePaletteSetting = new ExtensionSetting<string | undefined>("colors_active_palette", undefined);

  private _selectedPalette$ = new BehaviorSubject<palette | undefined>(undefined);
  private _pickerColors$ = new BehaviorSubject<pickerColors | undefined>(undefined);
  private _colorSelector$ = new BehaviorSubject<((palette: palette | undefined) => (pickerColors | undefined)) | undefined>(undefined);

  private featureActive = false;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);

    this._activePaletteSetting.changes$.pipe(
      combineLatestWith(this._savedPalettesSetting.changes$),

      /* if changed and active does not exist, update current to undefined */
      tap(([activePalette, savedPalettes]) => {
        if(activePalette !== undefined && ![...savedPalettes, ...Object.values(defaultPalettes)]
          .some(p => p.name === activePalette)) {
          this._activePaletteSetting.setValue(undefined);
        }
      }),
      map(([activePalette, savedPalettes]) => activePalette !== undefined ?
        [...savedPalettes, ...Object.values(defaultPalettes)].find(p => p.name === activePalette) :
        undefined
      ),
      distinctUntilChanged()
    ).subscribe(palette => this._selectedPalette$.next(palette));

    this._selectedPalette$.pipe(
      combineLatestWith(this._colorSelector$),
      map(([palette, selector]) => selector ? selector(palette) : palette),
    ).subscribe(colors => this._pickerColors$.next(colors));
  }

  /**
   * Selected palette or undefined if default skribbl palette
   */
  public get selectedPalette$() {
    return this._selectedPalette$.asObservable();
  }

  /**
   * Colors to show in the picker or undefined to show default skribbl colors
   */
  public get pickerColors$() {
    return this._pickerColors$.asObservable();
  }

  public get activePaletteSetting() {
    return this._activePaletteSetting.asFrozen;
  }

  public get savedPalettesSetting() {
    return this._savedPalettesSetting.asFrozen;
  }

  public async removePalette(name: string){
    this._logger.debug(`Removing palette ${name}`);

    const palettes = await this._savedPalettesSetting.getValue();
    const index = palettes.findIndex(p => p.name === name);
    if(index === -1) {
      this._logger.error(`Palette with name ${name} does not exist`);
      throw new Error(`Palette with name ${name} does not exist`);
    }

    palettes.splice(index, 1);
    await this._savedPalettesSetting.setValue(palettes);
  }

  public async savePalette(palette: palette, overwrite: string | undefined = undefined) {
    this._logger.debug(`Saving palette ${palette.name}`, palette);

    let palettes = await this._savedPalettesSetting.getValue();
    if(palettes.some(p => p.name === palette.name && p.name !== overwrite)) {
      this._logger.error(`Palette with name ${palette.name} already exists`);
      throw new Error(`Palette with name ${palette.name} already exists`);
    }

    palettes = palettes.filter(p => p.name !== overwrite);
    palettes.push(palette);
    await this._savedPalettesSetting.setValue(palettes);
  }

  public async setColorSelector(selector: (palette: palette | undefined) => (pickerColors | undefined)){
    if(!this.featureActive) {
      this._logger.error("Attempted to save palette while feature is not active");
      const handle = await this._toastService.showConfirmToast("Attempted to modify color palette, feature disabled.", "Do you want to enable the palettes feature?", 5000, {confirm: "Enable", cancel: "Cancel"});
      const result = await handle.result;
      if(result) await this._featuresService.activateFeature(DrawingColorPalettesFeature);
    }

    this._colorSelector$.next(selector);
  }

  public resetColorSelector(){
    this._colorSelector$.next(undefined);
  }

  public get colorSelectorActive(){
    return this._colorSelector$.value === undefined;
  }

  async onFeatureActivate(): Promise<void> {
    this.featureActive = true;
  }

  async onFeatureDestroy(): Promise<void> {
    this.featureActive = false;
  }

}