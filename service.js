/*
 * Contentscript which tweaks skribbl and basically controls what was added to the ui and how that stuff works.
 * Dispatches events to the body dom element to communicate with patched gamejs
 * 
 * There are some VERY old parts, don't kill me for those.
 * A complete rework to make it a bit less messy is on my todo.
 */

/*
    Report message format:

        Draw:   ["drawCommands", [C1], [C2], ..., [C8]]
        Clear:  ["clearCanvas"]

    Draw command format:

        Brush:  [m, c, s, x1, y1, x2, y2]
        Fill:   [m, c, x1, y1]
        Erase:  [m, s, x1, y1, x2, y2]
        Clear:  [m] (Only custom logged)

    Parameter values:
        
        Mode    m: 0 (Brush), 1 (Erase), 2 (Fill), 3 (Clear - Only custom report to content script, originally sent as "clearCanvas" report message)
        Color   c: 0-22 (Column-wise skribbl colors, left to right)
        Vector  x: 0-800
        Vector  y: 0-600
*/

/*
 * Todo and bugs:
 * ----fix conflict with image poster (container freespace) 
 * ----fix lobby id check -> as soon as lobby connected
 * fix lobby search not triggering sometimes on first lobby
 * lobby buttons take several clicks sometimes
 *  ----fix lobby status when search is still active (slow connection)
 * fix lobby search not triggering sometimes on first lobby
 * lobby buttons take several clicks sometimes
 *  ----keydown changes tools when other players draw
 *  ----mysterious drawing over next persons' canvas sometimes
 *  ----still that audio thing
 *  ----holy not working
 *  ----lobby search stops if lobby is tempoarly down
 *  ----private lobby settings not set
 *  gif progress bar is not consisten
 *  gif drawing speed could be tweaked
 * 
 * Feature requests:
 * ----implement gif saving
 * ----maybe bigger color palette
 * ----lobby description
 * ----tab style popup
 * ----ustom sprites
 * ff port :(
 * 
 */


'use strict';
const version = "18.2.1";
const command_token = "--";

// stop patcher observing
patcher.disconnect();

// Set default settings
if (!localStorage.member) localStorage.member = "";
if (!localStorage.userAllow) localStorage.userAllow = "true";
if (!localStorage.login) localStorage.login = "";
if (!localStorage.ownHoly) localStorage.ownHoly = "false";
if (!localStorage.ink) localStorage.ink = "true";
if (!localStorage.sens) localStorage.sens = 50;
if (!localStorage.charBar) localStorage.charBar = "false";
if (!localStorage.imageAgent) localStorage.imageAgent = "false";
if (!localStorage.vip) localStorage.vip = "";
if (!localStorage.token) localStorage.token = "++";
if (!localStorage.markup) localStorage.markup = "false";
if (!localStorage.markupColor) localStorage.markupColor = "#ffd6cc";
if (!localStorage.randomColorInterval) localStorage.randomColorInterval = 50;
if (!localStorage.randomColorButton) localStorage.randomColorButton = false;
if (!localStorage.displayBack) localStorage.displayBack = false;
if (!sessionStorage.lobbySearch) sessionStorage.lobbySearch = "false";
if (!sessionStorage.searchPlayers) sessionStorage.searchPlayers = "[]";
if (!sessionStorage.skipDeadLobbies) sessionStorage.skipDeadLobbies = "false";
if (!localStorage.palette) localStorage.palette = "originalPalette";
if (!localStorage.customPalettes) localStorage.customPalettes = '[{"rowCount":13, "name":"sketchfulPalette", "colors":[{"color":"rgb(255, 255, 255)","index":100},{"color":"rgb(211, 209, 210)","index":101},{"color":"rgb(247, 15, 15)","index":102},{"color":"rgb(255, 114, 0)","index":103},{"color":"rgb(252, 231, 0)","index":104},{"color":"rgb(2, 203, 0)","index":105},{"color":"rgb(1, 254, 148)","index":106},{"color":"rgb(5, 176, 255)","index":107},{"color":"rgb(34, 30, 205)","index":108},{"color":"rgb(163, 0, 189)","index":109},{"color":"rgb(204, 127, 173)","index":110},{"color":"rgb(253, 173, 136)","index":111},{"color":"rgb(158, 84, 37)","index":112},{"color":"rgb(81, 79, 84)","index":113},{"color":"rgb(169, 167, 168)","index":114},{"color":"rgb(174, 11, 0)","index":115},{"color":"rgb(200, 71, 6)","index":116},{"color":"rgb(236, 158, 6)","index":117},{"color":"rgb(0, 118, 18)","index":118},{"color":"rgb(4, 157, 111)","index":119},{"color":"rgb(0, 87, 157)","index":120},{"color":"rgb(15, 11, 150)","index":121},{"color":"rgb(110, 0, 131)","index":122},{"color":"rgb(166, 86, 115)","index":123},{"color":"rgb(227, 138, 94)","index":124},{"color":"rgb(94, 50, 13)","index":125},{"color":"rgb(0, 0, 0)","index":126},{"color":"rgb(130, 124, 128)","index":127},{"color":"rgb(87, 6, 12)","index":128},{"color":"rgb(139, 37, 0)","index":129},{"color":"rgb(158, 102, 0)","index":130},{"color":"rgb(0, 63, 0)","index":131},{"color":"rgb(0, 118, 106)","index":132},{"color":"rgb(0, 59, 117)","index":133},{"color":"rgb(14, 1, 81)","index":134},{"color":"rgb(60, 3, 80)","index":135},{"color":"rgb(115, 49, 77)","index":136},{"color":"rgb(209, 117, 78)","index":137},{"color":"rgb(66, 30, 6)","index":138}]}]';
if ("permission" in Notification && Notification.permission === "default" && confirm("Do you want to receive notifications when a lobby was found?")) Notification.requestPermission(); 
// defaults for word check
var is_length_error = false;
var is_hint_error = false;

// Activate game container for betatesting purposes
if (version.includes("beta")) testMode();

// var to store copied drawing
let drawCommandsCopy = [];


// _____________________________________________________________
//
//                Communication with Popup
// _____________________________________________________________

// communication with popup.js
chrome.runtime.onMessage.addListener(msgObj => {
    if (msgObj == "get") {
        chrome.runtime.sendMessage({
            get: JSON.stringify(localStorage)
        });
    }
    else command_interpreter(msgObj + "--");
});


// _____________________________________________________________
//
//               Init backbutton stuff and pressure
// _____________________________________________________________


// capture drawings
var capturedCommands = [];
document.querySelector("body").addEventListener("logDrawCommand", function (e) { capturedCommands.push(e.detail); });

