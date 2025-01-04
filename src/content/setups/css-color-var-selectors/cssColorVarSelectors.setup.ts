import { earlySetup } from "@/content/core/setup/earlySetup.decorator";
import { themeColors } from "@/util/typo/themes/colors";
import { getCssVariableSelectorHooks } from "@/util/typo/themes/cssVariableSelectorHooks";
import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until the game js has been patched
 */
@earlySetup()
export class CssColorVarSelectorsSetup extends Setup<Record<string, string[]>> {

  protected async runSetup(): Promise<Record<string, string[]>> {
    const css = await(await fetch("/css/style.css")).text();
    return getCssVariableSelectorHooks(css, Object.keys(themeColors));
  }
}