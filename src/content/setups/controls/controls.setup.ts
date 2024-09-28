import { inject } from "inversify";
import { appendElement, createElement } from "@/util/document/appendElement";
import { Setup } from "../../core/setup/setup";
import { GamePatchReadySetup } from "../game-patch-ready/game-patch.setup";
import Controls from "./controls.svelte";

export class ControlsSetup extends Setup<HTMLElement> {

  @inject(GamePatchReadySetup) private _gameReadySetup!: GamePatchReadySetup;

  protected async runSetup(): Promise<HTMLElement> {

    await this._gameReadySetup.complete();

    const controls = appendElement(createElement("<div class='typo-controls'></div>"), "afterbegin", document.body);
    new Controls({
      target: controls
    });

    return controls;
  }
}