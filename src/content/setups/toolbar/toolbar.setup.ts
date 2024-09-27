import { inject } from "inversify";
import { appendElement, createElement } from "../../../util/document/appendElement";
import { Setup } from "../../core/setup/setup";
import { requireElement } from "../../../util/document/requiredQuerySelector";
import { GamePatchReadySetup } from "../game-patch-ready/game-patch.setup";
import Toolbar from "./toolbar.svelte";

export class ToolbarSetup extends Setup<HTMLElement> {

  @inject(GamePatchReadySetup) private _gameReadySetup!: GamePatchReadySetup;

  protected async runSetup(): Promise<HTMLElement> {

    await this._gameReadySetup.complete();

    const toolbar = appendElement(createElement("<div class='typo-toolbar'></div>"), "afterbegin", requireElement("#game-wrapper"));
    new Toolbar({
      target: toolbar
    });

    return toolbar;
  }
}