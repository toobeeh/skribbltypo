// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// adds all smaller ui improvements to skribbl
// depends on: capture.js, generalFunctions.js, emojis.js
const uiTweaks = {
    palettes: [],
    initGameNavigation: () => {
        // Create next button
        /* let btNext = elemFromString(`<button class="button-blue">Next Lobby</button>`);
        btNext.addEventListener("click", () => {
            leaveLobby(true)
        }); */

        let iconNext = elemFromString(`<div data-typo-tooltip='Next Lobby' data-tooltipdir='N' class="lobbyNavIcon next" style="
                background-image: url(${chrome.runtime.getURL("res/arrow.gif")}); 
            "></div>`);
        iconNext.addEventListener("click", () => {
            leaveLobby(true);
        });

        // Create exit button
        /* let btExit = elemFromString(`<button class="button-orange">Exit Lobby</button>`);
        btExit.addEventListener("click", () => {
            leaveLobby(false);
        }); */

        let iconExit = elemFromString(`<div data-typo-tooltip='Leave Lobby' data-tooltipdir='N'  class="lobbyNavIcon exit" style="
                background-image: url(${chrome.runtime.getURL("res/arrow.gif")}); 
            "></div>`);
        iconExit.addEventListener("click", () => {
            leaveLobby(false);
        });

        // create container for buttons
        let lobbyControls = elemFromString(`<div id="lobby-nav"></div>`);
        /* lobbyControls.appendChild(btExit);
        lobbyControls.appendChild(btNext); */
        lobbyControls.appendChild(iconExit);
        lobbyControls.appendChild(iconNext);
        QS("#game-bar").appendChild(lobbyControls);
    },
    initWordHint: () => {
        // Add wordcount under input
        const input = QS("#game-chat .chat-container form input");
        const hints = QS("#game-word .hints .container");
        const characters = QS("#game-chat .characters");

        /* let charbar = (input.insertAdjacentHTML("afterend", "<span id='charbar' style='color:black' ></span>"), QS("#charbar"));
        charbar.insertAdjacentHTML("afterend", "<style id='charcountRules'></style>"); */

        input.parentElement.insertAdjacentHTML("afterEnd", "<div id=\"emojiPrev\"\ style='z-index: 10; display:none; padding: .5em;box-shadow: black 1px 1px 9px -2px;position: absolute;bottom: 2.5em;background: white;border-radius: 0.5em;'></div>");

        let refreshCharBar = () => {
            // recognize command and call interpreter
            if (input.value.includes("--") && localStorage.chatcommands == "true") {
                performCommand(input.value);
                input.value = "";
            }
            /* QS("#charcountRules").innerHTML = localStorage.charbar == "true" ? ".word-length{display:block !important}" : "#charbar { display: none !important }";
            if (hints.querySelector(".word-length") && hints.querySelector(".word-length").parentElement.style.display != "none") { // show charbar only if guessing
                let word = hints.textContent.replace(hints.querySelector(".word-length").innerText, "");
                charbar.textContent = word.length - input.value.length;
                if (input.value.length > word.length
                    || !replaceUmlaute(input.value).toLowerCase().match(new RegExp(word.substr(0, input.value.length).toLowerCase().replaceAll("_", "[\\w\\d]")))) {
                    charbar.style.background = "#ff5c33";
                }
                else charbar.style.background = "#BAFFAA";
            }
            else {
                charbar.innerText = " - ";
                charbar.style.background = "#BAFFAA";
            } */
            if (localStorage.charbar != "true") {
                characters.style.cssText = "display:none";
            }
            else if (hints.querySelector(".word-length") && hints.querySelector(".word-length").parentElement.style.display != "none") {
                let word = hints.textContent.replace(hints.querySelector(".word-length").innerText, "");
                if (input.value.length > word.length
                    || !replaceUmlaute(input.value).toLowerCase().match(new RegExp(replaceUmlaute(word.substr(0, input.value.length).toLowerCase().replaceAll("_", "[\\w\\d]"))))) {
                    characters.style.cssText = "color: red; transform: scale(120%)";
                }
                else characters.style.cssText = "";
            }
            else {
                characters.style.cssText = "";
            }
        }
        refreshCharBar();
        // Add event listener to keyup and process to hints
        input.addEventListener("keyup", refreshCharBar);
        // Add event listener to word mutations
        (new MutationObserver(refreshCharBar)).observe(QS("#game-word"), { attributes: true, childList: true, subtree: true, characterData: true });
    },
    initRandomColorDice: () => {
        // add random color image
        const rand = elemFromString(`<div id="randomColor" class="tool clickable" data-typo-tooltip='Random Colors' data-tooltipdir='N'>
<div class="icon" style="background-image: url(img/randomize.gif); background-size:90%;">
</div></div>`);
        //rand.style.display = localStorage.random == "true" ? "" : "none";
        QS("#typotoolbar").insertAdjacentElement("beforeEnd", rand);
        QS(".colors:not(.custom)").addEventListener("pointerdown", () => clearInterval(uiTweaks.randomInterval));
        uiTweaks.randomInterval = 0;
        rand.addEventListener("click", function () {
            clearInterval(uiTweaks.randomInterval);
            let nthChild = rand.getAttribute("data-monochrome");
            let items = [
                ...QSA(".colors:not([style*=display]) .color" + (nthChild ? ":nth-child(" + nthChild + ")" : ""))
            ].filter(item =>
                item.style.backgroundColor != "rgb(255, 255, 255)" && item.style.backgroundColor != "rgb(0, 0, 0)"
            );
            uiTweaks.randomInterval = setInterval(() => {
                items[Math.floor(Math.random() * items.length)]?.dispatchEvent(new PointerEvent("pointerdown", { button: 0, altKey: false }));
            }, Number(localStorage.randominterval));
        });
    },
    initColorPicker: () => {
        // color picker
        let toolbar = QS("#typotoolbar");
        let picker = elemFromString(`<div id="colPicker" class="tool clickable" data-typo-tooltip='Color Picker' data-tooltipdir='N'>
<div class="icon" style="background-image: url(${chrome.runtime.getURL("res/mag.gif")});">
</div></div>`);
        //picker.style.display = localStorage.random == "true" ? "" : "none";
        toolbar.insertAdjacentElement("beforeend", picker);
        const pickr = Pickr.create({
            el: picker,
            useAsButton: true,
            theme: 'nano',
            components: {
                // Main components
                preview: true,
                hue: true,
                // Input / output Options
                interaction: {
                    input: true,
                }
            }
        });
        let dontDispatch = false;
        pickr.on("change", color => {
            colcode = parseInt(color.toHEXA().toString().replace("#", ""), 16) + 10000;
            if (!dontDispatch) document.dispatchEvent(newCustomEvent("setColor", { detail: { code: colcode } }));
            dontDispatch = false;
        });
        document.querySelector(".colors").addEventListener("click", () => {
            dontDispatch = true;
            pickr.setColor(QS("#color-preview-primary").style.fill);
        });
        document.addEventListener("setColor", (detail) => {
            dontDispatch = true;
            pickr.setColor(QS("#color-preview-primary").style.fill);
        });
    },
    initCanvasZoom: () => {
        // init precise drawing mode
        let canvasGame = QS("#game-canvas canvas");
        let zoomActive = false;
        let changeZoom;
        uiTweaks.resetZoom = () => {
            // reset zoom
            canvasGame.setAttribute("data-zoom", 1);
            canvasGame.parentElement.style.height = "";
            canvasGame.parentElement.style.width = "";
            canvasGame.parentElement.style.boxShadow = "";
            canvasGame.style.width = "100%";
            canvasGame.style.top = "";
            canvasGame.style.left = "";
            document.removeEventListener("keydown", changeZoom);
            zoomActive = false;
            // document.querySelector(".size-picker .slider").dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
        }
        let toggleZoom = (event, skipctrl = false) => {
            if ((event.ctrlKey || skipctrl) && localStorage.zoomdraw == "true") {
                event.preventDefault();
                if (skipctrl || !zoomActive && !QS("#game-toolbar").classList.contains("hidden")) {
                    zoomActive = true;
                    const zoom = Number(sessionStorage.zoom) > 1 ? Number(sessionStorage.zoom) : 3;
                    // refresh brush cursor
                    canvasGame.setAttribute("data-zoom", zoom);
                    //document.querySelector(".size-picker .slider").dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
                    // get current height and set to parent
                    let bRect = canvasGame.getBoundingClientRect();
                    canvasGame.parentElement.style.height = /* bRect.height + */ "600px";
                    canvasGame.parentElement.style.width = /* bRect.width + */ "800px";
                    canvasGame.parentElement.style.boxShadow = "black 0px 0px 25px 5px";
                    // zoom canvas
                    canvasGame.style.width = (zoom * 100) + "%";
                    // get position offset
                    canvasGame.style.position = "relative";
                    canvasGame.style.top = "-" + ((event.offsetY * zoom) - (600 / 2)) + "px";
                    canvasGame.style.left = "-" + ((event.offsetX * zoom) - (800 / 2)) + "px";
                    changeZoom = (e) => {
                        if (Number(e.key) > 1 && Number(e.key) <= 9) {
                            sessionStorage.zoom = e.key;
                            toggleZoom(event, true);
                            //toggleZoom(event);
                        }
                    }
                    document.addEventListener("keydown", changeZoom);
                }
                else {
                    uiTweaks.resetZoom();
                }
            }
        }
        document.addEventListener("pointerdown", toggleZoom);
        document.querySelector("body").addEventListener("logCanvasClear", (e) => { if (zoomActive) toggleZoom(e, true); });
    },
    initColorPalettes: () => {
        // add color palettes
        palettes = JSON.parse(localStorage.customPalettes).forEach(palette => {
            uiTweaks.palettes.push(createColorPalette(palette));
        });
        // add small skribbl palette
        const smallSkribbl = `{"name":"oldSkribbl", "rowCount": 11, "colors":[{"color":"rgb(255, 255, 255)"},{"color":"rgb(210, 210, 210)"},{"color":"rgb(239, 19, 11)"},{"color":"rgb(255, 113, 0)"},{"color":"rgb(255, 228, 0)"},{"color":"rgb(0, 204, 0)"},{"color":"rgb(0, 178, 255)"},{"color":"rgb(35, 31, 211)"},{"color":"rgb(163, 0, 186)"},{"color":"rgb(211, 124, 170)"},{"color":"rgb(160, 82, 45)"},{"color":"rgb(0, 0, 0)"},{"color":"rgb(80, 80, 80)"},{"color":"rgb(86, 8, 6)"},{"color":"rgb(137, 39, 0)"},{"color":"rgb(163, 103, 0)"},{"color":"rgb(0, 61, 3)"},{"color":"rgb(0, 59, 120)"},{"color":"rgb(8, 3, 82)"},{"color":"rgb(65, 0, 81)"},{"color":"rgb(118, 48, 75)"},{"color":"rgb(72, 28, 0)"}]}`;
        const smallPalette = createColorPalette(JSON.parse(smallSkribbl));
        smallPalette.json = null;
        uiTweaks.palettes.push(smallPalette);
        uiTweaks.palettes.push({
            name: "originalPalette", activate: () => {
                [...QSA("#game-toolbar .color-picker .colors.custom")].forEach(p => p.remove());
                QS("#game-toolbar .color-picker .colors").style.display = "";
            }
        });
        uiTweaks.palettes.find(palette => palette.name == localStorage.palette)?.activate();
    },
    initLobbyDescriptionForm: () => {
        // add Description form 
        let customwords = QS(".game-room-group.customwords");
        const input = elemFromString(`<div class="game-room-group" style="height:10%">
<div class="game-room-name">Palantir Description</div>
<textarea style="" id="lobbyDesc" maxlength="200" spellcheck="false" placeholder="Add a description that will show up in the Palantir bot"></textarea>
</div>`);
        customwords.insertAdjacentElement("beforebegin", input);
    },
    initLobbyChat: () => {
        return; // not needed anymore
        const chat = QS("#game-chat");
        const settings = QS("#game-room .settings");
        const board = QS("#game-board");

        let roomObserver = new MutationObserver(function (mutations) {
            if (chat.classList.contains("room")) {
                if (settings.parentElement != chat.parentElement) settings.insertAdjacentElement("afterend", chat);
            }
            else {
                if (board.parentElement != chat.parentElement) board.insertAdjacentElement("afterend", chat);
            }
        });
        roomObserver.observe(chat, { attributes: true, childList: false });

    },
    initMarkMessages: () => {

        QS(".chat-content").addEventListener("click", e => {
            let id = e.target.closest("[playerid]")?.getAttribute("playerid");
            if (id) {
                const clickedName = e.target.closest("b");
                if (clickedName) {
                    let player = QS(".players-list .player[playerid='" + id + "']");
                    player.click();
                }
            }
        });

        const addPlayerPopup = (node) => {
            let attr = node.getAttribute("playerid");
            if (attr) {
                node.querySelector("b").style.cursor = "pointer";
                if (localStorage.experimental != "true") return;
                let clone = document.querySelector(".players-list .player[playerid='" + attr + "'] .player-avatar-container").cloneNode(true);
                clone.style.height = "1em";
                clone.style.width = "1em";
                clone.style.display = "inline-block";
                clone.style.marginRight = ".4em";
                clone.style.marginLeft = ".4em";
                clone.style.transform = "translateY(15%)";
                node.querySelector("b").insertAdjacentElement("beforebegin", clone)
            }
        }

        // Observer for chat mutations and emoji replacement
        let chatObserver = new MutationObserver(function (mutations) {
            mutations.forEach(mutation => mutation.addedNodes.forEach(markMessage));
            mutations.forEach(mutation => mutation.addedNodes.forEach(emojis.replaceEmojiContent));
            mutations.forEach(mutation => mutation.addedNodes.forEach(addPlayerPopup));
        });
        chatObserver.observe(QS(".chat-content"), { attributes: false, childList: true });
    },
    initSideControls: () => {
        //init new controls div
        document.body.appendChild(elemFromString("<div id='controls'></div>"));
        QS("#controls").style.cssText = "z-index: 50;position: fixed;display: flex; flex-direction:column; left: 9px; top: 9px";
        QS("#controls").style.display = localStorage.controls == "true" ? "flex" : "none";
        // add fullscreen btn
        let fulls = elemFromString("<div data-typo-tooltip='Fullscreen' data-tooltipdir='E'  style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/fullscreen.gif")
            + ") center no-repeat;'></div>");
        fulls.addEventListener("click", () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            else {
                if (QS("#game").style.display == "none") {
                    new Toast("Fullscreen mode is only available in-game.", 2000);
                    return;
                }
                document.documentElement.requestFullscreen();
                document.head.insertAdjacentHTML("beforeEnd", `<style id='fullscreenRules'>
                    div#game-board, #game-container{flex-grow:1}
                    #game-wrapper{width:100%; padding:1em}
                    #controls{position:fixed; flex-direction:row !important;bottom:9px;top:unset !important;left:unset !important; right:9px;} 
                    #game{position:fixed; justify-content:center;left:0; width:100vw; height:100vh; padding: 0 1em; overflow-y:scroll} 
                    .logo-small{display:none !important}  
                    *::-webkit-scrollbar{display:none}</style>`);
            }
        });
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                QS("#fullscreenRules").remove();
            }
        });
        QS("#controls").append(fulls);

        // add typro
        let typroCloud = elemFromString("<div data-typo-tooltip='Typo Cloud' data-tooltipdir='E'  style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/cloud.gif")
            + ") center no-repeat;'></div>");
        typroCloud.addEventListener("click", typro.show);
        QS("#controls").append(typroCloud);

        // add appearance options
        let visualsButton = elemFromString("<div data-typo-tooltip='Themes' data-tooltipdir='E' style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/visuals.gif")
            + ") center no-repeat;'></div>");
        visualsButton.addEventListener("click", visuals.show);
        QS("#controls").append(visualsButton);

        // add brush tools
        //let brushmagicButton = elemFromString("<div style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
        //    + chrome.runtime.getURL("/res/brush.gif")
        //    + ") center no-repeat;'></div>");
        //brushmagicButton.addEventListener("click", brushtools.showSettings);
        //QS("#controls").append(brushmagicButton);

        document.dispatchEvent(new Event("addTypoTooltips"));
    },
    initDefaultKeybinds: () => {
        const chatInput = QS('.chat-container input');
        let lastColorSwitch = 0;
        document.addEventListener('keydown', e => {
            if (!document.activeElement.matches(".chat-container input")) {
                // Focus chat
                if (e.key === 'Tab' && !(e.altKey || e.ctrlKey || e.shiftKey)) {
                    e.preventDefault();
                    chatInput.focus();
                    return;
                }

                // size shortcuts
                else {
                    let sizes = [...QSA(".container .size")];
                    let ind = Number(e.key);
                    if (ind > 0 && ind < 6) sizes[ind - 1].click();
                }
            }
            else if (document.activeElement.matches(".chat-container input") && e.key === 'Tab' && !(e.altKey || e.ctrlKey || e.shiftKey)) e.preventDefault();

            if (e.key === 'AltGraph' && !(e.altKey || e.ctrlKey || e.shiftKey)) {// Show player IDs
                let removeIDs = (event) => {
                    if (event.key == "AltGraph") {
                        document.removeEventListener("keyup", removeIDs);
                        QSA(".players-list .player").forEach(player => {
                            player.querySelector(".player-icons span")?.remove();
                        });
                    }
                }
                document.addEventListener("keyup", removeIDs);
                QSA(".players-list .player").forEach(player => {
                    if (!player.querySelector(".player-icons span")) player.querySelector(".player-icons").insertAdjacentHTML("afterbegin", "<span style='color:inherit'>#" + player.getAttribute("playerid") + " </span>");
                });
                return;
            }
        });
        // Switch colors
        document.addEventListener("toggleColor", () => {
            if (Date.now() - lastColorSwitch < 50) return;
            lastColorSwitch = Date.now();
            const prim = parseInt(new Color({ rgb: QS("#color-preview-primary").style.fill }).hex.replace("#", ""), 16) + 10000;
            const sec = parseInt(new Color({ rgb: QS("#color-preview-secondary").style.fill }).hex.replace("#", ""), 16) + 10000;
            document.dispatchEvent(newCustomEvent("setColor", { detail: { code: sec, secondary: false } }));
            document.dispatchEvent(newCustomEvent("setColor", { detail: { code: prim, secondary: true } }));
        });
    },
    initLobbyRestriction: () => {
        let controls = QS("#controls");
        let restrict = elemFromString("<div id='restrictLobby' style='z-index:50;display:none;flex: 0 0 auto;cursor:pointer; user-select: none; width:48px; height:48px; background: center no-repeat'></div>");
        controls.append(restrict);
        let updateIcon = () => {
            if (localStorage.restrictLobby == "unrestricted") restrict.style.backgroundImage = "url(" + chrome.runtime.getURL("res/unrestricted.gif") + ")";
            else restrict.style.backgroundImage = "url(" + chrome.runtime.getURL("res/restricted.gif") + ")";
        }
        updateIcon();
        restrict.addEventListener("click", () => {
            let servers = "";
            socket.data.user.member.Guilds.forEach(guild => servers += "<option value='" + guild.GuildID + "'>" + guild.GuildName + "</option>");
            let modal = new Modal(elemFromString(`<div id="selectrestriction"><h4>Choose in which Discord Servers Palantir is allowed to share the lobby invite link.<br>Your preference is used when you're the owner of a private lobby.<br>You can change it anytime in-game.</h4><br>
                        <input type="radio" id="unrestricted" name="restriction" value="unrestricted" checked>
                        <label for="unrestricted"> No Restrictions</label><br> 
                        <input type="radio" id="restrictserver" name="restriction" value="server">
                        <label for="restrictserver"> Allow a single server: </label> <select>
                        ${servers}
                        </select><br> 
                        <input type="radio" id="restricted" name="restriction" value="restricted">
                        <label for="restricted"> Allow no one to see the invite</label></div>`), async () => {
                localStorage.restrictLobby = QS("#selectrestriction input[name=restriction]:checked").value;
                if (localStorage.restrictLobby == "server") localStorage.restrictLobby = QS("#selectrestriction select").value;
                updateIcon();
                if (lobbies.joined && lobbies.userAllow) { // report lobby if joined
                    let description = lobbies.lobbyProperties.Private ? (QS("#lobbyDesc") && QS("#lobbyDesc").value ? QS("#lobbyDesc").value : '') : "";
                    await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key, description);
                }
            }, "Lobby Privacy");
            if (localStorage.restrictLobby == "restricted") modal.content.querySelector("#restricted").setAttribute("checked", "checked");
            else if (localStorage.restrictLobby == "unrestricted") modal.content.querySelector("#unrestricted").setAttribute("checked", "checked");
            else if (localStorage.restrictLobby != "") {
                modal.content.querySelector("#restrictserver").setAttribute("checked", "checked");
                modal.content.querySelector("select").value = localStorage.restrictLobby;
            }
        });
    },
    initQuickReact: () => {
        let react = elemFromString(`<div tabindex="0" id="quickreact" style="
        display: flex;
        place-content: space-evenly;
        width: 100%;
        border-radius: .5em;
        margin-right: .5em;
        margin-top: .5em;
        cursor: not-allowed;
        user-select: none;
        display:none;
        outline: none;
    ">
    <style>
        #quickreact > span {
            background: var(--COLOR_PANEL_BG);
            color: var(--COLOR_GAMEBAR_TEXT);
            border-radius: .5em;
            padding: .5em;
            font-weight: 600;
        }
    </style>
    <span>⬅️Close</span><span>⬆️Like</span><span>⬇️Shame</span><span>➡️Kick</span></div>`);
        QS("#game-chat > .chat-container").appendChild(react);
        let chatinput = QS("#game-chat .chat-container input");
        chatinput.addEventListener("keyup", (e) => {
            if (localStorage.quickreact == "true" && e.which == 17 && chatinput.value == "" && react.style.display == "none") {
                react.style.display = "flex";
                react.focus();
            }
        });
        react.addEventListener("focusout", () => react.style.display = "none");
        react.addEventListener("keyup", (e) => {
            e.bubbles = false;
            e.preventDefault();
            if (e.which == 38) { // up
                performCommand("like");
            }
            else if (e.which == 39) { // right
                performCommand("kick");
            }
            else if (e.which == 40) { // down
                performCommand("shame");
            }
            chatinput.focus();
        });
        react.addEventListener("keydown", (e) => e.preventDefault());
    },
    initSelectionFormatter: () => {
        let popup = elemFromString(`<div id="copyFormatted" style="
    position: absolute;
    width: calc(90% - 8px);
    left: 5%;
    background: white;
    border-radius: .5em;
    padding: .5em;
    color: black !important;
    font-weight: 600;
    top:0;
    text-align: center;
    cursor: pointer;
    user-select:none;
    box-shadow: black 0px 2px 7px;
">Copy chat selection for Discord</div>`);
        popup.style.display = "none";
        const chatbox = QS("#game-chat > .chat-container");
        popup.addEventListener("pointerdown", () => {
            let chat = document.getSelection().toString();
            chat = chat.replace(/(\n)(?=.*? guessed the word!)/g, "+ ")
                .replace(/(\n)(?=.*? joined.)/g, "+ ")
                .replace(/(\n)(?=The word was)/g, "+ ")
                .replace(/(\n)(?=.*? is drawing now!)/g, "+ ")
                .replace(/(\n)(?=.*? left.)/g, "- ")
                .replace(/(\n)(?=.*? is voting to kick.)/g, "- ")
                .replace(/(\n)(?=.*? was kicked.)/g, "- ")
                .replace(/(\n)(?=Whoops.*? caught the drop before you.)/g, "--- ")
                .replace(/(\n)(?=Yeee.*? and caught the drop!)/g, "--- ")
                .replaceAll("\n\n", "\n");
            document.getSelection().removeAllRanges();
            new Toast("Copied chat to clipboard!", 1000);
            navigator.clipboard.writeText("```diff\n" + chat + "\n```");
        });
        document.addEventListener("selectionchange", () => {
            const selection = document.getSelection();
            if (selection.toString() != "" && chatbox.contains(selection.anchorNode) && selection.anchorNode.localName != "form") popup.style.display = "";
            else setTimeout(() => popup.style.display = "none", 20);
        });
        QS("#game-chat").appendChild(popup);
    },
    initToolsMod: (enable = true) => {
        return; // disable for now
        if (enable) QS("#game-toolbar").classList.add("typomod");
        else QS("#game-toolbar").classList.remove("typomod");
    },
    initClipboardCopy: () => {
        document.addEventListener("keydown", async (e) => {
            if (!(e.which == 67 && e.ctrlKey) || QS("#game").style.display == "none" || document.getSelection().type == "Range") return;
            let canvas = QS("#game-canvas canvas");
            let scaled = await scaleDataURL(canvas.toDataURL(), canvas.width * localStorage.qualityScale, canvas.height * localStorage.qualityScale);
            await dataURLtoClipboard(scaled);
            new Toast("Copied image to clipboard.", 1500);
        });
    },
    initChatRecall: () => {
        const input = QS("#game-chat .chat-container form input");
        let history = [];
        let lookup = [];
        // Add event listener to keyup and process to hints
        input.addEventListener("keydown", (event) => {
            if (event.code == "Enter") {
                history = history.concat(lookup.splice(0).reverse());
                history.push(input.value);
            }
        });
        input.addEventListener("keyup", (event) => {
            if (event.code == "ArrowUp") {
                let prev = history.pop();
                if (prev) {
                    lookup.push(prev);
                    input.value = prev;
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }
            else if (event.code == "ArrowDown") {
                let next = lookup.pop();
                if (next) {
                    history.push(next);
                    input.value = next;
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }
        });
    },
    initChooseCountdown: () => {
        const overlay = QS(".overlay");
        let lastWinnerMsg = "";
        QS(".overlay").insertAdjacentHTML("beforeBegin",
            "<style>.overlay::after {content: '';position: absolute;top: 0;left: 0;width: 100%;}.overlay.countdown::after{background: lightgreen;height: .5em;transition: width 15s linear;width: 0;}</style>");
        const overlayObserver = new MutationObserver(() => {
            //if (QS(".overlay-content .result.show")?.innerText.includes("is the winner!")) {
            //    let winnerMsg = QS(".rank-name").innerText + " won the game with a score of " + QS(".rank-score").innerText + "!";
            //    if (winnerMsg != lastWinnerMsg) addChatMessage(winnerMsg, "");
            //    lastWinnerMsg = winnerMsg;
            //}
            if (QS(".overlay-content .text.show")?.innerText.includes("Choose a word")) {
                overlay.classList.add("countdown");
            }
            else overlay.classList.remove("countdown");
        });
        overlayObserver.observe(QS(".overlay-content"), { subtree: true, attributes: true, characterData: true });
    },
    initStraightLines: () => {
        // Credits for basic idea of canvas preview to https://greasyfork.org/en/scripts/410108-skribbl-line-tool/code
        // preview canvas
        const preview = {
            canvas: elemFromString(`<canvas style="position:absolute; cursor:crosshair; touch-action:none; inset: 0; z-index:10; opacity:0.5" width="800" height="600"></canvas>`),
            context: () => preview.canvas.getContext("2d"),
            gameCanvas: QS("#game canvas"),
            use: () => {
                preview.clear();
                preview.gameCanvas.insertAdjacentElement("afterend", preview.canvas);
                preview.gameCanvas.style.pointerEvents = "none";
            },
            stop: () => {
                preview.canvas.remove();
                preview.gameCanvas.style.pointerEvents = "";
            },
            clear: () => preview.context().clearRect(0, 0, 800, 600),
            line: (x, y, x1, y1, color = "black", size = 5) => {
                preview.clear();
                const ctx = preview.context();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x1, y1);
                ctx.strokeStyle = color;
                ctx.lineWidth = size;
                ctx.stroke();
            }
        }
        let straight = false;
        let lastRelease = 0;
        let snap = false;
        let pointerdown = false;
        let lastDown = [null, null];
        let lastDownClient = [null, null];
        let lastDirectClient = [null, null];
        const pointerEvent = (type, x, y, pressure = 0.5) => {
            return new PointerEvent(type, {
                bubbles: true,
                clientX: x,
                clientY: y,
                button: 0,
                pressure: pressure,
                pointerType: "mouse"
            });
        }
        // get pos when scaled
        const getRealCoordinates = (x, y) => {
            const { width, height } = preview.canvas.getBoundingClientRect();
            x = (800 / width) * x;
            y = (600 / height) * y;
            return [x, y];
        }
        // listen for shift down
        document.addEventListener("keydown", (event) => {
            let state = straight;
            straight = straight || event.which === 16;
            if (straight && !state) preview.use();
            if (straight && !state && Date.now() - lastRelease < 300) snap = true;
        });
        document.addEventListener("keyup", (event) => {
            let state = straight;
            straight = straight && event.which !== 16;
            snap = straight && snap;
            if (!straight && !pointerdown) preview.stop();
            if (!straight && state) lastRelease = Date.now();
            if (!straight) lastDirectClient = [null, null];
        });
        document.addEventListener("keyup", (event) => {
            let state = straight;
            straight = straight && event.which !== 16;
            snap = straight && snap;
            if (!straight && !pointerdown) preview.stop();
            if (!straight && state) lastRelease = Date.now();
        });
        // get snap end coordinates
        const snapDestination = (x, y, x1, y1) => {
            let dx = Math.abs(x - x1);
            let dy = Math.abs(y - y1);
            return dx > dy ? [x1, y] : [x, y1];
        }
        // listen for pointer events
        preview.canvas.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
            pointerdown = true;
            if (straight) {
                lastDownClient = [event.clientX, event.clientY];
                lastDown = getRealCoordinates(event.offsetX, event.offsetY);
            }
        });
        preview.canvas.addEventListener("pointerup", (event) => {
            event.preventDefault();
            event.stopPropagation();
            pointerdown = false;
            if (straight) {
                preview.clear();
                lastDown = [null, null];
                let dest = [event.clientX, event.clientY];
                if (snap) dest = snapDestination(lastDownClient[0], lastDownClient[1], event.clientX, event.clientY);
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerdown", lastDownClient[0], lastDownClient[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointermove", dest[0], dest[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerup", dest[0], dest[1]));
            }
        });
        preview.canvas.addEventListener("pointermove", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (straight) {
                const col = QS("#color-preview-primary").style.fill;
                const size = [4, 14, 30, 40][[...QSA(".size")].findIndex(size => size.classList.contains("selected"))]
                if (lastDown[0]) {
                    let real = getRealCoordinates(event.offsetX, event.offsetY);
                    if (!snap) preview.line(lastDown[0], lastDown[1], real[0], real[1], col, size);
                    else {
                        let dest = snapDestination(lastDown[0], lastDown[1], real[0], real[1]);
                        preview.line(lastDown[0], lastDown[1], dest[0], dest[1], col, size);
                    }
                }
            }
        });
        preview.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            if (straight && lastDirectClient[0] != null) {
                let dest = [event.clientX, event.clientY];
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerdown", lastDirectClient[0], lastDirectClient[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointermove", dest[0], dest[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerup", dest[0], dest[1]));
            }
            lastDirectClient = [event.clientX, event.clientY];
        })
    },
    initPenPointer: () => {
        const canvas = QS("#game-canvas canvas");
        const pointerRule = elemFromString("<style></style>");
        canvas.insertAdjacentElement("beforebegin", pointerRule);
        const smallBlackPointerCss = `cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAMxJREFUWEftkrENAjEQBPczO6CJS6CBpwtCQhqwa3gCiF0FIT1ADg1Ack3A58jSR4hwA7/YK2A1mpsOM7luJpwQKPtTMiqjbAPsPTUqo2wD7D01KqNsA+w9Ndq60RWAfoK8AXiygJmvXwLYm9miwrn7C8ARwIMBywTdmdm2lLIJIbxzzld3PwM4NQsaYxxTSpdWQWufw9frD6xOma+vH66drqdX31l91j02KCPHnxsCZauVURllG2DvqVEZZRtg76lRGWUbYO+p0b81+gHeNSQrN2iaOgAAAABJRU5ErkJggg==") 21 21, default`;
        canvas.addEventListener("pointerenter", (event) => {
            if (event.pointerType == "pen" && localStorage.pressure === "1")
                pointerRule.innerHTML = "#game-canvas canvas{" + smallBlackPointerCss + " !important}";
        });
        canvas.addEventListener("pointerleave", () => {
            pointerRule.innerHTML = "";
        });
    },
    updateAccountElements: () => {
        const loggedIn = socket.authenticated;
        if (loggedIn) {
            QS("#typoUserInfo").style.cssText = "";
            QS("#typoUserInfo").innerHTML = "<div style='display:flex; justify-content:space-between; width:100%;'><small>Connected: "
                + socket.data.user.member.UserName + "</small><small id='ptrManage'>Manage</small><small id='ptrLogout'>Logout</small></div><br>";
            QS("#typoUserInfo").innerHTML += "<div style='display:flex; justify-content:space-between; width:100%;'><span>🔮 Bubbles: "
                + socket.data.user.bubbles + "</span><span>💧 Drops: " + socket.data.user.drops + "</span></div>";
            if (localStorage.experimental == "true") QS("#typoUserInfo").insertAdjacentHTML("beforeend",
                "<br>Typo v" + chrome.runtime.getManifest().version + " connected@ " + socket.sck.io.uri);
            QS("#typoUserInfo #ptrManage").addEventListener("click", () => window.open("https://typo.rip#u"));
            QS("#typoUserInfo #ptrLogout").addEventListener("click", logout);

            sprites.setLandingSprites(true);
            sprites.resetCabin(true);
        }
        else {
            const userinfo = QS("#typoUserInfo")
            userinfo.innerText = "No palantir account connected!";
            userinfo.style.cssText = "opacity:1; transition: opacity 0.5s";
            setTimeout(() => { userinfo.style.opacity = "0"; }, 3000);
            setTimeout(() => { userinfo.style.display = "none" }, 3500);

            sprites.setLandingSprites(false);
            sprites.resetCabin(false);
        }
    },
    initTypoTools: () => {
        const container = elemFromString(`<div id="typotoolbar" class="toolbar-group-tools" style="
            position: absolute;
            left: calc(100% + 5px);
            height: 100%;
        "></div>`);
        QS("#game-toolbar").appendChild(container);
        container.parentElement.parentElement.style.position = "relative";
        container.style.display = localStorage.typotools == "true" ? "" : "none";

        // move tools
        setTimeout(() => container.appendChild(QS(`.tool[data-tooltip="Lab"]`)), 500);

    },
    initAll: () => {
        // clear ads for space 
        //document.querySelectorAll(".adsbygoogle").forEach(a => a.style.display = "none");
        //document.querySelectorAll('a[href*="tower"]').forEach(function (ad) { ad.remove(); });
        // mel i love you i would never do this
        uiTweaks.initGameNavigation();
        uiTweaks.initToolsMod(localStorage.typotoolbar == "true");
        uiTweaks.initTypoTools();
        uiTweaks.initWordHint();
        uiTweaks.initRandomColorDice();
        uiTweaks.initClipboardCopy();
        uiTweaks.initColorPicker();
        uiTweaks.initCanvasZoom();
        uiTweaks.initColorPalettes();
        uiTweaks.initLobbyDescriptionForm();
        uiTweaks.initMarkMessages();
        uiTweaks.initQuickReact();
        uiTweaks.initSelectionFormatter();
        uiTweaks.initSideControls();
        uiTweaks.initLobbyRestriction();
        uiTweaks.initDefaultKeybinds();
        uiTweaks.initChatRecall();
        uiTweaks.initChooseCountdown();
        uiTweaks.initStraightLines();
        uiTweaks.initPenPointer();

        QS("#game-chat > div.chat-container > form > input[type=text]").setAttribute("maxlength", 300);

        // random easteregg
        if (Math.random() < 0.1) QS("#game-chat .chat-container form input").placeholder = "Typo your guess here...";
    }
}