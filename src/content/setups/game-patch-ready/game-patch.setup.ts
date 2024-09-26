import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until the game js has been patched
 */
export class GamePatchReadySetup extends Setup<void> {
  protected async runSetup(): Promise<void> {
    return new Promise((resolve) => {
      document.addEventListener("patchExecuted", () => resolve());
    });
  }
}