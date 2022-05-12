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
        if (urlBackground != "") style.innerHTML += "body {background: url(" + urlBackground + ")}";

        let urlBackgroundGame = options["urlBackgroundGame"] ? options["urlBackgroundGame"].trim() : "";
        if (urlBackgroundGame != "") {
            style.innerHTML += "#screenGame:not([style='display: none;'])::after,#screenLoading:not([style='display: none;'])::after{position:fixed; content: ''; left:0; top:0; width:100%; height:100%;z-index:-1; background: url("
                + urlBackgroundGame + ")}";
            style.innerHTML += "#screenLoading:not([style='display: none;'])::before{position:fixed; content: ''; left:0; top:0; bottom:0; right:0;z-index:1; background-image:inherit; background-repeat: inherit; background-position:inherit;} ";
        }

        let urlLogo = options["urlLogo"] ? options["urlLogo"].trim() : "";
        if (QS("img.logo.logoBig")) QS("img.logo.logoBig").src = urlLogo != "" ? urlLogo : "res/logo.gif";
        if (QS("img.logo.logoSmall")) QS("img.logo.logoSmall").src = urlLogo != "" ? urlLogo : "res/logo.gif";
        
        if (options["containerBackgroundsCheck"] == true) {
            let val = options["containerBackgrounds"] ? options["containerBackgrounds"].trim() : "";
            style.innerHTML += "#containerGamePlayers, #quickreact > span, .lobbyName, .lobbyContent, .tool:not(.toolActive), .brushSize, .loginPanelContent, .gameHeader, #containerChat, #imageOptions {background-color: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += ".loginPanelContent {box-shadow: " + (val != "" ? "" : "none") + "}";//0 0 4px 0 rgba(0,0,0,.5)
            style.innerHTML += "#containerGamePlayers .player, .updateInfo, #boxChat, #boxMessages > p:not(.markedMessage), #loginAvatarCustomizeContainer {background: transparent !important; border: none;}";
            style.innerHTML += ".guessedWord .rank {color: rgb(86, 206, 39) !important}";
            style.innerHTML += ".guessedWord::after {content: '';position: absolute;inset: 0;border-right: 3px solid #82c669;z-index: -1;box-shadow: inset -55px 0px 50px -50px #82c669;}";
        }

        if (options["containerOutlinesCheck"] == true) {
            let val = options["containerOutlines"] ? options["containerOutlines"].trim() : "";
            style.innerHTML += ".loginPanelContent, .lobbyName, .lobbyContent, .modalContainer, .gameHeader, #containerChat, #imageOptions {border-radius: 4px; border: 2px solid " + (val != "" ? val : "transparent") + " !important}";
        }

        if (options["containerImages"] && options["containerImages"].trim() != "")
        {
            style.innerHTML += "#containerGamePlayers, .lobbyName, .lobbyContent, .loginPanelContent, .gameHeader, #containerChat, #imageOptions  {background-image: url(" + options["containerImages"].trim() + ") !important}";
            style.innerHTML += "#containerGamePlayers .player{background:none !important}";
        }

        let color = options["fontColor"] ? options["fontColor"] : "";
        if (color && color != "") {
            style.innerHTML += "*:not(.colorMsg){color:" + color.trim() + " !important}";
            style.innerHTML += "#emojiPrev span, #sharePopup *, #downloadPopup *, #gamemodePopup *, #saveDrawingPopup *, .player .text, .wordContainer .word, .modalTitle, .modal-title, .checkbox label {color: black !important}";
        }
        let colorBtns = options["fontColorButtons"] ? options["fontColorButtons"] : "";
        if (colorBtns && colorBtns != "") style.innerHTML += "select, input, .btn{color:" + colorBtns.trim() + " !important}";
        if (color || colorBtns) style.innerHTML += "#timer, .modalContainer *, .toast {color: black !important;}";
        let font = options["fontStyle"] ? options["fontStyle"] : "";
        if (font && font != "") {
            [...QSA(".fontImport")].forEach(s => s.remove());
            document.head.appendChild(elemFromString(
                '<div class="fontImport" ><link rel="preconnect" href="https://fonts.gstatic.com">'
                + '<link href="https://fonts.googleapis.com/css2?family=' + font.trim() + '&display=swap" rel="stylesheet"></div>'));
            style.innerHTML += "*{font-family:'" + font.trim().split(":")[0].replaceAll("+"," ") + "', sans-serif !important}";
        }

        if (options["inputBackgroundsCheck"] == true) {
            let val = options["inputBackgrounds"] ? options["inputBackgrounds"].trim() : "";
            style.innerHTML += "input, textarea, .btn, select {background: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += "input:hover, textarea:hover, .btn:hover, select:hover {background: " + (val != "" ? val : "transparent") + " !important; opacity: 0.85}";
        }
        if (options["inputOutlinesCheck"] == true) {
            let val = options["inputOutlines"] ? options["inputOutlines"].trim() : "";
            style.innerHTML += "input, textarea, .btn, select {border: 2px solid " + (val != "" ? val : "transparent") + " !important}";
        }
        if (options["canvasBackgroundCheck"] == true) {
            let val = options["canvasBackground"] ? options["canvasBackground"].trim() : "";
            style.innerHTML += "#canvasGame {background: " + (val != "" ? val : "white") + " !important} ";
        }
        if (options["hideFooter"] == true) {
            style.innerHTML += ".login-content .col-xs-12{display:none}";
        }
        if (options["hideCaptcha"] == true) {
            style.innerHTML += ".grecaptcha-badge{display:none !important}";
        }
        if (options["hideMeta"] == true) {
            style.innerHTML += "#tabAbout, #tabHow{display:none}";
        }
        if (options["hideInGameLogo"] == true) {
            style.innerHTML += "#containerLogoSmall{display:none !important}";
        }
        if (options["hideAvatarLogo"] == true) {
            style.innerHTML += "#logoAvatarContainer{display:none }";
        }
        if (options["hideBrushlab"] == true) {
            style.innerHTML += "#brushlabbtn{display:none }";
        }
        else {
            style.innerHTML += "#brushlabbtnside{display:none }";
        }
        if (options["hideAvatarSprites"] == true) {
            style.innerHTML += ".spriteSlot{display:none }";
            style.innerHTML += "#loginAvatarCustomizeContainer .color, #loginAvatarCustomizeContainer .mouth, #loginAvatarCustomizeContainer .eyes {opacity: 1 !important}";
        }
        if (options["injection"] && options["injection"] != "") {
            if (QS("#injectionElems")) QS("#injectionElems").innerHTML = options["injection"];
            else document.body.append(elemFromString("<div id='injectionElems'>" + options["injection"] + "</div>"));
        }
        else QS("#injectionElems")?.remove();

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
<style>
#visualOpt .checkbox {width:100%; justify-content: space-evenly;display:flex; flex-wrap: wrap;}
#visualOpt .checkbox label{margin:1em;flex:1;}
</style>
    <h3>Image Replacements</h3>
    <div style='width:100%; justify-content: space-evenly;display:flex;'>
        <div>
            <h4>Skribbl-Logo Image</h4>
            <input class='form-control' type='text' id='urlLogo' placeholder='https://link.here/image.gif'>
        </div>
        <div>
            <h4>Background Image</h4>
            <input class='form-control' type='text' id='urlBackground' placeholder='https://link.here/image.gif'>
        </div>
    </div>
    <div style='width:100%; justify-content: space-evenly;display:flex;'>
        <div>
            <h4>In-Game Background Image</h4>
            <input class='form-control' type='text' id='urlBackgroundGame' placeholder='https://link.here/image.gif'>
        </div>
        <div>
            <h4>Custom Container Backgrounds</h4>
            <input class='form-control' type='text' id='containerImages' placeholder='https://link.here/image.gif'>
        </div>
    </div>
    <br>
    <h3>Font Options</h3> 
    <div style='width:100%; justify-content: space-evenly;display:flex;'>
        <div>
            <h4>Font Color</h4>
            <input class='form-control' type='text' id='fontColor' placeholder='#ffffff'>
        </div>
        <div>
            <h4>Button Font Color</h4>
            <input class='form-control' type='text' id='fontColorButtons' placeholder='#ffffff'>
        </div>
        <div>
            <h4>Font Style</h4>
            <input class='form-control' type='text' id='fontStyle' placeholder='Roboto:ital,wght@1,300'>
        </div>
    </div>
    <br>
    <h3>Color Options</h3>
    <h4> Colors as rgb: <code>rgb(x, x, x, x%)</code> or hex: <code>#xxxxxxxx</code> or empty for transparent</h4>
    <div class="checkbox">
        <label>
            <input type="checkbox" id='containerBackgroundsCheck'> Change Container Backgrounds 
            <input class='form-control' type='text' id='containerBackgrounds' placeholder='transparent'>
        </label>
        <label>
        <input type="checkbox" id='inputBackgroundsCheck'> Change Input Backgrounds
            <input class='form-control' type='text' id='inputBackgrounds' placeholder='transparent'>
        </label>
        <label>
            <input type="checkbox" id='containerOutlinesCheck'> Container Outlines
            <input class='form-control' type='text' id='containerOutlines' placeholder='transparent'>
        </label>
        <label>
            <input type="checkbox" id='inputOutlinesCheck'> Input Outlines
            <input class='form-control' type='text' id='inputOutlines' placeholder='transparent'>
        </label>
        <label>
            <input type="checkbox" id='canvasBackgroundCheck'> Replace Canvas Background
            <input class='form-control' type='text' id='canvasBackground' placeholder='white'>
        </label>
    </div>
    <br>
    <h3>Hide Elements</h3>
    <div class="checkbox">
        <label><input type="checkbox" id="hideFooter"> Hide credits, contact & TOS on frontpage</label>
        <label><input type="checkbox" id="hideCaptcha"> Hide captcha</label>
        <label><input type="checkbox" id="hideMeta"> Hide About & How to Play</label>
        <label><input type="checkbox" id="hideAvatarLogo"> Hide avatars beyond logo</label>
        <label><input type="checkbox" id="hideInGameLogo"> Hide logo in-game</label>
        <label><input type="checkbox" id="hideAvatarSprites"> Hide sprites on frontpage</label>
        <label><input type="checkbox" id="hideBrushlab"> Show Brushlab at the side controls instead</label>
    </div>
    <div style="display:none">
        <h4>HTML/CSS injection: add HTML to body</h4>
        <input class='form-control' type='text' id='injection' placeholder='<elem></elem> <style>elem { }</style>'>
    </div>
