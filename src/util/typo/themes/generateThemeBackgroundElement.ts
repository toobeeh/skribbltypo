import { createElement } from "@/util/document/appendElement";
import type { typoTheme } from "@/util/typo/themes/theme";

export const generateThemeBackgroundElement = (theme: typoTheme) => {
  return createElement(`<div id='typo-theme-background-${theme.meta.id}' class="typo-theme-background"></div>`);
};