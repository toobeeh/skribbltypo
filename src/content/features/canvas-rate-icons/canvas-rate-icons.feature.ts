import { TypoFeature } from "../../core/feature/feature";
import CanvasRateIconsComponent from "./canvas-rate-icons.svelte";

export class CanvasRateIconsFeature extends TypoFeature {

  public readonly name = "Improved Like Icons";
  public readonly description = "Sets new like/dislike icons which better fit the skribbl style.";
  public readonly featureId = 46;

  private _component?: CanvasRateIconsComponent;

  protected override async onActivate() {
    this._component = new CanvasRateIconsComponent({
      target: document.body,
    });
  }

  protected override async onDestroy() {
    this._component?.$destroy();
    this._component = undefined;
  }
}