</div>`;
        visuals.form = elemFromString(html);
        [...visuals.form.querySelectorAll("input")].forEach(input => {
            input.addEventListener("input", () => visuals.applyOptions(visuals.getOptions()));
        });

        try { visuals.themes = JSON.parse(localStorage.themes); }
        catch{ visuals.themes = []; }
        let createBtn = (theme) => {
            let themebtn = elemFromString("<div class='btn btn-success' style='margin:.5em'>" + theme.name + "</div>");
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
        let addtheme = elemFromString("<div class='btn btn-info' style='margin:.5em'>Save Current</div>");
        addtheme.addEventListener("click", () => {
            let input = prompt("How to name the theme?\nYou can right-click a theme to remove it.");
            if (input == null) return;
            let name = input && input != "" ? input : "new theme";
            visuals.addTheme(name, visuals.getOptions());
        });
        themes.appendChild(addtheme);
        let exportTheme = elemFromString("<div class='btn btn-info' style='margin:.5em'>Export</div>");
        exportTheme.addEventListener("click", () => {
            navigator.clipboard.writeText(JSON.stringify(visuals.getOptions()));
            new Toast("Copied theme text to clipboard.");
        });
        themes.appendChild(exportTheme);
        let importTheme = elemFromString("<div class='btn btn-info' style='margin:.5em'>Import</div>");
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