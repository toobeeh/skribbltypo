// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

let hints = [
    "Did you notice the tool shortcuts B,F and E?<br>Try out C to use a color pipette tool.",
    "Click on the canvas and use STRG+Arrow to draw a perfect straight line!",
    "Connect the Palantir Discord bot to search for your friends easily.",
    "Enable the ImageAgent to show template pictures when you're drawing.",
    "Use arrow up/down to recover the last chat input.",
    "Enable random colors and click the dice in the color field to get a rainbow brush.<br>Click any color to abort.",
    "Search for multiple player names by separating them with a comma.",
    "Change the markup color for your chat messages with the slider in the popup tab 'advanced'.",
    "Change the pressure sensitivity with the slider in the popup tab 'advanced'.",
    "Toggle your discord bot visibility in the extension popup.",
    "Get more colors by choosing the sketchful palette in the popup tab 'advanced'.<br>Only extension users see those colors.",
    "When creating a private lobby, you can set a description which can be seen in the discord bot.",
    "Click a lobby button to search for a lobby automatically.<br>The search will pause until there are free slots.",
    "Click the letter icon to share the current image directly to any of your discord servers.",
    "To remove an added Discord server, click its name in the popup tab 'Discord'.",
    "Click the magnifier icon to use a color picker! All Typo users can see the colors.",
    "Precision Work? Use the zoom feature!<br> [STRG + Click] to zoom to point, any number to set zoom level and leave with [STRG + Click].",
    "If you like the extension, tell others about it or rate it on the chrome store! <3"
];

var patcher = new MutationObserver(function (mutations) {
         mutations.forEach(function (mutation){
            mutation.addedNodes.forEach(async function(node){
                if (node.tagName == "SCRIPT" && node.src.includes("game.js")) {
                    // block game.js
                    node.type = "javascript/blocked"; // block for chrome
                    node.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true });
                    // insert patched script
                    let script = document.createElement("script");
                    script.src = chrome.extension.getURL("gamePatch.js");
                    node.parentElement.appendChild(script);
                    // insert search popup
                    let p = document.createElement("div");
                    p.innerHTML = '<div id="popupSearch" class="btn btn-primary" style=" z-index:10; font-size:1.5em;position: fixed;overflow-wrap: break-word;width: 25vw;word-break: break-all;left: 37.6vw;min-height: 5em;display: flex;align-items: center;justify-content: center;border-radius: 1em;top: 2em;box-shadow: black 0em 0em 10em 1em;">Searching Lobby... [Enter] to abort</div>';
                    document.body.appendChild(p);
                    if (!(sessionStorage.lobbySearch == "true" || sessionStorage.skipDeadLobbies == "true" || sessionStorage.searchPlayers && JSON.parse(sessionStorage.searchPlayers).length > 0)) p.style.display = "none";
                    document.addEventListener("keyup", (e) => {
                        let keycode = (e.keyCode ? e.keyCode : e.which);
                        if (keycode == '13') {
                            sessionStorage.lobbySearch = "false";
                            sessionStorage.skipDeadLobbies = "false";
                            sessionStorage.searchPlayers = "[]";
                            p.style.display = "none";
                        }
                    });
                }
                if (node.tagName == "A" && node.href.includes("tower")) node.remove();
                if (node.tagName == "DIV") {
                    if (node.classList.contains("login-side-right")) {
                        await initLobbyTab(true);
                        node.style.width = "300px";
                        node.style.flex = "0 1 auto";
                    }
                    if (node.classList.contains("loginPanelContent") && document.querySelectorAll(".loginPanelContent").length > 2 && document.querySelectorAll(".login-side-left .loginPanelContent").length <= 0) {
                        let cont = document.querySelector(".login-side-left");
                        cont.appendChild(node);
                        cont.style.width = "300px";
                        cont.style.flex = "0 1 auto";
                    }
                    if (node.classList.contains("updateInfo")) {
                        let status = await (await fetch("https://tobeh.host/Orthanc/status.txt")).text();
                        node.innerHTML = "Hello there! 💖<br><br>BTW: " + hints[Math.floor((Math.random() * hints.length))] + "<br><br>" + status;
                    }
                    
                }
                if (node.id == 'screenLogin') {
                    node.style.justifyContent = "center";
                }
                if (node.id == 'formLogin') {
                    //add dead lobbies button
                    let privateBtn = document.querySelector("#buttonLoginCreatePrivate");
                    let skipDead = document.createElement("button");
                    privateBtn.style.display = "inline";
                    privateBtn.style.width = "48%";
                    skipDead.classList.add('btn', 'btn-info');
                    skipDead.textContent = "Skip Dead Lobbies";
                    skipDead.style.width = "48%";
                    skipDead.style.marginTop = "4px";
                    skipDead.style.marginLeft = "4%";
                    skipDead.addEventListener('click', () => { sessionStorage.skipDeadLobbies = "true"; });
                    privateBtn.parentNode.appendChild(skipDead);

                    //add search names button and field
                    let container = node;
                    let containerForm = document.createElement("div");
                    let inputName = document.createElement("input");
                    let inputSubmit = document.createElement("button");
                    let icon = document.createElement("div");
                    icon.style.display = "inline";
                    icon.classList.add("iconPlay");
                    inputName.id = "inputSearchNickName";
                    inputName.value = sessionStorage.searchPlayers ? JSON.parse(sessionStorage.searchPlayers) : "";
                    inputName.classList.add("form-control");
                    inputName.style.width = "70%";
                    inputName.placeholder = "'name' or 'name, name1, name2'";
                    containerForm.classList.add("loginPanelContent");
                    containerForm.style.display = "flex";
                    containerForm.style.justifyContent = "space-between";
                    containerForm.style.boxShadow = "unset";
                    containerForm.style.marginTop = "1em";
                    inputSubmit.classList.add("btn", "btn-success");
                    inputSubmit.textContent = "Search Player!";
                    inputSubmit.addEventListener("click", () => {
                        if (inputName.value.trim() == "") return;
                        document.querySelector("button[type='submit'].btn-success").click();
                        let players = inputName.value.split(",");
                        players = players.map(p => p.trim());
                        sessionStorage.searchPlayers = JSON.stringify(players);
                    })

                    containerForm.append(inputName);
                    containerForm.append(inputSubmit);
                    container.appendChild(containerForm);
                    //containerForm.previousElementSibling.style.borderRadius = "0";
                }
                
            });
        });
});
patcher.observe(document, { attributes: false, childList: true, subtree: true });