// log canvas clear in actions array
document.querySelector("body").addEventListener("logCanvasClear", function (e) { capturedCommands = []; capturedActions.push([[3]]); });

// clear captured actions if drawer finished
// actually not necessary and blocks saving the gif while showing the scoreboard
document.querySelector("body").addEventListener("drawingFinished", function (e) { capturedCommands = []; capturedActions = []; });

// put commands in array (each index is one action aka mouseup on canvas)
var capturedActions = []
function pushCaptured() { capturedCommands.length > 0 ? (capturedActions.push(capturedCommands), capturedCommands = []) : 1; }
document.querySelector("#canvasGame").addEventListener("pointerup", pushCaptured);
document.querySelector("#canvasGame").addEventListener("pointerout", pushCaptured);

// function to request captured actions and with unpushed commands
function getCapturedActions(){
    return capturedCommands.length > 0 ? capturedActions.concat([[...capturedCommands]]) : capturedActions;
}

// func to restore drawing based on saved commands
function restoreDrawing(limit = 0) {
    document.querySelector("#restore").style.pointerEvents = "none";
    document.querySelector("#canvasGame").style.pointerEvents = "none";
    let actions = getCapturedActions().slice(0, -limit);
    let redo = [];

    // put all commands from each action in one command-array. the last actions (limit) are passed.
    for (let action = 0, lenA = actions.length - limit; action < lenA; action++)
        for (let cmd = 0, lenC = actions[action].length; cmd < lenC; cmd++)
            actions[action][cmd].length > 0 && redo.push(actions[action][cmd]);

    // search for the last clear to avoid unnecessary drawing
    let lastClear = redo.length - 1;
    while (lastClear > 0 && redo[lastClear][0] != 3) { lastClear--; }

    let captured = lastClear > 0 ? lastClear + 1 : 0;
    let maxcaptured = redo.length;

    let body = document.querySelector("body");
    document.querySelector("#buttonClearCanvas").dispatchEvent(new Event("click"));
    let t = setInterval(function () {
        captured >= maxcaptured ? (
            clearInterval(t),
            capturedActions = [],
            capturedCommands = [],
            document.querySelector("#restore").style.pointerEvents = "",
            capturedActions = actions,
            document.querySelector("#canvasGame").style.pointerEvents = ""
            ) : body.dispatchEvent(new CustomEvent("performDrawCommand", { detail: redo[captured] })); captured++;
    }, 5);
}

// function to draw selected draw commands separated in actions
function drawOnCanvas(drawActions) {
    document.querySelector("#restore").style.pointerEvents = "none";
    document.querySelector("#canvasGame").style.pointerEvents = "none";
    if(document.querySelector("#clearCanvasBeforePaste").checked) document.querySelector("#buttonClearCanvas").dispatchEvent(new Event("click"));
    let body = document.querySelector("body");
    let commands = [];
    let command = 0;
    drawActions.forEach(a => a.forEach(c => commands.push(c)));
    let i = setInterval(() => {
        command >= commands.length ?(
            clearInterval(i),
            document.querySelector("#restore").style.pointerEvents = "",
            document.querySelector("#canvasGame").style.pointerEvents = ""
        ) : body.dispatchEvent(new CustomEvent("performDrawCommand", { detail: commands[command] })); command++;
    }, 5);
}

// generate a gif of stored draw commands
async function drawCommandsToGif(filename = "download") {
    let workerJS = "";
    workerJS += await (await fetch(chrome.runtime.getURL("gifCap/b64.js"))).text();
    //workerJS += await (await fetch(chrome.runtime.getURL("gifCap/jmin.js"))).text();
    workerJS += await (await fetch(chrome.runtime.getURL("gifCap/GIFEncoder.js"))).text();
    workerJS += await (await fetch(chrome.runtime.getURL("gifCap/LZWEncoder.js"))).text();
    workerJS += await (await fetch(chrome.runtime.getURL("gifCap/NeuQuant.js"))).text();
    workerJS +=  await (await fetch(chrome.runtime.getURL("gifCap/skribblCanvas.js"))).text();
    workerJS += await (await fetch(chrome.runtime.getURL("gifCap/capture.js"))).text();
    let renderWorker = new Worker(URL.createObjectURL(new Blob([(workerJS)], { type: 'application/javascript' })));
    renderWorker.postMessage({ 'filename': filename, 'capturedActions': getCapturedActions() });

    // T H I C C progress bar 
    let progressBar = document.createElement("p");
    progressBar.style.color = "rgb(0, 0, 0)";
    progressBar.style.background = "rgb(247, 210, 140)";
    progressBar.innerText = String.fromCodePoint("0x2B1C").repeat(10) + " 0%";

    renderWorker.addEventListener('message', function (e) {
        if (e.data.download) {
            progressBar.innerText = String.fromCodePoint("0x1F7E9").repeat(10) + " Done!";
            let templink = document.createElement("a");
            templink.download = filename;
            templink.href = e.data.download;
            templink.click();
        }
        else if (e.data.progress) {
            let prog = Math.floor(e.data.progress * 10);
            let miss = 10-prog;
            let bar = "";
            while (prog > 0) {
                bar += String.fromCodePoint("0x1F7E9"); prog--;
            }
            while (miss > 0) {
                bar += String.fromCodePoint("0x2B1C"); miss--;
            }
            progressBar.innerText = bar;
            let percent = Math.round(e.data.progress * 100)
            progressBar.innerText += " " + percent + "%";
        }
		
    }, false);

    printCmdOutput("render");
    document.getElementById("boxMessages").appendChild(progressBar);
}

//init pressure sensibility for windows ink and tablets - k depends on steps
const kLevel = 1 / 36;
var refresh = true;
var refreshCycle = 5;

// event for pressure drawing
document.querySelector("#canvasGame").addEventListener("pointermove", (event) => {
    if (!refresh || localStorage.ink != "true" || event.pointerType != "pen") return;
    refresh = false;

    let size = 4;
    while (size * kLevel * (100/(101-localStorage.sens)) < event.pressure) size += 0.2;
    setBrushsize(size);

    setTimeout(function () { refresh = true; }, refreshCycle);
});

// event if pen was released
document.querySelector("#canvasGame").addEventListener("pointerup", (event) => {
    if (localStorage.ink == "true" && event.pointerType == "pen") setBrushsize(1);
});

// func to set the brushsize (event to game.js)
function setBrushsize(newsize) {
    let event = new CustomEvent("setBrushSize", {
        detail: newsize
    });
    document.querySelector("body").dispatchEvent(event);
}



// _____________________________________________________________
//
//            Init report to orthanc and palantir (->report.js)
// _____________________________________________________________

// report lobby after 5 secs in lobby (event on submit button)

