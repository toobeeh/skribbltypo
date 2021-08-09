// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

/*
 * Extends service.js contentscript
  Command detection:
  - commands are const strings containing the command name
  - command_interpreter(cmd) recognizes commands and calls the corresponding function for the command
  - command function is executed
  - command function prints output to the chat via printCmdOutput(cmd)
*/

// Define command strings
let help_text = "<h4>Chat with command detection</h4> Confirm command with '--' <br/>- help (Show help) <br/>- enable/disable charbar (Toggle wordbox)<br/>- set markup [#hexcode] (Set chat markup) <br/>- enable/disable holy (Holy special) ";
help_text += "<br/>- add vip [name] (New VIP) <br/>- rem vip [name] (Delete VIP) <br/>- show vip (Show VIPs) <br/>- clear vip (Clear VIPs)";
help_text += "<br/>- enable/disable agent (Toggle ImageAgent) <br/>- enable/disable markup (Toggle markup)";
help_text += "<br/>- enable/disable ink (Toggle tablet pressure)<br/>- enable/disable back (Toggle back-button)<br/>- enable/disable random (Toggle random color)<br/>- set random [ms] (Random interval, ms)";
help_text += "<br/>Example: 'set markup #ffffff--'<br/> <br/> Most settings are accessible in the extension popup!";

const cmd_add_observerToken = "adobs";
const cmd_remove_observerToken = "rmobs";

const cmd_resetTypo = "reset!";

const cmd_setScale = "scale";

const cmd_typro = "typro";

const cmd_enableOwnHoly = "enable holy";
const cmd_disableOwnHoly = "disable holy";

const cmd_setMarkup = "set markup";
const cmd_resetMarkup = "reset markup";
const cmd_enMarkup = "enable markup";
const cmd_daMarkup = "disable markup";

const cmd_help = "help";

const cmd_votekick = "kick";
const cmd_like = "like";
const cmd_dislike = "shame";

const cmd_deleteToken = "set token";

const cmd_enCharBar = "enable charbar";
const cmd_daCharBar = "disable charbar";

const cmd_addImportantName = "add vip";
const cmd_removeImportantName = "rem vip";
const cmd_showImportantName = "show vip";
const cmd_clearImportantName = "clear vip";

const cmd_enAgent = "enable agent";
const cmd_daAgent = "disable agent";

const cmd_enInk = "enable ink";
const cmd_daInk = "disable ink";
const cmd_setSensitivity = "set sens";
const cmd_setInkmode = "inkmode";

const cmd_restore = "restore pic";
const cmd_enBack = "enable back";
const cmd_daBack = "disable back";

const cmd_enRandom = "enable random";
const cmd_daRandom = "disable random";
const cmd_setRandom = "set random";

const cmd_setPalette = "palette";
const cmd_addPalette = "addpal";
const cmd_removePalette = "rmpal";

