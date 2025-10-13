import { ChatControlsSetup } from "@/app/setups/chat-controls/chat-controls.setup";
import { ControlsSetup } from "@/app/setups/controls/controls.setup";
import { CustomizerActionsSetup } from "@/app/setups/customizer-actions/customizer-actions.setup";
import { SkribblInitializedSetup } from "@/app/setups/skribbl-initialized/skribbl-initialized.setup";
import { ToastSetup } from "@/app/setups/toast/toast.setup";
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
 * @param toastContainer
 * @param chatControls
 * @param customizerActions
 */
function getElements(panels: Awaited<ReturnType<PanelSetup["complete"]>>, toolbar: HTMLElement, controls: HTMLElement, toastContainer: HTMLElement, chatControls: HTMLElement, customizerActions: HTMLElement){
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
    clearButton: requireElement(".tool[data-tooltip=\"Clear\"]"),
    gameSettings: requireElement("#game-settings"),
    home: requireElement("#home"),
    game: requireElement("#game"),
    gameWrapper: requireElement("#game-wrapper"),
    load: requireElement("#load"),
    chatInput: requireElement("#game-chat form.chat-form input") as HTMLInputElement,
    chatForm: requireElement("#game-chat form.chat-form"),
    chatArea: requireElement("#game-chat"),
    chatContent: requireElement("#game-chat .chat-content"),
    hints: requireElement("#game-word .hints"),
    canvasWrapper: requireElement("#game-canvas"),
    canvas: requireElement("#game-canvas canvas") as HTMLCanvasElement,
    landingAvatar: requireElement(".avatar-customizer .avatar"),
    landingCustomizeContainer: requireElement(".avatar-customizer"),
    landingAvatarContainer: requireElement(".avatar-customizer .container"),
    skribblTools: requireElement(".toolbar-group-tools"),
    skribblActions: requireElement(".toolbar-group-actions"),
    skribblToolbar: requireElement("#game-toolbar"),
    skribblBrushTools: requireElement(".toolbar-group-tools .tool[data-tooltip=\"Brush\"]"),
    colorContainer: requireElement("#game-toolbar .colors"),
    scoreboardResults: requireElement("#game-canvas .overlay-content .result"),
    playerPopup: requireElement("#modal .modal-content .modal-container-player"),
    skribblModal: requireElement("#modal"),
    canvasOverlay: requireElement("#game-canvas .overlay-content"),
    textOverlay: requireElement("#game-canvas .overlay-content > .text"),
    gameRate: requireElement("#game-rate"),
    inputName: requireElement("input.input-name") as HTMLInputElement,
    logoIngame: requireElement("#game-logo img"),
    chatControls,
    ...panels,
    toolbar,
    controls,
    toastContainer,
    customizerActions
  };
}
export type typoElements = ReturnType<typeof getElements>;

/**
 * Setup to get commonly used skribbl element references
 */
export class ElementsSetup extends Setup<typoElements> {

  @inject(PanelSetup) private _panelSetup!: PanelSetup;
  @inject(ToolbarSetup) private _toolbarSetup!: ToolbarSetup;
  @inject(ControlsSetup) private _controlsSetup!: ControlsSetup;
  @inject(ChatControlsSetup) private _chatControlsSetup!: ChatControlsSetup;
  @inject(ToastSetup) private _toastSetup!: ToastSetup;
  @inject(SkribblInitializedSetup) private _gameReadySetup!: SkribblInitializedSetup;
  @inject(CustomizerActionsSetup) private _customizerIconsSetup!: CustomizerActionsSetup;

  protected async runSetup(): Promise<ReturnType<typeof getElements>> {
    await this._gameReadySetup.complete();
    const panels = await this._panelSetup.complete();
    const toolbar = await this._toolbarSetup.complete();
    const controls = await this._controlsSetup.complete();
    const chatControls = await this._chatControlsSetup.complete();
    const toastContainer = await this._toastSetup.complete();
    const customizerActions = await this._customizerIconsSetup.complete();
    return getElements(panels, toolbar, controls, toastContainer, chatControls, customizerActions);
  }
}