import { Interceptor } from "@/content/core/interceptor/interceptor";
import { earlySetup } from "@/content/core/setup/earlySetup.decorator";
import { inject } from "inversify";
import { firstValueFrom } from "rxjs";
import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until the game js has been patched
 */
@earlySetup()
export class GamePatchReadySetup extends Setup<void> {

  @inject(Interceptor) private readonly _interceptor!: Interceptor;

  protected async runSetup(): Promise<void> {
    return firstValueFrom(this._interceptor.patchLoaded$);
  }
}