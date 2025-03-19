import { FeatureTag } from "@/content/core/feature/feature-tags";
import { FeaturesService } from "@/content/core/feature/features.service";
import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ControlsSettings from "./controls-settings.svelte";

export class ControlsSettingsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(FeaturesService) private readonly _featuresService!: FeaturesService;
  @inject(GlobalSettingsService) private readonly _settingsService!: GlobalSettingsService;

  public readonly name = "Typo Settings";
  public readonly description = "Manage the features of typo";
  public readonly tags = [
    FeatureTag.INFORMATION,
    FeatureTag.DEVELOPMENT
  ];
  public override readonly toggleEnabled = false;
  public readonly featureId = 1;

  private readonly _onboardingTask = this.useOnboardingTask({
    key: "feature_opened",
    name: "Open settings of a feature",
    description: "Click the wrench icon and open the settings of a typo feature to adjust it to your likes.",
    start: () => this.openSettingsPopup()
  });

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
        icon: "file-img-wrench-gif",
        name: "Typo Settings",
        order: 1,
        tooltipAction: this.createTooltip
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      this.openSettingsPopup();
    });
  }

  private openSettingsPopup(){
    const settingsComponent: componentData<ControlsSettings> = {
      componentType: ControlsSettings,
      props: {
        feature: this,
      },
    };
    this._modalService.showModal(
      settingsComponent.componentType,
      settingsComponent.props,
      "Typo Settings",
    );
  }

  protected override postConstruct() {
    this._settingsService.globalHotkeysList.forEach(hotkey => this.useHotkey(hotkey));

    this.useSetting(this._settingsService.settings.devMode);
    this.useSetting(this._settingsService.settings.controlsPosition);
    this.useSetting(this._settingsService.settings.controlsDirection);
    this.useSetting(this._settingsService.settings.showLandingOutfit);
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
  }

  public override get hotkeys() {
    return this._settingsService.globalHotkeysList;
  }

  public get features() {
    return this._featuresService.features;
  }

  public get devModeStore() {
    return fromObservable(this._settingsService.settings.devMode.changes$, false);
  }

  /**
   * Set the hotkey combo for a hotkey action
   * @param hotkey
   * @param value
   */
  public async setHotkeyCombo(hotkey: HotkeyAction, value: string[]) {
    const toast = await this._toastService.showLoadingToast(
      `Updating hotkey ${hotkey.name} to ${value.join(" + ")}`,
    );

    try {
      await this._hotkeysService.setHotkeyCombo(hotkey, value);
    } catch {
      toast.reject();
      return;
    }

    toast.resolve();
  }

  /**
   * Resets the hotkey combo to the default value
   * @param hotkey
   */
  public async resetHotkeyCombo(hotkey: HotkeyAction) {
    const toast = await this._toastService.showLoadingToast(
      `Resetting hotkey ${hotkey.name} to default ${hotkey.defaultCombo?.join(" + ") ?? "(disabled)"}`,
    );

    let newCombo;
    try {
      newCombo = await this._hotkeysService.resetHotkeyCombo(hotkey);
    } catch {
      toast.reject();
      return;
    }

    toast.resolve();
    return newCombo;
  }

  public featureImportance(tags: FeatureTag[]){
    if(tags.includes(FeatureTag.DRAWING)) return 4;
    if(tags.includes(FeatureTag.GAMEPLAY)) return 4;
    if(tags.includes(FeatureTag.INTERFACE)) return 3;
    if(tags.includes(FeatureTag.SOCIAL)) return 3;
    if(tags.includes(FeatureTag.PALANTIR)) return 2;
    if(tags.includes(FeatureTag.INFORMATION)) return 2;
    if(tags.includes(FeatureTag.DEVELOPMENT)) return 1;
    return 0;
  }

  public featureContainsText(feature: TypoFeature, content: string){
    const search = content.toLowerCase();
    return feature.name.toLowerCase().includes(search) || feature.description.toLowerCase().includes(search)
      || feature.settings.some(s => s.name?.toLowerCase().includes(search) || s.description?.toLowerCase().includes(search))
      || feature.commands.some(c => c.name?.toLowerCase().includes(search) || c.description?.toLowerCase().includes(search))
      || feature.hotkeys.some(h => h.name?.toLowerCase().includes(search) || h.description?.toLowerCase().includes(search));
  }

  public searchFeatures(features: TypoFeature[], filterTags: FeatureTag[], content: string){
    return features
      .filter(f => filterTags.length === 0 || f.tags.some(t => filterTags.includes(t)))
      .filter(f => content.length === 0 || this.featureContainsText(f, content))
      .sort((a, b) => this.featureImportance(b.tags) - this.featureImportance(a.tags));

  }

  public async completeOnboardingTask(){
    (await this._onboardingTask).complete();
  }
}