// ----------------------------- INTERPRETER - CALLS FUNCTIONS DEPENDING ON ENTERED COMMAND
const performCommand = (cmd) => {

    cmd = cmd.replace("--","");
    cmd.trim();

    if (cmd.includes(cmd_enableOwnHoly)) setHolyOnOwn();
    else if (cmd.includes(cmd_disableOwnHoly)) resetHolyOnOwn();
    else if (cmd.includes(cmd_resetMarkup)) resetMarkupColor();
    else if (cmd.includes(cmd_setMarkup)) setMarkupColor(cmd, cmd_setMarkup);
    else if (cmd.includes(cmd_help)) printCmdOutput(cmd_help);
    else if (cmd.includes(cmd_daCharBar)) daCharBar();
    else if (cmd.includes(cmd_enCharBar)) enCharBar();
    else if (cmd.includes(cmd_daAgent)) daAgent();
    else if (cmd.includes(cmd_enAgent)) enAgent();
    else if (cmd.includes(cmd_daMarkup)) daMarkup();
    else if (cmd.includes(cmd_enMarkup)) enMarkup();
    else if (cmd.includes(cmd_daInk)) daInk();
    else if (cmd.includes(cmd_enInk)) enInk();
    else if (cmd.includes(cmd_setSensitivity)) setSensitivity((cmd.replace(cmd_setSensitivity, "")).trim());
    else if (cmd.includes("memberlogin")) login(cmd.replace("memberlogin", "").trim());
    else if (cmd.includes("enable palantir")) {
        localStorage.userAllow = "true"; 
        lobbies_.userAllow = true;
        if (lobbies_.inGame && !lobbies_.joined) {
            socket.joinLobby(lobbies_.lobbyProperties.Key);
            lobbies_.joined = true;
        }
        socket.setLobby(lobbies_.lobbyProperties, lobbies_.lobbyProperties.Key);
    }
    else if (cmd.includes("disable palantir")) {
        lobbies_.userAllow = false;
        localStorage.userAllow = "false";
        socket.leaveLobby();
        lobbies_.joined = false;
    }
    else if (cmd.includes("clr")) {
        let elems = [...QSA("#boxMessages > *")];
        elems = elems.length > 50 ? elems.slice(0, elems.length - 50) : elems;
        elems.forEach(elem => elem.remove());
        printCmdOutput("","Cleared chat", "Removed all except last 50 messages, if existent.");
    }
    else if (cmd.includes("enable controls") || cmd.includes("disable controls")) {
        QS("#controls").style.display = cmd.includes("enable") ? "flex" : "none";
        localStorage.controls = cmd.includes("enable");
    }
    else if (cmd.includes("enable gamemodes") || cmd.includes("disable gamemodes")) {
        localStorage.gamemodes = cmd.includes("enable");
        if (cmd.includes("enable")) gamemode.init();
        else gamemode.destroy();
    }
    else if (cmd.includes("enable keybinds") || cmd.includes("disable keybinds")) {
        localStorage.keybinds = cmd.includes("enable");
        if (cmd.includes("enable")) keybind.init();
        else keybind.destroy();
    }
    else if (cmd.includes("enable chatcommands") || cmd.includes("disable chatcommands")) {
        localStorage.chatcommands = cmd.includes("enable");
    }
    else if (cmd.includes("enable experimental") || cmd.includes("disable experimental")) {
        localStorage.experimental = cmd.includes("enable");
    }
    else if (cmd.includes("enable sizeslider") || cmd.includes("disable sizeslider")) {
        localStorage.sizeslider = cmd.includes("enable");
        if (cmd.includes("enable")) uiTweaks.initSizeSlider();
        else QS("#sizeslider").remove();
    }
    else if (cmd.includes("enable emojipicker") || cmd.includes("disable emojipicker")) {
        localStorage.emojipicker = cmd.includes("enable");
    }
    else if (cmd.includes("enable drops") || cmd.includes("disable drops")) {
        localStorage.drops = cmd.includes("enable");
    }
    else if (cmd.includes("enable zoomdraw") || cmd.includes("disable zoomdraw")) {
        localStorage.zoomdraw = cmd.includes("enable");
        uiTweaks.resetZoom();
    }
    else if (cmd.includes("enable quickreact") || cmd.includes("disable quickreact")) {
        localStorage.quickreact = cmd.includes("enable");
    }
    else if (cmd.includes("enable keepCanvas") || cmd.includes("disable keepCanvas")) {
        localStorage.keepCanvas = cmd.includes("enable");
    }
    else if (cmd.includes(cmd_setSensitivity)) setSensitivity((cmd.replace(cmd_setSensitivity, "")).trim());
    else if (cmd.includes(cmd_setInkmode)) setInkmode((cmd.replace(cmd_setInkmode, "")).trim());
    else if (cmd.includes(cmd_addImportantName)) addVip((cmd.replace(cmd_addImportantName, "")).trim());
    else if (cmd.includes(cmd_removeImportantName)) remVip((cmd.replace(cmd_removeImportantName, "")).trim());
    else if (cmd.includes(cmd_showImportantName)) showVip();
    else if (cmd.includes(cmd_clearImportantName)) clearVip();
    else if (cmd.includes(cmd_setScale)) localStorage.qualityScale = (cmd.replace(cmd_setScale, "")).trim();
    else if (cmd.includes(cmd_enBack)) toggleBackbutton(true);
    else if (cmd.includes(cmd_daBack)) toggleBackbutton();
    else if (cmd.includes(cmd_enRandom)) toggleRandomColor(true);
    else if (cmd.includes(cmd_daRandom)) toggleRandomColor();
    else if (cmd.includes(cmd_resetTypo)) { setDefaults(true); window.location.reload(); }
    else if (cmd.includes(cmd_setRandom)) setRandomInterval((cmd.replace(cmd_setRandom, "")).trim());
    else if (cmd.includes(cmd_deleteToken)) setToken((cmd.replace(cmd_deleteToken, "")).trim());
    else if (cmd.includes(cmd_addPalette)) addPalette(cmd.replace(cmd_addPalette, "").trim());
    else if (cmd.includes(cmd_setPalette)) setPalette(cmd.replace(cmd_setPalette, "").trim());
    else if (cmd.includes(cmd_removePalette)) removePalette(cmd.replace(cmd_removePalette, "").trim());
    else if (cmd.includes(cmd_like)) like();
    else if (cmd.includes(cmd_dislike)) dislike();
    else if (cmd.includes(cmd_votekick)) kick();
    else if (cmd.includes(cmd_typro)) socket.getStoredDrawings();

    else printCmdOutput("Error");
}

