/*
 * Contentscript which tweaks skribbl and basically controls whats added to the ui and how that stuff works.
 * Dispatches events to the body dom element tocommunicate with patched gamejs
 * 
 * That whole code piled up during about one year, still working to make it less ugly and to eliminate the worst of the bad-practise-parts
 * Also, there are still some german parts hiding... :))))
 */

/*
    Different versions of the holy gif (yeah DEFINITELY should stop hosting it on giphy)
    - Mit Kontur                                            https://media.giphy.com/media/RJKTLStD0Lc6IaFw5C/giphy.gif
    - Zweifarbig                                            https://media.giphy.com/media/UvVlujHiawde07lhXC/giphy.gif
    - Dreifarbig, dünkler                                   https://media.giphy.com/media/KCvmNt16OGOaQj3tUl/giphy.gif
    - Verbessert oben, nicht so dunkel                      https://media.giphy.com/media/Idflcn5mfJ5rrS83hs/giphy.gif
    - Beste Version                                         https://media.giphy.com/media/f4283S48LIV14CJfuf/giphy.gif
    - Kleiner zweifarbig                                    https://media.giphy.com/media/JUSvACNKQtVX7FDwRY/giphy.gif
    - Kleiner mit Leuchten                                  https://media.giphy.com/media/VbJZngoMF3A4x9trJM/giphy.gif
    - -#- dickere Leuchten                                  https://media.giphy.com/media/kcCw9Eq5QoXrfriJjP/giphy.gif
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
'use strict';
const version = "16.2";
const link_to_holy = "https://media.giphy.com/media/kcCw9Eq5QoXrfriJjP/giphy.gif";
const command_token = "--";

// Set default settings
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

// Activate game container for betatesting purposes
if (version.includes("beta")) testMode();

// enter lobby if last lobby was skipped
if (sessionStorage.skippedLobby == "true") {
    document.querySelector("button[type='submit'].btn-success").click();
    sessionStorage.skippedLobby = "false";
}

// communication with popup.js
chrome.runtime.onMessage.addListener(msgObj => {
    if (msgObj == "get") {
        chrome.runtime.sendMessage({
            get: JSON.stringify(localStorage)
        });
    }
    else command_interpreter(msgObj + "--");
});

// capture drawings
var capturedCommands = [];
document.querySelector("body").addEventListener("logDrawCommand", function (e) { capturedCommands.push(e.detail); });

// log canvas clear in actions array
document.querySelector("body").addEventListener("logCanvasClear", function (e) { capturedCommands = []; capturedActions.push([[3]]); });

// clear captured actions if drawer finished
document.querySelector("body").addEventListener("drawingFinished", function (e) { capturedCommands = []; capturedActions = []; });

// put commands in array (each index is one action aka mouseup on canvas)
var capturedActions = []
function pushCaptured() { capturedCommands.length > 0 ? (capturedActions.push(capturedCommands), capturedCommands = []) : 1; }
document.querySelector("#canvasGame").addEventListener("pointerup", pushCaptured);
document.querySelector("#canvasGame").addEventListener("pointerout", pushCaptured);

// Observer for player and word mutations
var bigbrother = new MutationObserver(function (mutations) {
    update();
    checkPlayers();
    updateImageAgent();
});
bigbrother.observe(document.querySelector("#currentWord"), { attributes: false, childList: true });
bigbrother.observe(document.querySelector("#containerGamePlayers"), { attributes: false, childList: true });

// Observer for chat mutations
var chatObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            markMessage(node);
        })
    });
});
chatObserver.observe(document.getElementById("boxMessages"), { attributes: false, childList: true });

//init pressure sensibility for windows ink and tablets - k depends on steps
const kLevel = 1 / 36;
var refresh = true;
var refreshCycle = 5;

// event for pressure drawing
document.querySelector("#canvasGame").onpointermove = function (event) {

    if (!refresh || localStorage.ink || event.pointerType != "pen") return;
    refresh = false;

    let size = 4;
    while (size * kLevel * (101 - localStorage.sens) / 100 < event.pressure) size += 0.2;
    setBrushsize(size);

    setTimeout(function () { refresh = true; }, refreshCycle);
}

// event if pen was released
document.querySelector("#canvasGame").onpointerup = function (event) {
    if (localStorage.ink && event.pointerType == "pen") setBrushsize(1);
}

// defaults for word check
var is_length_error = false;
var is_hint_error = false;

// func for UI setup 
(function (event) {

    // get DOM elements
    let input = document.querySelector("#inputChat");
    let current = document.querySelector("#currentWord");
    let box = document.querySelector("#boxChatInput");
    let panel_header = document.querySelector(".loginPanelTitle");
    let chat_cont = document.querySelector("#boxChat");
    let msg_cont = document.querySelector("#boxMessages");
    let div_buttons = document.querySelector(".gameHeaderButtons");

    // add listener to querstionmark
    document.querySelector(".iconQuestionmark").onclick = function () { testMode(); };
    document.querySelector('button[type="submit"]').click = function () { localStorage.practise = false; };

    // Add event listener to keyup
    input.addEventListener("keyup", function () { keyup(); });

    // remove ad nodes
    document.querySelectorAll('a[href*="tower"]').forEach(function (ad) { ad.remove(); });

    // Create next button
    let bt_next = document.createElement("input");
    bt_next.setAttribute("type", "button");
    bt_next.setAttribute("value", "Next Lobby");
    bt_next.onclick = function () {
        sessionStorage.skippedLobby = true;
        location.reload();
    }
    bt_next.setAttribute("style", "height: 20px; padding:0px; padding-left: 5px; padding-right:5px;");
    bt_next.setAttribute("class", "btn btn-info btn-block");

    // Create exit button
    let bt_exit = document.createElement("input");
    bt_exit.setAttribute("type", "button");
    bt_exit.setAttribute("value", "Exit Lobby");
    bt_exit.onclick = function () { location.reload(); };
    bt_exit.setAttribute("style", "height:20px; padding: 0px; padding-left: 5px; padding-right:5px;");
    bt_exit.setAttribute("class", "btn btn-block btn-warning");

    // create table container for buttons
    var table_controls = document.createElement("table");
    let td_next = document.createElement("td");
    let td_exit = td_next;
    let tr_0 = document.createElement("tr");
    let tr_1 = tr_0;

    td_next.appendChild(bt_next);
    tr_1.appendChild(td_next);

    td_exit.appendChild(bt_exit);
    tr_0.appendChild(td_exit);

    table_controls.setAttribute("style", "margin-top: 2px; margin-right:10px; margin-left: 10px");
    table_controls.appendChild(tr_0);
    table_controls.appendChild(tr_1);

    div_buttons.appendChild(table_controls);

    // Add version status
    let status_box = document.createElement("button");
    status_box.innerHTML = "T@" + version;
    status_box.setAttribute("style", "font-size:15px; position:absolute; right:20px");
    status_box.setAttribute("class", "updateInfo");
    status_box.onclick = function () { alert("Click the extension icon to open the dashboard!"); };
    panel_header.appendChild(status_box);

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
    document.querySelector("#containerFreespace").innerHTML = "";

    // Add imageagent
    let div_imageAgent = document.createElement("img");
    div_imageAgent.setAttribute("id", "imageAgent");
    div_imageAgent.setAttribute("style", "max-width:100%; max-height:30vh !important");
    document.querySelector("#containerFreespace").insertBefore(div_imageAgent, document.querySelector("#containerFreespace").firstChild);
    div_imageAgent.parentNode.style = "display:flex;flex-direction:column;align-items:center;";


    let flag = document.createElement("input");
    flag.setAttribute("type", "button");
    flag.setAttribute("value", "Flag");
    flag.setAttribute("class", "btn btn-info");
    flag.setAttribute("style", "margin:0.5em; padding:0.2em");
    $(flag).click(function () { setAgentSource("flag"); });

    let logo = document.createElement("input");
    logo.setAttribute("type", "button");
    logo.setAttribute("value", "Logo");
    logo.setAttribute("class", "btn btn-info");
    logo.setAttribute("style", "margin:0.5em; padding:0.2em");
    $(logo).click(function () { setAgentSource("logo"); });

    let map = document.createElement("input");
    map.setAttribute("type", "button");
    map.setAttribute("value", "Map");
    map.setAttribute("class", "btn btn-info");
    map.setAttribute("style", "margin:0.5em; padding:0.2em");
    $(map).click(function () { setAgentSource("map"); });

    let random = document.createElement("input");
    random.setAttribute("type", "button");
    random.setAttribute("value", "Word");
    random.setAttribute("class", "btn btn-info");
    random.setAttribute("style", "margin:0.5em; padding:0.2em");
    $(random).click(function () { setAgentSource(""); });

    let text = document.createElement("input");
    text.setAttribute("type", "button");
    text.setAttribute("value", "Custom");
    text.setAttribute("class", "btn btn-warning");
    text.setAttribute("style", "margin:0.5em; padding:0.2em");
    $(text).click(function () { $("#searchAgentInput").toggle(); });

    let searchAgentInput = document.createElement("input");
    searchAgentInput.setAttribute("type", "text");
    searchAgentInput.setAttribute("class", "form-control");
    searchAgentInput.setAttribute("id", "searchAgentInput");
    searchAgentInput.setAttribute("style", "margin-bottom:0.3em; display:none");
    searchAgentInput.setAttribute("placeholder", "Input term and search with 'enter'!");
    $(searchAgentInput).keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') setAgentSource($(searchAgentInput).val(), 1);
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

    document.querySelector("#containerFreespace").insertBefore(agentButtons, document.querySelector("#containerFreespace").firstChild);
    agentButtons.style.display = "none";

    // show help
    printCmdOutput(cmd_help);

    // add back btn
    let backBtn = document.createElement("div");
    backBtn.classList.add("tool");
    backBtn.id = "restore";
    backBtn.style.display = localStorage.displayBack ? "" : "none";
    backBtn.innerHTML = "<img class='toolIcon' src='" + chrome.extension.getURL("/res/back.gif") + "'>";
    backBtn.onclick = function () { restoreDrawing(1); };
    document.querySelector(".containerTools").appendChild(backBtn);
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

})();

// func to mark a message node with background color
function markMessage(newNode) {
    if (localStorage.markup != "true") return;

    let sender = newNode.innerHTML.slice(newNode.innerHTML.indexOf("<b>"), newNode.innerHTML.indexOf("</b>")).slice(3, -2);
    if (sender == document.querySelector("input[placeholder='Enter your name']").value || sender != "" && localStorage.vip.split("/").includes(sender))
        newNode.style.background = markup_color;
}

// func to restore drawing based on saved commands
function restoreDrawing(limit = 0) {
    let actions = capturedActions.slice(0, -limit);
    let redo = [];

    // put all commands from each action in one command-array. the last actions (limit) are passed.
    for (let action = 0, lenA = capturedActions.length - limit; action < lenA; action++)
        for (let cmd = 0, lenC = capturedActions[action].length; cmd < lenC; cmd++)
            capturedActions[action][cmd].length > 0 && redo.push(capturedActions[action][cmd]);

    // search for the last clear to avoid unnecessary drawing
    let lastClear = redo.length - 1;
    while (lastClear > 0 && redo[lastClear][0] != 3) { lastClear--; }

    let captured = lastClear > 0 ? lastClear + 1 : 0;
    let maxcaptured = redo.length;

    let body = document.querySelector("body");
    document.querySelector("#buttonClearCanvas").dispatchEvent(new Event("click"));
    let t = setInterval(function () {
        captured >= maxcaptured ? (clearInterval(t), capturedActions = [], capturedCommands = [], capturedActions = actions) :
            body.dispatchEvent(new CustomEvent("performDrawCommand", { detail: redo[captured] })); captured++;
    }, 3);
}

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

// mutation observer callback
function checkPlayers() {

    let players = document.querySelector(".name");
    let i;

    for (i = 0; i < players.length; i++) {
        if (players[i].innerHTML.includes("(You)") || players[i].innerHTML.includes("Ƭ")) // hehehe Ƭobeh is always premium
        {
            let playerNode = players[i].parentNode.parentNode;
            let pNar = playerNode.children;
            let special;

            let k;
            for (k = 0; k < pNar.length; k++) {

                if (pNar[k].className == "avatar") {

                    let aNar = pNar[k].children;

                    let j;
                    for (j = 0; j < pNar.length; j++) {

                        if (aNar[j].className == "special") {
                            special = aNar[j];

                            if (localStorage.ownHoly == "true") {
                                special.setAttribute("style", "background-image: url(" + link_to_holy + ");");
                                players[i].parentElement.parentElement.style.height = "60px";
                            }

                            if (localStorage.ownHoly == "false") {
                                special.setAttribute("style", "display:none;");
                                players[i].parentElement.parentElement.style.height = "50px";
                            }
                        }
                    }
                }
            }
        }
    }
} // bootyful

// func to set the brushsize (event to game.js)
function setBrushsize(newsize) {
    let event = new CustomEvent("setBrushSize", {
        detail: newsize
    });
    document.querySelector("body").dispatchEvent(event);
}

// func to set imageagentbuttons visible if drawing
function updateImageAgent() {
    let word = document.getElementById("currentWord");
    let div = document.getElementById("agentButtons");

    // if player isnt drawing
    if (div == null) return;

    if (word.innerHTML.includes("_") || word.innerHTML == "" || localStorage.imageAgent == "false") {
        div.style.display = "none";
        document.querySelector("#containerFreespace").setAttribute("class", "");
        document.querySelector("#imageAgent").setAttribute("src", "");
        scrollMessages();
        return;
    }
    div.style.display = "block";
    document.querySelector("#containerFreespace").setAttribute("class", "updateInfo collapse in");
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
    setTimeout(function () {
        document.querySelector("#currentWord").innerHTML = "example";
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
