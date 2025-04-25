import { FeatureTag } from "@/app/core/feature/feature-tags";
import type { featureBinding } from "@/app/core/feature/featureBinding";
import { ExtensionSetting, type serializable } from "@/app/core/settings/setting";
import { ColorsService, type pickerColors } from "@/app/services/colors/colors.service";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { Color } from "@/util/color";
import { createElement } from "@/util/document/appendElement";
import {type Subscription, } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import ColorPalettesInfo from "./drawing-color-palettes-info.svelte";
import ColorPalettesManage from "./drawing-color-palettes-manage.svelte";
import ColorPalettePicker from "./color-palette-picker.svelte";
import  {defaultPalettes} from "@/app/features/drawing-color-palettes/default-palettes";

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
  @inject(ColorsService) private readonly _colorsService!: ColorsService;

  public readonly name = "Color Palettes";
  public readonly description = "Use custom color palettes instead of the default skribbl colors";
  public readonly tags = [FeatureTag.DRAWING];
  public readonly featureId = 32;

  protected override get boundServices(): featureBinding[] {
    return [this._colorsService];
  }

  public override get featureInfoComponent(): componentData<ColorPalettesInfo> {
    return { componentType: ColorPalettesInfo, props: {} };
  }

  public override get featureManagementComponent(): componentData<ColorPalettesManage> {
    return { componentType: ColorPalettesManage, props: { feature: this } };
  }

  private readonly _hideOriginalPaletteStyle = createElement(`<style>
    #game #game-toolbar .colors:has(.top) {
      display: none;
    }
  </style>`);
  private readonly _importedPalettes = new ExtensionSetting<boolean>(
    "imported_palettes",
    false,
    this,
  );

  private _activePaletteSubscription?: Subscription;
  private _colorPalettePicker?: ColorPalettePicker;

  protected override async onActivate() {
    this._activePaletteSubscription = this._colorsService.pickerColors$.subscribe((palette) =>
      this.updatePaletteStyle(palette),
    );

    /* import old palettes. remove in a future version after grace period */
    if (!(await this._importedPalettes.getValue())) {
      try {
        const savedPalettes = this.parseSavedOldTypoPalettes().filter(
          (p) => p.name !== "sketchfulPalette",
        );
        for (const palette of savedPalettes) {
          await this._colorsService.savePalette(palette);
        }
        this._logger.info("Imported old typo palettes", savedPalettes);
        await this._importedPalettes.setValue(true);
      } catch {}
    }
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
  private async updatePaletteStyle(colors: pickerColors | undefined) {
    this._logger.info("Updating palette style", colors);

    this._colorPalettePicker?.$destroy();
    if (colors === undefined) {
      this._hideOriginalPaletteStyle.remove();
      return;
    }

    const elements = await this._elementsSetup.complete();

    if (this._hideOriginalPaletteStyle.parentElement === null)
      document.body.appendChild(this._hideOriginalPaletteStyle);
    this._colorPalettePicker = new ColorPalettePicker({
      target: elements.skribblToolbar,
      anchor: elements.colorContainer,
      props: {
        feature: this,
        colors,
      },
    });
  }

  /**
   * Remove a palette from the settings
   * @param name
   */
  public async removePalette(name: string) {
    this._logger.info(`Removing palette ${name}`);

    if (
      !(await (
        await this._toastService.showConfirmToast(
          `Do you want to remove the palette ${name}?`,
          undefined,
          10000,
          { confirm: "Delete palette", cancel: "Cancel deletion" },
        )
      ).result)
    ) {
      this._logger.info(`User canceled removal of palette ${name}`);
      return;
    }

    const toast = await this._toastService.showLoadingToast(`Removing palette ${name}`);

    try {
      await this._colorsService.removePalette(name);
    } catch (e) {
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
      if (
        typeof palette.name !== "string" ||
        typeof palette.columns !== "number" ||
        !Array.isArray(palette.colorHexCodes) ||
        !palette.colorHexCodes.every((c: unknown) => typeof c === "string")
      ) {
        this._logger.error("Invalid palette format", palette);
        throw new Error("Invalid palette format");
      }

      return palette;
    } catch (e) {
      this._logger.error("Failed to parse palette from json", e);
      this._toastService.showToast(
        "Failed to read palette",
        "Invalid palette format. Check the JSON data!",
      );
      throw e;
    }
  }

  public parseSavedOldTypoPalettes(): palette[] {
    this._logger.info("Parsing saved old typo palette");

    try {
      const data = localStorage.getItem("customPalettes");
      if (data === null) return [];

      const palettes = JSON.parse(data);
      if (!Array.isArray(palettes)) throw new Error("Palette data is not an array");

      const parsed: palette[] = [];
      palettes.forEach((p: unknown) => {
        if (typeof p !== "object" || p === null) throw new Error("Palette is not an object");
        const map = new Map(Object.entries(p));
        const name = map.get("name");
        const colors = map.get("colors");
        const rowCount = map.get("rowCount");
        if (typeof name !== "string" || !Array.isArray(colors) || typeof rowCount !== "number")
          throw new Error("Palette is missing properties");

        const mappedColors: Color[] = [];
        for (const color of colors) {
          if (typeof color !== "object") throw new Error("Color data is not a object");
          const map = new Map(Object.entries(color));
          const rgb = map.get("color");
          if (typeof rgb !== "string") throw new Error("Color is not a string");
          mappedColors.push(Color.fromRgbString(rgb));
        }

        parsed.push({
          name,
          columns: rowCount,
          colorHexCodes: mappedColors.map((c) => c.hex),
        });
      });

      return parsed;
    } catch (e) {
      this._logger.error("Failed to parse saved old typo palette", e);
      return [];
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

    if (palette.colorHexCodes.length === 0) {
      this._logger.error(`Palette ${palette.name} has no colors`);
      toast.reject(`Palette ${palette.name} has no colors`);
      return;
    }

    if (palette.name.trim() === "") {
      this._logger.error("Palette has no name set");
      toast.reject("Palette has no name set");
      return;
    }

    if (palette.columns < 1) {
      this._logger.error(`Palette ${palette.name} has less than 1 column`);
      toast.reject(`Palette ${palette.name} cannot have less than 1 column`);
      return;
    }

    try {
      await this._colorsService.savePalette(palette, overwrite);
    } catch (e) {
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

    const toast = await this._toastService.showLoadingToast(
      `Exporting palette ${palette.name} to clipboard`,
    );

    try {
      const json = JSON.stringify(palette);
      await navigator.clipboard.writeText(json);
    } catch (e) {
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
  public setColor(colorHex: string) {
    this._logger.info(`Setting color to ${colorHex}`);
    const color = Color.fromHex(colorHex);
    this._drawingService.setColor(color.skribblCode);
  }

  public get savedPalettesStore() {
    return this._colorsService.savedPalettesSetting.store;
  }

  public get activePaletteStore() {
    return this._colorsService.activePaletteSetting.store;
  }

  public get defaultPalettes() {
    return defaultPalettes;
  }
}