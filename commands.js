/*
 * Extends service.js contentscript
  Command detection:
  - commands are const strings containing the command name
  - command_interpreter(cmd) recognizes commands and calls the corresponding function for the command
  - command function is executed
  - command function prints output to the chat via printCmdOutput(cmd)
*/

// Define command strings
var help_text = "<h4>Chat with command detection</h4> Confirm command with '--' <br/>- help (Show help) <br/>- enable/disable charbar (Toggle wordbox)<br/>- set markup [#hexcode] (Set chat markup) <br/>- enable/disable holy (Holy special) ";
help_text += "<br/>- add vip [name] (New VIP) <br/>- rem vip [name] (Delete VIP) <br/>- show vip (Show VIPs) <br/>- clear vip (Clear VIPs)";
help_text += "<br/>- enable/disable agent (Toggle ImageAgent) <br/>- enable/disable markup (Toggle markup)";
help_text += "<br/>- enable/disable ink (Toggle tablet pressure)<br/>- enable/disable back (Toggle back-button)<br/>- enable/disable random (Toggle random color)<br/>- set random [ms] (Random interval, ms)";
help_text += "<br/>Example: 'set markup #ffffff--'<br/> <br/> Most settings are accessible in the extension popup!";

const cmd_add_observerToken = "adobs";
const cmd_remove_observerToken = "rmobs";

const cmd_enableOwnHoly = "enable holy";
const cmd_disableOwnHoly = "disable holy";

const cmd_setMarkup = "set markup";
const cmd_resetMarkup = "reset markup";
const cmd_enMarkup = "enable markup";
const cmd_daMarkup = "disable markup";

const cmd_help = "help";

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

const cmd_restore = "restore pic";
const cmd_enBack = "enable back";
const cmd_daBack = "disable back";

const cmd_enRandom = "enable random";
const cmd_daRandom = "disable random";
const cmd_setRandom = "set random";

// ----------------------------- INTERPRETER - CALLS FUNCTIONS DEPENDING ON ENTERED COMMAND
function command_interpreter(cmd) {

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
    //else if (cmd.includes(cmd_add_observerToken)) addObserveToken((cmd.replace(cmd_add_observerToken, "")).trim());
    //else if (cmd.includes(cmd_remove_observerToken)) removeObserveToken((cmd.replace(cmd_remove_observerToken, "")).trim());
    else if (cmd.includes("memberlogin")) login(cmd.replace("memberlogin", "").trim());
    else if (cmd.includes("enable palantir")) {localStorage.userAllow = "true"; Report.trigger();}
    else if (cmd.includes("disable palantir")) localStorage.userAllow = "false";
    else if (cmd.includes(cmd_setSensitivity)) setSensitivity((cmd.replace(cmd_setSensitivity, "")).trim());
    else if (cmd.includes(cmd_addImportantName)) addVip((cmd.replace(cmd_addImportantName, "")).trim());
    else if (cmd.includes(cmd_removeImportantName)) remVip((cmd.replace(cmd_removeImportantName, "")).trim());
    else if (cmd.includes(cmd_showImportantName)) showVip();
    else if (cmd.includes(cmd_clearImportantName)) clearVip();
    else if (cmd.includes(cmd_restore)) restoreDrawing();
    else if (cmd.includes(cmd_enBack)) toggleBackbutton(true);
    else if (cmd.includes(cmd_daBack)) toggleBackbutton();
    else if (cmd.includes(cmd_enRandom)) toggleRandomColor(true);
    else if (cmd.includes(cmd_daRandom)) toggleRandomColor();
    else if (cmd.includes(cmd_setRandom)) setRandomInterval((cmd.replace(cmd_setRandom, "")).trim());
    else if (cmd.includes(cmd_deleteToken)) setToken((cmd.replace(cmd_deleteToken, "")).trim());
    //else if (cmd.includes(cmd_randomColor)) document.querySelector("body").dispatchEvent(new Event("setRandomColor"));

    else printCmdOutput("Error");
}

