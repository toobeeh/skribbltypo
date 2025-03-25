import ChatControls from "@/app/setups/chat-controls/chat-controls.svelte";
import { requireElement } from "@/util/document/requiredQuerySelector";
import { inject } from "inversify";
import { Setup } from "../../core/setup/setup";
import { createElement, appendElement } from "@/util/document/appendElement";
import { GamePatchReadySetup } from "../game-patch-ready/game-patch-ready.setup";

export class ChatControlsSetup extends Setup<HTMLElement> {

  @inject(GamePatchReadySetup) private _gameReadySetup!: GamePatchReadySetup;

  protected async runSetup(): Promise<HTMLElement> {
    await this._gameReadySetup.complete();

    const chatControls = appendElement(createElement("<div class='typo-chat-controls'></div>"), "afterbegin", requireElement("#game-wrapper"));
    new ChatControls({
      target: chatControls
    });

    return chatControls;
  }
}