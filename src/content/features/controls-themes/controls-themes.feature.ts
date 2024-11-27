import {type ThemeListingDto, ThemesApi } from "@/api";
import { ExtensionSetting, type serializable } from "@/content/core/settings/setting";
import { ApiService } from "@/content/services/api/api.service";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { createEmptyTheme, type typoTheme } from "@/util/typo/themes/theme";
import { inject } from "inversify";
import { BehaviorSubject, combineLatestWith, Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import ControlsSettings from "./controls-themes.svelte";

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
  private _loadedEditorTheme$ = new BehaviorSubject<savedTheme | undefined>(undefined);
  private _activeThemeTab$ = new BehaviorSubject<"editor" | "list" | "browser">("list");

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

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
      const settingsComponent: componentData<ControlsSettings> = {
        componentType: ControlsSettings,
        props: {
          feature: this,
        },
      };
      this._modalService.showModal(settingsComponent.componentType, settingsComponent.props, "Typo Themes");
    });

    this._themeResetSubscription = this._savedThemesSetting.changes$.pipe(
      combineLatestWith(this._activeThemeSetting.changes$)
    ).subscribe(([themes, activeId]) => {
      if(!themes.some(t => t.theme.meta.id === activeId)) this._activeThemeSetting.setValue(0);
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
      toast.resolve("Theme loaded");
    }
    catch(e) {
      this._logger.error("Failed to load theme to editor", e);
      toast.reject("Failed to load theme");
    }
  }

  public async unloadThemeFromEditor(){
    this._logger.info("Unloading theme from editor");
    this._loadedEditorTheme$.next(undefined);
    await this._toastService.showToast("Theme unloaded from editor");
  }

  public async createNewTheme(){
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

  public async activateLocalTheme(theme: serializableTheme){
    this._logger.info("Activating local theme", theme);

    const toast = await this._toastService.showLoadingToast("Activating theme");
    try {
      const themes = await this._savedThemesSetting.getValue();
      const existingTheme = themes.find(t => t.theme.meta.id === theme.meta.id);
      if(existingTheme === undefined){
        this._logger.warn("Theme not found", theme);
        toast.reject("Theme not found");
        return;
      }

      await this._activeThemeSetting.setValue(existingTheme.theme.meta.id);
      toast.resolve(`Theme ${theme.meta.name} activated`);
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
      toast.resolve(`Theme ${theme.theme.meta.name} removed`);
    }
    catch(e) {
      this._logger.error("Failed to remove theme", e);
      toast.reject("Failed to remove theme");
      return;
    }
  }
}