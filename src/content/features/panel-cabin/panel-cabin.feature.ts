import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelCabin from "./panel-cabin.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class PanelCabinFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;

  private _component?: PanelCabin;

  public readonly name = "Sprite Cabin";
  public readonly description = "Displays a drag-n-drop interface on the start page to customize your sprite combo";

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelCabin({
      target: elements.cabinTab,
      props: {
        feature: this
      }
    });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }
}