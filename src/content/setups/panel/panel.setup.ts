import { inject } from "inversify";
import { Setup } from "../../core/setup/setup";
import { requireElement } from "../../../util/document/requiredQuerySelector";
import { createElement, appendElement } from "../../../util/document/appendElement";
import { GamePatchReadySetup } from "../game-patch-ready/game-patch.setup";
import PanelTabs from "./panel-tabs.svelte";

export class PanelSetup extends Setup<{ leftPanel: HTMLElement, rightPanel: HTMLElement }> {

  @inject(GamePatchReadySetup) private _gameReadySetup!: GamePatchReadySetup;

  protected async runSetup(): Promise<{ leftPanel: HTMLElement; rightPanel: HTMLElement }> {

    await this._gameReadySetup.complete();

    const panels = {
      rightPanel: appendElement(createElement("<div class='panel panel-right typo-panel'></div>"), "afterend", requireElement(".panel")),
      leftPanel: appendElement(createElement("<div class='panel panel-left typo-panel'></div>"), "beforebegin", requireElement(".panel"))
    };

    new PanelTabs({
      target: panels.leftPanel,
      props: {
        tabs: [{ name: "Typo News", id: "news" }, { name: "Changelog", id: "changelog" }]
      }
    });

    new PanelTabs({
      target: panels.rightPanel,
      props: {
        tabs: [{ name: "Lobbies", id: "lobbies" }, { name: "Filters", id: "filter" }, { name: "Sprite Cabin", id: "cabin" }]
      }
    });

    return panels;
  }
}