// ----------------------------- OUTPUT - SHOWS CHAT MESSAGE DEPENDING ON COMMAND
function printCmdOutput(cmd) {

    // Create Message
    let p = document.createElement("p");
    p.style.color = "rgb(0, 0, 0)";
    p.style.background = "rgb(247, 210, 140)";

    let b = document.createElement("b");
    b.innerHTML = "Command:   " + cmd;
    b.style.display = "block";

    let s = document.createElement("span");

    // Set Message Content
    if (cmd.includes("Error")) s.innerHTML = "Error by executing the command";
    else if (cmd == cmd_disableOwnHoly) s.innerHTML = "Holy special was removed";
    else if (cmd == cmd_enableOwnHoly) s.innerHTML = "Holy special was activated";
    else if (cmd == cmd_setMarkup) s.innerHTML = "New markup-color: '" + markup_color + "'";
    else if (cmd == cmd_resetMarkup) s.innerHTML = "Markup-color was reset";
    else if (cmd == cmd_help) s.innerHTML = help_text;
    else if (cmd == cmd_daCharBar || cmd == cmd_enCharBar) s.innerHTML = "CharBar toggled";
    else if (cmd == cmd_daAgent || cmd == cmd_enAgent) s.innerHTML = "ImageAgent toggled";
    else if (cmd == cmd_daMarkup || cmd == cmd_enMarkup) s.innerHTML = "Markup toggled";
    else if (cmd == cmd_daInk || cmd == cmd_setSensitivity || cmd == cmd_enInk) s.innerHTML = "Sensitivity was set";

    p.appendChild(b);
    p.appendChild(s);

    let cont = document.getElementById("boxMessages");
    cont.appendChild(p);
    scrollMessages();
}

// ----------------------------- FUNCTIONS - TO HANDLE COMMAND FUNCTIONALITY
// func to update charbar visibility
function viewCharBar() {
    let _height;
    let table = document.getElementById("tableBox");

    if (localStorage.charBar == "true") {
        document.getElementById("tableBox").style.visibility = "";
        _height = parseInt(table.style.height.substring(0, table.style.height.length - 2)) + parseInt(table.style.marginTop.substring(0, table.style.marginTop.length - 2)) + 34;
    }
    else {
        document.getElementById("tableBox").style.visibility = "collapse";
        _height = 34;
    }

    document.getElementById("style_cont_msg").innerHTML = "#boxMessages{height:calc(100% - " + _height + "px);}"
}

// func to set random color button in color preview
function toggleRandomColor(state = false, silent = false) {
    if (state) document.querySelector("#randomIcon").style.display = "";   
    else {
        document.querySelector("#randomIcon").style.display = "none";
        document.querySelector("body").dispatchEvent(new CustomEvent("setRandomColor", { detail: "false" }));
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
    if (document.querySelector("div[data-tool='pen']").classList.contains("toolActive")) {
        document.querySelector("body").dispatchEvent(new CustomEvent("setRandomColor", { detail: duration }));
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
    updateImageAgent();
    printCmdOutput(cmd_enAgent);
}

// func to disable imageagent
function daAgent() {
    localStorage.imageAgent = false;
    updateImageAgent();
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

//async function addObserveToken(observeToken) {
//    let verify = await fetch('https://www.tobeh.host/Orthanc/verify/', {
//        method: 'POST',
//        headers: {
//            'Accept': '*/*',
//            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//        },
//        body: "observeToken=" + observeToken
//    }
//    );
//    verify = await verify.json();
//    let guild = new Guild(verify.AuthGuildID, verify.AuthGuildName, observeToken);
//    let guilds = [];
//    guilds = JSON.parse(localStorage.guilds);
//    guilds.push(guild);
//    localStorage.guilds = JSON.stringify(guilds);
//}
//function removeObserveToken(observeToken) {
//    let guilds = [];
//    let oldGuilds = JSON.parse(localStorage.guilds);
//    oldGuilds.forEach((g) => {
//        if (g.ObserveToken != observeToken) guilds.push(g);
//    });
//    localStorage.guilds = JSON.stringify(guilds);
//}

function login(login) {
    localStorage.login = login;
}