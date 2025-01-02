import { createElement } from "@/util/document/appendElement";
import type { typoTheme } from "@/util/typo/themes/theme";

export const generateThemeExternalCssElement = (theme: typoTheme) => {
  return theme.misc.themeCssUrl && theme.misc.themeCssUrl.length > 0 ? [
    createElement(`<link id='typo-theme-external-css-${theme.meta.id}' rel="stylesheet" href="${theme.misc.themeCssUrl}">`)
  ] : [];
};