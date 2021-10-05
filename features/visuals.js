// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// inits the image options bar
// dependend on: genericfunctions.js
const visuals = {
    form: undefined,
    themes: [],
    applyOptions: (options) => {
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
        if (QS("div.logo-big img")) QS("div.logo-big img").src = urlLogo != "" ? urlLogo : "img/logo.gif";
        if (QS("div.logo-small img")) QS("div.logo-small img").src = urlLogo != "" ? urlLogo : "img/logo.gif";
        
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
            style.innerHTML += ".tooltip .tooltip-content, #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, div#game-toolbar.typomod div.tools-container div.tools div.tool, #game-toolbar div.color-picker div.preview div.graphic-container, #game-room .container-settings, #game-chat .container, #game-players .list .player, #game-players .list .player.odd {background-color: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += "#game-players .list .player.odd{background-image: linear-gradient(0, " + (val != "" ? val : "transparent") + ", " + (val != "" ? val : "transparent") + ");}";
            style.innerHTML += "#game-chat .content {background:none}";
            style.innerHTML += ":root{ --COLOR_TOOL_TIP_BG: " + val + " !important; } ";
            style.innerHTML += "#game-players div.list div.player div.bubble div.arrow{border-right-color:" + val + "} #game-players div.list div.player div.bubble div.content{background-color:" + val + "}";
            style.innerHTML += "#game-chat .container .content p:nth-child(even) {background-color: #ffffff20;}";
        }

        if (options["containerOutlinesCheck"] == true) {
            let val = options["containerOutlines"] ? options["containerOutlines"].trim() : "";
            style.innerHTML += "#imageAgent, #modal .box, #home .panel, .modalContainer, #game-chat .container, #game-players .list .player, #imageOptions {border-radius: 4px; border: 2px solid " + (val != "" ? val : "transparent") + " !important}";
        }

        if (options["containerImages"] && options["containerImages"].trim() != "")
        {
            style.innerHTML += "#imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat .container, #game-players .list  {background-image: url(" + options["containerImages"].trim() + ") !important}";
            style.innerHTML += "#game-players .list {background:none !important}";
        }
        // font color
        let color = options["fontColor"] ? options["fontColor"] : "";
        if (color && color != "") {
            style.innerHTML += "#home .bottom .footer .notice, * {color:" + color.trim() + "}";
            style.innerHTML += "input[type=checkbox].flatUI, #game-chat .container form input, input[type=text].flatUI, #home .bottom .footer .section-container .section{color:unset}"
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
            style.innerHTML += "#game-chat > div.container > div.content > p *:not([style*='rgb(125, 173, 63)']):not([style*='rgb(206, 79, 10)']):not([style*='rgb(204, 204, 0)']) {color:" + ingamecolor.trim() + " !important}";
            style.innerHTML += "#game * {color:" + ingamecolor.trim() + "}";
            style.innerHTML += "div#game-toolbar.typomod div.tools-container div.tools div.tool div.key, #game-word .description, #game-round .round-max, #game-round span, #game-players .player-amount b:nth-child(4), #game-players .player-amount span {color:" + ingamecolor.trim() + "; filter: brightness(0.8);}";
        }
        // font color of buttons / inputs
        let colorBtns = options["fontColorButtons"] ? options["fontColorButtons"] : "";
        if (colorBtns && colorBtns != "") style.innerHTML += "select, input, button, textarea {color:" + colorBtns.trim() + "}";
        if (ingamecolor || color || colorBtns) style.innerHTML += "#game-clock{color:black}";
        let font = options["fontStyle"] ? options["fontStyle"] : "";
        if (font && font != "") {
            [...QSA(".fontImport")].forEach(s => s.remove());
            document.head.appendChild(elemFromString(
                '<div class="fontImport" ><link rel="preconnect" href="https://fonts.gstatic.com">'
                + '<link href="https://fonts.googleapis.com/css2?family=' + font.trim() + '&display=swap" rel="stylesheet"></div>'));
            style.innerHTML += "*{font-family:'" + font.trim().split(":")[0].replaceAll("+"," ") + "', sans-serif !important}";
        }
        // input backgrounds 
        if (options["inputBackgroundsCheck"] == true) {
            let val = options["inputBackgrounds"] ? options["inputBackgrounds"].trim() : "";
            style.innerHTML += "input[type=checkbox], input[type=checkbox].flatUI,#modal .container .box .content .container-rooms .room, button.flatUI.green,button.flatUI.orange, button.flatUI.blue, button.flatUI, input[type=text].flatUI, .link .input-container .link-overlay, input, textarea, button, select {background: " + (val != "" ? val : "transparent") + " !important; box-shadow:none !important;} ";
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
            style.innerHTML += "#game .logo-small{display:none}";
        }
        if (options["hideAvatarLogo"] == true) {
            style.innerHTML += "#home .logo-big .avatar-container {display:none }";
        }
        if (options["hideAvatarSprites"] == true) {
            style.innerHTML += ".avatar-customizer .spriteSlot{display:none }";
            style.innerHTML += ".avatar-customizer .color, .avatar-customizer .mouth, .avatar-customizer .eyes {opacity: 1 !important}";
        }
        if (options["injection"] && options["injection"] != "") {
            if (QS("#injectionElems")) QS("#injectionElems").innerHTML = options["injection"];
            else document.body.append(elemFromString("<div id='injectionElems'>" + options["injection"] + "</div>"));
        }

        if (QS("#visualRules")) QS("#visualRules").innerHTML = style.innerHTML;
        else document.head.append(style);
    },
    show: () => {
        let options = JSON.parse(localStorage.visualOptions);
        visuals.loadOptions(options);
        const onclose = () => {
            let options = visuals.getOptions();
            visuals.applyOptions(options);
            localStorage.visualOptions = JSON.stringify(options);
        };
        new Modal(visuals.form, onclose, "Visual Settings");
    },
    loadOptions: (options) => {
        [...visuals.form.querySelectorAll("input")].forEach(input => {
            if (options[input.id] != undefined && options[input.id] != null) input.type == "text" ? input.value = options[input.id] : input.checked = options[input.id];
            else input.type == "text" ? input.value = "" : input.checked = false; 
        });
        visuals.applyOptions(options);
    },
    getOptions: () => {
        let options = {};
        [...visuals.form.querySelectorAll("input")].forEach(input => options[input.id] = (input.type == "text" ? input.value : input.checked));
        return options;
    },
    addTheme: undefined,
    init: () => {
        let html =
            `<div id='visualOpt' style='display:flex; flex-direction:column; align-items: center; width:100%'>
    <h3>Image Replacements</h3>
    <div style='width:100%; justify-content: space-evenly;display:flex;'>
        <div>
            <h4>Skribbl-Logo Image</h4>
            <input class='flatUI' type='text' id='urlLogo' placeholder='https://link.here/image.gif'>
        </div>
        <div>
            <h4>Background Image</h4>
            <input class='flatUI' type='text' id='urlBackground' placeholder='https://link.here/image.gif'>
        </div>
    </div>
    <div style='width:100%; justify-content: space-evenly;display:flex;'>
        <div>
            <h4>In-Game Background Image</h4>
            <input class='flatUI' type='text' id='urlBackgroundGame' placeholder='https://link.here/image.gif'>
        </div>
        <div>
            <h4>Custom Container Backgrounds</h4>
            <input class='flatUI' type='text' id='containerImages' placeholder='https://link.here/image.gif'>
        </div>
    </div>
    <br>
    <h3>Font Options</h3> 
    <div style='width:100%; justify-content: space-evenly;display:flex;'>
        <div>
            <h4>Font Color</h4>
            <input class='flatUI' type='text' id='fontColor' placeholder='#ffffff'>
        </div>
        <div>
            <h4>In-Game Font Color</h4>
            <input class='flatUI' type='text' id='ingameFontColor' placeholder='#ffffff'>
        </div>

        <div>
            <h4>Button Font Color</h4>
            <input class='flatUI' type='text' id='fontColorButtons' placeholder='#ffffff'>
        </div>
        <div>
            <h4>Font Style</h4>
            <input class='flatUI' type='text' id='fontStyle' placeholder='Roboto:ital,wght@1,300'>
        </div>
    </div>
    <br>
    <h3>Color Options</h3>
    <h4> Colors as rgb: <code>rgb(x, x, x, x%)</code> or hex: <code>#xxxxxxxx</code> or empty for transparent</h4>
    <div style="display: grid; grid-template-columns: 1fr 2fr; grid-column-gap: 1em;grid-row-gap: 1em; margin: 0 1em;">
        <label>
            <input type="checkbox" class="flatUI" id='containerBackgroundsCheck'> <span>Change Container Backgrounds</span>
        </label>
        <input class='flatUI' type='text' id='containerBackgrounds' placeholder='transparent'>

        <label>
            <input type="checkbox" class="flatUI" id='ingameContainerBackgroundsCheck'> <span>Change In-Game-Container Backgrounds</span>
        </label>
        <input class='flatUI' type='text' id='ingameContainerBackgrounds' placeholder='transparent'>

        <label>
            <input type="checkbox" class="flatUI" id='inputBackgroundsCheck'> <span>Change Input Backgrounds</span>
        </label>
        <input class='flatUI' type='text' id='inputBackgrounds' placeholder='transparent'>

        <label>
            <input type="checkbox" class="flatUI" id='containerOutlinesCheck'> <span>Container Outlines</span>
        </label>
        <input class='flatUI' type='text' id='containerOutlines' placeholder='transparent'>

        <label>
            <input type="checkbox" class="flatUI" id='inputOutlinesCheck'> <span>Input Outlines</span>
        </label>
        <input class='flatUI' type='text' id='inputOutlines' placeholder='transparent'>
    </div>
    <br>
    <h3>Hide Elements</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 1em;grid-row-gap: 1em; margin: 0 1em;">
        <label><input type="checkbox" class="flatUI" id="hideFooter"> <span>Hide credits, contact & TOS on frontpage</span></label>
        <label><input type="checkbox" class="flatUI" id="hideTypoInfo"> <span> Hide palantir stats</span></label>
        <label><input type="checkbox" class="flatUI" id="hideDiscord"> <span> Hide Discord banner</span></label>
        <label><input type="checkbox" class="flatUI" id="hideAvatarLogo"> <span> Hide avatars beyond logo</span></label>
        <label><input type="checkbox" class="flatUI" id="hideInGameLogo"> <span> Hide logo in-game</span></label>
        <label><input type="checkbox" class="flatUI" id="hideAvatarSprites"> <span> Hide sprites on frontpage</span></label>
    </div>
    <div>
        <h4>HTML/CSS injection: add HTML to body</h4>
        <input class='flatUI' type='text' id='injection' placeholder='<elem></elem> <style>elem { }</style>'>
    </div>
</div>`;
        visuals.form = elemFromString(html);
        [...visuals.form.querySelectorAll("input")].forEach(input => {
            input.addEventListener("input", () => visuals.applyOptions(visuals.getOptions()));
        });

        try { visuals.themes = JSON.parse(localStorage.themes); }
        catch{ visuals.themes = []; }
        let createBtn = (theme) => {
            let themebtn = elemFromString("<button class='flatUI green min air' style='margin:.5em'>" + theme.name + "</button>");
            themebtn.addEventListener("click", () => {
                visuals.loadOptions(theme.options);
                visuals.applyOptions(theme.options);
            });
            let removeToggle = null;
            themebtn.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (removeToggle) {
                    themebtn.remove();
                    visuals.themes = visuals.themes.filter(rem => rem.options != theme.options);
                    localStorage.themes = JSON.stringify(visuals.themes);
                }
                else {
                    themebtn.innerText = "Repeat to remove";
                    removeToggle = setTimeout(() => {
                        removeToggle = null;
                        themebtn.innerText = theme.name;
                    }, 2000);
                }
            });
            return themebtn;
        }
        let themes = elemFromString(
            `<div style='width:100%; justify-content: flex-start;display:flex;flex-wrap:wrap;'>
    </div>`);
        visuals.themes.forEach(theme => {
            themebtn = createBtn(theme);
            themes.appendChild(themebtn);
        });
        visuals.addTheme = (name, options) => {
            visuals.themes.push({ name: name, options:  options});
            localStorage.themes = JSON.stringify(visuals.themes);
            themes.insertBefore(createBtn([...visuals.themes].pop()), themes.firstChild);
        }
        let addtheme = elemFromString("<button class='flatUI blue min air' style='margin:.5em'>Save Current</button>");
        addtheme.addEventListener("click", () => {
            let input = prompt("How to name the theme?\nYou can right-click a theme to remove it.");
            if (input == null) return;
            let name = input && input != "" ? input : "new theme";
            visuals.addTheme(name, visuals.getOptions());
        });
        themes.appendChild(addtheme);
        let exportTheme = elemFromString("<button class='flatUI blue min air' style='margin:.5em'>Export</button>");
        exportTheme.addEventListener("click", () => {
            navigator.clipboard.writeText(JSON.stringify(visuals.getOptions()));
            new Toast("Copied theme text to clipboard.");
        });
        themes.appendChild(exportTheme);
        let importTheme = elemFromString("<button class='flatUI blue min air' style='margin:.5em'>Import</button>");
        importTheme.addEventListener("click", () => {
            try {
                let theme = prompt("Enter the theme text");
                if (theme == null) return;
                let input = prompt("How to name the theme?");
                if (input == null) return;
                let name = input && input != "" ? input : "new theme";
                visuals.themes.push({ name: name, options: JSON.parse(theme) });
                localStorage.themes = JSON.stringify(visuals.themes);
                themes.insertBefore(createBtn([...visuals.themes].pop()), themes.firstChild);
            }
            catch{new Toast("Error adding the theme.")}
        });
        themes.appendChild(importTheme);
        visuals.form.insertBefore(themes, visuals.form.firstChild);
    }

}