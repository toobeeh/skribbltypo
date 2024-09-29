import { ControlsSetup } from "@/content/setups/controls/controls.setup";
import { SkribblInitializedSetup } from "@/content/setups/skribbl-initialized/skribbl-initialized.setup";
import { Setup } from "../../core/setup/setup";
import { requireElement } from "@/util/document/requiredQuerySelector";
import { inject } from "inversify";
import { PanelSetup } from "../panel/panel.setup";
import { ToolbarSetup } from "../toolbar/toolbar.setup";

/**
 * Function to make dynamic return type
 * @param panels
 * @param toolbar
 * @param controls
 */
function getElements(panels: Awaited<ReturnType<PanelSetup["complete"]>>, toolbar: HTMLElement, controls: HTMLElement){
  return {
    panelContainer: requireElement(".panels"),
    avatarPanel: requireElement(".panel:not(.typo-panel)"),
    newsTab: requireElement(".panel-tab-news"),
    changelogTab: requireElement(".panel-tab-changelog"),
    lobbiesTab: requireElement(".panel-tab-lobbies"),
    cabinTab: requireElement(".panel-tab-cabin"),
    filterTab: requireElement(".panel-tab-filter"),
    playButton: requireElement(".panel:not(.typo-panel) .button-play"),
    gameBar: requireElement("#game-bar"),
    gameSettings: requireElement("#game-settings"),
    home: requireElement("#home"),
    game: requireElement("#game"),
    gameWrapper: requireElement("#game-wrapper"),
    load: requireElement("#load"),
    chatInput: requireElement("#game-chat .chat-container form input") as HTMLInputElement,
    chatArea: requireElement("#game-chat"),
    canvas: requireElement("#game-canvas canvas") as HTMLCanvasElement,
    ...panels,
    toolbar,
    controls
  };
}
export type typoElements = ReturnType<typeof getElements>;

export class ElementsSetup extends Setup<typoElements> {

  @inject(PanelSetup) private _panelSetup!: PanelSetup;
  @inject(ToolbarSetup) private _toolbarSetup!: ToolbarSetup;
  @inject(ControlsSetup) private _controlsSetup!: ControlsSetup;
  @inject(SkribblInitializedSetup) private _gameReadySetup!: SkribblInitializedSetup;

  protected async runSetup(): Promise<ReturnType<typeof getElements>> {
    await this._gameReadySetup.complete();
    const panels = await this._panelSetup.complete();
    const toolbar = await this._toolbarSetup.complete();
    const controls = await this._controlsSetup.complete();
    return getElements(panels, toolbar, controls);
  }
}