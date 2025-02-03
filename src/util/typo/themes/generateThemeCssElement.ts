import { stringHasContent } from "@/util/stringHasContent";
import type { typoTheme } from "@/util/typo/themes/theme";

export const generateStyleElementForTheme = (theme: typoTheme, selectorHooks: Record<string, string[]>) => {

  /* generate colors css */
  const colorsCss = Object.entries(theme.colors).map(entry => {
    const value = entry[1];
    const colorString = value.length == 3
      ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
      : `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    return `${entry[0]}: ${colorString};`;
  }).join("\n");

  /* create style element and generate css styles */
  const style = document.createElement("STYLE");
  style.id = `typo-theme-style-${theme.meta.id}`;

  // TODO background style adjustment for ingame detection

  style.innerHTML = `
        :root {${colorsCss}}
        body {
            background: none;
        }
        .typo-theme-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${ theme.images.backgroundTint ?? "" };
            z-index: -10;
            pointer-events: none;
            filter: brightness(${ !stringHasContent(theme.images.urlBackground) && (theme.images.backgroundTint ?? "transparent") !== "transparent" ? 4 : 1 });
        }
        .typo-theme-background::after {
            image-rendering: unset;
            content: "";
            position: absolute;
            inset: 0;
            background-position: center;
            background-image: url(${ stringHasContent(theme.images.urlBackground) ? theme.images.urlBackground : "/img/background.png" });
            background-repeat: ${!stringHasContent(theme.images.urlBackground) || theme.images.backgroundRepeat ? "repeat" : "no-repeat"};
            background-size: ${!stringHasContent(theme.images.urlBackground) ? "350px" : theme.images.backgroundRepeat ? "auto" : "cover"};
            mix-blend-mode: ${theme.images.backgroundTint == "transparent" || !stringHasContent(theme.images.backgroundTint) ? "none" : "multiply"};
            filter: ${theme.images.backgroundTint == "transparent" || !stringHasContent(theme.images.backgroundTint) ? "none" : "saturate(0%)"};
        }
        body:has(#game[style*="display: flex"]) .typo-theme-background${ stringHasContent(theme.images.urlBackgroundGame) ? "" : ".disabled" }::after {
            background-image: url(${ theme.images.urlBackgroundGame });
        }

        ${theme.misc.hideFooter ? ".tos, .notice {display:none}" : ""}
        
        ${theme.misc.hideInGameLogo ? "#game #game-logo{display:none} #game{margin-top:2em}" : ""}

        ${theme.misc.hideAvatarLogo ? "#home .logo-big .avatar-container {display:none }" : ""}

        ${theme.misc.hideSkribblPanels ? ".bottom .footer .section-container { display: none !important }" : ""}

        ${stringHasContent(theme.images.containerImages) ? `
        #game-bar, #game-room .settings, #game-room .players,  #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, 
        #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat 
        .chat-content, #game-players .players-list  {background-image: url(${theme.images.containerImages}) !important}
        #game-players .players-list .player {background:none !important}
        ` : ""}

        .flatUi.orange, .button-orange {
            background-color: var(--COLOR_BUTTON_DANGER_BG) !important;
            color: var(--COLOR_BUTTON_DANGER_TEXT) !important;
        }
        .flatUI.green, .button-play, #start-game {
            color: var(--COLOR_BUTTON_SUBMIT_TEXT) !important;
            background-color: var(--COLOR_BUTTON_SUBMIT_BG) !important;
        }
        .flatUI.blue, .button-create, .button-blue, #copy-invite {
            background-color: var(--COLOR_BUTTON_NORMAL_BG) !important;
            color: var(--COLOR_BUTTON_NORMAL_TEXT) !important;
        }

        :is(.flatUi.orange, .button-orange):is(:hover, :active, :focus) {
            background-color: var(--COLOR_BUTTON_DANGER_BG) !important;
            color: var(--COLOR_BUTTON_DANGER_TEXT) !important;
            opacity: 0.8;
        }
        :is(.flatUI.green, .button-play, #start-game):is(:hover, :active, :focus) {
            color: var(--COLOR_BUTTON_SUBMIT_TEXT) !important;
            background-color: var(--COLOR_BUTTON_SUBMIT_BG) !important;
            opacity: 0.8;
        }
        :is(.flatUI.blue, .button-create, .button-blue, #copy-invite):is(:hover, :active, :focus) {
            background-color: var(--COLOR_BUTTON_NORMAL_BG) !important;
            color: var(--COLOR_BUTTON_NORMAL_TEXT) !important;
            opacity: 0.8;
        }

        ${stringHasContent(theme.misc.fontStyle) ? `*{font-family:'${theme.misc.fontStyle.trim().split(":")[0].replaceAll("+", " ")}', sans-serif !important}` : ""}

        ${stringHasContent(theme.images.urlLogo) ? `
          div.logo-big a {display: flex; justify-content: center }
          div.logo-big img, div#game-logo img {max-height:20vh; content: url(${theme.images.urlLogo}) }
        ` : ""}

        ${
          Object.entries(theme.hooks ? theme.hooks : {})
            .filter(entry => entry[1] !== "")
            .map(entry => `${selectorHooks[entry[0]].join(",")}{${entry[1]}}`)
            .join("\n")
        }

        ::-webkit-scrollbar {
            width: 14px;
            border-radius: 7px;
            background-color: var(--COLOR_PANEL_LO); 
        }
        
        ::-webkit-scrollbar-thumb {
            border-radius: 7px;
            background-color: var(--COLOR_PANEL_HI)
        }

        #game-chat ::-webkit-scrollbar {
            width: 14px;
            border-radius: 7px;
            background-color: var(--COLOR_CHAT_SCROLLBAR); 
        }
        
        #game-chat ::-webkit-scrollbar-thumb {
            border-radius: 7px;
            background-color: var(--COLOR_CHAT_SCROLLBAR_THUMB); 
        }

        ${theme.misc.cssText ?? ""}
    
        `;

  return style;
};