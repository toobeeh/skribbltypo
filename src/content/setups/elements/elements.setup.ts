import { Setup } from "../../core/setup/setup";
import { requireElement } from "../../../util/document/requiredQuerySelector";
import { inject } from "inversify";
import { GamePatchReadySetup } from "../game-patch-ready/game-patch.setup";
import { PanelSetup } from "../panel/panel.setup";
import { ToolbarSetup } from "../toolbar/toolbar.setup";

/**
 * Function to make dynamic return type
 * @param panels
 * @param toolbar
 */
function getElements(panels: Awaited<ReturnType<PanelSetup["complete"]>>, toolbar: HTMLElement){
  return {
    panelContainer: requireElement(".panels"),
    avatarPanel: requireElement(".panel:not(.typo-panel)"),
    newsTab: requireElement(".panel-tab-news"),
    changelogTab: requireElement(".panel-tab-changelog"),
    lobbiesTab: requireElement(".panel-tab-lobbies"),
    cabinTab: requireElement(".panel-tab-cabin"),
    playButton: requireElement(".panel:not(.typo-panel) .button-play"),
    gameBar: requireElement("#game-bar"),
    gameSettings: requireElement("#game-settings"),
    home: requireElement("#home"),
    game: requireElement("#game"),
    gameWrapper: requireElement("#game-wrapper"),
    load: requireElement("#load"),
    canvas: requireElement("#game-canvas canvas") as HTMLCanvasElement,
    ...panels,
    toolbar
  };
}
export type typoElements = ReturnType<typeof getElements>;

export class ElementsSetup extends Setup<typoElements> {

  @inject(PanelSetup) private _panelSetup!: PanelSetup;
  @inject(ToolbarSetup) private _toolbarSetup!: ToolbarSetup;
  @inject(GamePatchReadySetup) private _gameReadySetup!: GamePatchReadySetup;

  protected async runSetup(): Promise<ReturnType<typeof getElements>> {
    await this._gameReadySetup.complete();
    const panels = await this._panelSetup.complete();
    const toolbar = await this._toolbarSetup.complete();
    return getElements(panels, toolbar);
  }
}