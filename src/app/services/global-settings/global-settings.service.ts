import { HotkeyAction } from "@/app/core/hotkeys/hotkey";
import { BooleanExtensionSetting, ChoiceExtensionSetting } from "@/app/core/settings/setting";
import { inject, injectable } from "inversify";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class GlobalSettingsService {

  private _globalHotkeysList = {
    exitModal: new HotkeyAction(
      "modal_close",
      "Close Modal",
      "Close open modals using a hotkey",
      undefined,
      () => {
        return void 0;
      },
      true,
      ["Escape"]
    )
  };

  private _settings = {
    devMode: new BooleanExtensionSetting("devMode", false)
      .withName("Developer Mode")
      .withDescription("Enable some developer features & settings"),
    controlsPosition: new ChoiceExtensionSetting<"topright" | "topleft" | "bottomright" | "bottomleft">("controlsPosition", "topleft")
      .withName("Control Icons Position")
      .withDescription("The position where the typo controls are displayed")
      .withChoices([
        {name: "Top Right", choice: "topright"},
        {name: "Top Left", choice: "topleft"},
        {name: "Bottom Right", choice: "bottomright"},
        {name: "Bottom Left", choice: "bottomleft"}
      ]),
    controlsDirection: new ChoiceExtensionSetting<"vertical" | "horizontal">("controlsDirection", "vertical")
      .withName("Control Icons Direction")
      .withDescription("The direction where the typo controls are lined up")
      .withChoices([
        {name: "Horizontal", choice: "horizontal"},
        {name: "Vertical", choice: "vertical"},
      ]),
    showLandingOutfit: new BooleanExtensionSetting("showLandingOutfit", true)
      .withName("Customizer Outfit")
      .withDescription("Show your current outfit on the avatar customizer"),
  };

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  public get globalHotkeys(){
    return this._globalHotkeysList;
  }

  public get globalHotkeysList(){
    return Object.values(this._globalHotkeysList);
  }

  public get settings(){
    return this._settings;
  }

  public get settingsList(){
    return Object.values(this._settings);
  }
}