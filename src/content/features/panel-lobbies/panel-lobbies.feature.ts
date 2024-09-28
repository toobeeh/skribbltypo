import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelLobbies from "./panel-lobbies.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class PanelLobbiesFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;

  private _component?: PanelLobbies;

  public readonly name = "Lobby List";
  public readonly description = "Displays online players from your connected discord servers on the start page";
  public readonly featureId = 6;

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelLobbies({
      target: elements.lobbiesTab,
      props: {
        feature: this
      }
    });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }
}