// Set status as playing after 5 secs, before as searching
let startBtns = document.querySelectorAll("button[type='submit']");

startBtns[0].addEventListener("click", () => {
    // report status as searching      
    Report.searching = true;
    Report.waiting = false;
    Report.playing = false;
    Report.trigger();

    // report as paying after timeout
    setTimeout(() => {
        if (sessionStorage.skipDeadLobbies == "false" && JSON.parse(sessionStorage.searchPlayers).length <= 0 && sessionStorage.lobbySearch == "false") {
            Report.playing = true;
            Report.searching = false;
            Report.waiting = false;
            Report.trigger();
        }
    }, 4000);

});
startBtns[1].addEventListener("click", () => {
    Report.searching = false;
    Report.waiting = false;
    Report.playing = true;
    Report.trigger();

    // report as playing after timeout
    setTimeout(() => {
        if (sessionStorage.skipDeadLobbies == "false" && JSON.parse(sessionStorage.searchPlayers).length <= 0 && sessionStorage.lobbySearch == "false") {
            Report.playing = true;
            Report.searching = false;
            Report.waiting = false;
            Report.trigger();
        }
    }, 4000);

});


// get user name from game.js -> prevents modification from DOM
document.querySelector("body").addEventListener("loginData", function (d) {
    Report.loginName = d.detail.name.trim();
    sessionStorage.lastLoginName = Report.loginName;
});

var reportTrigger = new MutationObserver(() => {
    Report.trigger();
});
reportTrigger.observe(document.querySelector(".containerGame #containerGamePlayers"), { attributes: true, childList: true})


// if lobbies are already loaded (Orthanc fast af?!?!)
if (loaded) setTimeout(startSearch, 1000);

// when async lobbies loaded
document.querySelector("body").addEventListener("lobbiesLoaded", function (e) {
    // lobby search function
    document.querySelectorAll(".lobbySearchButton").forEach(b => {
        b.addEventListener("click", () => {

            let link = b.getAttribute("link");
            let key = b.getAttribute("lobbykey");
            let id = b.getAttribute("lobbyid");
            let language = b.getAttribute("lobbylang");
            localStorage.lang = language;

            if (link) {
                sessionStorage.skippedLobby = "true";
                window.location.href = link;
                return;
            }

            sessionStorage.targetLobby = id;
            sessionStorage.targetKey = key;
            sessionStorage.lobbySearch = "true";
            
            document.querySelector("button[type='submit'].btn-success").click();
            Report.searching = true;
            Report.waiting = false;
            Report.playing = false;
            setTimeout(() => {
                if (sessionStorage.skipDeadLobbies == "false" && JSON.parse(sessionStorage.searchPlayers).length <= 0 && sessionStorage.lobbySearch == "false") {
                    Report.playing = true;
                    Report.searching = false;
                    Report.waiting = false;
                    Report.trigger();
                }
            }, 4000);
            reloadLobbies();
            document.querySelector("#popupSearch").parentElement.style.display = "block";
        });
    });
    if (sessionStorage.lobbySearch == "true") setTimeout(startSearch, 1000);
});


let lobbyDeadHits = 0;
function startSearch() {
    if (sessionStorage.lobbySearch == "true") {
        let lobbyid = document.querySelector("#lobbyID" + sessionStorage.targetLobby);
        if (!lobbyid) {
            lobbyDeadHits++;
            if (lobbyDeadHits < 5) {
                setTimeout(startSearch, 3000);
                return;
            }
            sessionStorage.lobbySearch = "false";
            alert("The lobby doesn't exist anymore :(");
            document.querySelector("#popupSearch").innerText = "";
            document.querySelector("#popupSearch").style.display = "none";
            Report.playing = false;
            Report.searching = false;
            Report.waiting = false;
            Report.trigger();
        }
        else if (parseInt(lobbyid.getAttribute('lobbyPlayerCount')) >= 8) {
            //lobbyid.
        }
        else document.querySelector("button[type='submit'].btn-success").click();
    }
}

// check lobby as soon as connected and perform search checks
document.querySelector("body").addEventListener("lobbyConnected", async (e) => {
    // if searching for a lobby id
    if (sessionStorage.lobbySearch == "true") {
        let key = sessionStorage.targetKey;
        let id = sessionStorage.targetLobby;
        let state = await fetch('https://www.tobeh.host/Orthanc/idprovider/', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: "lobbyID=" + id
        }
        );
        let idResponse = await state.json();
        let thisKey = Report.generateLobbyKey(false);
        if (idResponse.Lobby && idResponse.Lobby.Key != thisKey) setTimeout(() => { window.location.reload(); }, 200);
        else {
            sessionStorage.lobbySearch = "false";
            document.querySelector("#popupSearch").parentElement.style.display = "none";
            if (Notification.permission !== "blocked" && document.hidden) {
                let n = new Notification("Lobby found!", { body: "Yee! Check out skribbl", icon: "/res/crown.gif" });
            }
        }
    }
    //if searching for a player
    else if (sessionStorage.searchPlayers != undefined && JSON.parse(sessionStorage.searchPlayers).length > 0) {
        let found = false;
        let players = JSON.parse(sessionStorage.searchPlayers);
        e.detail.forEach(p => { if (players.includes(p.name)) found = true; });
        if (found) {
            sessionStorage.searchPlayers = "[]";
            document.querySelector("#popupSearch").parentElement.style.display = "none";
            if (Notification.permission !== "blocked" && document.hidden) {
                let n = new Notification("Player found!", { body: "Yee! Check out skribbl", icon: "/res/crown.gif"});
            }
        }
        else {
            sessionStorage.skippedLobby = "true";
            setTimeout(() => { window.location.reload(); }, 400);
        }
    }
    // if dead lobbies are skipped
    else if (sessionStorage.skipDeadLobbies == "true") {
        if (document.querySelectorAll("#containerGamePlayers > .player").length <= 1) {
            sessionStorage.skippedLobby = "true";
            setTimeout(() => { window.location.reload(); }, 400);
        }
        else {
            sessionStorage.skipDeadLobbies = "false";
            document.querySelector("#popupSearch").parentElement.style.display = "none";
            if (Notification.permission !== "blocked" && document.hidden) {
                let n = new Notification("Lobby found!", { body: "Yee! Check out skribbl", icon: "/res/crown.gif" });
            }
        }
    }
});

// refresh lobbies all 5 secs 
setInterval(async () => {
    await reloadLobbies();
}, 5000)

async function reloadLobbies() {
    if (document.querySelector("#screenLogin").style.display == "none") return;
    //for (let node of document.querySelectorAll(".loginPanelContent > h3, .loginPanelContent > .updateInfo")) { node.remove(); }
    await initLobbyTab();
}


