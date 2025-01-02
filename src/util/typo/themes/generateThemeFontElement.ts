import { createElement } from "@/util/document/appendElement";
import type { typoTheme } from "@/util/typo/themes/theme";

export const generateThemeFontElements = (theme: typoTheme) => {
  return theme.misc.fontStyle && theme.misc.fontStyle.length > 0 ? [
    createElement(`<link id='typo-theme-font-preconnect-${theme.meta.id}' rel="preconnect" href="https://fonts.gstatic.com">`),
    createElement(`<link id='typo-theme-font-style-${theme.meta.id}' href="https://fonts.googleapis.com/css2?family=${theme.misc.fontStyle?.trim()}&display=swap" rel="stylesheet">`)
  ] : [];
};