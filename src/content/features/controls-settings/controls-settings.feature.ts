import { FeaturesService } from "@/content/core/feature/features.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import ControlsSettings from "./controls-settings.svelte";

export class ControlsSettingsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(FeaturesService) private readonly _featuresService!: FeaturesService;

  public readonly name = "Typo Settings";
  public readonly description =
    "Manage the features of typo";
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
        icon: "file-img-settings-gif",
        name: "Typo Settings",
        order: 1,
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
      this._modalService.showModal(settingsComponent.componentType, settingsComponent.props, "Typo Settings");

    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
  }

  public get features(){
    return this._featuresService.features;
  }
}