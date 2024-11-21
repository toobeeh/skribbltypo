import { ExtensionSetting, type serializable } from "@/content/core/settings/setting";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { createElement } from "@/util/document/appendElement";
import { map, type Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import ColorPalettesInfo from "./drawing-color-palettes-info.svelte";
import ColorPalettesManage from "./drawing-color-palettes-manage.svelte";
import ColorPalettePicker from "./color-palette-picker.svelte";

export interface palette {
  name: string;
  columns: number;
  colorHexCodes: string[];
  [key: string]: serializable;  /* needed to pass as serializable */
}

export class DrawingColorPalettesFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ToastService) private readonly _toastService!: ToastService;

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
    .colors :is(.top, .bottom) {
      display: none;
    }
  </style>`);

  private _activePaletteSubscription?: Subscription;
  private _colorPalettePicker?: ColorPalettePicker;

  protected override async onActivate() {
    this._activePaletteSubscription = this._activePaletteSetting.changes$.pipe(
      withLatestFrom(this._savedPalettesSetting.changes$),
      map(([activePalette, savedPalettes]) => activePalette !== undefined ? savedPalettes.find(p => p.name === activePalette) : undefined)
    ).subscribe(palette => this.updatePaletteStyle(palette));
  }

  protected override async onDestroy() {
    this._hideOriginalPaletteStyle.remove();
    this._activePaletteSubscription?.unsubscribe();
    this._activePaletteSubscription = undefined;
    this._colorPalettePicker?.$destroy();
  }

  private async updatePaletteStyle(palette: palette | undefined){
    this._logger.info("Updating palette style", palette);

    if(palette === undefined){
      if(this._hideOriginalPaletteStyle.parentNode === undefined) document.body.appendChild(this._hideOriginalPaletteStyle);
      this._colorPalettePicker?.$destroy();
      return;
    }

    const elements = await this._elementsSetup.complete();

    this._hideOriginalPaletteStyle.remove();
    this._colorPalettePicker = new ColorPalettePicker({
      target: elements.colorContainer,
      props: {
        palette
      }
    });
  }

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

  public get savedPalettesStore() {
    return this._savedPalettesSetting.store;
  }
}