// ----------------------------- OUTPUT - SHOWS CHAT MESSAGE DEPENDING ON COMMAND
function printCmdOutput(cmd, info = "", title = "") {

    // Create Message
    let p = document.createElement("p");
    p.style.color = "rgb(0, 0, 0)";
    p.style.background = "rgb(247, 210, 140)";

    let b = document.createElement("b");
    b.innerHTML = "Command:   " + cmd;
    if (title != "") b.innerHTML = title;
    b.style.display = "block";

    let s = document.createElement("span");

    // Set Message Content
    if (cmd.includes("Error")) s.innerHTML = "Error executing the command";
    else if (cmd == cmd_disableOwnHoly) s.innerHTML = "Holy special was removed";
    else if (cmd == cmd_enableOwnHoly) s.innerHTML = "Holy special was activated";
    else if (cmd == cmd_setMarkup) s.innerHTML = "New markup-color: '" + localStorage.markupColor + "'";
    else if (cmd == cmd_resetMarkup) s.innerHTML = "Markup-color was reset";
    else if (cmd == cmd_help) s.innerHTML = help_text;
    else if (cmd == cmd_daCharBar || cmd == cmd_enCharBar) s.innerHTML = "CharBar toggled";
    else if (cmd == cmd_daAgent || cmd == cmd_enAgent) s.innerHTML = "ImageAgent toggled";
    else if (cmd == cmd_daMarkup || cmd == cmd_enMarkup) s.innerHTML = "Markup toggled";
    else if (cmd == cmd_daInk || cmd == cmd_setSensitivity || cmd == cmd_enInk) s.innerHTML = "Sensitivity was set";
    else if (cmd == "render") s.innerHTML = "Gif is rendering in background and will be downloaded. Takes up to 30s.";
    else if (cmd == "drop") s.innerHTML = info;

    p.appendChild(b);
    p.appendChild(s);

    let cont = document.getElementById("boxMessages");
    cont.appendChild(p);
    scrollMessages();
}

// ----------------------------- FUNCTIONS - TO HANDLE COMMAND FUNCTIONALITY

