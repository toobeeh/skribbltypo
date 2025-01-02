import type { Color } from "@/util/color";
import type { Mutable } from "@/util/types/mutable";
import { themeColors } from "@/util/typo/themes/colors";

/**
 * Generate a color scheme based on the main color and text color, in hsla scheme
 * @param mainColor
 * @param textColor
 * @param useIngame
 * @param useInputs
 * @param invertInputText
 */
export const generateColorScheme = (mainColor: Color | undefined, textColor: Color | undefined, useIngame: boolean, useInputs: boolean, invertInputText: boolean) => {
  const theme = structuredClone(themeColors) as Mutable<typeof themeColors>;

  /* modify main elements */
  const mainHueBase = 226;
  const mainSatBase = 85;
  const mainLigBase = 32;
  const mainOpBase = 0.75;


  if (mainColor) {
    const mainHsl = mainColor.hsl;
    const mainHue = mainHsl[0];
    const mainSat = mainHsl[1];
    const mainLig = mainHsl[2];
    const mains = [
      "--COLOR_PANEL_BG",
      "--COLOR_PANEL_LO",
      "--COLOR_PANEL_BUTTON",
      "--COLOR_PANEL_BUTTON_HOVER",
      "--COLOR_PANEL_BUTTON_ACTIVE",
      "--COLOR_PANEL_HI",
      "--COLOR_PANEL_FOCUS",
      "--COLOR_PANEL_BORDER",
      "--COLOR_TOOL_TIP_BG"
    ] as (keyof typeof theme)[];
    mains.forEach(k => theme[k][0] = (theme[k][0] - mainHueBase + mainHue) % 360);
    mains.forEach(k => theme[k][1] =  theme[k][1] * (mainSat / 100));
    mains.forEach(k => theme[k][2] = theme[k][2] * (mainLig / 100));
    theme["--COLOR_CHAT_SCROLLBAR"] = [...theme["--COLOR_PANEL_LO"]];
    theme["--COLOR_CHAT_SCROLLBAR_THUMB"] = [...theme["--COLOR_PANEL_HI"]];

    if (useIngame) {
      const themeSat = mainSatBase * (mainSat / 100);
      const themeLight = mainLigBase * (mainLig / 100);
      theme["--COLOR_CHAT_BG_BASE"] = [mainHue, themeSat, themeLight, mainOpBase];
      theme["--COLOR_CHAT_BG_ALT"] = [mainHue, themeSat, themeLight - 7, mainOpBase];
      theme["--COLOR_PLAYER_BG_BASE"] = [mainHue, themeSat, themeLight, mainOpBase];
      theme["--COLOR_PLAYER_BG_ALT"] = [mainHue, themeSat, themeLight - 7, mainOpBase];
    }

    if (useInputs) {
      theme["--COLOR_INPUT_BORDER"] = [mainHue, mainSatBase, 75 * (mainLigBase / 100), 0.4];
      theme["--COLOR_INPUT_BORDER_FOCUS"] = [mainHue, mainSatBase, 85 * (mainLigBase / 100), 0.4];
      theme["--COLOR_INPUT_BG"] = [mainHue, mainSatBase, 80 * (mainLigBase / 100), 0.3];
      theme["--COLOR_INPUT_HOVER"] = [mainHue, mainSatBase, 90 * (mainLigBase / 100), 0.3];
    }
  }

  /* modify text */
  if (textColor) {
    const textHsl = textColor.hsl;
    const texts = [
      "--COLOR_GAMEBAR_TEXT",
      "--COLOR_GAMEBAR_ROUND_TEXT",
      "--COLOR_PLAYER_TEXT_BASE",
      "--COLOR_CHAT_TEXT_BASE",
      "--COLOR_INPUT_TEXT",
      "--COLOR_PANEL_TEXT"
    ] as (keyof typeof theme)[];
    texts.forEach(k => theme[k] = [textHsl[0], textHsl[1], textHsl[2], ...(textHsl[3] ? [textHsl[3]] : [])]);
    theme["--COLOR_PANEL_TEXT_PLACEHOLDER"] = [textHsl[0], textHsl[1], textHsl[2] - 50];
    theme["--COLOR_GAMEBAR_WORD_DESCRIPTION"] = [textHsl[0], textHsl[1], textHsl[2], 0.7];
    if (invertInputText) theme["--COLOR_INPUT_TEXT"][2] = 100 - theme["--COLOR_INPUT_TEXT"][2];
  }

  return theme;
};