import { Setup } from "../../core/setup/setup";
import { requireElement } from "../../../util/document/requiredQuerySelector";
import { inject } from "inversify";
import { PanelSetup } from "../panel/panel.setup";

type typoElementNames = "avatarPanel" | "leftPanel" | "rightPanel" | "panelContainer" | "newsTab" | "changelogTab" | "lobbiesTab" | "cabinTab";
export type typoElements = Record<typoElementNames, HTMLElement>;

export class ElementsSetup extends Setup<typoElements> {

  @inject(PanelSetup)
  private _panelSetup!: PanelSetup;

  protected async runSetup(): Promise<typoElements> {

    const panels = await this._panelSetup.complete();

    return {
      panelContainer: requireElement(".panels"),
      avatarPanel: requireElement(".panel:not(.typo-panel)"),
      rightPanel: panels.rightPanel,
      leftPanel: panels.leftPanel,
      newsTab: requireElement(".panel-tab-news"),
      changelogTab: requireElement(".panel-tab-changelog"),
      lobbiesTab: requireElement(".panel-tab-lobbies"),
      cabinTab: requireElement(".panel-tab-cabin")
    };
  }

}