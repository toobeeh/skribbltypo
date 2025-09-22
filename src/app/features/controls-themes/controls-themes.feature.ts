import {type ThemeListingDto } from "@/api";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { ExtensionSetting } from "@/app/core/settings/setting";
import { GlobalSettingsService } from "@/app/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/app/services/modal/modal.service";
import { ThemesService } from "@/app/services/themes/themes.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ApiDataSetup } from "@/app/setups/api-data/api-data.setup";
import { CssColorVarSelectorsSetup } from "@/app/setups/css-color-var-selectors/cssColorVarSelectors.setup";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import type { Color } from "@/util/color";
import { fromObservable } from "@/util/store/fromObservable";
import { generateColorScheme } from "@/util/typo/themes/colorScheme";
import { generateThemeBackgroundElement } from "@/util/typo/themes/generateThemeBackgroundElement";
import { generateStyleElementForTheme } from "@/util/typo/themes/generateThemeCssElement";
import { generateThemeExternalCssElement } from "@/util/typo/themes/generateThemeExternalCssElement";
import { generateThemeFontElements } from "@/util/typo/themes/generateThemeFontElement";
import { generateThemeCustomHtmlElement } from "@/util/typo/themes/generateThemeHtmlElement";
import { type savedTheme, type typoTheme } from "@/util/typo/themes/theme";
import { inject } from "inversify";
import { BehaviorSubject, combineLatestWith, map, Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import ControlsThemes from "./controls-themes.svelte";

export class ControlsThemesFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(CssColorVarSelectorsSetup) private readonly _cssColorVarSelectorsSetup!: CssColorVarSelectorsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(ThemesService) private readonly _themesService!: ThemesService;
  @inject(GlobalSettingsService) private readonly _globalSettingsService!: GlobalSettingsService;

  public readonly name = "Themes";
  public readonly description =
    "Customize the skribbl.io appearance with pre-made themes or your own style";
  public readonly tags = [
    FeatureTag.INTERFACE
  ];
  public readonly featureId = 34;

  private readonly _onboardingTask = this.useOnboardingTask({
    key: "theme_activated",
    name: "Activate a theme",
    description: "Select a theme to customize the style of skribbl.",
    start: () => this.openThemesPopup()
  });

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _themeResetSubscription?: Subscription;
  private _currentThemeSubscription?: Subscription;
  private _activeThemeTab$ = new BehaviorSubject<"editor" | "list" | "browser">("list");
  private _themeElements: HTMLElement[] = [];
  private _variableHooks?: Record<string, string[]>;

  private readonly _importedOldThemes = new ExtensionSetting<boolean>("imported_old_themes", false, this);
  private readonly _importedOldThemes2 = new ExtensionSetting<boolean>("imported_old_themes2", false, this);

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    this._variableHooks = await this._cssColorVarSelectorsSetup.complete();

    /* create icon and attach to controls */
    this._iconComponent = new IconButton({
      target: elements.controls,
      props: {
        hoverMove: false,
        size: "48px",
        icon: "file-img-themes-gif",
        name: "Themes",
        order: 3,
        tooltipAction: this.createTooltip
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      this.openThemesPopup();
    });

    /* Switch to original/no theme when invalid theme detected */
    this._themeResetSubscription = this._themesService.savedThemesSetting.changes$.pipe(
      combineLatestWith(this._themesService.activeThemeSetting.changes$)
    ).subscribe(([themes, activeId]) => {
      if(!themes.some(t => t.theme.meta.id === activeId)) this._themesService.activeThemeSetting.setValue(0);
    });

    /* change theme elements when active theme changed */
    this._currentThemeSubscription = this._themesService.activeThemeSetting.changes$.pipe(
      withLatestFrom(this._themesService.savedThemesSetting.changes$),
      map(([activeId, themes]) => activeId === 0 ? undefined : themes.find(t => t.theme.meta.id === activeId)?.theme),
      combineLatestWith(this._themesService.loadedEditorTheme$),
      map(([activeTheme, loadedTheme]) => (loadedTheme?.theme ?? activeTheme))
    ).subscribe(theme => {
      this._logger.debug("Active theme changed", theme);
      this.setThemeElements(theme);
    });

    /* remove in future versions when compatibility not anymore needed */
    await this.importOldTypoThemes();
  }

  protected override async onDestroy(): Promise<void> {
    this._iconComponent?.$destroy();
    this._iconClickSubscription?.unsubscribe();
    this._iconClickSubscription = undefined;
    this._themeResetSubscription?.unsubscribe();
    this._themeResetSubscription = undefined;
    this._currentThemeSubscription?.unsubscribe();
    this._currentThemeSubscription = undefined;
    await this.setThemeElements(undefined);
    this._variableHooks = undefined;
  }

  private openThemesPopup(){
    if(!this._variableHooks) throw new Error("Themes feature not activated?");
    const themesComponent: componentData<ControlsThemes> = {
      componentType: ControlsThemes,
      props: {
        feature: this,
        variableHooks: this._variableHooks
      },
    };
    this._modalService.showModal(themesComponent.componentType, themesComponent.props, "Typo Themes");
  }

  public get savedThemesStore() {
    return this._themesService.savedThemesSetting.store;
  }

  public get activeThemeStore() {
    return this._themesService.activeThemeSetting.store;
  }

  public get loadedEditorThemeStore(){
    return this._themesService.loadedEditorThemeStore;
  }

  public get activeThemeTabStore() {
    return fromObservable(this._activeThemeTab$, this._activeThemeTab$.value, value => this._activeThemeTab$.next(value));
  }

  public get devmodeStore() {
    return this._globalSettingsService.settings.devMode.store;
  }

  public async getOnlineThemes() {
    return (await this._apiDataSetup.complete()).themes;
  }

  public async loadThemeToEditor(theme: savedTheme){
    const toast = await this._toastService.showLoadingToast("Loading theme to editor");
    try {
      await this._themesService.loadThemeToEditor(theme);
      toast.resolve(`Theme ${theme.theme.meta.name} loaded`);
    }
    catch {
      toast.reject("Failed to load theme");
    }
  }

  public updateLoadedEditorTheme(theme: savedTheme){
    this._themesService.updateLoadedEditorTheme(theme);
  }

  public async discardLoadedEditorTheme(removeThemeId?: number){
    if(removeThemeId !== undefined)  {
      if(! await(await this._toastService.showConfirmToast("Do you want to discard & remove the theme?", undefined, 10000, {confirm: "Remove theme", cancel: "Keep editing"})).result){
        this._logger.info("User canceled theme removal");
        return;
      }
    }

    else {
      if(! await(await this._toastService.showConfirmToast("Do you want to discard the changes?", undefined, 10000, {confirm: "Discard changes", cancel: "Keep editing"})).result){
        this._logger.info("User canceled theme discarding");
        return;
      }
    }

    await this._themesService.unloadThemeFromEditor();

    if(removeThemeId !== undefined)  {
      const toast = await this._toastService.showLoadingToast("Removing theme");
      try {
        const theme = await this._themesService.removeSavedTheme(removeThemeId);
        toast.resolve(`Theme ${theme.theme.meta.name} removed`);
      }
      catch {
        toast.reject("Failed to remove theme");
      }
    }

    else {
      await this._toastService.showToast("Theme unloaded from editor");
    }
  }

  public async createLocalTheme(){
    const toast = await this._toastService.showLoadingToast("Creating new theme");
    try {
      const theme = await this._themesService.createLocalTheme();
      toast.resolve("New theme created");
      return theme;
    }
    catch(e) {
      toast.reject("Failed to create theme");
      throw e;
    }
  }

  public async importOldTypoThemes(){
    try {

      /* OLD old themes, compatibility mode */
      const oldThemes = localStorage.getItem("themes");
      if(!(await this._importedOldThemes.getValue()) && oldThemes !== null) {
        const oldThemesObject = JSON.parse(oldThemes);
        if (!Array.isArray(oldThemesObject)) throw new Error("invalid themes data");
        for (const theme of oldThemesObject) {
          try {
            await this.importOldTheme(theme);
          } catch(e) {
            this._logger.error("Failed to import old typo theme", e);
          }
        }
        await this._importedOldThemes.setValue(true);
      }

      /* themes saved in previous typo version */
      const oldThemes2 = localStorage.getItem("themesv2");
      if(!(await this._importedOldThemes2.getValue()) && oldThemes2 !== null){
        const oldThemes2Object = JSON.parse(oldThemes2);
        if(!Array.isArray(oldThemes2Object)) throw new Error("invalid themes data");
        for(const theme of oldThemes2Object){
          try {
            await this._themesService.importThemeFromString(JSON.stringify(theme));
          }
          catch(e) {
            this._logger.error("Failed to import old typo theme", e);
          }
        }
        await this._importedOldThemes2.setValue(true);
      }
    }
    catch(e) {
      this._logger.error("Failed to import old typo themes", e);
      throw e;
    }
  }

  public async importOldTheme(oldTheme: object){
    try {
      if(typeof oldTheme !== "object") throw new Error("Invalid theme data");
      const oldThemeKeys = new Map(Object.entries(oldTheme));
      const options = oldThemeKeys.get("options");
      const name = oldThemeKeys.get("name");
      if(typeof options !== "object") throw new Error("Invalid theme options");
      if(typeof name !== "string") throw new Error("Invalid theme name");

      if(name === "Original") {
        this._logger.info("Skipping original theme");
        return;
      }
      await this._themesService.importOldTheme(options, name);
    }
    catch(e) {
      throw e;
    }
  }

  public async saveLoadedEditorTheme(){
    const toast = await this._toastService.showLoadingToast("Saving theme changes");
    try {
      const theme = await this._themesService.saveLoadedEditorTheme();
      toast.resolve(`Theme ${theme.theme.meta.name} updated`);
      return theme;
    }
    catch(e) {
      toast.reject("Failed to create theme");
      throw e;
    }
  }

  public async savePublicTheme(theme: ThemeListingDto){
    const toast = await this._toastService.showLoadingToast("Saving theme");
    try {
      const localTheme = await this._themesService.savePublicTheme(theme);
      toast.resolve(`Theme ${localTheme.theme.meta.name} saved`);
    }
    catch {
      toast.reject("Failed to save theme");
    }
  }

  public async activateLocalTheme(id: number){
    const toast = await this._toastService.showLoadingToast("Activating theme");
    try {
      const theme = await this._themesService.activateLocalTheme(id);
      (await this._onboardingTask).complete();
      toast.resolve(`Theme ${theme.theme.meta.name} activated`);
    }
    catch {
      toast.reject("Failed to activate theme");
    }
  }

  public async activatePublicTheme(theme: ThemeListingDto){
    const toast = await this._toastService.showLoadingToast("Activating theme");
    try {
      const localTheme = await this._themesService.activatePublicTheme(theme);
      (await this._onboardingTask).complete();
      toast.resolve(`Theme ${localTheme.theme.meta.name} activated`);
    }
    catch {
      toast.reject("Failed to activate theme");
    }
  }

  public async removeSavedTheme(localId: number){

    if(! await(await this._toastService.showConfirmToast("Do you want to delete the theme?", undefined, 10000, {confirm: "Delete theme", cancel: "Cancel deletion"})).result){
      this._logger.info("User canceled theme removal");
      return;
    }

    const toast = await this._toastService.showLoadingToast("Removing theme");
    try {
      const theme = await this._themesService.removeSavedTheme(localId);
      toast.resolve(`Theme ${theme.theme.meta.name} removed`);
    }
    catch {
      toast.reject("Failed to remove theme");
    }
  }

  public async shareTheme(theme: typoTheme){
    const toast = await this._toastService.showLoadingToast("Sharing theme");
    try {
     const id = await this._themesService.shareTheme(theme);
     await navigator.clipboard.writeText(id);
     toast.resolve(`Share id (${id}) for theme ${theme.meta.name} copied`);
    }
    catch {
      toast.reject("Failed to share theme");
    }
  }

  public async importTheme(shareId: string){
    const toast = await this._toastService.showLoadingToast("Importing theme");
    try {
      const theme = await this._themesService.importTheme(shareId);
      toast.resolve(`Theme ${theme.theme.meta.name} imported`);
      return theme;
    }
    catch(e) {
      toast.reject("Failed to import theme");
      throw e;
    }
  }

  /**
   * Update the html elements that represent the selelcted theme
   * @param theme
   * @private
   */
  private async setThemeElements(theme: typoTheme | undefined){
    this._logger.info("Setting theme elements", theme);

    this._themeElements.forEach(e => e.remove());
    this._themeElements = theme ? await this.createThemeElements(theme) : [];
    this._themeElements.forEach(e => document.body.appendChild(e));
  }

  /**
   * Create html elements to display a theme
   * @param theme
   * @private
   */
  private async createThemeElements(theme: typoTheme){
    const selectorHooks = await this._cssColorVarSelectorsSetup.complete();
    const themeStyle = generateStyleElementForTheme(theme, selectorHooks);
    const themeFont = generateThemeFontElements(theme);
    const themeHtml = generateThemeCustomHtmlElement(theme);
    const themeExternalCss = generateThemeExternalCssElement(theme);
    const themeBackground = generateThemeBackgroundElement(theme);
    return [themeStyle, ...themeFont, ...themeHtml, ...themeExternalCss, themeBackground];
  }

  /**
   * Generate a color scheme based on parameters and fill the color variables accordingly
   * @param theme
   * @param primary
   * @param text
   * @param useOnInputs
   * @param invertInputText
   * @param useIngame
   */
  public async setColorScheme(theme: typoTheme, primary: Color, text: Color, useOnInputs: boolean, invertInputText: boolean, useIngame: boolean){
    this._logger.debug("Setting color scheme", theme, primary, text, useOnInputs, invertInputText, useIngame);
    const colors = generateColorScheme(primary, text, useIngame, useOnInputs, invertInputText);
    theme.colors = colors;

    await this._toastService.showToast("Color scheme updated");
  }
}