import { earlySetup } from "@/content/core/setup/earlySetup.decorator";
import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until the game js has been patched
 */
@earlySetup()
export class GamePatchReadySetup extends Setup<void> {
  protected async runSetup(): Promise<void> {
    return new Promise((resolve) => {

      /* if patcher already finished */
      if(document.body.getAttribute("typo-script-loaded") !== null) resolve();

      /* else wait for patcher finished */
      else document.addEventListener("patchExecuted", () => resolve());
    });
  }
}