function like() {
    let up = QS(".thumbsUp");
    if (up) up.dispatchEvent(newCustomEvent("click"));
}
function dislike() {
    let down = QS(".thumbsDown");
    if (down) down.dispatchEvent(newCustomEvent("click"));
}
function kick() {
    let kick = QS("#votekickCurrentplayer");
    if (kick) kick.dispatchEvent(newCustomEvent("click"));
}

// func to set active palette
function setPalette(p) {
    if (!document.querySelector("#" + p)) return;
    [...document.querySelectorAll(".containerColorbox")].forEach(c => c.style.display = "none");
    document.querySelector("#" + p).style.display = "";
    localStorage.palette = p;
}

// func to add palette
function addPalette(p) {
    let palettes = JSON.parse(localStorage.customPalettes);
    let newPalette = JSON.parse(p);
    palettes.push(newPalette);
    localStorage.customPalettes = JSON.stringify(palettes);
    addColorPalette(p);
}

// func to remove palette
function removePalette(p) {
    let palettes = JSON.parse(localStorage.customPalettes);
    palettes = palettes.filter(f => { return f.name != p; });
    document.querySelector("#" + p).remove();
    if (p == localStorage.palette) {
        setPalette("standardPalette");
    }
    localStorage.customPalettes = JSON.stringify(palettes);
}


// func to update charbar visibility
function viewCharBar() {
    let _height;
    let table = document.getElementById("tableBox");

    if (localStorage.charBar == "true") {
        QS("#wordSize").style.visibility = "";
        document.getElementById("tableBox").style.visibility = "";
        document.getElementById("tableBox").style.position = "";
        _height = parseInt(table.style.height.substring(0, table.style.height.length - 2)) + parseInt(table.style.marginTop.substring(0, table.style.marginTop.length - 2)) + 34;
    }
    else {
        document.getElementById("tableBox").style.visibility = "collapse";
        document.getElementById("tableBox").style.position = "absolute";
        QS("#wordSize").style.visibility = "hidden";
        _height = 34;
    }

    // document.getElementById("style_cont_msg").innerHTML = "#boxMessages{height:calc(100% - " + _height + "px);}"
}

// func to set random color button in color preview
function toggleRandomColor(state = false, silent = false) {
    if (state) {
        document.querySelector("#randomIcon").style.display = "";
        document.querySelector("#colPicker").style.display = "flex";
    }
    else {
        document.querySelector("#randomIcon").style.display = "none";
        document.querySelector("body").dispatchEvent(newCustomEvent("setRandomColor", { detail: { enable: "false" } }));
        document.querySelector("#colPicker").style.display = "none";
    }
    localStorage.randomColorButton = state;
}

// func to enable/disable back button
function toggleBackbutton(state = false, silent = false) {
    if (state) document.querySelector("#restore").style.display = "";
    else document.querySelector("#restore").style.display = "none";
    localStorage.displayBack = state;
    if (!silent) printCmdOutput("Updated back button");
}

// func to adjust the random color switch interval
function setRandomInterval(duration) {
    duration > 1000 ? duration = 1000 : duration < 5 ? duration = 5 : 1;
    localStorage.randomColorInterval = duration;
    let colors = [];
    [...QSA(".colorItem")].forEach(c => {
        if (c.parentElement.parentElement.style.display != "none") {
            colors.push(Number(c.getAttribute("data-color")));
        }
    });
    if (document.querySelector("div[data-tool='pen']").classList.contains("toolActive")) {
        document.querySelector("body").dispatchEvent(newCustomEvent("setRandomColor", { detail: { enable: duration, colors: colors } }));
    }

    printCmdOutput("Interval set to " + duration + "ms");
}

// func to set holysetting
function setHolyOnOwn() {
    localStorage.ownHoly = true;
    checkPlayers();
    printCmdOutput(cmd_enableOwnHoly);
}

