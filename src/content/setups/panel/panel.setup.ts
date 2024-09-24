import { Setup } from "../../core/setup/setup";
import { requireElement } from "../../../util/document/requiredQuerySelector";
import { createElement, elements } from "../../../util/document/elements";
import PanelTabs from "./panel-tabs.svelte";

import "./panel.scss";

export class PanelSetup extends Setup<{ leftPanel: HTMLElement, rightPanel: HTMLElement }> {

  protected async runSetup(): Promise<{ leftPanel: HTMLElement; rightPanel: HTMLElement }> {
    const panels = {
      rightPanel: elements(createElement("<div class='panel panel-right typo-panel'></div>"), "afterend", requireElement(".panel")),
      leftPanel: elements(createElement("<div class='panel panel-left typo-panel'></div>"), "beforebegin", requireElement(".panel"))
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
        tabs: [{ name: "Lobbies", id: "lobbies" }, { name: "Sprite Cabin", id: "cabin" }]
      }
    });

    return panels;
  }
}