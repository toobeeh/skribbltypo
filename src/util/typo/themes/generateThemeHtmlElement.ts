import { createElement } from "@/util/document/appendElement";
import type { typoTheme } from "@/util/typo/themes/theme";

export const generateThemeCustomHtmlElement = (theme: typoTheme) => {
  return theme.misc.htmlText && theme.misc.htmlText.length > 0 ? [
    createElement(`<div id='typo-theme-html-${theme.meta.id}'>${theme.misc.htmlText}</div>`)
  ] : [];
};