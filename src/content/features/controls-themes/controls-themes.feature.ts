import {type ThemeListingDto, ThemesApi } from "@/api";
import { ExtensionSetting, type serializable } from "@/content/core/settings/setting";
import { ApiService } from "@/content/services/api/api.service";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
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
import { createEmptyTheme, type typoTheme } from "@/util/typo/themes/theme";
import { inject } from "inversify";
import { BehaviorSubject, combineLatestWith, map, Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import ControlsThemes from "./controls-themes.svelte";

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface serializableTheme extends typoTheme {
  [key: string]: serializable; /* needed to pass as serializable */
}

export interface savedTheme {
  [key: string]: serializable; /* needed to pass as serializable */
  theme: serializableTheme;
  savedAt: number;
  publicTheme?: {
    publicId: string;
    localVersion: number
  },
  enableManage?: boolean;
}

export class ControlsThemesFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(CssColorVarSelectorsSetup) private readonly _cssColorVarSelectorsSetup!: CssColorVarSelectorsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(ApiService) private readonly _apiService!: ApiService;
  @inject(GlobalSettingsService) private readonly _globalSettingsService!: GlobalSettingsService;

  public readonly name = "Themes";
  public readonly description =
    "Customize the skribbl.io appearance with pre-made themes or your own style";
  public readonly featureId = 34;

  private readonly _originalTheme: serializableTheme = createEmptyTheme("Mel", "Original Skribbl", 0) as serializableTheme;
  private readonly _savedThemesSetting = new ExtensionSetting<savedTheme[]>("saved_themes", [{
      theme: this._originalTheme,
      savedAt: Date.now(),
      enableManage: false
    }], this)
    .withName("Saved Themes")
    .withDescription("The themes you have saved");

  private _activeThemeSetting = new ExtensionSetting<number | undefined>("active_theme_local_id", undefined, this);

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _themeResetSubscription?: Subscription;
  private _currentThemeSubscription?: Subscription;
  private _loadedEditorTheme$ = new BehaviorSubject<savedTheme | undefined>(undefined);
  private _activeThemeTab$ = new BehaviorSubject<"editor" | "list" | "browser">("list");
  private _themeElements: HTMLElement[] = [];

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    const variableHooks = await this._cssColorVarSelectorsSetup.complete();

    /* create icon and attach to controls */
    this._iconComponent = new IconButton({
      target: elements.controls,
      props: {
        hoverMove: false,
        size: "48px",
        icon: "file-img-themes-gif",
        name: "Themes",
        order: 3,
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      const themesComponent: componentData<ControlsThemes> = {
        componentType: ControlsThemes,
        props: {
          feature: this,
          variableHooks
        },
      };
      this._modalService.showModal(themesComponent.componentType, themesComponent.props, "Typo Themes");
    });

    this._themeResetSubscription = this._savedThemesSetting.changes$.pipe(
      combineLatestWith(this._activeThemeSetting.changes$)
    ).subscribe(([themes, activeId]) => {
      if(!themes.some(t => t.theme.meta.id === activeId)) this._activeThemeSetting.setValue(0);
    });

    this._currentThemeSubscription = this._activeThemeSetting.changes$.pipe(
      withLatestFrom(this._savedThemesSetting.changes$),
      map(([activeId, themes]) => activeId === 0 ? undefined : themes.find(t => t.theme.meta.id === activeId)?.theme),
      combineLatestWith(this._loadedEditorTheme$),
      map(([activeTheme, loadedTheme]) => (loadedTheme?.theme ?? activeTheme))
    ).subscribe(theme => {
      this._logger.debug("Active theme changed", theme);
      this.setThemeElements(theme);
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconClickSubscription = undefined;
    this._iconComponent?.$destroy();
    this._themeResetSubscription?.unsubscribe();
    this._themeResetSubscription = undefined;
  }

  public get savedThemesStore() {
    return this._savedThemesSetting.store;
  }

  public get currentThemeStore() {
    return this._activeThemeSetting.store;
  }

  public async getOnlineThemes() {
    return (await this._apiDataSetup.complete()).themes;
  }

  public get devmodeStore() {
    return this._globalSettingsService.settings.devMode.store;
  }

  public get loadedEditorThemeStore(){
    return fromObservable(this._loadedEditorTheme$, this._loadedEditorTheme$.value);
  }

  public get activeThemeTabStore() {
    return fromObservable(this._activeThemeTab$, this._activeThemeTab$.value, value => this._activeThemeTab$.next(value));
  }

  public async loadThemeToEditor(theme: savedTheme){
    this._logger.info("Loading theme to editor", theme);
    const toast = await this._toastService.showLoadingToast("Loading theme to editor");

    try {
      const themes = await this._savedThemesSetting.getValue();
      const existingTheme = themes.find(t => t.theme.meta.id === theme.theme.meta.id);
      if(existingTheme === undefined){
        this._logger.warn("Theme not found", theme);
        toast.reject("Theme not found");
        return;
      }

      this._loadedEditorTheme$.next(structuredClone(theme));
      toast.resolve(`Theme ${theme.theme.meta.name} loaded`);
    }
    catch(e) {
      this._logger.error("Failed to load theme to editor", e);
      toast.reject("Failed to load theme");
    }
  }

  public updateLoadedEditorTheme(theme: savedTheme){
    this._logger.debug("Updating loaded theme", theme);

    if(this._loadedEditorTheme$.value?.theme.meta.id !== theme.theme.meta.id){
      this._logger.warn("Theme not loaded or different theme loaded", theme);
      return;
    }
    this._loadedEditorTheme$.next(structuredClone(theme));
  }

  public async unloadThemeFromEditor(){
    this._logger.info("Unloading theme from editor");
    this._loadedEditorTheme$.next(undefined);
    await this._toastService.showToast("Theme unloaded from editor");
  }

  public async createLocalTheme(){
    this._logger.info("Creating new theme");
    const toast = await this._toastService.showLoadingToast("Creating new theme");

    try {
      const elements = await this._elementsSetup.complete();
      const username = elements.inputName.value.length > 0 ? elements.inputName.value : "User";

      const theme = createEmptyTheme(username, "Untitled Theme");
      const themes = await this._savedThemesSetting.getValue();
      const newTheme: savedTheme = {
        theme: theme as serializableTheme,
        savedAt: Date.now(),
        enableManage: true
      };

      await this._savedThemesSetting.setValue([newTheme, ...themes]);
      toast.resolve("New theme created");
      return newTheme;
    }

    catch (e) {
      this._logger.error("Failed to create new theme", e);
      toast.reject("Failed to create theme");
      throw e;
    }
  }

  public async saveLoadedEditorTheme(){
    this._logger.info("Updating local theme and unloading from editor");
    const toast = await this._toastService.showLoadingToast("Saving theme");

    try {
      const editorTheme = this._loadedEditorTheme$.value;
      const themes = await this._savedThemesSetting.getValue();
      const savedTheme = themes.find(t => t.theme.meta.id === editorTheme?.theme.meta.id);
      if(editorTheme === undefined || savedTheme === undefined){
        this._logger.warn("Theme to update not found", editorTheme);
        toast.reject("Theme not found");
        return;
      }

      savedTheme.theme = editorTheme.theme;
      savedTheme.savedAt = Date.now();

      await this._savedThemesSetting.setValue([savedTheme, ...themes.filter(t => t.theme.meta.id !== savedTheme.theme.meta.id)]);
      toast.resolve(`Theme ${savedTheme.theme.meta.name} updated`);
      this._loadedEditorTheme$.next(undefined);
      await this._activeThemeSetting.setValue(savedTheme.theme.meta.id);
      return savedTheme;
    }

    catch (e) {
      this._logger.error("Failed to create new theme", e);
      toast.reject("Failed to create theme");
      throw e;
    }
  }

  public async savePublicTheme(theme: ThemeListingDto){
    this._logger.info("Saving public theme", theme);

    const toast = await this._toastService.showLoadingToast("Saving theme");
    try {
      const themeData = await  this._apiService.getApi(ThemesApi).useThemeById({id: theme.id});
      const saveData: savedTheme = {
        theme: themeData as serializableTheme,
        savedAt: Date.now(),
        publicTheme: {
          publicId: theme.id,
          localVersion: theme.version
        },
        enableManage: false
      };

      let currentThemes = await this._savedThemesSetting.getValue();

      if(currentThemes.some(t => t.publicTheme?.publicId === theme.id)){
        this._logger.warn("Theme already saved", theme);
        toast.reject("Theme already saved");
        return;
      }

      currentThemes = [saveData, ...currentThemes];
      await this._savedThemesSetting.setValue(currentThemes);
    }
    catch(e) {
      this._logger.error("Failed to save public theme", e);
      toast.reject("Failed to save theme");
      return;
    }

    toast.resolve();
  }

  public async activateLocalTheme(id: number){
    this._logger.info("Activating local theme", id);

    const toast = await this._toastService.showLoadingToast("Activating theme");
    try {
      const themes = await this._savedThemesSetting.getValue();
      const existingTheme = themes.find(t => t.theme.meta.id === id);
      if(existingTheme === undefined){
        this._logger.warn("Local Theme not found", id);
        toast.reject("Theme not found");
        return;
      }

      /* remove currently loaded edit theme */
      this._loadedEditorTheme$.next(undefined);

      await this._activeThemeSetting.setValue(existingTheme.theme.meta.id);
      toast.resolve(`Theme ${existingTheme.theme.meta.name} activated`);
    }
    catch(e) {
      this._logger.error("Failed to activate theme", e);
      toast.reject("Failed to activate theme");
      return;
    }
  }

  public async activatePublicTheme(theme: ThemeListingDto){
    this._logger.debug("Getting saved theme of public listing", theme);

    const toast = await this._toastService.showLoadingToast("Activating theme");

    try {
      const themes = await this._savedThemesSetting.getValue();
      const existingTheme = themes.find(t => t.publicTheme?.publicId === theme.id);

      if(existingTheme === undefined){
        this._logger.warn("Theme not found", theme);
        toast.reject(`Theme ${theme.name} is not downloaded`);
        return;
      }

      /* remove currently loaded edit theme */
      this._loadedEditorTheme$.next(undefined);

      await this._activeThemeSetting.setValue(existingTheme.theme.meta.id);
      toast.resolve(`Theme ${theme.name} activated`);
    }
    catch(e) {
      this._logger.error("Failed to activate public theme", e);
      toast.reject("Failed to activate theme");
      return;
    }
  }

  public async removeLocalTheme(localId: number){
    this._logger.info("Removing local theme", localId);

    const toast = await this._toastService.showLoadingToast("Removing theme");
    try {
      const themes = await this._savedThemesSetting.getValue();
      const theme = themes.find(t => t.theme.meta.id === localId);

      if(theme === undefined){
        this._logger.warn("Theme not found", localId);
        toast.reject("Theme not found");
        return;
      }

      const filtered = themes.filter(t => t.theme.meta.id !== localId);
      await this._savedThemesSetting.setValue(filtered);

      /* if loaded for edit, unload */
      if(this._loadedEditorTheme$.value?.theme.meta.id === localId) {
        this._loadedEditorTheme$.next(undefined);
      }

      toast.resolve(`Theme ${theme.theme.meta.name} removed`);
    }
    catch(e) {
      this._logger.error("Failed to remove theme", e);
      toast.reject("Failed to remove theme");
      return;
    }
  }

  private async setThemeElements(theme: typoTheme | undefined){
    this._logger.info("Setting theme elements", theme);

    this._themeElements.forEach(e => e.remove());
    this._themeElements = theme ? await this.createThemeElements(theme) : [];
    this._themeElements.forEach(e => document.body.appendChild(e));
  }

  private async createThemeElements(theme: typoTheme){
    const selectorHooks = await this._cssColorVarSelectorsSetup.complete();
    const themeStyle = generateStyleElementForTheme(theme, selectorHooks);
    const themeFont = generateThemeFontElements(theme);
    const themeHtml = generateThemeCustomHtmlElement(theme);
    const themeExternalCss = generateThemeExternalCssElement(theme);
    const themeBackground = generateThemeBackgroundElement(theme);
    return [themeStyle, ...themeFont, ...themeHtml, ...themeExternalCss, themeBackground];
  }

  public async setColorScheme(theme: typoTheme, primary: Color, text: Color, useOnInputs: boolean, invertInputText: boolean, useIngame: boolean){
    this._logger.debug("Setting color scheme", theme, primary, text, useOnInputs, invertInputText, useIngame);
    const colors = generateColorScheme(primary, text, useIngame, useOnInputs, invertInputText);
    theme.colors = colors;

    await this._toastService.showToast("Color scheme updated");
  }

  public async shareTheme(theme: typoTheme){
    this._logger.debug("Sharing theme", theme);
    const toast = await this._toastService.showLoadingToast("Sharing theme");

    let shareId: string;
    try {
      const response = await this._apiService.getApi(ThemesApi).shareTheme({themeDto: theme});
      shareId = response.id;
      this._logger.info("created theme share id:", response.id);

      await navigator.clipboard.writeText(shareId);
    }
    catch(e) {
      this._logger.error("Failed to share theme", e);
      toast.reject("Failed to share theme");
      return;
    }

    toast.resolve(`Share id (${shareId}) copied to clipboard`);
  }

  public async importTheme(shareId: string){
    this._logger.debug("Importing theme", shareId);
    const toast = await this._toastService.showLoadingToast("Importing theme");

    try {
      const theme = await this._apiService.getApi(ThemesApi).getThemeById({id: shareId});
      this._logger.info("Loaded theme", theme);

      const themes = await this._savedThemesSetting.getValue();
      const existingTheme = themes.find(t => t.theme.meta.id === theme.meta.id);
      if(existingTheme !== undefined){
        this._logger.warn("Theme already exists, assigning new ID", theme);
        theme.meta.id = Date.now();
      }
      const savedTheme: savedTheme = {
        theme: theme as serializableTheme,
        savedAt: Date.now(),
        publicTheme: undefined,
        enableManage: true
      };

      await this._savedThemesSetting.setValue([savedTheme, ...themes]);
      toast.resolve(`Theme ${theme.meta.name} saved`);
      return savedTheme;
    }
    catch(e) {
      this._logger.error("Failed to import theme", e);
      toast.reject("Failed to import theme");
      throw new Error("Failed to import theme");
    }
  }
}