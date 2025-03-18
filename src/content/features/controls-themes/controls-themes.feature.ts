import {type ThemeListingDto } from "@/api";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ThemesService } from "@/content/services/themes/themes.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { CssColorVarSelectorsSetup } from "@/content/setups/css-color-var-selectors/cssColorVarSelectors.setup";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
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

  public async unloadThemeFromEditor(){
    await this._themesService.unloadThemeFromEditor();
    await this._toastService.showToast("Theme unloaded from editor");
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

  public async importOldTheme(theme: string){
    const toast = await this._toastService.showLoadingToast("Converting old theme..");
    try {

      const oldTheme = JSON.parse(theme);
      const newTheme = await this._themesService.importOldTheme(oldTheme.options, oldTheme.name);
      toast.resolve("Old theme convert");
      return newTheme;
    }
    catch(e) {
      toast.reject("Failed to convert theme");
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

    if(! await(await this._toastService.showConfirmToast("Do you want to delete the theme?")).result){
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