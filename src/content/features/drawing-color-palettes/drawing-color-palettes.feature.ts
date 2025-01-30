import { ExtensionSetting, type serializable } from "@/content/core/settings/setting";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { Color } from "@/util/color";
import { createElement } from "@/util/document/appendElement";
import { combineLatestWith, distinctUntilChanged, map, type Subscription, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import ColorPalettesInfo from "./drawing-color-palettes-info.svelte";
import ColorPalettesManage from "./drawing-color-palettes-manage.svelte";
import ColorPalettePicker from "./color-palette-picker.svelte";
import  {defaultPalettes} from "@/content/features/drawing-color-palettes/default-palettes";

export interface palette {
  name: string;
  columns: number;
  colorHexCodes: string[];
  [key: string]: serializable;  /* needed to pass as serializable */
}

export class DrawingColorPalettesFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  public readonly name = "Color Palettes";
  public readonly description = "Use custom color palettes instead of the default skribbl colors";
  public readonly featureId = 32;

  public override get featureInfoComponent(): componentData<ColorPalettesInfo>{
    return { componentType: ColorPalettesInfo, props: {}};
  }

  public override get featureManagementComponent(): componentData<ColorPalettesManage>{
    return {componentType: ColorPalettesManage, props: { feature: this }};
  }

  private _savedPalettesSetting = new ExtensionSetting<palette[]>("saved_palettes", [], this)
      .withName("Auto Focus Chat Input")
      .withDescription("Automatically focus the chat input when someone else starts drawing");

  private _activePaletteSetting = new ExtensionSetting<string | undefined>("active_palette", undefined, this)
      .withName("Active Palette")
      .withDescription("The name of the currently active palette");

  private readonly _hideOriginalPaletteStyle = createElement(`<style>
    #game #game-toolbar .colors:has(.top) {
      display: none;
    }
  </style>`);

  private _activePaletteSubscription?: Subscription;
  private _colorPalettePicker?: ColorPalettePicker;

  protected override async onActivate() {
    this._activePaletteSubscription = this._activePaletteSetting.changes$.pipe(
      combineLatestWith(this._savedPalettesSetting.changes$),

      /* if changed and active does not exist, update current  to undefined */
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
    ).subscribe(palette => this.updatePaletteStyle(palette));
  }

  protected override async onDestroy() {
    this._hideOriginalPaletteStyle.remove();
    this._activePaletteSubscription?.unsubscribe();
    this._activePaletteSubscription = undefined;
    this._colorPalettePicker?.$destroy();
  }

  /**
   * Change the visibility of the default palette or custom palette
   * @param palette
   * @private
   */
  private async updatePaletteStyle(palette: palette | undefined){
    this._logger.info("Updating palette style", palette);

    this._colorPalettePicker?.$destroy();
    if(palette === undefined){
      this._hideOriginalPaletteStyle.remove();
      return;
    }

    const elements = await this._elementsSetup.complete();

    if(this._hideOriginalPaletteStyle.parentElement === null) document.body.appendChild(this._hideOriginalPaletteStyle);
    this._colorPalettePicker = new ColorPalettePicker({
      target: elements.skribblToolbar,
      anchor: elements.colorContainer,
      props: {
        feature: this,
        palette
      }
    });
  }

  /**
   * Remove a palette from the settings
   * @param name
   */
  public async removePalette(name: string) {
    this._logger.info(`Removing palette ${name}`);

    const toast = await this._toastService.showLoadingToast(`Removing palette ${name}`);
    const palettes = await this._savedPalettesSetting.getValue();
    const index = palettes.findIndex(p => p.name === name);
    if(index === -1) {
      this._logger.error(`Palette with name ${name} does not exist`);
      toast.reject(`Palette with name ${name} does not exist`);
      return;
    }

    try {
      palettes.splice(index, 1);
      await this._savedPalettesSetting.setValue(palettes);
    }
    catch (e) {
      this._logger.error(`Failed to remove palette ${name}`, e);
      toast.reject(`Failed to remove palette ${name}`);
      return;
    }

    toast.resolve();
  }

  /**
   * Parse a palette from a json string
   * @param json
   */
  public parsePalette(json: string): palette {
    this._logger.info("Parsing palette from json", json);

    try {
      const palette = JSON.parse(json);
      if(typeof palette.name !== "string" || typeof palette.columns !== "number" || !Array.isArray(palette.colorHexCodes)
      || ! palette.colorHexCodes.every((c: unknown) => typeof c === "string")) {
        this._logger.error("Invalid palette format", palette);
        throw new Error("Invalid palette format");
      }

      return palette;
    }
    catch(e) {
      this._logger.error("Failed to parse palette from json", e);
      this._toastService.showToast("Failed to read palette", "Invalid palette format. Check the JSON data!");
      throw e;
    }
  }

  /**
   * Save a palette to the settings, or overwrite with given name
   * @param palette
   * @param overwrite
   */
  public async savePalette(palette: palette, overwrite: string | undefined = undefined) {
    this._logger.info(`Saving palette ${palette.name}`, palette);

    const toast = await this._toastService.showLoadingToast(`Saving palette ${palette.name}`);

    if(palette.colorHexCodes.length === 0) {
      this._logger.error(`Palette ${palette.name} has no colors`);
      toast.reject(`Palette ${palette.name} has no colors`);
      return;
    }

    if(palette.name.trim() === "") {
      this._logger.error("Palette has no name set");
      toast.reject("Palette has no name set");
      return;
    }

    if(palette.columns < 1) {
      this._logger.error(`Palette ${palette.name} has less than 1 column`);
      toast.reject(`Palette ${palette.name} cannot have less than 1 column`);
      return;
    }

    let palettes = await this._savedPalettesSetting.getValue();
    if(palettes.some(p => p.name === palette.name && p.name !== overwrite)) {
      this._logger.error(`Palette with name ${palette.name} already exists`);
      toast.reject(`Palette with name ${palette.name} already exists`);
      return;
    }

    try {
      palettes = palettes.filter(p => p.name !== overwrite);
      palettes.push(palette);
      await this._savedPalettesSetting.setValue(palettes);
    }
    catch (e) {
      this._logger.error(`Failed to save palette ${palette.name}`, e);
      toast.reject(`Failed to save palette ${palette.name}`);
      return;
    }

    toast.resolve();
  }

  /**
   * Copy the json of a palette to the clipboard
   * @param palette
   */
  public async exportPalette(palette: palette) {
    this._logger.info(`Exporting palette ${palette.name} to clipboard`, palette);

    const toast = await this._toastService.showLoadingToast(`Exporting palette ${palette.name} to clipboard`);

    try {
      const json = JSON.stringify(palette);
      await navigator.clipboard.writeText(json);
    }
    catch(e) {
      this._logger.error(`Failed to export palette ${palette.name} to clipboard`, e);
      toast.reject(`Failed to export palette ${palette.name} to clipboard`);
      return;
    }

    toast.resolve();
  }

  /**
   * Set the color of the skribbl tool
   * @param colorHex
   */
  public setColor(colorHex: string){
    this._logger.info(`Setting color to ${colorHex}`);
    const color = Color.fromHex(colorHex);
    this._drawingService.setColor(color.skribblCode);
  }

  public get savedPalettesStore() {
    return this._savedPalettesSetting.store;
  }

  public get activePaletteStore() {
    return this._activePaletteSetting.store;
  }

  public get defaultPalettes() {
    return defaultPalettes;
  }
}