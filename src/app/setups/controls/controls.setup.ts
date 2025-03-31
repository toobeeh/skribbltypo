import { GlobalSettingsService } from "@/app/services/global-settings/global-settings.service";
import { inject } from "inversify";
import { Setup } from "../../core/setup/setup";
import { GamePatchReadySetup } from "../game-patch-ready/game-patch-ready.setup";
import Controls from "./controls.svelte";

export class ControlsSetup extends Setup<HTMLElement> {

  @inject(GamePatchReadySetup) private _gameReadySetup!: GamePatchReadySetup;
  @inject(GlobalSettingsService) private _settingsService!: GlobalSettingsService;

  protected async runSetup(): Promise<HTMLElement> {

    await this._gameReadySetup.complete();

    const component = new Controls({
      target: document.body,
      props:{
        globalSettings: this._settingsService
      }
    });

    return await component.element;
  }
}