// _____________________________________________________________
//
//                Observer for general functions
// _____________________________________________________________

// Observer for player and word mutations
var bigbrother = new MutationObserver(()=> {
    update();
    updateImageAgent();
});
bigbrother.observe(document.querySelector("#currentWord"), { attributes: false, childList: true });
bigbrother.observe(document.querySelector(".containerGame #containerGamePlayers"), { attributes: false, childList: true });

// Observer for chat mutations
var chatObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            markMessage(node);
        })
    });
});
chatObserver.observe(document.getElementById("boxMessages"), { attributes: false, childList: true });

// enter lobby if last lobby was skipped 
if (sessionStorage.skippedLobby == "true") {
    setTimeout(() => { document.querySelector("button[type='submit'].btn-success").click(); }, 400);
    sessionStorage.skippedLobby = "false";
}

let showNextDropTimeout = null;
// check drops interval
setInterval(async () => {
    if (Report.guildLobbies.length <= 0){
        document.querySelector("#claimDrop").style.display = "none";
        return;
    }
    let state = await fetch('https://www.tobeh.host/Orthanc/drop/', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: "login=" + JSON.parse(localStorage.member).UserLogin
    }
    );
    state = await state.json();
    if (state.DropID) {
        let dropTime = state.ValidFrom;
        let timediff = Date.parse(dropTime + " UTC") - Date.now();
        if (timediff < 0) return;
        clearTimeout(showNextDropTimeout);
        showNextDropTimeout = setTimeout(() => {
            let drop = document.querySelector("#claimDrop")
            drop.setAttribute("dropID", state.DropID);
            drop.style.display = "block";
            drop.style.left = Math.round(8 + Math.random() * 784) + "px";
            let dropClaimedCheck = setInterval(async() => {
                if (drop.style.display == "none") { clearInterval(dropClaimedCheck); return;}
                let state = await fetch('https://www.tobeh.host/Orthanc/drop/', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: "login=" + JSON.parse(localStorage.member).UserLogin
                }
                );
                state = await state.json();
                if (!state.DropID) {
                    drop.dispatchEvent(new Event("click"));
                }
            }, 200);
            setTimeout(async () => { drop.style.display = "none"; clearInterval(dropClaimedCheck);}, 5000);
        },timediff);
    }
},10000);

// _____________________________________________________________
//
//               UI setup stuff (add buttons, events, etc)
// _____________________________________________________________


