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
    "--COLOR_CHAT_INPUT_COUNT": [0, 0, 0],
    "--COLOR_BUTTON_DANGER_BG": [44, 81, 51],
    "--COLOR_BUTTON_SUBMIT_BG": [110, 75, 55],
    "--COLOR_BUTTON_NORMAL_BG": [208, 80, 54],
    "--COLOR_BUTTON_DANGER_TEXT": [0, 0, 100],
    "--COLOR_BUTTON_SUBMIT_TEXT": [0, 0, 100],
    "--COLOR_BUTTON_NORMAL_TEXT": [0, 0, 100]
});

const copyColors = () => JSON.parse(JSON.stringify(COLORS));

const toColorCode = value => value.length == 3
    ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
    : `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;

const getEmptyTheme = () => ({
    colors: copyColors(),
    images: {
        urlLogo: "",
        urlBackground: "",
        urlBackgroundGame: "",
        backgroundRepeat: true,
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
        themeCssUrl: "",
        themeCss: "",
        hideMeta: false,
        cssText: "",
        htmlText: ""
    },
    hooks: Object.keys(COLORS).map(k => ({ color: k, css: "" })).reduce((acc, { color, css }) => {
        acc[color] = css;
        return acc;
    }, {})
});

/* thanks chatgpt :^ */
const getSelectorsWithVariables = (cssText, colorVariables) => {
    // Parse the CSS text using a DOM parser
    const parser = new DOMParser();
    const css = parser.parseFromString(`<style>${cssText}</style>`, 'text/html').querySelector('style');

    // Get all CSS rules from the stylesheet
    const rules = css.sheet.cssRules;

    // Initialize an empty object to store selectors for each variable
    const variableSelectors = {};

    // Iterate through each color variable to initialize empty arrays for each one
    colorVariables.forEach((colorVariable) => {
        variableSelectors[colorVariable] = [];
    });

    // Iterate through each rule to find selectors with variables
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        // Check if the rule is a CSSStyleRule (i.e., a selector with style properties)
        if (rule instanceof CSSStyleRule) {

            // Iterate through each style property to find variables
            for (let j = 0; j < rule.style.length; j++) {
                const propertyName = rule.style[j];
                const propertyValue = rule.style.getPropertyValue(propertyName);

                // Check if the property value contains any of the color variables
                colorVariables.forEach((colorVariable) => {
                    if (propertyValue.includes(`var(${colorVariable}`)) {
                        variableSelectors[colorVariable].push(rule.selectorText);
                    }
                });
            }
        }
    }

    // Return an object with color variables as keys and an array of selectors where they are used as the value
    return variableSelectors;
}

let SKRIBBL_HOOKS = localStorage.cache_skribbl_hooks ? JSON.parse(localStorage.cache_skribbl_hooks) : {};
(async () => {
    const style = await (await fetch("/css/style.css")).text();
    SKRIBBL_HOOKS = getSelectorsWithVariables(style, Object.keys(COLORS));
    localStorage.cache_skribbl_hooks = JSON.stringify(SKRIBBL_HOOKS);
})()


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
    shareTheme: async (theme) => {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log("Theme share id: " + xhr.responseText);
                        resolve(xhr.responseText);
                    } else {
                        reject(null);
                    }
                }
            };
            xhr.open("POST", "https://tobeh.host/Orthanc/themeapi/share/index.php", true); // Replace with the URL of your PHP script
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("theme=" + encodeURIComponent(theme));
        });
    },
    refreshThemeBrowser: () => {
        (async () => {
            const merge = (a, b) => {
                for (let key in b) {
                    if (b.hasOwnProperty(key)) {
                        if (!a.hasOwnProperty(key)) {
                            a[key] = b[key];
                        } else if (typeof b[key] === 'object' && typeof a[key] === 'object') {
                            merge(a[key], b[key]);
                        }
                    }
                }
                return a;
            }

            const themes = await (await fetch("https://tobeh.host/Orthanc/themeapi/all/")).json();

            /* update themes */

            for (let t of themes) {
                let added = visuals.themes.find(theme => theme.meta.id == t.id);
                if (added && added.meta.version && added.meta.version < t.version) {
                    let updated = await (await fetch("https://tobeh.host/Orthanc/themeapi/get/?id=" + t.id)).json();

                    const defaults = getEmptyTheme();
                    const merged = merge(updated, defaults);
                    merged.meta.version = t.version;
                    merged.meta.id = t.id;
                    visuals.themes = [merged, ...visuals.themes.filter(theme => theme.meta.id != t.id)];
                    localStorage.themesv2 = JSON.stringify(visuals.themes);
                }
            }

            /* add list */

            const container = visuals.getElem("#themeBrowser");
            container.innerHTML = "";
            themes.forEach(t => {
                const added = visuals.themes.some(a => a.meta.id == t.id);
                const entry = elemFromString(`<div class="theme">
                    <div><b>${t.name}</b> by ${t.author}</div>
                    <div>${t.downloads} Downloads</div>
                    <button ${added ? "disabled" : ""} class="flatUI green min air downloadTheme">${!added ? "Download" : "Added"} </button>
                    <div>v${t.version}</div>
                </div>
                `);
                container.appendChild(entry);
                entry.querySelector(".downloadTheme").addEventListener("click", async () => {

                    const theme = await (await fetch("https://tobeh.host/Orthanc/themeapi/download/?id=" + t.id)).json();

                    const defaults = getEmptyTheme();
                    const merged = merge(theme, defaults);
                    merged.meta.type = "onlineTheme";
                    merged.meta.version = t.version;
                    merged.meta.id = t.id;
                    visuals.applyOptions(merged);
                    localStorage.activeTheme = merged.meta.id;
                    localStorage.visualOptions = undefined;
                    visuals.saveTheme(merged, "");
                    new Toast("Theme has been imported!");
                    visuals.refreshThemeBrowser();
                });
            });
        })()
    },
    refreshThemeContainer: () => {
        const manage = visuals.getElem(".body .manage");
        manage.innerHTML = "";
        visuals.themes.forEach(theme => {
            const entry = elemFromString(`<div class="theme">
                <div><b>${theme.meta.name}</b> by ${theme.meta.author}</div>
                <div>${theme.meta.type == "theme" ? "Local Theme" : "Online Theme"}</div>
                <button class="flatUI green min air toggleTheme">${localStorage.activeTheme != undefined && localStorage.activeTheme == theme.meta.id ? "Disable" : "Use"}</button>
                <button ${theme.meta.id == 0 ? "disabled" : ""}  class="flatUI orange min air manageTheme"></button>

                <div style="grid-column: span all" class="manageSection">
                    <button class="flatUI orange min air deleteTheme">Delete</button>
                    <button class="flatUI blue min air editTheme" ${theme.meta.id == 0 || theme.meta.type != "theme" ? "disabled" : ""}>Edit</button>
                    <button class="flatUI blue min air shareTheme" ${theme.meta.id == 0 || theme.meta.type != "theme" ? "disabled" : ""}>Share</button>
                    <button class="flatUI blue min air renameTheme" ${theme.meta.id == 0 || theme.meta.type != "theme" ? "disabled" : ""}>Rename</button>
                </div>
            </div>
            `);
            manage.appendChild(entry);
            entry.querySelector(".toggleTheme").addEventListener("click", () => {
                if (Number(localStorage.activeTheme) !== theme.meta.id) visuals.applyOptions(theme);
                else {
                    visuals.applyOptions(visuals.themes.find(t => t.meta.id == 0));
                    localStorage.activeTheme = undefined;
                }
                localStorage.visualOptions = undefined;
                visuals.refreshThemeContainer();
            });
            entry.querySelector(".deleteTheme").addEventListener("click", () => {
                const result = confirm("Delete theme " + theme.meta.name + "?");
                if (!result) return;
                visuals.deleteTheme(theme.meta.id);
                visuals.applyOptions(visuals.themes.find(t => t.meta.id == 0));
            });
            entry.querySelector(".editTheme").addEventListener("click", () => {
                visuals.loadThemeToEditor(theme.meta.id, true);
            });
            entry.querySelector(".manageTheme").addEventListener("click", () => {
                entry.classList.toggle("manage");
            });
            entry.querySelector(".renameTheme").addEventListener("click", () => {
                const name = prompt("Enter the new name");
                if (name && name.length > 0) {
                    visuals.themes.forEach(t => {
                        if (t.meta.id == theme.meta.id) t.meta.name = name;
                    });
                    localStorage.themesv2 = JSON.stringify(visuals.themes);
                    visuals.refreshThemeContainer();
                }
            });
            entry.querySelector(".shareTheme").addEventListener("click", async () => {
                let url = await visuals.shareTheme(JSON.stringify(theme));
                new Toast("Share ID copied to clipboard! Use it in the 'Browse Themes' tab");
                navigator.clipboard.writeText(url);

            });
        });

        const oldThemes = JSON.parse(localStorage.themes ? localStorage.themes : "[]");
        oldThemes.forEach(theme => {
            const entry = elemFromString(`<div class="oldtheme">
            <div><b>${theme.name}</b></div>
            <div>Old Theme</div>
            <button class="flatUI green min air">Apply</button>
            <br>
            <br>
            `);
            manage.appendChild(entry);
            entry.querySelector(".green").addEventListener("click", () => {
                localStorage.visualOptions = JSON.stringify(theme.options);
                localStorage.activeTheme = undefined;
                visuals.applyOldOptions(theme.options);
                visuals.refreshThemeContainer();
            });
        });
    },
    mainPickers: { primary: undefined, text: undefined, tint: undefined },
    currentEditor: getEmptyTheme(),
    saveTheme: (theme, name) => {
        let creator = socket?.data?.user?.member?.UserName;
        if (!creator) creator = QS(".input-name").value;
        if (!creator) creator = "Unknown";
        if (!theme.meta) {
            theme.meta = {
                author: creator,
                created: Date.now(),
                type: "theme",
                id: Date.now(),
                name: name
            }
        }
        visuals.themes = visuals.themes.filter(t => t.meta.id != theme.meta.id);
        visuals.themes = [theme, ...visuals.themes];
        localStorage.themesv2 = JSON.stringify(visuals.themes.filter(t => t.meta.id > 0 || t.meta.type == "onlineTheme"));
        visuals.refreshThemeContainer();
        visuals.getElem(".menu .manage").click();
    },
    deleteTheme: (id) => {
        visuals.themes = visuals.themes.filter(t => t.meta.id != id);
        localStorage.themesv2 = JSON.stringify(visuals.themes);
        visuals.refreshThemeContainer();
    },
    loadThemeToEditor: (id, apply = true) => {
        let theme = visuals.themes.find(t => t.meta.id === id);
        if (!theme) theme = getEmptyTheme();
        theme = JSON.parse(JSON.stringify(theme));
        visuals.getElem(".menu .create").click();
        visuals.currentEditor = theme;
        visuals.getElem("#themeName").disabled = theme.meta?.id ? true : false;
        visuals.getElem(".themeColor").style.display = theme.meta?.id ? "none" : "grid";
        visuals.getElem(".textColor").style.display = theme.meta?.id ? "none" : "grid";
        visuals.getElem("#themeName").value = theme.meta?.name ? theme.meta.name : "";

        /* load normal input values */
        [...visuals.form.querySelectorAll(".imageSettings input, .proSettings input")].forEach(elem => {
            switch (elem.id) {
                case "urlLogo":
                    elem.value = theme.images.urlLogo;
                    break;
                case "urlBackground":
                    elem.value = theme.images.urlBackground;
                    break;
                case "urlBackgroundGame":
                    elem.value = theme.images.urlBackgroundGame;
                    break;
                case "containerImages":
                    elem.value = theme.images.containerImages;
                    break;
                case "fontStyle":
                    elem.value = theme.misc.fontStyle;
                    break;
                case "cssText":
                    elem.value = theme.misc.cssText;
                    break;
                case "htmlText":
                    elem.value = theme.misc.htmlText;
                    break;
                case "cssUrl":
                    elem.value = theme.misc.themeCssUrl;
                    break;
                case "hideFooter":
                    elem.checked = theme.misc.hideFooter;
                    break;
                case "hideTypoInfo":
                    elem.checked = theme.misc.hideTypoInfo;
                    break;
                case "hideTypoPanels":
                    elem.checked = theme.misc.hideTypoPanels;
                    break;
                case "hideAvatarLogo":
                    elem.checked = theme.misc.hideAvatarLogo;
                    break;
                case "hideInGameLogo":
                    elem.checked = theme.misc.hideInGameLogo;
                    break;
                case "hideAvatarSprites":
                    elem.checked = theme.misc.hideAvatarSprites;
                    break;
                case "hideMeta":
                    elem.checked = theme.misc.hideMeta;
                    break;
                case "backgroundRepeat":
                    elem.checked = theme.images.backgroundRepeat;
                    break;
            }
        });

        /* reset main pickers rgb(193,204,255)*/
        visuals.getElem("#primaryColorPicker").removeAttribute("data-color");
        visuals.getElem("#primaryColorPicker").style.backgroundColor = "blue";

        visuals.getElem("#textColorPicker").removeAttribute("data-color");
        visuals.getElem("#textColorPicker").style.backgroundColor = "blue";

        visuals.getElem("#backgroundTintPicker").removeAttribute("data-color");
        visuals.getElem("#backgroundTintPicker").style.backgroundColor = theme.images.backgroundTint != "transparent" ? theme.images.backgroundTint : "blue";

        visuals.getElem("#enableBackgroundTint").checked = theme.images.backgroundTint != "transparent";

        /* load color inits */
        visuals.form.querySelectorAll(".body .picker").forEach(p => {
            p.style.backgroundColor = toColorCode(theme.colors[p.id]);
            p.setAttribute("data-color", JSON.stringify(theme.colors[p.id]));
        });

        /* load hooks */
        [...visuals.form.querySelectorAll(".styleHookInput")].forEach(hook => {
            const id = hook.getAttribute("data-hook");
            hook.value = theme.hooks && theme.hooks[id] ? theme.hooks[id] : "";
        });

        if (apply) visuals.applyOptions(visuals.currentEditor);
    },
    html: `<div class="themesv2 manage">
        <div class="menu">
            <div class="manage">Select Theme</div>
            <div class="create">Theme Editor</div>
            <div class="add">Browse Themes</div>
        </div>

        <div class="body">
            <div class="manage">

            </div>
            
            <div class="create">
                
                <div class="themeName" style="display: grid; grid-template-columns: 1fr 3fr 2fr 1fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" for="themeName">Theme Name:</label>
                    <input placeholder="Name your theme" type="text" id="themeName" name="themeName" style="width: auto">
                    <button id="saveTheme" style="width: fit-content" class="flatUI blue min air">Save Theme</button>
                    <button id="resetTheme" style="width: fit-content" class="flatUI orange min air">Reset</button>
                </div>

                <div class="themeColor" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Primary Color:</label>
                    <div id="primaryColorPicker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%; background: blue;"></div>
                    <label class="checkbox"><input type="checkbox" class="" id="useThemeInputs"> <div>Use on Input fields</div></label>
                    <label class="checkbox"><input type="checkbox" class="" id="useThemeIngame"> <div>Use ingame</div></label>
                </div>

                <div class="textColor" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Text Color:</label>
                    <div id="textColorPicker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%; background: blue;"></div>
                    <label class="checkbox" style="grid-column: span 2"><input type="checkbox" class="" id="invertText"> <div>Invert text brightness in input fields</div></label>
                </div>

                <div class="backgroundTint" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Background Color Tint:</label>
                    <div id="backgroundTintPicker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%; background: blue;"></div>
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

                        <label class="checkbox">
                            <input type="checkbox" class="" id="backgroundRepeat"> 
                            <div>Repeat Background</div>
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
                    <div id="colorSwatchesTheme" style="display: grid; grid-gap: .5em 1em; grid-template-columns: 3fr 2fr; padding: 1em;">
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

                        <label style="display:flex; flex-direction: column; gap: .5em; grid-column: span 2">
                            Plain CSS Injection
                            <input type='text' id='cssText' placeholder='.logo-big { display: none !Important; }'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em; grid-column: span 2">
                            Plain HTML Injection
                            <input type='text' id='htmlText' placeholder='<div>hello there</div>'>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideFooter"> 
                            <div>Hide footer</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideMeta"> 
                            <div>Hide About, News & How-To</div>
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

                <details class="skribblHooks">
                    <summary>Skribbl Style Hooks</summary>
                    <br>
                    <div>
                        Skribbl style hooks allow more advanced CSS styling without having to dig through the skribbl css classes.<br>
                        The CSS you write will be applied wherever the skribbl color variable is used.
                    </div>
                    <br>
                    <div style="display: grid; grid-gap: .5em 1em; grid-template-columns: 1fr 3fr; padding: 1em;">
                        ${Object.keys(COLORS).map(key => `<div>${key.replaceAll("-", "").replaceAll("_", " ")}</div><input class="styleHookInput" data-hook="${key}" id="styleHook${key}" type='text' id='cssUrl' placeholder='background: green; border: 2px solid red;'>`).join("")}
                    </div>
                    <br>
                </details>

            </div>
            
            <div class="add">

                <div class="themeUrlImport" style="display: grid; grid-template-columns: 1fr 3fr 1fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" for="themeShareLink">Theme Share ID:</label>
                    <input placeholder="Ask a friend to share their theme" type="text" id="themeShareLink" name="themeShareLink" style="width: auto">
                    <button id="themeShareLinkSubmit" style="width: fit-content" class="flatUI blue min air">Load Theme</button>
                </div>
                <br>

                <div id="themeBrowser" style="display:flex; flex-direction:column; gap: .8em;">
                </div>

            </div>
        </div>    
    </div>
    `,
    init: () => {

        /* fill themes with missing values */
        const merge = (a, b) => {
            for (let key in b) {
                if (b.hasOwnProperty(key)) {
                    if (!a.hasOwnProperty(key)) {
                        a[key] = b[key];
                    } else if (typeof b[key] === 'object' && typeof a[key] === 'object') {
                        merge(a[key], b[key]);
                    }
                }
            }
            return a;
        }
        const local = JSON.parse(localStorage.themesv2 ? localStorage.themesv2 : "[]");
        local.forEach(t => {
            const defaults = getEmptyTheme();
            const merged = merge(t, defaults);
            visuals.themes.push(merged);
        });

        visuals.themes.push({ ...getEmptyTheme(), meta: { name: "Original Theme", author: "Mel", type: "theme", id: 0, created: 0 } });
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
            switch (elem.id) {
                case "urlLogo":
                    visuals.currentEditor.images.urlLogo = elem.value;
                    break;
                case "urlBackground":
                    visuals.currentEditor.images.urlBackground = elem.value;
                    break;
                case "urlBackgroundGame":
                    visuals.currentEditor.images.urlBackgroundGame = elem.value;
                    break;
                case "containerImages":
                    visuals.currentEditor.images.containerImages = elem.value;
                    break;
                case "fontStyle":
                    const regex = /\?family=([^&]*)/;
                    const match = elem.value.match(regex);
                    visuals.currentEditor.misc.fontStyle = match ? match[1] : elem.value;
                    break;
                case "cssUrl":
                    visuals.currentEditor.misc.themeCssUrl = elem.value;
                    break;
                case "cssText":
                    visuals.currentEditor.misc.cssText = elem.value;
                    break;
                case "htmlText":
                    visuals.currentEditor.misc.htmlText = elem.value;
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
                case "hideMeta":
                    visuals.currentEditor.misc.hideMeta = elem.checked;
                    break;
                case "backgroundRepeat":
                    visuals.currentEditor.images.backgroundRepeat = elem.checked;
                    break;
            }
            visuals.applyOptions(visuals.currentEditor);
        }

        [...visuals.form.querySelectorAll(".imageSettings input, .proSettings input")].forEach(elem => {
            elem.addEventListener("input", () => { inputChanged(elem); });
        });

        /* setup pickers, ugh */
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

        /* setup hooks */
        [...visuals.form.querySelectorAll(".styleHookInput")].forEach(hook => {
            const id = hook.getAttribute("data-hook");
            hook.addEventListener("input", () => {
                visuals.currentEditor.hooks[id] = hook.value;
                visuals.applyOptions(visuals.currentEditor);
            });
        });

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

        /* set primary color picker */
        visuals.getElem("#primaryColorPicker").addEventListener("click", (e) => {
            let color = JSON.parse(e.target.getAttribute("data-color"));
            const picker = createPicker(e.target, color => {
                primaryColor = color.toHSLA().slice(0, 3);
                e.target.setAttribute("data-color", JSON.stringify(primaryColor));
                e.target.style.backgroundColor = toColorCode(primaryColor);
                updateSimple();
            }, true, false, color ? toColorCode(color) : undefined);
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        });

        /* set text color picker */
        visuals.getElem("#textColorPicker").addEventListener("click", (e) => {
            let color = JSON.parse(e.target.getAttribute("data-color"));
            const picker = createPicker(e.target, color => {
                textColor = color.toHSLA().slice(0, 3);
                e.target.setAttribute("data-color", JSON.stringify(textColor));
                e.target.style.backgroundColor = toColorCode(textColor);
                updateSimple();
            }, true, false, color ? toColorCode(color) : undefined);
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        });

        /* set tint color picker */
        visuals.getElem("#backgroundTintPicker").addEventListener("click", (e) => {
            let color = JSON.parse(e.target.getAttribute("data-color"));
            const picker = createPicker(e.target, color => {
                tintColor = color.toHSLA();
                e.target.setAttribute("data-color", JSON.stringify(tintColor));
                e.target.style.backgroundColor = toColorCode(tintColor);
                visuals.currentEditor.images.backgroundTint = toColorCode(tintColor);
                visuals.getElem("#enableBackgroundTint").checked = true;
                visuals.applyOptions(visuals.currentEditor);
            }, true, false, color ? toColorCode(color) : undefined);
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        });

        visuals.getElem("#useThemeIngame").addEventListener("input", () => updateSimple());
        visuals.getElem("#useThemeInputs").addEventListener("input", () => updateSimple());
        visuals.getElem("#invertText").addEventListener("input", () => updateSimple());
        visuals.getElem("#enableBackgroundTint").addEventListener("input", (event) => {
            let checked = event.target.checked;
            let current = visuals.getElem("#backgroundTintPicker").getAttribute("data-color");
            if (!checked || !current) visuals.currentEditor.images.backgroundTint = "transparent";
            else visuals.currentEditor.images.backgroundTint = toColorCode(JSON.parse(current));
            visuals.applyOptions(visuals.currentEditor);
        });

        visuals.refreshThemeContainer();

        /*  save handler */
        elem("#saveTheme").addEventListener("click", () => {
            const name = elem("#themeName").value;
            if (name == "") name = "New Theme";

            const theme = JSON.parse(JSON.stringify(visuals.currentEditor));
            visuals.loadThemeToEditor("", false);
            visuals.saveTheme(theme, name);
            primaryColor = undefined;
            textColor = undefined;
        });

        /*  reset handler */
        elem("#resetTheme").addEventListener("click", () => {
            localStorage.activeTheme = undefined;
            localStorage.activeOldTheme = undefined;
            visuals.loadThemeToEditor("", true);
            localStorage.activeTheme = undefined;
            visuals.refreshThemeContainer();
            primaryColor = undefined;
            textColor = undefined;
        });

        /*  import handler */
        elem("#themeShareLinkSubmit").addEventListener("click", async () => {
            elem("#themeShareLinkSubmit").disabled = true;
            elem("#themeShareLinkSubmit").innerText = "Loading...";
            try {
                let link = elem("#themeShareLink").value;
                let id = link.split("/").reverse()[0];
                let text = await (await fetch("https://tobeh.host/Orthanc/themeapi/get/?id=" + id)).text();
                let theme = JSON.parse(text);

                const defaults = getEmptyTheme();
                const merged = merge(theme, defaults);
                visuals.applyOptions(merged);
                localStorage.activeTheme = merged.meta.id;
                localStorage.visualOptions = undefined;
                visuals.saveTheme(merged, "");
                new Toast("Theme has been imported!");
            }
            catch (e) {
                console.log(e);
                new Toast("Theme could not be loaded...");
            }
            elem("#themeShareLinkSubmit").disabled = false;
            elem("#themeShareLinkSubmit").innerText = "Load Theme";
        });

        /* add theme browser */
        visuals.refreshThemeBrowser();

    },
    show: () => {
        const onclose = () => {

        };
        new Modal(visuals.form, onclose, "Skribbl Themes");
    },
    loadActiveTheme: () => {
        let active = localStorage.activeTheme;
        let theme = visuals.themes.find(t => t.meta.id == active);
        if (theme && active != undefined) visuals.applyOptions(theme);
        else if (localStorage.visualOptions != undefined) {
            visuals.applyOldOptions(JSON.parse(localStorage.visualOptions));
        }
        visuals.refreshThemeContainer();
    },
    applyOldOptions: (options) => {

        /* remove old visual rules */
        QS("#visualRules")?.remove();
        QS(".fontImport")?.remove();
        QS("#injectionElems")?.remove();
        QS("#typoThemeBg")?.remove();
        QS("#typoThemeExternal")?.remove();
        QS("#typoThemeFont")?.remove();
        QS("#typo_theme_style")?.remove();
        [...QSA(".typo_theme_injection_element")].forEach(elem => elem.remove());

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
            style.innerHTML += ":root {--COLOR_PANEL_BUTTON: " + (val != "" ? val : "transparent") + " !important}";
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

        if (theme.meta?.id) {
            localStorage.activeTheme = theme.meta.id;
            localStorage.activeOldTheme = undefined;
        }

        /* remove old visual rules */
        QS("#visualRules")?.remove();
        QS(".fontImport")?.remove();
        QS("#injectionElems")?.remove();
        QS("#typoThemeBg")?.remove();
        QS("#typoThemeExternal")?.remove();
        QS("#typoThemeFont")?.remove();
        QS("#typo_theme_style")?.remove();
        [...QSA(".typo_theme_injection_element")].forEach(elem => elem.remove());

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
            background-repeat: ${theme.images.urlBackground == "" || theme.images.backgroundRepeat ? "repeat" : "no-repeat"};
            background-size: ${theme.images.urlBackground == "" ? "350px" : theme.images.backgroundRepeat ? "auto" : "cover"};
            mix-blend-mode: ${theme.images.backgroundTint == "transparent" ? "none" : "multiply"};
            filter: ${theme.images.backgroundTint == "transparent" ? "none" : "saturate(0%)"};
        }
        #typoThemeBg.ingame${theme.images.urlBackgroundGame != "" ? "" : ".disabled"}::after {
            background-image: url(${theme.images.urlBackgroundGame});
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

        ${theme.images.containerImages != "" ? `
        #game-bar, #game-room .settings, #game-room .players,  #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, 
        #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat 
        .chat-container, #game-players .players-list  {background-image: url(${theme.images.containerImages}) !important}
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

        ${theme.misc.fontStyle != "" ? `*{font-family:'${theme.misc.fontStyle.trim().split(":")[0].replaceAll("+", " ")}', sans-serif !important}` : ""}

        ${theme.images.urlLogo != "" ? "div.logo-big img {max-height:20vh}" : ""}

        ${Object.keys(theme.hooks ? theme.hooks : {}).filter(key => theme.hooks[key] != "").map(key => `${SKRIBBL_HOOKS[key].join(",")}{${theme.hooks[key]}}`).join("\n")}

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
        QS("#typo_theme_style")?.remove();
        document.body.append(style);

        /* add typo background */
        const bg = elemFromString(`<div id="typoThemeBg"></div>`);
        QS("#typoThemeBg")?.remove();
        document.body.appendChild(bg);

        /* use image url */
        let small = QS("div.logo-big img");
        let big = QS("#game #game-logo img");
        if (theme.images.urlLogo != "") {
            if (small) small.src = theme.images.urlLogo;
            if (big) big.src = theme.images.urlLogo;
        }
        else {
            if (small) small.src = "img/logo.gif";
            if (big) big.src = "img/logo.gif";
        }

        /* add font import */
        QS("#typoThemeExternal")?.remove();
        if (theme.misc.themeCssUrl != "") {
            const css = elemFromString(`<link id="typoThemeExternal" rel="stylesheet" href="${theme.misc.themeCssUrl}">`);
            document.head.appendChild(css);
        }

        /* add theme style import */
        QS("#typoThemeFont")?.remove();
        if (theme.misc.fontStyle != "") {
            const font = elemFromString(`<div id="typoThemeFont"><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=${theme.misc.fontStyle.trim()}&display=swap" rel="stylesheet"></div>`);
            document.head.appendChild(font);
        }

        /* add theme html injection */
        if (theme.misc.htmlText != "") {
            try {
                const inj = elemFromString(`<div>${theme.misc.htmlText}</div>`);
                [...inj.children].forEach(c => {
                    c.classList.add("typo_theme_injection_element");
                    document.body.append(c);
                });
            }
            catch { }
        }
    }
}