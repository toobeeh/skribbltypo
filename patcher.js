// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

let waitForDocAndPalantir = async () => {
    let palantirReady = false;
    let DOMready = false;
    return new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            DOMready = true;
            if (palantirReady) resolve(true);
        });
        document.addEventListener("palantirLoaded", () => {
            palantirReady = true;
            if (DOMready) resolve(true);
        });
        setTimeout(() => { reject(false); }, 10000);
    });
}
// await DOM load and palantir connection
(async () => {
    if (await waitForDocAndPalantir()) {
        initSprites(); // init sprites
        drops.initDrops(); // init drops
    }
    else alert("Error connecting to Palantir :/");
})();

// inject patched game.js and modify elements that are immediately after page load visible
const hints = [
    "Did you notice the tool shortcuts B,F and E?<br>Try out C to use a color pipette tool.",
    "Click on the canvas and use Shift+Arrow to draw a perfect straight line!",
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

let patcher = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(async function(node){
                if (node.tagName == "SCRIPT" && node.src.includes("game.js")) {
                    // block game.js
                    node.type = "javascript/blocked"; // block for chrome
                    node.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true });
                    // insert patched script
                    let script = document.createElement("script");
                    script.src = chrome.extension.getURL("gamePatch.js");
                    node.parentElement.appendChild(script);
                    
                }
                if (node.tagName == "DIV") {
                    // init guild lobbies and socket
                    if (node.classList.contains("login-side-right")) {
                        lobbies_.init();
                        await socket.init();
                    }
                    // put infobox below on the left side
                    else if (node.classList.contains("loginPanelContent") && document.querySelectorAll(".loginPanelContent").length > 2 && document.querySelectorAll(".login-side-left .loginPanelContent").length <= 0) {
                        let cont = document.querySelector(".login-side-left");
                        cont.appendChild(node);
                        cont.style.width = "400px";
                        cont.style.flex = "0 1 auto";
                    }
                    // add update info to infobox
                    else if (node.classList.contains("updateInfo")) {
                        let status = await (await fetch("https://tobeh.host/Orthanc/status.txt")).text();
                        node.innerHTML = "Hello there! 💖<br><br>BTW: " + hints[Math.floor((Math.random() * hints.length))] + "<br><br>" + status;
                    }
                    else if (node.id == 'screenLogin') {
                        node.style.justifyContent = "center";
                    }
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
                    skipDead.addEventListener('click', () => {
                        let modal = new Modal(elemFromString("<h3>Click anywhere to cancel</h3>"), () => {
                            lobbies_.searchData.searching = false;
                        }, "Skipping dead lobbies...","30vw","10em");
                        lobbies_.startSearch(() => {
                            return lobbies_.lobbyProperties.Players.length > 1;
                        }, () => {
                            setTimeout(()=>leaveLobby(true), 100);
                        }, () => {
                             modal.close();
                         });
                    });
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
                        let players = inputName.value.split(",");
                        let skippedPlayers = [];
                        players = players.map(p => p.trim());
                        let modalCont = elemFromString("<div style='text-align:center'><h4>" + inputName.value + "</h4><span id='skippedPlayers'>Skipped:<br></span><br><h4>Click anywhere to cancel</h4><div>");
                        let modal = new Modal( modalCont, () => {
                                lobbies_.searchData.searching = false;
                        }, "Searching for players:", "30vw", "15em");
                        lobbies_.startSearch(() => {
                            lobbies_.lobbyProperties.Players.forEach(p => {
                                if (skippedPlayers.indexOf(p.Name) < 0 && p.Name != socket.clientData.playerName) {
                                    skippedPlayers.push(p.Name);
                                    modalCont.querySelector("#skippedPlayers").innerHTML += " [" + p.Name + "] <wbr>";
                                }
                            });
                            return lobbies_.lobbyProperties.Players.some(lobbyplayer =>
                                players.some(searchPlayer => searchPlayer.toLowerCase() == lobbyplayer.Name.toLowerCase()));
                        }, () => {
                            setTimeout(() => leaveLobby(true), 200);
                        }, () => {
                            modal.close();
                        });
                        document.body.dispatchEvent(new Event("joinLobby"));
                    });
                    containerForm.append(inputName);
                    containerForm.append(inputSubmit);
                    container.appendChild(containerForm);
                }
            });
        });
});
patcher.observe(document, { attributes: false, childList: true, subtree: true });