// func for UI setup 
(function () {
    // idk why but it has to!
    document.querySelector("#buttonClearCanvas").dispatchEvent(new Event("click"));

    // get DOM elements
    let input = document.querySelector("#inputChat");
    let box = document.querySelector("#boxChatInput");
    let panel_header = document.querySelector(".loginPanelTitle");
    let chat_cont = document.querySelector("#boxChat");
    let msg_cont = document.querySelector("#boxMessages");
    let gameHeader = document.querySelector(".gameHeaderButtons");

    // add listener to questionmark
    document.querySelector(".iconQuestionmark").onclick = function () { testMode(); };
    document.querySelector('button[type="submit"]').onclick = function () {
        localStorage.practise = false;
    };

    // Add event listener to keyup
    input.addEventListener("keyup", function () { keyup(); });

    // remove ad nodes
    document.querySelectorAll('a[href*="tower"]').forEach(function (ad) { ad.remove(); });

    // Create next button
    let bt_next = document.createElement("input");
    bt_next.setAttribute("type", "button");
    bt_next.setAttribute("value", "Next Lobby");
    bt_next.onclick = function () {
        sessionStorage.skipDeadLobbies = "true";
        sessionStorage.skippedLobby = "true";
        window.location.reload();
    }
    //bt_next.setAttribute("style", "height: 20px; padding:0px; padding-left: 5px; padding-right:5px;");
    bt_next.setAttribute("class", "btn btn-info btn-block");
    bt_next.style.margin = "0 0.5em";

    // Create exit button
    let bt_exit = document.createElement("input");
    bt_exit.setAttribute("type", "button");
    bt_exit.setAttribute("value", "Exit Lobby");
    bt_exit.onclick = function () { location.reload(); };
    //bt_exit.setAttribute("style", "height:20px; padding: 0px; padding-left: 5px; padding-right:5px;");
    bt_exit.setAttribute("class", "btn btn-warning btn-block");
    bt_exit.style.margin = "0 0.5em";

    // create table container for buttons
    let lobbyControls = document.createElement("div");
    lobbyControls.style = "display:flex; font-size:15; float: right; justify-content:center; align-items:center;";
    lobbyControls.appendChild(bt_exit);
    lobbyControls.appendChild(bt_next);
    gameHeader.appendChild(lobbyControls);

    // Add version status
    let status_box = document.createElement("button");
    status_box.innerHTML = "T@" + version;
    status_box.setAttribute("style", "font-size:15px; position:absolute; right:20px");
    status_box.setAttribute("class", "updateInfo");
    status_box.onclick = function () { alert("Click the extension icon to open the dashboard!"); };
    //panel_header.appendChild(status_box);

    // Add wordcount under input
    let table = document.createElement("TABLE");
    let tr = table.insertRow();
    let td = tr.insertCell();
    td.innerHTML = "<div id=\"info\"\></div>"; // lazy guy
    table.setAttribute("id", "tableBox");
    table.style.fontSize = "16px"
    table.style.width = "100%";
    table.style.marginLeft = "0%";
    table.style.marginTop = "5px";
    table.style.border = "thin stroke"
    table.style.borderRadius = "7px";
    table.style.background = "#BAFFAA";
    table.style.textAlign = "center";
    table.style.height = "25px";

    // shrink message container
    let _height = parseInt(table.style.height.substring(0, table.style.height.length - 2)) + parseInt(table.style.marginTop.substring(0, table.style.marginTop.length - 2)) + 34;

    // add wordcount if enabled
    if (localStorage.charBar == "false") {
        table.style.visibility = "collapse";
        _height = 34;
    }

    let style_cont_msg = document.createElement("style");
    style_cont_msg.innerHTML = "#boxMessages{height:calc(100% - " + _height + "px);}"
    style_cont_msg.setAttribute("id", "style_cont_msg");

    chat_cont.insertBefore(style_cont_msg, msg_cont);
    box.appendChild(table);

    // clear ads for space 
    //document.querySelector("#containerFreespace").innerHTML = ""; -> conflicts with image poster

    // Add imageagent
    let flag = document.createElement("input");
    flag.setAttribute("type", "button");
    flag.setAttribute("value", "Flag");
    flag.setAttribute("class", "btn btn-info");
    flag.setAttribute("style", "margin:0.5em; padding:0.2em");
    flag.addEventListener("click", () => { setAgentSource("flag"); });

    let logo = document.createElement("input");
    logo.setAttribute("type", "button");
    logo.setAttribute("value", "Logo");
    logo.setAttribute("class", "btn btn-info");
    logo.setAttribute("style", "margin:0.5em; padding:0.2em");
    logo.addEventListener("click", () => { setAgentSource("logo"); });

    let map = document.createElement("input");
    map.setAttribute("type", "button");
    map.setAttribute("value", "Map");
    map.setAttribute("class", "btn btn-info");
    map.setAttribute("style", "margin:0.5em; padding:0.2em");
    map.addEventListener("click", () => { setAgentSource("map"); });

    let random = document.createElement("input");
    random.setAttribute("type", "button");
    random.setAttribute("value", "Word");
    random.setAttribute("class", "btn btn-info");
    random.setAttribute("style", "margin:0.5em; padding:0.2em");
    random.addEventListener("click", () => { setAgentSource(""); });

    let text = document.createElement("input");
    text.setAttribute("type", "button");
    text.setAttribute("value", "Custom");
    text.setAttribute("class", "btn btn-warning");
    text.setAttribute("style", "margin:0.5em; padding:0.2em");
    text.addEventListener("click", () => { searchAgentInput.style.display == "none" ? searchAgentInput.style.display = "" : searchAgentInput.style.display = "none"; });

    let searchAgentInput = document.createElement("input");
    searchAgentInput.setAttribute("type", "text");
    searchAgentInput.setAttribute("class", "form-control");
    searchAgentInput.setAttribute("id", "searchAgentInput");
    searchAgentInput.setAttribute("style", "margin-bottom:0.3em; display:none");
    searchAgentInput.setAttribute("placeholder", "Input term and search with 'enter'!");
    searchAgentInput.addEventListener("keyup", (event) => {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') setAgentSource(searchAgentInput.value, 1);
        event.stopPropagation();
    });

    let agentButtons = document.createElement("div");
    agentButtons.setAttribute("id", "agentButtons");
    agentButtons.setAttribute("class", "updateInfo collapse in");
    agentButtons.appendChild(flag);
    agentButtons.appendChild(logo);
    agentButtons.appendChild(map);
    agentButtons.appendChild(random);
    agentButtons.appendChild(text);
    agentButtons.appendChild(searchAgentInput);

    let containerAgent = document.createElement("div");
    containerAgent.id = "containerAgent";
    containerAgent.appendChild(agentButtons);
    containerAgent.style = "display:flex;flex-direction:column;align-items:center;";

    let div_imageAgent = document.createElement("img");
    div_imageAgent.setAttribute("id", "imageAgent");
    div_imageAgent.setAttribute("style", "max-width:100%; max-height:30vh !important");

    containerAgent.appendChild(div_imageAgent);

    document.querySelector("#containerSidebar").insertBefore(containerAgent, document.querySelector("#containerSidebar").firstChild);
    agentButtons.style.display = "none";

    // show help
    //printCmdOutput(cmd_help);

    // add back btn
    let backBtn = document.createElement("div");
    let clearContainer = document.querySelector(".containerClearCanvas");
    backBtn.classList.add("tool");
    backBtn.id = "restore";
    backBtn.style.display = localStorage.displayBack ? "" : "none";
    backBtn.innerHTML = "<img class='toolIcon' src='" + chrome.extension.getURL("/res/back.gif") + "'>";
    backBtn.onclick = function () { restoreDrawing(1); };
    clearContainer.style.marginLeft = "8px";
    clearContainer.firstChild.classList.add("tool");
    clearContainer.firstChild.style.opacity = "1";
    clearContainer.classList.add("containerTools");
    clearContainer.appendChild(backBtn);
    toggleBackbutton(localStorage.displayBack == "true", true);

    // add random color image
    let rand = document.querySelector(".colorPreview");
    rand.innerHTML = "<img src='res/randomize.gif' class='toolIcon'>";
    rand.style.justifyContent = "center";
    rand.style.alignItems = "center";
    rand.style.display = "flex";
    rand.firstChild.display = localStorage.randomColorButton ? "" : "none";
    rand.firstChild.id = "randomIcon";
    rand.addEventListener("click", function () {
        document.querySelector("body").dispatchEvent(new CustomEvent("setRandomColor", { detail: localStorage.randomColorInterval }));
    });


    // add DL button
    let header = document.querySelector(".gameHeader");
    let download = document.createElement("img");
    download.src = "https://media.giphy.com/media/RLKYVelNK5bP3yc8LJ/giphy.gif";
    download.style.cursor = "pointer";
    download.id = "downloadImage";
    download.addEventListener("click", () => {
        let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer;
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);
        try {
            drawer = document.querySelector('#containerGamePlayers .drawing:not([style*="display: none"])').parentElement.parentElement.querySelector(".name").textContent.replace(" (You)", "");
        }
        catch{ drawer = ""; }
        d.download = "skribbl" + document.querySelector("#currentWord").textContent + (drawer ? drawer : "");
        d.href = document.querySelector("#canvasGame").toDataURL("image/png;base64");
        d.dispatchEvent(e);
    });
    header.insertBefore(download, header.firstChild);

    // add DL button for gif
    let downloadGif = document.createElement("img");
    downloadGif.src = chrome.runtime.getURL("res/gif.gif");
    downloadGif.style.cursor = "pointer";
    downloadGif.id = "downloadGif";
    downloadGif.addEventListener("click", () => {
        let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer;
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);
        try {
            drawer = document.querySelector('#containerGamePlayers .drawing:not([style*="display: none"])').parentElement.parentElement.querySelector(".name").textContent.replace(" (You)", "");
        }
        catch{ drawer = ""; }
        d.download = "skribbl" + document.querySelector("#currentWord").textContent + (drawer ? drawer : "");
        d.href = document.querySelector("#canvasGame").toDataURL("image/png;base64");
        drawCommandsToGif(d.download);
    });
    header.insertBefore(downloadGif, header.firstChild);

    // add Description form 
    let containerForms = document.querySelector(".containerSettings");
    let containerGroup = document.createElement("div");
    containerGroup.classList.add("form-group");
    let lobbyDescLabel = document.createElement("label");
    lobbyDescLabel.for = "lobybDesc";
    lobbyDescLabel.innerText = "Lobby Description";
    let textareaDesc = document.createElement("textarea");
    textareaDesc.classList.add("form-control");
    textareaDesc.placeholder = "Lobby description to show up in the palantir bot";
    textareaDesc.id = "lobbyDesc";

    containerForms.appendChild(containerGroup);
    containerGroup.appendChild(lobbyDescLabel);
    containerGroup.appendChild(textareaDesc);

    // add drawing copy button
    let optionsButton = document.createElement("button");
    document.querySelector("#containerPlayerlist div.tooltip-wrapper").appendChild(optionsButton);
    document.querySelector("#containerPlayerlist div.tooltip-wrapper").setAttribute("data-original-title", "");
    optionsButton.classList = "btn btn-info btn-block";
    optionsButton.id = "saveDrawingOptions";
    optionsButton.innerText = "Image tools";
    optionsButton.addEventListener("click", () => {
        if (!localStorage.imageTools) {
            alert("'Image tools' allow you to save drawings so they can be re-drawn in skribbl.\nUse the blue button to copy an image on fly or download and open images with the orange buttons.\nWhen you're drawing, you can paste them by clicking the green buttons.\nDO NOT TRY TO ANNOY OTHERS WITH THIS.");
            localStorage.imageTools = "READ IT";
        };
        document.querySelector("#saveDrawingPopup").style.display = "block";
        document.querySelector("#saveDrawingPopup").style.top = "calc(100% - 2em - " + document.querySelector("#saveDrawingPopup").offsetHeight + "px)";
        optionsPopup.children[0].focus();
        //document.querySelector("#saveDrawingPopupPaste").style.display = document.querySelector(".containerToolbar").style.display;
        document.querySelector("#saveDrawingPopupPasteSaved").style.display = document.querySelector(".containerToolbar").style.display;
        //if (drawCommandsCopy.length <= 0) document.querySelector("#saveDrawingPopupPaste").style.display = "none";
    });

    let optionsPopup = document.createElement("div");
    document.querySelector("#containerPlayerlist").appendChild(optionsPopup);
    optionsPopup.style.position = "absolute";
    optionsPopup.style.background = "white";
    //optionsPopup.style.top = "";
    optionsPopup.style.overflow = "hidden";
    optionsPopup.style.zIndex = "5";
    optionsPopup.style.width = "90%";
    optionsPopup.style.padding = "1em;";
    optionsPopup.style.borderRadius = ".5em";
    optionsPopup.style.marginLeft = "5%";
    optionsPopup.style.boxShadow = "1px 1px 9px -2px black";
    optionsPopup.style.display = "none";
    optionsPopup.style.minHeight = "15%";
    optionsPopup.style.padding = "1em";
    optionsPopup.id = "saveDrawingPopup";
    optionsPopup.tabIndex = "-1";

    //let popupCopyCommands = document.createElement("button");
    //optionsPopup.appendChild(popupCopyCommands);
    //popupCopyCommands.classList = "btn btn-info btn-block";
    //popupCopyCommands.innerText = "Copy current";
    //popupCopyCommands.addEventListener("click", () => {
    //    let clear = capturedActions.length-1;
    //    while (capturedActions[clear][0] != 3) clear--;
    //    drawCommandsCopy = [...capturedActions.slice(clear)];
    //    document.querySelector("#saveDrawingPopupPaste").style.display = document.querySelector(".containerToolbar").style.display;
    //});


    //let popupPasteCommands = document.createElement("button");
    //optionsPopup.appendChild(popupPasteCommands);
    //popupPasteCommands.id = "saveDrawingPopupPaste";
    //popupPasteCommands.classList = "btn btn-info btn-block";
    //popupPasteCommands.innerText = "Paste copied";
    //popupPasteCommands.addEventListener("click", () => {
    //    drawOnCanvas(drawCommandsCopy);
    //    capturedActions = [...drawCommandsCopy];
    //}
    //);

    let popupTempSaveCommands = document.createElement("button");
    optionsPopup.appendChild(popupTempSaveCommands);
    popupTempSaveCommands.classList = "btn btn-info btn-block";
    popupTempSaveCommands.innerText = "Save current";
    popupTempSaveCommands.addEventListener("click", () => {
        let originalActions = getCapturedActions();
        let clear = originalActions.length - 1;
        while (originalActions[clear][0] != 3) clear--;
        let popupCustomSaved = document.createElement("button");
        optionsPopup.appendChild(popupCustomSaved);
        popupCustomSaved.classList = "btn btn-success btn-block";
        let actions = [...originalActions.slice(clear)];
        let drawer;
        try {
            drawer = document.querySelector('#containerGamePlayers .drawing:not([style*="display: none"])').parentElement.parentElement.querySelector(".name").textContent.replace(" (You)", "");
        }
        catch{ drawer = "coolDrawing"; }
        popupCustomSaved.innerText = prompt("How would you like to name the drawing?", drawer);
        popupCustomSaved.addEventListener("click", () => {
            drawOnCanvas(actions);
            capturedActions = [...actions];
        });
        document.querySelector("#saveDrawingPopup").style.top = "calc(100% - 2em - " + document.querySelector("#saveDrawingPopup").offsetHeight + "px)";
    });

    let popupSaveCommands = document.createElement("button");
    optionsPopup.appendChild(popupSaveCommands);
    popupSaveCommands.classList = "btn btn-warning btn-block";
    popupSaveCommands.innerText = "Download current";
    popupSaveCommands.addEventListener("click", () => {
        let originalActions = getCapturedActions();
        let clear = originalActions.length - 1;
        while (originalActions[clear][0] != 3) clear--;
        if (originalActions.length < 1 || originalActions[0][0] == 3 && originalActions.length == 1) { alert("Error capturing drawing data :("); return;}
        let content = JSON.stringify([...originalActions.slice(clear)]);
        let dl = document.createElement('a');
        dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        dl.setAttribute('download', prompt("What name should the drawing be saved under?", "niceDrawing" ) + ".skd");
        dl.style.display = 'none';
        document.body.appendChild(dl);
        dl.click();
        document.body.removeChild(dl);
        let popupCustomSaved = document.createElement("button");
        optionsPopup.appendChild(popupCustomSaved);
        popupCustomSaved.classList = "btn btn-success btn-block";
        let actions = [...originalActions.slice(clear)];
        popupCustomSaved.innerText = dl.getAttribute("download");
        popupCustomSaved.addEventListener("click", () => {
            drawOnCanvas(actions);
            capturedActions = [...actions];
        });
    });

    let popupPasteSavedCommands = document.createElement("button");
    optionsPopup.appendChild(popupPasteSavedCommands);
    popupPasteSavedCommands.id = "saveDrawingPopupPasteSaved";
    popupPasteSavedCommands.classList = "btn btn-warning btn-block";
    popupPasteSavedCommands.innerText = "Load file";
    popupPasteSavedCommands.addEventListener("click", () => {
        let fileInput = document.createElement('input');
        let actions;
        fileInput.type = 'file';
        fileInput.accept = ".skd";
        fileInput.onchange = e => {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = readerEvent => {
                actions = readerEvent.target.result;
                let popupCustomSaved = document.createElement("button");
                optionsPopup.appendChild(popupCustomSaved);
                popupCustomSaved.classList = "btn btn-success btn-block";
                popupCustomSaved.innerText = file.name;
                popupCustomSaved.addEventListener("click", () => {
                    drawOnCanvas(JSON.parse(actions));
                    capturedActions = JSON.parse(actions);
                });
                document.querySelector("#saveDrawingPopup").style.top = "calc(100% - 2em - " + document.querySelector("#saveDrawingPopup").offsetHeight + "px)";
            }
        }
        fileInput.click();
    });

    let checkbox = document.createElement("input");
    let checkboxWrap = document.createElement("div");
    let checkboxLabel = document.createElement("label");
    checkbox.type = "checkbox";
    checkbox.id = "clearCanvasBeforePaste";
    checkboxLabel.innerText = "Clear canvas before paste";
    checkboxLabel.insertBefore(checkbox,checkboxLabel.firstChild);
    checkboxWrap.appendChild(checkboxLabel);
    checkboxWrap.classList.add("checkbox");
    optionsPopup.appendChild(checkboxWrap);


    Array.from(optionsPopup.children).concat(optionsPopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!optionsPopup.contains(document.activeElement)) optionsPopup.style.display = "none" }, 20); }));

    // add sketchful colors
    document.querySelector(".containerColorbox").id = "originalPalette";
    document.querySelector("#buttonClearCanvas").style.height = "48px";
    let palettes = JSON.parse(localStorage.customPalettes);
    //let sketchfulPalette = '{"rowCount":13, "name":"sketchfulPalette", "colors":[{"color":"rgb(255, 255, 255)","index":100},{"color":"rgb(211, 209, 210)","index":101},{"color":"rgb(247, 15, 15)","index":102},{"color":"rgb(255, 114, 0)","index":103},{"color":"rgb(252, 231, 0)","index":104},{"color":"rgb(2, 203, 0)","index":105},{"color":"rgb(1, 254, 148)","index":106},{"color":"rgb(5, 176, 255)","index":107},{"color":"rgb(34, 30, 205)","index":108},{"color":"rgb(163, 0, 189)","index":109},{"color":"rgb(204, 127, 173)","index":110},{"color":"rgb(253, 173, 136)","index":111},{"color":"rgb(158, 84, 37)","index":112},{"color":"rgb(81, 79, 84)","index":113},{"color":"rgb(169, 167, 168)","index":114},{"color":"rgb(174, 11, 0)","index":115},{"color":"rgb(200, 71, 6)","index":116},{"color":"rgb(236, 158, 6)","index":117},{"color":"rgb(0, 118, 18)","index":118},{"color":"rgb(4, 157, 111)","index":119},{"color":"rgb(0, 87, 157)","index":120},{"color":"rgb(15, 11, 150)","index":121},{"color":"rgb(110, 0, 131)","index":122},{"color":"rgb(166, 86, 115)","index":123},{"color":"rgb(227, 138, 94)","index":124},{"color":"rgb(94, 50, 13)","index":125},{"color":"rgb(0, 0, 0)","index":126},{"color":"rgb(130, 124, 128)","index":127},{"color":"rgb(87, 6, 12)","index":128},{"color":"rgb(139, 37, 0)","index":129},{"color":"rgb(158, 102, 0)","index":130},{"color":"rgb(0, 63, 0)","index":131},{"color":"rgb(0, 118, 106)","index":132},{"color":"rgb(0, 59, 117)","index":133},{"color":"rgb(14, 1, 81)","index":134},{"color":"rgb(60, 3, 80)","index":135},{"color":"rgb(115, 49, 77)","index":136},{"color":"rgb(209, 117, 78)","index":137},{"color":"rgb(66, 30, 6)","index":138}]}'
    //sketchfulPalette = JSON.parse(sketchfulPalette);
    palettes.forEach(p => addColorPalette(p));

    // add drop button
    let dropContainer = document.createElement("div");
    dropContainer.id = "claimDrop";
    dropContainer.style.width = "48px";
    dropContainer.style.height = "48px";
    dropContainer.style.left = "8px";
    dropContainer.style.bottom = "8px";
    dropContainer.style.position = "absolute";
    dropContainer.style.backgroundSize = "contain";
    dropContainer.style.cursor = "pointer";
    dropContainer.style.display = "none";
    dropContainer.style.backgroundImage = "url('https://tobeh.host/Orthanc/sprites/gif/drop.gif')";
    dropContainer.addEventListener("click", async () => {
        if (dropContainer.style.display == "none") return;
        dropContainer.style.display = "none";
        let dropID = dropContainer.getAttribute("dropID");
        let state = await fetch('https://www.tobeh.host/Orthanc/drop/claim/', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: "login=" + JSON.parse(localStorage.member).UserLogin + "&dropID=" + dropID + "&lobbyKey=" + Report.guildLobbies[0].Key + "&lobbyPlayerID=" + Report.loginName
        }
        );
        state = await state.json();
        if (state.Caught) printCmdOutput("drop", "You were the fastest and caught the drop!", "Yeee!");
        else {
            let winner = "";
            if (state.CaughtLobbyKey == Report.guildLobbies[0].Key) winner = state.CaughtLobbyPlayerID;
            else winner = "Someone in another lobby"
            printCmdOutput("drop", winner + " caught the drop before you :(", "Whoops...");
        }
    })
    document.querySelector("#containerCanvas").appendChild(dropContainer);


})();

