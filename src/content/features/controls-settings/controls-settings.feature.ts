import { FeaturesService } from "@/content/core/feature/features.service";
import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import ControlsSettings from "./controls-settings.svelte";

export class ControlsSettingsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(FeaturesService) private readonly _featuresService!: FeaturesService;
  @inject(GlobalSettingsService) private readonly _settingsService!: GlobalSettingsService;

  public readonly name = "Typo Settings";
  public readonly description = "Manage the features of typo";
  public override readonly toggleEnabled = false;
  public readonly featureId = 1;

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
    });
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
}