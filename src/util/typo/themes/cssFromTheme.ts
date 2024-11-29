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
  style.id = `typo-theme-${theme.meta.id}`;

  style.innerHTML = `
        :root {${colorsCss}}
        body {
            background: none;
        }
        #typoThemeBg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${ theme.images.backgroundTint };
            z-index: -1;
            pointer-events: none;
            filter: brightness(${ theme.images.backgroundTint != "transparent" ? 4 : 1 });
        }
        #typoThemeBg::after {
            image-rendering: unset;
            content: "";
            position: absolute;
            inset: 0;
            background-position: center;
            background-image: url(${ theme.images.urlBackground !== undefined ? theme.images.urlBackground : "/img/background.png" });
            background-repeat: ${theme.images.urlBackground !== undefined || theme.images.backgroundRepeat ? "repeat" : "no-repeat"};
            background-size: ${theme.images.urlBackground !== undefined ? "350px" : theme.images.backgroundRepeat ? "auto" : "cover"};
            mix-blend-mode: ${theme.images.backgroundTint == "transparent" || theme.images.backgroundTint === undefined ? "none" : "multiply"};
            filter: ${theme.images.backgroundTint == "transparent" || theme.images.backgroundTint === undefined ? "none" : "saturate(0%)"};
        }
        #typoThemeBg.ingame${ theme.images.urlBackgroundGame !== undefined ? "" : ".disabled" }::after {
            background-image: url(${ theme.images.urlBackgroundGame });
        }

        ${theme.misc.hideFooter ? ".tos, .notice {display:none}" : ""}

        ${theme.misc.hideTypoInfo ? "#typoUserInfo {display:none !important}" : ""}

        ${theme.misc.hideTypoPanels ? "#panelgrid .panel:is(:first-child, :last-child) {display:none } #panelgrid{grid-template-columns: 100% !important}" : ""}

        ${theme.misc.hideInGameLogo ? "#game #game-logo{display:none} #game{margin-top:2em}" : ""}

        ${theme.misc.hideMeta ? "#home > div.bottom {display:none !important}" : ""}

        ${theme.misc.hideAvatarSprites ? `
        .avatar-customizer .spriteSlot{display:none }
        .avatar-customizer {background-image: unset !important }
        .avatar-customizer .color, .avatar-customizer .mouth, .avatar-customizer .eyes {opacity: 1 !important}
        ` : ""}

        ${theme.misc.hideAvatarLogo ? "#home .logo-big .avatar-container {display:none }" : ""}

        ${theme.images.containerImages !== undefined ? `
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

        ${theme.misc.fontStyle !== undefined ? `*{font-family:'${theme.misc.fontStyle.trim().split(":")[0].replaceAll("+", " ")}', sans-serif !important}` : ""}

        ${theme.images.urlLogo != "" ? "div.logo-big img {max-height:20vh}" : ""}

        ${theme.misc.useOldNav ? ".lobbyNavIcon {display: none !important;} #legacy-next, #legacy-exit {display: block !important; }" : ""}

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

        ${theme.misc.cssText}
    
        `;

  return style;
};