function addColorPalette(paletteJson) {
    let containerColorbox = document.createElement("div");
    containerColorbox.classList.add("containerColorbox");

    let columns = [];
    paletteJson.colors.forEach(c => {
        let index = paletteJson.colors.indexOf(c);
        if (!columns[Math.floor(index / paletteJson.rowCount)]) columns.push([]);
        columns[Math.floor(index / paletteJson.rowCount)].push(c);
    });

    let paletteContainer = document.createElement("div");
    paletteContainer.id = paletteJson.name;

    if (localStorage.palette == paletteJson.name) document.querySelector(".containerColorbox").style.display = "none";
    else paletteContainer.style.display = "none";

    paletteContainer.classList.add("containerColorbox");
    paletteContainer.classList.add("customPalette");
    paletteContainer.setAttribute("data-toggle", "tooltip");
    paletteContainer.setAttribute("data-placement", "top");
    paletteContainer.setAttribute("title", "");
    paletteContainer.setAttribute("data-original-title", "Select a color");

    columns.forEach(c => {
        let colorColumn = document.createElement("div");
        colorColumn.classList.add("containerColorColumn");
        c.forEach(i => {
            let colorItem = document.createElement("div");
            colorItem.classList.add("colorItem");
            colorItem.setAttribute("data-color", i.index);
            colorItem.style.background = i.color;
            colorItem.addEventListener("click", () => document.querySelector("body").dispatchEvent(new CustomEvent("setColor", { detail: i.index })));
            colorColumn.appendChild(colorItem);
        });
        paletteContainer.appendChild(colorColumn);
    });
    let tools = document.querySelector(".containerTools");
    tools.parentElement.insertBefore(paletteContainer, tools);
    return paletteContainer;
}


