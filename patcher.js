
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
                        node.innerHTML = "Hiiiii!<br>Btw - still thank u for using Typo! 💖<br><br>The palantir bot made its way to sketchful!<br>Connect your discord servers and try it out.<br><br>Also, did you notice the tool shortcuts B,F and E?<br>Try out C to use the new color pipette tool!<br>Check out all the other features <a href='https://tobeh.host/Orthanc'>on the updated website</a>!";
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
                    containerForm.previousElementSibling.style.borderRadius = "0";
                }
                
            });
        });
});
patcher.observe(document, { attributes: false, childList: true, subtree: true });
