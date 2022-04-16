// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// inject patched game.js and modify elements that are immediately after page load visible
const waitForDocAndPalantir = async () => {
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
        setTimeout(() => { reject(false); }, 20000);
    });
}
// await DOM load and palantir connection
(async () => {
    if (await waitForDocAndPalantir()) {
        await sprites.init(); // init sprites
        drops.initDrops(); // init drops
        if (localStorage.restrictLobby == "") {
            QS("#restrictLobby").dispatchEvent(new Event("click"));
        }
    }
    else alert("Error connecting to Palantir :/");
})().catch(console.error);

visuals.init(); //init visual options popup

let patcher = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
             mutation.addedNodes.forEach(async function (node) {
                if (localStorage.visualOptions && (node.tagName == "BODY" || node.tagName == "IMG")) { // head or image is loaded
                    // load current options
                    let opts = JSON.parse(localStorage.visualOptions);
                    visuals.applyOptions(opts);
                    // check if theme querystring is active
                    let name = (new URLSearchParams(window.location.search)).get("themename");
                    let theme = JSON.parse((new URLSearchParams(window.location.search)).get("theme"));
                    if (name && theme) {
                        window.history.pushState({}, document.title, "/");
                        if (visuals.themes.some(t => JSON.stringify(t.options) == JSON.stringify(theme))){
                            visuals.applyOptions(theme);
                            localStorage.visualOptions = JSON.stringify(theme);
                            setTimeout(() => new Toast("🥳 Activated theme " + name), 200);
                        }
                        else {
                            visuals.addTheme(name, theme);
                            visuals.applyOptions(theme);
                            localStorage.visualOptions = JSON.stringify(theme);
                            setTimeout(() => new Toast("🥳 Imported theme " + name), 200);
                        }
                    }
                }
                if (node.tagName == "BODY") node.style.imageRendering = "crisp-edges"; // ff support
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
                        node.style.height = "min-content";
                        await socket.init();
                    }
                    // put infobox below on the left side
                    else if (node.id == "tabHow" && node.closest(".login-content")) {
                        let cont = document.querySelector(".login-side-left");
                        cont.appendChild(node.closest(".loginPanelContent"));
                        cont.style.width = "400px";
                        cont.style.flex = "0 1 auto";
                    }
                    // add update info to infobox
                    else if (node.classList.contains("updateInfo")) { 
                        node.innerHTML = "<br>Heya, take a cookie! 🍪<br><br>BTW: " + hints[Math.floor((Math.random() * hints.length))];
                        //node.innerHTML += "<br><br> Additional to the march update, some features have rolled out.<br><br> <div class='btn btn-block btn-success'>View the changelog" + (localStorage.lastChangelogview != chrome.runtime.getManifest().version ? " 📢 New!" : "") + "</div>";
                        node.innerHTML += "<br><br>Data can be used to do pretty cool stuff.";
                        node.innerHTML += "<br> By using Typo, you agree on <a id='typodata' role='button'>how Typo uses data.</a>";
                        node.innerHTML += "<br><br>Learn everything about Typo & Palantir on the <a href='https://typo.rip' role='button'>website</a> or <a href='https://discord.link/typo' role='button'>join the Discord server.</a>"
                        //let popupChanges = elemFromString(changelogPopup);
                        //node.querySelector("div").addEventListener("click", () => {
                        //    new Modal(popupChanges, () => { }, "Changelog");
                        //    localStorage.lastChangelogview = chrome.runtime.getManifest().version;
                        //});
                        let popupData = elemFromString(dataPopup);
                        node.querySelector("#typodata").addEventListener("click", () => {
                            new Modal(popupData, () => { }, "Data & Privacy");
                        });
                    }
                    else if (node.id == 'screenLogin') {
                        node.style.justifyContent = "center";
                    }
                    if (node.id == "containerLogoBig" || node.id == "logoAvatarContainer") node.style.display = "";
                }
                if (node.id == 'formLogin') {
                    //add dead lobbies button
                    let privateBtn = document.querySelector("#buttonLoginCreatePrivate");
                    let toggleFilter = document.createElement("div");
                    privateBtn.style.display = "inline";
                    privateBtn.style.width = "48%";
                    toggleFilter.classList.add('btn', 'btn-info');
                    toggleFilter.textContent = "Toggle Lobby Search";
                    toggleFilter.style.width = "48%";
                    toggleFilter.style.marginTop = "4px";
                    toggleFilter.style.marginLeft = "4%";
                    toggleFilter.id = "toggleFilter";
                    privateBtn.parentNode.appendChild(toggleFilter);
                }
            });
        });
});
if (!STOP_EXECUTION) patcher.observe(document, { attributes: false, childList: true, subtree: true });