// func to disable holysetting
function resetHolyOnOwn() {
    localStorage.ownHoly = false;
    checkPlayers();
    printCmdOutput(cmd_disableOwnHoly);
}

// func to set markupcolorsetting
function setMarkupColor(cmd, cmd_mu) {
    let cmd_end_pos = cmd.indexOf(cmd_mu) + cmd_mu.length + 1;
    let i = cmd_end_pos;

    while (i < cmd.length || cmd[i] == ' ') i++;

    let color_code = cmd.substr(cmd_end_pos, i - cmd_end_pos);

    if (color_code.length != 7 || color_code[0] != '#') { printCmdOutput(cmd_mu + " - Error"); return; }

    localStorage.markupColor = color_code;

    printCmdOutput(cmd_setMarkup);
}

// func to reset markupcolorsetting to default
function resetMarkupColor() {
    localStorage.markupColor = "#ffd6cc";
    printCmdOutput(cmd_resetMarkup);
}

// func to enable message markup
function enMarkup() {
    localStorage.markup = true;
    printCmdOutput(cmd_enMarkup);
}

// func to disable message markup
function daMarkup() {
    localStorage.markup = false;
    printCmdOutput(cmd_daMarkup);
}

// func to enable pressure
function enInk() {
    localStorage.ink = true;
    printCmdOutput(cmd_enInk);
}

// func to disable pressure
function daInk() {
    localStorage.ink = false;
    printCmdOutput(cmd_daInk);
}

// func to set sensitivity
function setSensitivity(nsens) {
    if (nsens < 1) nsens = 1;
    else if (nsens > 100) nsens = 100;

    localStorage.sens = nsens;
    printCmdOutput(cmd_setSensitivity + " " + nsens);
}

// func to set inkmode
function setInkmode(mode) {
    localStorage.inkMode = mode;
    printCmdOutput(cmd_setInkmode + " " + mode);
}

// func to set charbarsetting visible
function enCharBar() {
    localStorage.charBar = true;
    viewCharBar();
    printCmdOutput(cmd_enCharBar);
}

// func to set charbarsetting to hidden
function daCharBar() {
    localStorage.charBar = false;
    viewCharBar();
    printCmdOutput(cmd_daCharBar);
}

// func to enable imageagent
function enAgent() {
    localStorage.imageAgent = true;
    imageAgent.updateImageAgent();
    printCmdOutput(cmd_enAgent);
}

// func to disable imageagent
function daAgent() {
    localStorage.imageAgent = false;
    imageAgent.updateImageAgent();
    printCmdOutput(cmd_daAgent);
}

// func to set input clear token
function setToken(token) {
    localStorage.token = token;
    printCmdOutput("set token <br/> '" + token + "' wurde als Token gesetzt.")
}

//func to add vip name too settings
function addVip(name) {
    localStorage.vip = (localStorage.vip != null ? localStorage.vip : "") + name + "/"; // since "/" is a non accepted char for skribbl names
    printCmdOutput("add vip <br/> '" + name + "' wurde als VIP gesetzt.")
}

// func to remove vip name from setting
function remVip(name) {
    localStorage.vip = localStorage.vip.replace(name + "/", "");
    printCmdOutput("rem vip <br/> '" + name + "' wurde entfernt.")
}

// func to clear all vips
function clearVip() {
    localStorage.vip = "";
    printCmdOutput("clear vip <br/> VIP-Liste geleert.")
}

// func to show all vip names
function showVip() {
    var vip = localStorage.vip;
    var out = " show vip<br/><h5>Hervorgehobene VIPs: </h5>";
    var list = "";
    out += "<ul>";

    vip.forEach((item, i) => {
        if (item != "") list += "<li>" + item + "</li>";
    });

    out += (list != "" ? list : "NUR DU!!!");
    out += "</ul>";
    printCmdOutput(out);
}

function login(login) {
    localStorage.member = '{"UserLogin":' + login + '}';
    new Toast("Reload skribbl to complete the login.");
}