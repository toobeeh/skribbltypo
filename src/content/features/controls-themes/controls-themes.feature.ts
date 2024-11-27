import { type ThemeDto, type ThemeListingDto, ThemesApi } from "@/api";
import { ExtensionSetting, type serializable } from "@/content/core/settings/setting";
import { ApiService } from "@/content/services/api/api.service";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { createEmptyTheme, type typoTheme } from "@/util/typo/themes/theme";
import { inject } from "inversify";
import { firstValueFrom, Subscription } from "rxjs";
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

  private readonly _savedThemesSetting = new ExtensionSetting<savedTheme[]>("saved_themes", [{
    theme: createEmptyTheme("Mel", "Original Skribbl") as serializableTheme,
    savedAt: Date.now(),
    enableManage: false
  }], this)
      .withName("Saved Themes")
      .withDescription("The themes you have saved");

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

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
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
  }

  public get savedThemesStore() {
    return this._savedThemesSetting.store;
  }

  public async getOnlineThemes() {
    return (await this._apiDataSetup.complete()).themes;
  }

  public get devmodeStore() {
    return this._globalSettingsService.settings.devMode.store;
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
}