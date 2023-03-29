const SKRIBBL_THEME = {
    "--COLOR_PANEL_BG": [226, 85, 32, 0.75],
    "--COLOR_PANEL_LO": [226, 90, 27, 0.75],
    "--COLOR_PANEL_BUTTON": [226, 67, 49],
    "--COLOR_PANEL_BUTTON_HOVER": [226, 73, 43],
    "--COLOR_PANEL_BUTTON_ACTIVE": [226, 72, 41],
    "--COLOR_PANEL_HI": [226, 80, 44],
    "--COLOR_PANEL_FOCUS": [32, 85, 56],
    "--COLOR_PANEL_BORDER": [232, 85, 11],
    "--COLOR_PANEL_BORDER_FOCUS": [207, 98, 66],
    "--COLOR_PANEL_TEXT": [0, 0, 94],
    "--COLOR_PANEL_TEXT_FOCUS": [0, 0, 100],
    "--COLOR_PANEL_TEXT_PLACEHOLDER": [0, 0, 61],
    "--COLOR_TOOL_BASE": [0, 0, 100],
    "--COLOR_TOOL_HOVER": [0, 0, 77],
    "--COLOR_TOOL_TEXT": [0, 0, 0],
    "--COLOR_TOOL_SIZE_BASE": [0, 0, 100],
    "--COLOR_TOOL_SIZE_HOVER": [0, 0, 77],
    "--COLOR_TOOL_ACTIVE": [271, 77, 66],
    "--COLOR_TOOL_SIZE_ACTIVE": [271, 77, 66],
    "--COLOR_INPUT_BG": [0, 0, 100],
    "--COLOR_INPUT_HOVER": [0, 0, 100],
    "--COLOR_INPUT_TEXT": [0, 0, 17],
    "--COLOR_INPUT_BORDER": [0, 0, 44],
    "--COLOR_INPUT_BORDER_FOCUS": [207, 98, 66],
    "--COLOR_PLAYER_TEXT_BASE": [0, 0, 0],
    "--COLOR_PLAYER_ME": [214, 100, 64],
    "--COLOR_PLAYER_ME_GUESSED": [216, 100, 35],
    "--COLOR_PLAYER_BG_BASE": [0, 0, 100],
    "--COLOR_PLAYER_BG_ALT": [0, 0, 93],
    "--COLOR_PLAYER_BG_GUESSED_BASE": [113, 68, 58],
    "--COLOR_PLAYER_BG_GUESSED_ALT": [113, 57, 50],
    "--COLOR_TOOL_TIP_BG": [226, 100, 64],
    "--COLOR_GAMEBAR_TEXT": [0, 0, 0],
    "--COLOR_GAMEBAR_ROUND_TEXT": [0, 0, 0],
    "--COLOR_GAMEBAR_WORD_DESCRIPTION": [0, 0, 21],
    "--COLOR_TEXT_CANVAS_TRANSPARENT": [0, 0, 25],
    "--COLOR_CHAT_TEXT_BASE": [0, 0, 0],
    "--COLOR_CHAT_TEXT_GUESSED": [103, 68, 48],
    "--COLOR_CHAT_TEXT_CLOSE": [54, 100, 44],
    "--COLOR_CHAT_TEXT_DRAWING": [216, 60, 52],
    "--COLOR_CHAT_TEXT_JOIN": [103, 68, 48],
    "--COLOR_CHAT_TEXT_LEAVE": [21, 91, 42],
    "--COLOR_CHAT_TEXT_OWNER": [32, 100, 63],
    "--COLOR_CHAT_TEXT_GUESSCHAT": [86, 47, 46],
    "--COLOR_CHAT_BG_BASE": [0, 0, 100],
    "--COLOR_CHAT_BG_ALT": [0, 0, 93],
    "--COLOR_CHAT_SCROLLBAR": [0, 0, 49],
    "--COLOR_CHAT_SCROLLBAR_THUMB": [0, 0, 78],
    "--COLOR_CHAT_BG_GUESSED_BASE": [105, 100, 94],
    "--COLOR_CHAT_BG_GUESSED_ALT": [104, 100, 87],
    "--COLOR_CHAT_INPUT_COUNT": [0, 0, 0]
};

const THEME_BACKGROUNDS = {
    pink: "https://imgur.com/NIdFqXU.png",
    orange: "https://imgur.com/kMugOxY.png",
    green: "https://imgur.com/QKw7V42.png"
}

