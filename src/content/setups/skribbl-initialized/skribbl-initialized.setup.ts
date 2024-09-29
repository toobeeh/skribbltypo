import { earlySetup } from "@/content/core/setup/earlySetup.decorator";
import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until the game js has been run
 */
@earlySetup()
export class SkribblInitializedSetup extends Setup<void> {
  protected async runSetup(): Promise<void> {
    return new Promise((resolve) => {

      /* if script already finished */
      if(document.body.getAttribute("typo-skribbl-loaded") !== null) resolve();

      /* else wait for patcher finished */
      else document.addEventListener("skribblInitialized", () => resolve());
    });
  }
}