import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { SkribblLandingPlayer } from "@/content/setups/landing-player-display/skribblLandingPlayer";
import type { SkribblPlayerDisplay } from "@/util/typo/skribblPlayerDisplay.interface";
import { Setup } from "../../core/setup/setup";
import { inject } from "inversify";

/**
 * Create a skribbl player implementation for the landing avatar customizer
 */
export class LandingPlayerDisplaySetup extends Setup<SkribblPlayerDisplay> {

  @inject(ElementsSetup) private _elementsSetup!: ElementsSetup;

  protected async runSetup(): Promise<SkribblPlayerDisplay> {
    const elements = await this._elementsSetup.complete();
    return new SkribblLandingPlayer(elements.landingCustomizeContainer, elements.landingAvatarContainer);
  }
}