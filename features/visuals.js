// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const COLORS = Object.freeze({
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
});
const copyColors = () => JSON.parse(JSON.stringify(COLORS));
const toColorCode = value => value.length == 3
    ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
    : `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;


const simpleThemeColors = (mainHsl, textHsl, useIngame = false, useInputs = false, invertInputText = true) => {
    const theme = copyColors();

    /* modify main elements */
    const mainHueBase = 226;
    const mainSatBase = 85;
    const mainLigBase = 32;
    const mainOpBase = 0.75;

    if (mainHsl) {
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
        ];
        mains.forEach(k => theme[k][0] = (theme[k][0] - mainHueBase + mainHue) % 360);
        mains.forEach(k => theme[k][1] = theme[k][1] * (mainSat / 100));
        mains.forEach(k => theme[k][2] = theme[k][2] * (mainLig / 100));

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
    if (textHsl) {
        const texts = [
            "--COLOR_GAMEBAR_TEXT",
            "--COLOR_GAMEBAR_ROUND_TEXT",
            "--COLOR_PLAYER_TEXT_BASE",
            "--COLOR_CHAT_TEXT_BASE",
            "--COLOR_INPUT_TEXT",
            "--COLOR_PANEL_TEXT"
        ];
        texts.forEach(k => theme[k] = [...textHsl]);
        theme["--COLOR_PANEL_TEXT_PLACEHOLDER"] = [textHsl[0], textHsl[1], textHsl[2] - 50];
        theme["--COLOR_GAMEBAR_WORD_DESCRIPTION"] = [textHsl[0], textHsl[1], textHsl[2], 0.7];
        if (invertInputText) theme["--COLOR_INPUT_TEXT"][2] = 100 - theme["--COLOR_INPUT_TEXT"][2];
    }
    return theme;
}

// inits the image options bar
// dependend on: genericfunctions.js
const visuals = {
    themes: [],
    form: undefined,
    getElem: undefined,
    currentEditor: {
        colors: copyColors(),
        images: {
            urlLogo: "",
            urlBackground: "",
            containerImages: "",
            containerImages: "",
            backgroundTint: "transparent"
        },
        misc: {
            fontStyle: "",
            hideFooter: false,
            hideTypoInfo: false,
            hideTypoPanels: false,
            hideAvatarLogo: false,
            hideInGameLogo: false,
            hideAvatarSprites: false,
            themeCssUrl: ""
        }

    },
    html: `<div class="themesv2 manage">
        <div class="menu">
            <div class="manage">Select Theme</div>
            <div class="create">Theme Editor</div>
            <div class="add">Browse Themes</div>
        </div>

        <div class="body">
            <div class="manage">
                manage

            </div>
            
            <div class="create">
                
                <div class="themeName" style="display: grid; grid-template-columns: 1fr 3fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" for="themeName">Theme Name:</label>
                    <input placeholder="Name your theme" type="text" id="themeName" name="themeName" style="width: auto">
                    <button style="width: fit-content" class="flatUI blue min air">Save Theme</button>
                </div>

                <div class="themeColor" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Primary Color:</label>
                    <div id="primaryColorPicker"></div>
                    <label class="checkbox"><input type="checkbox" class="" id="useThemeInputs"> <div>Use on Input fields</div></label>
                    <label class="checkbox"><input type="checkbox" class="" id="useThemeIngame"> <div>Use ingame</div></label>
                </div>

                <div class="textColor" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Text Color:</label>
                    <div id="textColorPicker"></div>
                    <label class="checkbox" style="grid-column: span 2"><input type="checkbox" class="" id="invertText"> <div>Invert text brightness in input fields</div></label>
                </div>

                <div class="backgroundTint" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Background Color Tint:</label>
                    <div id="backgroundTintPicker"></div>
                    <label class="checkbox" style="grid-column: span 2"><input type="checkbox" class="" id="enableBackgroundTint"> <div>Tint background image with color</div></label>
                </div>

                <br><br>

                <details class="imageSettings">
                    <summary>Image Settings</summary>
                    <br>
                    <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 1em 3em;'>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Skribbl-Logo Image 
                            <input type='text' id='urlLogo' placeholder='https://link.here/image.gif'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Background-Image 
                            <input type='text' id='urlBackground' placeholder='https://link.here/image.gif'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            In-Game Background Image
                            <input type='text' id='urlBackgroundGame' placeholder='https://link.here/image.gif'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Container Background
                            <input type='text' id='containerImages' placeholder='https://link.here/image.gif'>
                        </label>

                    </div>
                    <br>
                </details>

                <details class="colorPickers">
                    <summary>Advanced Color Settings</summary>
                    <br>
                    <div><b>Warning:</b> All colors will be reset if you change the Theme Primary Color.</div>
                    <div style="display: grid; grid-gap: .5em 1em; grid-template-columns: 3fr 2fr; padding: 1em;">
                    ${Object.keys(COLORS).map(key => `<div>${key.replaceAll("-", "").replaceAll("_", " ")}</div><div class="picker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%;background-color: ${toColorCode(COLORS[key])}" data-color="${JSON.stringify(COLORS[key])}" id=${key}></div>`).join("")}
                    </div>
                    <br>
                </details>

                <details class="proSettings">
                    <summary>Miscellaneous</summary>
                    <br>
                    <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 1em 3em;'>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Use Google Font 
                            <input type='text' id='fontStyle' placeholder='Google Fonts import Link'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            External CSS URL
                            <input type='text' id='cssUrl' placeholder='https://link.here/style.css'>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideFooter"> 
                            <div>Hide footer</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideTypoPanels"> 
                            <div>Hide Typo panels</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideTypoInfo"> 
                            <div>Hide Typo user stats</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideAvatarLogo"> 
                            <div>Hide avatars beyond logo</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideInGameLogo"> 
                            <div>Hide in-game logo</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideAvatarSprites"> 
                            <div>Hide sprites on home page</div>
                        </label>
                    </div>

                    <br>
                </details>

            </div>
            
            <div class="add">

            </div>
        </div>    
    </div>
    `,
    init: () => {
        visuals.form = elemFromString(visuals.html);
        const elem = visuals.getElem = selector => visuals.form.querySelector(selector);
        const setContent = mode => {
            visuals.form.classList.toggle("add", mode == "add");
            visuals.form.classList.toggle("manage", mode == "manage");
            visuals.form.classList.toggle("create", mode == "create");
        };

        elem(".menu .add").addEventListener("click", () => setContent("add"));
        elem(".menu .manage").addEventListener("click", () => setContent("manage"));
        elem(".menu .create").addEventListener("click", () => setContent("create"));


        /* add lsiteners to other inputs */
        const inputChanged = elem => {
            console.log(elem.value);
            switch (elem.id) {
                case "urlLogo":
                    visuals.currentEditor.images.urlLogo = elem.value;
                    break;
                case "urlBackground":
                    visuals.currentEditor.images.urlBackground = elem.value;
                    break;
                case "urlBackgroundGame":
                    break;
                case "containerImages":
                    visuals.currentEditor.images.containerImages = elem.value;
                    break;
                case "fontStyle":
                    visuals.currentEditor.misc.fontStyle = elem.value;
                    break;
                case "cssUrl":
                    visuals.currentEditor.misc.themeCssUrl = elem.value;
                    break;
                case "hideFooter":
                    visuals.currentEditor.misc.hideFooter = elem.checked;
                    break;
                case "hideTypoInfo":
                    visuals.currentEditor.misc.hideTypoInfo = elem.checked;
                    break;
                case "hideTypoPanels":
                    visuals.currentEditor.misc.hideTypoPanels = elem.checked;
                    break;
                case "hideAvatarLogo":
                    visuals.currentEditor.misc.hideAvatarLogo = elem.checked;
                    break;
                case "hideInGameLogo":
                    visuals.currentEditor.misc.hideInGameLogo = elem.checked;
                    break;
                case "hideAvatarSprites":
                    visuals.currentEditor.misc.hideAvatarSprites = elem.checked;
                    break;

            }
            visuals.applyOptions(visuals.currentEditor);
        }

        [...visuals.form.querySelectorAll(".imageSettings input, .proSettings input")].forEach(elem => {
            elem.addEventListener("input", () => { inputChanged(elem); });
        });

    },
    show: () => {
        const onclose = () => {

        };
        new Modal(visuals.form, onclose, "Skribbl Themes");

        const createPicker = (element, change, button = true, transparency = false, defaultCol = "rgb(193,204,255)") => {
            const pickr = Pickr.create({
                el: element,
                useAsButton: button,
                lockOpacity: !transparency,
                theme: 'nano',
                autoReposition: true,
                default: defaultCol,
                comparison: false,
                components: {
                    // Main components
                    preview: true,
                    hue: true,
                    opacity: transparency,
                    // Input / output Options
                    interaction: {
                        input: true,
                        save: true
                    }
                }
            });
            pickr.on("change", color => {
                change(color);
            });
            return pickr;
        }

        /* init detail pickers */
        const showPicker = (entry) => {
            const picker = createPicker(entry.elem, (c) => { setColor(c, entry.elem.id); }, true, true, toColorCode(visuals.currentEditor.colors[entry.id]));
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        };

        const pickers = [];
        [...visuals.form.querySelectorAll(".colorPickers .picker")].forEach(elem => {
            let entry = { id: elem.id, elem: elem };
            pickers.push(entry);
            elem.addEventListener("click", () => showPicker(entry))
        });

        const setColor = (color, id) => {
            visuals.currentEditor.colors[id] = color.toHSLA();
            updateColors();
            visuals.applyOptions(visuals.currentEditor);
        }

        const updateColors = () => {
            pickers.forEach(picker => {
                picker.elem.style.backgroundColor = toColorCode(visuals.currentEditor.colors[picker.id]);
                picker.elem.setAttribute("data-color", JSON.stringify(visuals.currentEditor.colors[picker.id]));
            });
        }

        /* create primary pickers */
        let primaryColor = undefined;
        let textColor = undefined;
        const updateSimple = () => {
            visuals.currentEditor.colors = simpleThemeColors(primaryColor, textColor,
                visuals.getElem("#useThemeIngame").checked,
                visuals.getElem("#useThemeInputs").checked,
                visuals.getElem("#invertText").checked
            );
            visuals.applyOptions(visuals.currentEditor);
            updateColors();
        }

        let primaryPicker = createPicker(visuals.getElem("#primaryColorPicker"), (color) => {
            primaryColor = color.toHSLA().slice(0, 3);
            primaryPicker.applyColor(true);
            updateSimple();
        }, false, false);

        let textPicker = createPicker(visuals.getElem("#textColorPicker"), (color) => {
            textColor = color.toHSLA().slice(0, 3);
            textPicker.applyColor(true);
            updateSimple();
        }, false, false);

        let bgTint = "transparent";
        let tintPicker = createPicker(visuals.getElem("#backgroundTintPicker"), (color) => {
            bgTint = toColorCode(color.toHSLA());
            tintPicker.applyColor(true);
            if (visuals.getElem("#enableBackgroundTint").checked) visuals.currentEditor.images.backgroundTint = toColorCode(color.toHSLA());
            else visuals.currentEditor.images.backgroundTint = "transparent";
            visuals.applyOptions(visuals.currentEditor);
        }, false, true);

        visuals.getElem("#useThemeIngame").addEventListener("input", () => updateSimple());
        visuals.getElem("#useThemeInputs").addEventListener("input", () => updateSimple());
        visuals.getElem("#invertText").addEventListener("input", () => updateSimple());
        visuals.getElem("#enableBackgroundTint").addEventListener("input", (event) => {
            visuals.currentEditor.images.backgroundTint = event.target.checked ? bgTint : "transparent";
            visuals.applyOptions(visuals.currentEditor);
        });

    },
    loadOptions: () => {

    },
    applyOldOptions: (options) => {

        /* remove old visual rules */
        QS("#visualRules")?.remove();
        QS(".fontImport")?.remove();
        QS("#injectionElems")?.remove();

        let style = document.createElement("style");
        style.id = "visualRules";
        let urlBackground = options["urlBackground"] ? options["urlBackground"].trim() : "";
        if (urlBackground != "") style.innerHTML += "html:is([data-theme=dark], [data-theme='']) body {background: url(" + urlBackground + ")}";

        let urlBackgroundGame = options["urlBackgroundGame"] ? options["urlBackgroundGame"].trim() : "";
        if (urlBackgroundGame != "") {
            style.innerHTML += "#game:not([style='display: none;'])::after{position:fixed; content: ''; left:0; top:0; width:100%; height:100%;z-index:-1; background: url("
                + urlBackgroundGame + ")}";
            //style.innerHTML += "#screenLoading:not([style='display: none;'])::before{position:fixed; content: ''; left:0; top:0; bottom:0; right:0;z-index:1; background-image:inherit; background-repeat: inherit; background-position:inherit;} ";
        }

        let urlLogo = options["urlLogo"] ? options["urlLogo"].trim() : "";
        if (QS("div.logo-big img")) {
            QS("div.logo-big img").src = urlLogo != "" ? urlLogo : "img/logo.gif";
            style.innerHTML += `div.logo-big img {max-height:20vh}`;
        }
        if (QS("#game #game-logo img")) QS("#game #game-logo img").src = urlLogo != "" ? urlLogo : "img/logo.gif";

        if (options["containerBackgroundsCheck"] == true) {
            let val = options["containerBackgrounds"] ? options["containerBackgrounds"].trim() : "";
            style.innerHTML += "#setting-bar .content, #emojiPrev, #imageAgent, #home .news ::-webkit-scrollbar, #home .news ::-webkit-scrollbar-thumb, .modalContainer, .toast, #modal .box, #home .panel, #home .bottom .footer {background-color: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += "#home .bottom svg {fill: " + (val != "" ? val : "transparent") + " !important}";
        }
        if (options["containerBackgroundsCheck"] == true && options["ingameContainerBackgroundsCheck"] !== false) {
            options["ingameContainerBackgrounds"] = options["containerBackgrounds"];
            options["ingameContainerBackgroundsCheck"] = true;
            try {
                QS("#ingameContainerBackgrounds").value = options["ingameContainerBackgrounds"];
                QS("#ingameContainerBackgroundsCheck").checked = true;
            } catch { }
        }
        if (options["ingameContainerBackgroundsCheck"] == true) {
            let val = options["ingameContainerBackgrounds"] ? options["ingameContainerBackgrounds"].trim() : "";
            style.innerHTML += "#game-bar, .clickable,  #game-room .settings, #game-room .players,   .tooltip .tooltip-content, #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, div#game-toolbar.typomod div.tools-container div.tools div.tool, #game-toolbar div.color-picker div.preview div.graphic-container, #game-room .container-settings, #game-chat .container, #game-players .players-list .player, #game-players .players-list .player.odd {background-color: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += "#game-players .players-list .player.odd{background-image: linear-gradient(0, " + (val != "" ? val : "transparent") + ", " + (val != "" ? val : "transparent") + ");}";
            style.innerHTML += "#game-chat .chat-content {background:none}";
            style.innerHTML += ":root{ --COLOR_TOOL_TIP_BG: " + val + " !important; --COLOR_CHAT_BG_BASE: " + val + " !important; } ";
            style.innerHTML += "#game-players div.list div.player div.bubble div.arrow{border-right-color:" + val + "} #game-players div.list div.player div.bubble div.content{background-color:" + val + "}";
            style.innerHTML += "#game-chat .chat-container .chat-content p:nth-child(even), #game-chat .chat-container .chat-content p.guessed:nth-child(even) {background-color: #ffffff20;} #game-chat .chat-container .chat-content p.guessed:nth-child(odd){background-color:transparent}";
        }

        if (options["containerOutlinesCheck"] == true) {
            let val = options["containerOutlines"] ? options["containerOutlines"].trim() : "";
            style.innerHTML += "#game-bar,  #game-room .settings, #game-room .players,   #imageAgent, #modal .box, #home .panel, .modalContainer, #game-chat .chat-container, #game-players .players-list .player, #imageOptions {border-radius: 4px; border: 2px solid " + (val != "" ? val : "transparent") + " !important}";
        }

        if (options["containerImages"] && options["containerImages"].trim() != "") {
            style.innerHTML += "#game-bar, #game-room .settings, #game-room .players,  #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat .chat-container, #game-players .players-list  {background-image: url(" + options["containerImages"].trim() + ") !important}";
            style.innerHTML += "#game-players .players-list {background:none !important}";
        }
        // font color
        let color = options["fontColor"] ? options["fontColor"] : "";
        if (color && color != "") {
            style.innerHTML += "#home .bottom .footer .notice, *:not(.chat-content *), .characters {color:" + color.trim() + " !important}";
            style.innerHTML += "input[type=checkbox].flatUI, #game-chat .chat-container form input, input[type=text].flatUI, #home .bottom .footer .section-container .section{color:unset}"
        }
        // font color of everything in-game 
        if (!options["ingameFontColor"] && options["fontColor"]) {
            options["ingameFontColor"] = options["fontColor"];
            try {
                QS("#ingameFontColor").value = options["fontColor"];
            } catch { }
        }
        let ingamecolor = options["ingameFontColor"] ? options["ingameFontColor"] : "";
        if (ingamecolor && ingamecolor != "") {
            style.innerHTML += ":root{ --COLOR_CHAT_TEXT_BASE:" + ingamecolor.trim() + " !important}";
            style.innerHTML += "#game *:not(.chat-content *) {color:" + ingamecolor.trim() + "}";
            style.innerHTML += "div#game-toolbar.typomod div.tools-container div.tools div.tool div.key, #game-word .description, #game-round .round-max, #game-round span, #game-players .player-amount b:nth-child(4), #game-players .player-amount span {color:" + ingamecolor.trim() + "; filter: brightness(0.8);}";
        }
        // font color of buttons / inputs
        let colorBtns = options["fontColorButtons"] ? options["fontColorButtons"] : "";
        if (colorBtns && colorBtns != "") style.innerHTML += "select, input, button, textarea {color:" + colorBtns.trim() + "}";
        if (ingamecolor || color || colorBtns) style.innerHTML += "#game-clock{color:black !important}";
        let font = options["fontStyle"] ? options["fontStyle"] : "";
        if (font && font != "") {
            [...QSA(".fontImport")].forEach(s => s.remove());
            document.head.appendChild(elemFromString(
                '<div class="fontImport" ><link rel="preconnect" href="https://fonts.gstatic.com">'
                + '<link href="https://fonts.googleapis.com/css2?family=' + font.trim() + '&display=swap" rel="stylesheet"></div>'));
            style.innerHTML += "*{font-family:'" + font.trim().split(":")[0].replaceAll("+", " ") + "', sans-serif !important}";
        }
        // input backgrounds 
        if (options["inputBackgroundsCheck"] == true) {
            let val = options["inputBackgrounds"] ? options["inputBackgrounds"].trim() : "";
            style.innerHTML += "input[type=checkbox], input[type=checkbox].flatUI,#modal .container .box .content .container-rooms .room, button.flatUI.green,button.flatUI.orange, button.flatUI.blue, button.flatUI, input[type=text].flatUI, .link .input-container .link-overlay, input, textarea, button, select, #quickreact > span {background: " + (val != "" ? val : "transparent") + " !important; box-shadow:none !important;} ";
            style.innerHTML += "button:is(.flatUI, .flatUI.green, .flatUI.orange, .flatUI.blue):is(:hover, :active, :focus), input:is(:hover, :active, :focus), textarea:is(:hover, :active, :focus), button:is(:hover, :active, :focus), select:is(:hover, :active, :focus) {background: " + (val != "" ? val : "transparent") + " !important; opacity: 0.75}";
            style.innerHTML += ":is(#game-room .container-settings .group.customwords .checkbox, .report-menu) input[type=checkbox]:checked:after { content: '🞬'; height:100%; width: 100%; display: grid; place-content: center;}";
        }

        // outlines of inputs
        if (options["inputOutlinesCheck"] == true) {
            let val = options["inputOutlines"] ? options["inputOutlines"].trim() : "";
            style.innerHTML += ".link .input-container .link-overlay {display:none !important} input[type=checkbox]{border:none !important;} input, textarea, button, select {border: 2px solid " + (val != "" ? val : "transparent") + " !important; }";
        }
        if (options["hideFooter"] == true) {
            style.innerHTML += ".tos, .notice {display:none}";
        }
        if (options["hideTypoInfo"] == true) {
            style.innerHTML += "#typoUserInfo {display:none !important}";
        }
        if (options["hideDiscord"] == true) {
            style.innerHTML += "#home .socials {opacity:0}";
        }
        if (options["hideInGameLogo"] == true) {
            style.innerHTML += "#game #game-logo{display:none} #game{margin-top:2em}";
        }
        if (options["hideAvatarLogo"] == true) {
            style.innerHTML += "#home .logo-big .avatar-container {display:none }";
        }
        if (options["hideTypoPanels"] == true) {
            style.innerHTML += "#panelgrid .panel:is(:first-child, :last-child) {display:none } #panelgrid{grid-template-columns: 100% !important}";
        }
        if (options["hideAvatarSprites"] == true) {
            style.innerHTML += ".avatar-customizer .spriteSlot{display:none }";
            style.innerHTML += ".avatar-customizer {background-image: unset !important }";
            style.innerHTML += ".avatar-customizer .color, .avatar-customizer .mouth, .avatar-customizer .eyes {opacity: 1 !important}";
        }
        if (options["injection"] && options["injection"] != "") {
            if (QS("#injectionElems")) QS("#injectionElems").innerHTML = options["injection"];
            else document.body.append(elemFromString("<div id='injectionElems'>" + options["injection"] + "</div>"));
        }

        if (QS("#visualRules")) QS("#visualRules").innerHTML = style.innerHTML;
        else document.head.append(style);
    },
    applyOptions: (theme) => {

        /* remove old visual rules */
        QS("#visualRules")?.remove();
        QS(".fontImport")?.remove();
        QS("#injectionElems")?.remove();
        QS("#typoThemeBg")?.remove();
        QS("#typoThemeExternal")?.remove();
        QS("#typoThemeFont")?.remove();

        /* append css */
        let css = Object.keys(theme.colors).map(key => {
            let value = theme.colors[key];
            let string = value.length == 3
                ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
                : `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;

            return `${key}: ${string};`;
        }).join("\n");
        const style = document.createElement("STYLE");
        style.id = "typo_theme_style";
        style.innerHTML = `
        :root {${css}}
        body {
            background: none;
        }
        #typoThemeBg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${theme.images.backgroundTint};
            z-index: -1;
            pointer-events: none;
            filter: brightness(${theme.images.backgroundTint != "transparent" ? 4 : 1});
        }
        #typoThemeBg::after {
            image-rendering: unset;
            content: "";
            position: absolute;
            inset: 0;
            background-position: center;
            background-image: url(${theme.images.urlBackground != "" ? theme.images.urlBackground : "/img/background.png"});
            background-repeat: ${theme.images.urlBackground != "" ? "no-repeat" : "repeat"};
            background-size: ${theme.images.urlBackground != "" ? "cover" : "350px"};
            mix-blend-mode: ${theme.images.backgroundTint == "transparent" ? "none" : "multiply"};
            filter: ${theme.images.backgroundTint == "transparent" ? "none" : "saturate(0%)"};
        }

        ${theme.misc.hideFooter ? ".tos, .notice {display:none}" : ""}

        ${theme.misc.hideTypoInfo ? "#typoUserInfo {display:none !important}" : ""}

        ${theme.misc.hideTypoPanels ? "#panelgrid .panel:is(:first-child, :last-child) {display:none } #panelgrid{grid-template-columns: 100% !important}" : ""}

        ${theme.misc.hideInGameLogo ? "#game #game-logo{display:none} #game{margin-top:2em}" : ""}

        ${theme.misc.hideAvatarSprites ? `
        .avatar-customizer .spriteSlot{display:none }
        .avatar-customizer {background-image: unset !important }
        .avatar-customizer .color, .avatar-customizer .mouth, .avatar-customizer .eyes {opacity: 1 !important}
        ` : ""}

        ${theme.misc.hideAvatarLogo ? "#home .logo-big .avatar-container {display:none }" : ""}

        ${theme.images.containerImages != "" ? `
        #game-bar, #game-room .settings, #game-room .players,  #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, 
        #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat 
        .chat-container, #game-players .players-list  {background-image: url(${theme.images.containerImages}) !important}
        #game-players .players-list .player {background:none !important}
        ` : ""}

        ${theme.misc.fontStyle != "" ? `*{font-family:'${theme.misc.fontStyle.trim().split(":")[0].replaceAll("+", " ")}', sans-serif !important}` : ""}
        
        `;
        document.querySelector("#typo_theme_style")?.remove();
        document.body.append(style);

        /* add typo background */
        const bg = elemFromString(`<div id="typoThemeBg"></div>`);
        QS("#typoThemeBg")?.remove();
        document.body.appendChild(bg);

        /* add font import */
        if (theme.misc.themeCssUrl != "") {
            const css = elemFromString(`<link id="typoThemeExternal" rel="stylesheet" href="${theme.misc.themeCssUrl}">`);
            QS("#typoThemeExternal")?.remove();
            document.head.appendChild(css);
        }

        /* add theme style import */
        if (theme.misc.font != "") {
            const font = elemFromString(`<div id="typoThemeFont"><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=${theme.misc.fontStyle.trim()}&display=swap" rel="stylesheet"></div>`);
            QS("#typoThemeFont")?.remove();
            document.head.appendChild(font);
        }
    },
    addTheme: () => {

    }
}