const setTheme = vars => {
    let css = Object.keys(vars).map(key => {
        let value = vars[key];
        let string = value.length == 3
            ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
            : `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;

        return `${key}: ${string};`;
    }).join("\n");
    const style = document.createElement("STYLE");
    style.id = "typo_theme_style";
    style.innerHTML = `:root {${css}}`;

    document.querySelector("#typo_theme_style")?.remove();
    document.body.append(style);
}

const simpleThemeColors = (mainHsl, textHsl, useIngame, useInputs, invertInputText, backgroundImage) => {
    const theme = JSON.parse(JSON.stringify(SKRIBBL_THEME));

    const mainHue = mainHsl[0];
    const mainSat = mainHsl[1];
    const mainLig = mainHsl[2];

    /* modify main elements */
    const mainHueBase = 226;
    const mainSatBase = 85;
    const mainLigBase = 32;
    const mainOpBase = 0.75;
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
    ];
    mains.forEach(k => theme[k][0] = (theme[k][0] - mainHueBase + mainHue) % 360);
    mains.forEach(k => theme[k][1] = theme[k][1] * (mainSat / 100));
    mains.forEach(k => theme[k][2] = theme[k][2] * (mainLig / 100));

    /* modify text */
    const texts = [
        "--COLOR_GAMEBAR_TEXT",
        "--COLOR_GAMEBAR_ROUND_TEXT",
        "--COLOR_PLAYER_TEXT_BASE",
        "--COLOR_CHAT_TEXT_BASE",
        "--COLOR_INPUT_TEXT"
    ];
    texts.forEach(k => theme[k] = [...textHsl]);
    theme["--COLOR_PANEL_TEXT_PLACEHOLDER"] = [textHsl[0], textHsl[1], textHsl[2] - 50];
    theme["--COLOR_GAMEBAR_WORD_DESCRIPTION"] = [textHsl[0], textHsl[1], textHsl[2], 0.7];
    if (invertInputText) theme["--COLOR_INPUT_TEXT"][2] = 100 - theme["--COLOR_INPUT_TEXT"][2];

    if (useIngame) {
        const themeSat = mainSatBase * (mainSat / 100);
        const themeLight = mainLigBase * (mainLig / 100);
        theme["--COLOR_CHAT_BG_BASE"] = [mainHue, themeSat, themeLight, mainOpBase];
        theme["--COLOR_CHAT_BG_ALT"] = [mainHue, themeSat, themeLight - 7, mainOpBase];
        theme["--COLOR_PLAYER_BG_BASE"] = [mainHue, themeSat, themeLight, mainOpBase];
        theme["--COLOR_PLAYER_BG_ALT"] = [mainHue, themeSat, themeLight - 7, mainOpBase];
    }

    if (useInputs) {
        theme["--COLOR_INPUT_BORDER"] = [mainHue, mainSatBase, 75 * (mainLigBase / 100), 0.8];
        theme["--COLOR_INPUT_BORDER_FOCUS"] = [mainHue, mainSatBase, 85 * (mainLigBase / 100), 0.8];
        theme["--COLOR_INPUT_BG"] = [mainHue, mainSatBase, 80 * (mainLigBase / 100), 0.7];
        theme["--COLOR_INPUT_HOVER"] = [mainHue, mainSatBase, 90 * (mainLigBase / 100), 0.7];
    }

    return theme;
}

[{
    "name": "Original", "options":
        { "urlLogo": "", "urlBackground": "", "containerImages": "", "fontColor": "", "fontColorButtons": "", "fontStyle": "", "containerBackgroundsCheck": false, "containerBackgrounds": "", "inputBackgroundsCheck": false, "inputBackgrounds": "", "containerOutlinesCheck": false, "containerOutlines": "", "inputOutlinesCheck": false, "inputOutlines": "", "hideFooter": false, "hideCaptcha": false, "hideMeta": false, "hideAvatarLogo": false, "hideInGameLogo": false, "hideAvatarSprites": false }
}, { "name": "Dark Discord", "options": { "urlLogo": "", "urlBackground": "https://cdn.discordapp.com/attachments/715996980849147968/814955491876012032/dcdark.png); background-size: 800px;(", "containerImages": "", "fontColor": "white", "fontColorButtons": "white", "fontStyle": "Karla:wght@400;600", "containerBackgroundsCheck": true, "containerBackgrounds": "#2C2F3375", "inputBackgroundsCheck": true, "inputBackgrounds": "#00000075", "containerOutlinesCheck": true, "containerOutlines": "transparent !important; border-left: 4px solid #7289DA !important; ", "inputOutlinesCheck": true, "inputOutlines": "transparent !important; border-left: 3px solid #363636 !important; ", "hideFooter": true, "hideCaptcha": true, "hideMeta": true, "hideAvatarLogo": true, "hideInGameLogo": true, "hideAvatarSprites": false } }, { "name": "Alpha", "options": { "urlLogo": "https://imgur.com/k8e70AG.png", "urlBackground": "https://i.imgur.com/UNZtzl6.jpg", "containerImages": "", "fontColor": "white", "fontColorButtons": "white", "fontStyle": "Mulish:wght@400;600", "containerBackgroundsCheck": true, "containerBackgrounds": "#ffffff50", "inputBackgroundsCheck": true, "inputBackgrounds": "#00000040", "containerOutlinesCheck": true, "containerOutlines": "", "inputOutlinesCheck": true, "inputOutlines": "", "hideFooter": true, "hideCaptcha": true, "hideMeta": true, "hideAvatarLogo": true, "hideInGameLogo": true, "hideAvatarSprites": false } }, { "name": "sdf", "options": { "urlLogo": "", "urlBackground": "", "urlBackgroundGame": "", "containerImages": "", "fontColor": "", "ingameFontColor": "", "fontColorButtons": "", "fontStyle": "", "containerBackgroundsCheck": false, "containerBackgrounds": "", "ingameContainerBackgroundsCheck": false, "ingameContainerBackgrounds": "", "inputBackgroundsCheck": false, "inputBackgrounds": "", "containerOutlinesCheck": false, "containerOutlines": "", "inputOutlinesCheck": false, "inputOutlines": "", "hideFooter": false, "hideTypoInfo": false, "hideDiscord": false, "hideAvatarLogo": false, "hideInGameLogo": false, "hideAvatarSprites": false, "hideTypoPanels": false, "injection": "" } }]