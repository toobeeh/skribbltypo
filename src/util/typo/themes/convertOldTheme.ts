import type { oldThemeOptions } from "@/util/typo/themes/oldTheme";
import { type typoTheme } from "@/util/typo/themes/theme";

/**
 * Converta a legacy theme to a new theme format
 * @param options
 * @param author
 * @param name
 */
export function convertOldTheme(options: oldThemeOptions, theme: typoTheme) {

  /* apply everything that needed extra elements in old themes */
  theme.images.urlLogo = options.urlLogo;
  theme.images.urlBackground = options.urlBackground;
  theme.images.urlBackgroundGame = options.urlBackgroundGame;
  theme.misc.fontStyle = options.fontStyle;
  theme.misc.htmlText = options.injection;

  /* build css for everything else with "original" code */
  let css = "";
  if (options["containerBackgroundsCheck"] == true) {

    const val = options["containerBackgrounds"] ? options["containerBackgrounds"].trim() : "";
    css += ":root {--COLOR_PANEL_BUTTON: " + (val != "" ? val : "transparent") + " !important}";
    css += "#setting-bar .content, #emojiPrev, #imageAgent, #home .news ::-webkit-scrollbar, #home .news ::-webkit-scrollbar-thumb, .modalContainer, .toast, #modal .box, #home .panel, #home .bottom .footer {background-color: " + (val != "" ? val : "transparent") + " !important}";
    css += "#home .bottom svg {fill: " + (val != "" ? val : "transparent") + " !important}";
  }
  if (options["containerBackgroundsCheck"] == true && options["ingameContainerBackgroundsCheck"] !== false) {
    options["ingameContainerBackgrounds"] = options["containerBackgrounds"];
    options["ingameContainerBackgroundsCheck"] = true;
  }
  if (options["ingameContainerBackgroundsCheck"] == true) {
    const val = options["ingameContainerBackgrounds"] ? options["ingameContainerBackgrounds"].trim() : "";
    css += "#game-bar, .clickable,  #game-room .settings, #game-room .players,   .tooltip .tooltip-content, #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, div#game-toolbar.typomod div.tools-container div.tools div.tool, #game-toolbar divdiv.preview div.graphic-container, #game-room .container-settings, #game-chat .container, #game-players .players-list .player, #game-players .players-list .player.odd {background-color: " + (val != "" ? val : "transparent") + " !important}";
    css += "#game-players .players-list .player.odd{background-image: linear-gradient(0, " + (val != "" ? val : "transparent") + ", " + (val != "" ? val : "transparent") + ");}";
    css += "#game-chat .chat-content {background:none}";
    css += ":root{ --COLOR_TOOL_TIP_BG: " + val + " !important; --COLOR_CHAT_BG_BASE: " + val + " !important; } ";
    css += "#game-players div.list div.player div.bubble div.arrow{border-right-color:" + val + "} #game-players div.list div.player div.bubble div.content{background-color:" + val + "}";
    css += "#game-chat .chat-content p:nth-child(even), #game-chat .chat-content p.guessed:nth-child(even) {background-color: #ffffff20;} #game-chat .chat-content p.guessed:nth-child(odd){background-color:transparent}";
  }

  if (options["containerOutlinesCheck"] == true) {
    const val = options["containerOutlines"] ? options["containerOutlines"].trim() : "";
    css += "#game-bar,  #game-room .settings, #game-room .players,   #imageAgent, #modal .box, #home .panel, .modalContainer, #game-chat, #game-players .players-list .player, #imageOptions {border-radius: 4px; border: 2px solid " + (val != "" ? val : "transparent") + " !important}";
  }

  if (options["containerImages"] && options["containerImages"].trim() != "") {
    css += "#game-bar, #game-room .settings, #game-room .players,  #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat, #game-players .players-list  {background-image: url(" + options["containerImages"].trim() + ") !important}";
    css += "#game-players .players-list {background:none !important}";
  }
  // font color
  const color = options["fontColor"] ? options["fontColor"] : "";
  if (color && color != "") {
    css += "#home .bottom .footer .notice, *:not(.chat-content *), .characters {color:" + color.trim() + " !important}";
    css += "input[type=checkbox].flatUI, #game-chat form input, input[type=text].flatUI, #home .bottom .footer .section-container .section{color:unset}";
  }
  // font color of everything in-game
  if (!options["ingameFontColor"] && options["fontColor"]) {
    options["ingameFontColor"] = options["fontColor"];
  }
  const ingamecolor = options["ingameFontColor"] ? options["ingameFontColor"] : "";
  if (ingamecolor && ingamecolor != "") {
    css += ":root{ --COLOR_CHAT_TEXT_BASE:" + ingamecolor.trim() + " !important}";
    css += "#game *:not(.chat-content *) {color:" + ingamecolor.trim() + "}";
    css += "div#game-toolbar.typomod div.tools-container div.tools div.tool div.key, #game-word .description, #game-round .round-max, #game-round span, #game-players .player-amount b:nth-child(4), #game-players .player-amount span {color:" + ingamecolor.trim() + "; filter: brightness(0.8);}";
  }

  // font color of buttons / inputs
  const colorBtns = options["fontColorButtons"] ? options["fontColorButtons"] : "";
  if (colorBtns && colorBtns != "") css += "select, input, button, textarea {color:" + colorBtns.trim() + "}";
  if (ingamecolor || color || colorBtns) css += "#game-clock{color:black !important}";

  // input backgrounds
  if (options["inputBackgroundsCheck"] == true) {
    const val = options["inputBackgrounds"] ? options["inputBackgrounds"].trim() : "";
    css += "input[type=checkbox], input[type=checkbox].flatUI,#modal .container .box .content .container-rooms .room, button.flatUI.green,button.flatUI.orange, button.flatUI.blue, button.flatUI, input[type=text].flatUI, .link .input-container .link-overlay, input, textarea, button, select, #quickreact > span {background: " + (val != "" ? val : "transparent") + " !important; box-shadow:none !important;} ";
    css += "button:is(.flatUI, .flatUI.green, .flatUI.orange, .flatUI.blue):is(:hover, :active, :focus), input:is(:hover, :active, :focus), textarea:is(:hover, :active, :focus), button:is(:hover, :active, :focus), select:is(:hover, :active, :focus) {background: " + (val != "" ? val : "transparent") + " !important; opacity: 0.75}";
    css += ":is(#game-room .container-settings .group.customwords .checkbox, .report-menu) input[type=checkbox]:checked:after { content: '🞬'; height:100%; width: 100%; display: grid; place-content: center;}";
  }

  // outlines of inputs
  if (options["inputOutlinesCheck"] == true) {
    const val = options["inputOutlines"] ? options["inputOutlines"].trim() : "";
    css += ".link .input-container .link-overlay {display:none !important} input[type=checkbox]{border:none !important;} input, textarea, button, select {border: 2px solid " + (val != "" ? val : "transparent") + " !important; }";
  }
  if (options["hideFooter"] == true) {
    css += ".tos, .notice {display:none}";
  }
  if (options["hideTypoInfo"] == true) {
    css += "#typoUserInfo {display:none !important}";
  }
  if (options["hideDiscord"] == true) {
    css += "#home .socials {opacity:0}";
  }
  if (options["hideInGameLogo"] == true) {
    css += "#game #game-logo{display:none} #game{margin-top:2em}";
  }
  if (options["hideAvatarLogo"] == true) {
    css += "#home .logo-big .avatar-container {display:none }";
  }
  if (options["hideTypoPanels"] == true) {
    css += "#panelgrid .panel:is(:first-child, :last-child) {display:none } #panelgrid{grid-template-columns: 100% !important}";
  }
  if (options["hideAvatarSprites"] == true) {
    css += ".avatar-customizer .spriteSlot{display:none }";
    css += ".avatar-customizer {background-image: unset !important }";
    css += ".avatar-customizer .color, .avatar-customizer .mouth, .avatar-customizer .eyes {opacity: 1 !important}";
  }

  theme.misc.cssText = css;
}