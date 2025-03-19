import { ExtensionSetting } from "@/content/core/settings/setting";
import { ApiService } from "@/content/services/api/api.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { convertOldTheme } from "@/util/typo/themes/convertOldTheme";
import type { oldThemeOptions } from "@/util/typo/themes/oldTheme";
import { createEmptyTheme, type savedTheme, type serializableTheme, type typoTheme } from "@/util/typo/themes/theme";
import { inject, injectable } from "inversify";
import { type ThemeListingDto, ThemesApi } from "@/api";
import { BehaviorSubject, } from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class ThemesService {

  private readonly _logger;

  private readonly _originalTheme: serializableTheme = createEmptyTheme("Mel", "Original Skribbl", 0) as serializableTheme;
  private readonly _activeThemeSetting = new ExtensionSetting<number | undefined>("active_theme_local_id", undefined);
  private readonly _savedThemesSetting = new ExtensionSetting<savedTheme[]>("saved_themes", [{
    theme: this._originalTheme,
    savedAt: Date.now(),
    enableManage: false
  }]);

  private _loadedEditorTheme$ = new BehaviorSubject<savedTheme | undefined>(undefined);


  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(ElementsSetup) private readonly _elementsSetup: ElementsSetup,
    @inject(ApiService) private readonly _apiService: ApiService
  ) {
    this._logger = loggerFactory(this);
  }

  public get activeThemeSetting() {
    return this._activeThemeSetting.asFrozen;
  }

  public get savedThemesSetting() {
    return this._savedThemesSetting.asFrozen;
  }

  public get loadedEditorTheme$() {
    return this._loadedEditorTheme$.asObservable();
  }

  public get loadedEditorThemeStore() {
    return fromObservable(this._loadedEditorTheme$, this._loadedEditorTheme$.value);
  }

  /**
   * Load a theme to the editor; might receive changes via updateLoadedEditorTheme without saving later
   * @param theme
   */
  public async loadThemeToEditor(theme: savedTheme){
    this._logger.info("Loading theme to editor", theme);

    const themes = await this._savedThemesSetting.getValue();
    const existingTheme = themes.find(t => t.theme.meta.id === theme.theme.meta.id);
    if(existingTheme === undefined){
      this._logger.error("Theme not found", theme);
      throw new Error("Theme not found");
    }

    this._loadedEditorTheme$.next(structuredClone(theme));
  }

  /**
   * Update the loaded theme in the editor
   * @param theme
   */
  public updateLoadedEditorTheme(theme: savedTheme){
    this._logger.debug("Updating loaded theme", theme);

    if(this._loadedEditorTheme$.value?.theme.meta.id !== theme.theme.meta.id){
      this._logger.error("Theme not loaded or different theme loaded", theme);
      throw new Error("Theme not loaded or different theme loaded");
    }
    this._loadedEditorTheme$.next(structuredClone(theme));
  }

  /**
   * Unload a theme from the editor
   */
  public async unloadThemeFromEditor(){
    this._logger.info("Unloading theme from editor");
    this._loadedEditorTheme$.next(undefined);
  }

  /**
   * Create an empty new local theme and sore it
   */
  public async createLocalTheme(): Promise<savedTheme> {
    this._logger.info("Creating new theme");

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
    return newTheme;
  }

  /**
   * Save the state of the loaded theme in the editor to the original local theme and unload theme from editor
   */
  public async saveLoadedEditorTheme(): Promise<savedTheme> {
    this._logger.info("Updating local theme and unloading from editor");

    const editorTheme = this._loadedEditorTheme$.value;
    const themes = await this._savedThemesSetting.getValue();
    const savedTheme = themes.find(t => t.theme.meta.id === editorTheme?.theme.meta.id);
    if(editorTheme === undefined || savedTheme === undefined){
      this._logger.error("Theme to update not found", editorTheme);
      throw new Error("Theme to update not found");
    }

    savedTheme.theme = editorTheme.theme;
    savedTheme.savedAt = Date.now();

    await this._savedThemesSetting.setValue([savedTheme, ...themes.filter(t => t.theme.meta.id !== savedTheme.theme.meta.id)]);
    this._loadedEditorTheme$.next(undefined);
    await this._activeThemeSetting.setValue(savedTheme.theme.meta.id);
    return savedTheme;
  }

  public async importOldTheme(options: oldThemeOptions, name: string){
    this._logger.info("Importing old theme", options);

    const theme = createEmptyTheme("Unknown", name);
    convertOldTheme(options, theme);
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
      enableManage: true,
    };

    await this._savedThemesSetting.setValue([savedTheme, ...themes]);
    return savedTheme;
  }

  async importThemeFromString(themeString: string) {
    const theme = JSON.parse(themeString);
    if(typeof theme !== "object" || theme === null){
      throw new Error("Invalid theme data");
    }

    const savedTheme: savedTheme = {
      theme: theme as serializableTheme,
      savedAt: Date.now(),
      publicTheme: undefined,
      enableManage: true,
    };

    const themes = await this._savedThemesSetting.getValue();
    const existingTheme = themes.find(t => t.theme.meta.id === theme.meta.id);
    if(existingTheme !== undefined){
      this._logger.warn("Theme already exists, assigning new ID", theme);
      theme.meta.id = Date.now();
    }

    await this._savedThemesSetting.setValue([savedTheme, ...themes]);
    return savedTheme;
  }

  /**
   * Download a featured theme and save to local themes
   * @param theme
   */
  public async savePublicTheme(theme: ThemeListingDto): Promise<savedTheme> {
    this._logger.info("Saving public theme", theme);

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

    const existingTheme = currentThemes.find(t => t.theme.meta.id === themeData.meta.id);
    if(existingTheme !== undefined){
      this._logger.warn("Theme already saved", theme);
      return existingTheme;
    }

    currentThemes = [saveData, ...currentThemes];
    await this._savedThemesSetting.setValue(currentThemes);
    return saveData;
  }

  /**
   * Activate a local theme
   */
  public async activateLocalTheme(id: number): Promise<savedTheme> {
    this._logger.info("Activating local theme", id);

    const themes = await this._savedThemesSetting.getValue();
    const existingTheme = themes.find(t => t.theme.meta.id === id);
    if(existingTheme === undefined){
      this._logger.warn("Local Theme not found", id);
      throw new Error("Local Theme not found");
    }

    /* remove currently loaded edit theme */
    this._loadedEditorTheme$.next(undefined);

    await this._activeThemeSetting.setValue(existingTheme.theme.meta.id);
    return existingTheme;
  }

  /**
   * Activate a saved public theme
   */
  public async activatePublicTheme(theme: ThemeListingDto): Promise<savedTheme> {
    this._logger.debug("Getting saved theme of public listing", theme);

    const themes = await this._savedThemesSetting.getValue();
    const existingTheme = themes.find(t => t.publicTheme?.publicId === theme.id);

    if(existingTheme === undefined){
      this._logger.error("Theme not found", theme);
      throw new Error("Theme not found");
    }

    /* remove currently loaded edit theme */
    this._loadedEditorTheme$.next(undefined);

    await this._activeThemeSetting.setValue(existingTheme.theme.meta.id);
    return existingTheme;
  }

  /**
   * Removed a saved theme, no matter if local or public
   * @param localId
   */
  public async removeSavedTheme(localId: number): Promise<savedTheme> {
    this._logger.info("Removing saved theme", localId);

    const themes = await this._savedThemesSetting.getValue();
    const theme = themes.find(t => t.theme.meta.id === localId);

    if(theme === undefined){
      this._logger.error("Theme not found", localId);
      throw new Error("Theme not found");
    }

    const filtered = themes.filter(t => t.theme.meta.id !== localId);
    await this._savedThemesSetting.setValue(filtered);

    /* if loaded for edit, unload */
    if(this._loadedEditorTheme$.value?.theme.meta.id === localId) {
      this._loadedEditorTheme$.next(undefined);
    }

    return theme;
  }

  /**
   * Share a theme by uploading it, creating a share id and copying it to clipboard
   * @param theme
   */
  public async shareTheme(theme: typoTheme){
    this._logger.debug("Sharing theme", theme);

    const response = await this._apiService.getApi(ThemesApi).shareTheme({themeDto: theme});
    const shareId = response.id;
    this._logger.info("created theme share id:", response.id);
    return shareId;
  }

  /**
   * Import a theme by share id
   * @param shareId
   */
  public async importTheme(shareId: string){
    this._logger.debug("Importing theme", shareId);

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
    return savedTheme;
  }
}