// func to mark a message node with background color
function markMessage(newNode) {
    if (localStorage.markup != "true") return;

    let sender = newNode.innerHTML.slice(newNode.innerHTML.indexOf("<b>"), newNode.innerHTML.indexOf("</b>")).slice(3, -2);
    if (sender == document.querySelector("input[placeholder='Enter your name']").value || sender != "" && localStorage.vip.split("/").includes(sender))
        newNode.style.background = localStorage.markupColor;
}


// _____________________________________________________________
//
//            General functions (keyups, imageagent, shortcuts)
// _____________________________________________________________


// func to process keyups in message field
function keyup() {

    let input = document.getElementById("inputChat");
    let word = document.getElementById("currentWord");

    // remove content if clear token is present
    if (input.value.includes(localStorage.token)) {
        input.value = "";
        is_length_error = false;
        is_hint_error = false;
    }

    // recognize command and call interpreter
    if (input.value.includes(command_token)) {
        command_interpreter(input.value);
        input.value = "";
        is_length_error = false;
        is_hint_error = false;
    }

    // update length
    update();

    // If not already wrong, check if there are letters conflicting with hints
    if (!is_length_error) {
        let typed = input.value.toLowerCase();
        word = word.innerHTML.toLowerCase();

        if (typed.length > word.length) typed = typed.substring(0, word.length); // If typed longer than word, then cut

        for (var i = 0; i < typed.length; i++) {
            if (word[i] == "_") { is_hint_error = false; continue; } // if correct, skip letter

            is_hint_error = (word[i] != typed[i]); // if no match, show error
            if (is_hint_error) break;
        }
    }

    let bar = document.querySelector("#tableBox");

    if (is_length_error || is_hint_error) bar.style.background = "#ff5c33";
    else bar.style.background = "#BAFFAA";
}

