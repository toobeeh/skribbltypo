import { FeatureTag } from "@/content/core/feature/feature-tags";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import { TypoFeature } from "../../core/feature/feature";
import CanvasRateIconsComponent from "./canvas-rate-icons.svelte";

export class CanvasRateIconsFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly name = "Improved Like Icons";
  public readonly description = "Sets new like/dislike icons which better fit the skribbl style.";
  public readonly tags = [
    FeatureTag.INTERFACE
  ];
  public readonly featureId = 46;

  private _component?: CanvasRateIconsComponent;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    elements.gameRate.classList.add("typo-icons");
    this._component = new CanvasRateIconsComponent({
      target: document.body,
    });
  }

  protected override async onDestroy() {
    const elements = await this._elementsSetup.complete();
    elements.gameRate.classList.remove("typo-icons");
    this._component?.$destroy();
    this._component = undefined;
  }
}