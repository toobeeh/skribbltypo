import { inject } from "inversify";
import { appendElement, createElement } from "@/util/document/appendElement";
import { Setup } from "../../core/setup/setup";
import { GamePatchReadySetup } from "../game-patch-ready/game-patch-ready.setup";
import ToastContainer from "./toast-container.svelte";

export class ToastSetup extends Setup<HTMLElement> {

  @inject(GamePatchReadySetup) private _gameReadySetup!: GamePatchReadySetup;

  protected async runSetup(): Promise<HTMLElement> {

    await this._gameReadySetup.complete();

    const controls = appendElement(createElement("<div class='typo-toast-container'></div>"), "afterbegin", document.body);
    new ToastContainer({
      target: controls
    });

    return controls;
  }
}