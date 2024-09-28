import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelFilters from "./panel-filters.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class PanelFiltersFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;

  private _component?: PanelFilters;

  public readonly name = "Lobby Filters";
  public readonly description = "Lets you create custom filters for a quick lobby search";
  public readonly featureId = 5;

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelFilters({
      target: elements.filterTab,
      props: {
        feature: this
      }
    });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }
}