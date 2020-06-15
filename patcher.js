
var patcher = new MutationObserver(function (mutations) {
         mutations.forEach(function (mutation){
            mutation.addedNodes.forEach(async function(node){
                if (node.tagName == "SCRIPT" && node.src.includes("game.js")) {
                    node.src = chrome.extension.getURL("gamePatch.js");
                    let p = document.createElement("div");
                    p.innerHTML = '<div id="popupSearch" class="btn btn-primary" style=" z-index:10; font-size:1.5em;position: fixed;overflow-wrap: break-word;width: 25vw;word-break: break-all;left: 37.6vw;min-height: 5em;display: flex;align-items: center;justify-content: center;border-radius: 1em;top: 2em;box-shadow: black 0em 0em 10em 1em;">Searching Lobby... [Enter] to abort</div>';
                    document.body.appendChild(p);
                    if (sessionStorage.lobbySearch != "true") p.style.display = "none";
                    document.addEventListener("keyup", (e) => {
                        let keycode = (e.keyCode ? e.keyCode : e.which);
                        if (keycode == '13') {
                            sessionStorage.lobbySearch = "false";
                            p.style.display = "none";
                        }
                    });
                }
                if (node.tagName == "A" && node.href.includes("tower")) node.remove();
                if (node.tagName == "DIV") {
                    if (node.classList.contains("informationTabs")) await initLobbyTab(true);//{ try { await initLobbyTab(true); } catch { window.location.reload(); } }
                    if (node.id == "collapseUpdate") node.classList = "updateInfo collapse";
                }
                
            });
        });
});
patcher.observe(document, { attributes: false, childList: true, subtree: true });
