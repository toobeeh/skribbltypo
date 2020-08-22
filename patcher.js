
var patcher = new MutationObserver(function (mutations) {
         mutations.forEach(function (mutation){
            mutation.addedNodes.forEach(async function(node){
                if (node.tagName == "SCRIPT" && node.src.includes("game.js")) {
                    node.src = chrome.extension.getURL("gamePatch.js");
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
                    if (node.classList.contains("informationTabs")) await initLobbyTab(true);//{ try { await initLobbyTab(true); } catch { window.location.reload(); } }
                    if (node.id == "collapseUpdate") node.classList = "updateInfo collapse";
                }
                if (node.id == 'buttonLoginCreatePrivate') {
                    //add dead lobbies button
                    let privateBtn = document.querySelector("#buttonLoginCreatePrivate");
                    let skipDead = document.createElement("button");
                    //privateBtn.classList.remove('btn-block');
                    privateBtn.style.display = "inline";
                    privateBtn.style.width = "48%";
                    skipDead.classList.add('btn', 'btn-info');
                    skipDead.textContent = "Skip Dead Lobbies";
                    skipDead.style.width = "48%";
                    skipDead.style.marginTop = "4px";
                    skipDead.style.marginBottom = "8px";
                    skipDead.style.marginLeft = "4%";
                    skipDead.addEventListener('click', () => { sessionStorage.skipDeadLobbies = "true"; });
                    privateBtn.parentNode.appendChild(skipDead);
                }
                if (node.id == 'formLogin') {
                    //add search names button and field
                    let container = document.querySelector("#formLogin").parentElement.parentElement;
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
                    containerForm.style.borderTop = "1px solid #d3d3d3";
                    containerForm.style.display = "flex";
                    containerForm.style.justifyContent = "space-between";
                    inputSubmit.classList.add("btn", "btn-success");
                    inputSubmit.textContent = "Search Player!";
                    inputSubmit.addEventListener("click", () => {
                        if (inputName.value.trim() == "") return;
                        document.querySelector("button[type='submit'].btn-success").click();
                        let players = inputName.value.split(",");
                        players = players.map(p => p.trim());
                        sessionStorage.searchPlayers = JSON.stringify(players);
                    })

                    //containerForm.append(icon);
                    containerForm.append(inputName);
                    containerForm.append(inputSubmit);
                    container.appendChild(containerForm);
                    containerForm.previousElementSibling.style.borderRadius = "0";
                    
                }
                
            });
        });
});
patcher.observe(document, { attributes: false, childList: true, subtree: true });