// func to check if input is longer than word
function update() {
    let info = document.querySelector("#info");
    if (info == null) return; // Check if element exists

    let typed = document.getElementById("inputChat").value;
    let word = document.getElementById("currentWord").innerHTML;
    let diff = word.length - typed.length;

    is_length_error = (diff < 0);
    info.innerHTML = diff;
}

// func to set imageagentbuttons visible if drawing
function updateImageAgent() {
    let word = document.getElementById("currentWord");
    let div = document.getElementById("agentButtons");

    // if player isnt drawing
    if (div == null) return;

    if (word.innerHTML.includes("_") || word.innerHTML == "" || localStorage.imageAgent == "false") {
        div.style.display = "none";
        document.querySelector("#containerAgent").setAttribute("class", "");
        document.querySelector("#imageAgent").setAttribute("src", "");
        scrollMessages();
        return;
    }
    div.style.display = "block";
    document.querySelector("#containerAgent").setAttribute("class", "updateInfo collapse in");
    scrollMessages();
}

// func to set the image in the agentdiv - TODO: REPLACE COS BYPASS WITH GOOGLE-PERMISSION!!!
function setAgentSource(searchCriteria, exclusive = 0) {
    let agent = document.querySelector("#imageAgent");
    let word = document.querySelector("#currentWord").innerHTML;

    let search = (exclusive ? "" : word + "+") + searchCriteria;
    search = replaceUmlaute(search);

    agent.src = "/res/load.gif";

    // Search engines:
    // Google, duckduckgo etc detect bot usage -> unusable
    // Not working after few requests due to bot detection or smth:     https://yandex.com/images/search?text=hello%20kitty
    // Working but a bit weird results:                                 https://www.mojeek.com/search?fmt=images&imgpr=bing&q=

    //let xhr = new XMLHttpRequest();
    //xhr.open("GET", "https://www.google.com/search?safe=off&tbm=isch&sclient=img&q=" + search, true);
    //xhr.onreadystatechange = () => {
    //    if (xhr.readyState == 4) {
    //        console.log(xhr.responseText);
    //    }
    //}
    //xhr.send();
    // change to fetch
    $.getJSON('https://api.allorigins.win/get?url=' +
        encodeURIComponent('https://www.mojeek.com/search?fmt=images&imgpr=bing&q=' + search), function (data) {
            let html = data.contents;
            let doc = new DOMParser().parseFromString(html, "text/html");
            let imgs = doc.querySelectorAll("img");

            let src = imgs[2].getAttribute("src");
            src = src.substr(src.lastIndexOf("https"));
            agent.setAttribute("src", src);
            $(agent).data("index", "2")
            scrollMessages();

            $(agent).unbind();
            $(agent).click(function () {
                let i = parseInt($(agent).data("index"));
                i++;
                if (i >= imgs.length) i = 2;

                let src = imgs[i].getAttribute("src");
                src = src.substr(src.lastIndexOf("https"));
                //agent.src="/res/load.gif";
                agent.setAttribute("src", src);
                $(agent).data("index", i);
                scrollMessages();
            });
        });
}

//function to scroll to bottom of message container
function scrollMessages() {
    let box = document.querySelector("#boxMessages");
    $(box).scrollTop($(box).prop("scrollHeight"));
}

// func to show game div
function testMode() {
    localStorage.practise = true;
    document.querySelector(".containerToolbar").style.display = "";

    document.getElementById("screenGame").style.display = "block";
    document.getElementById("screenLogin").style.display = "none";
    document.querySelector(".header").style.display = "none";
    setTimeout(function () {
        document.querySelector("#currentWord").innerHTML = "Practise";
        $("body, html").animate({
            scrollTop: $(document).height()
        }, 400);
    }, 100);
}

// umlaute which have to be replaced
const umlautMap = {
    '\u00dc': 'UE',
    '\u00c4': 'AE',
    '\u00d6': 'OE',
    '\u00fc': 'ue',
    '\u00e4': 'ae',
    '\u00f6': 'oe',
    '\u00df': 'ss',
}

// func to replace umlaute in a string
function replaceUmlaute(str) {
    return str
        .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
            const big = umlautMap[a.slice(0, 1)];
            return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
        })
        .replace(new RegExp('[' + Object.keys(umlautMap).join('|') + ']', "g"),
            (a) => umlautMap[a]
        );
}
