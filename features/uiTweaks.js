// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// adds all smaller ui improvements to skribbl
// depends on: capture.js, generalFunctions.js, emojis.js
const uiTweaks = {
    palettes: [],
    initGameNavigation: () => {
        // Create next button
        let btNext = elemFromString(`<button id="legacy-next" style="display: none;" class="button-blue">Next Lobby</button>`);
        btNext.addEventListener("click", () => {
            leaveLobby(true)
        });

        let iconNext = elemFromString(`<div data-typo-tooltip='Next Lobby' data-tooltipdir='N' class="lobbyNavIcon next" style="
                background-image: url(${chrome.runtime.getURL("res/arrow.gif")}); 
            "></div>`);
        iconNext.addEventListener("click", () => {
            leaveLobby(true);
        });

        // Create exit button
        let btExit = elemFromString(`<button id="legacy-exit" style="display: none;" class="button-orange">Exit Lobby</button>`);
        btExit.addEventListener("click", () => {
            leaveLobby(false);
        });

        let iconExit = elemFromString(`<div data-typo-tooltip='Leave Lobby' data-tooltipdir='N'  class="lobbyNavIcon exit" style="
                background-image: url(${chrome.runtime.getURL("res/arrow.gif")}); 
            "></div>`);
        iconExit.addEventListener("click", () => {
            leaveLobby(false);
        });

        // create container for buttons
        let lobbyControls = elemFromString(`<div id="lobby-nav"></div>`);
        lobbyControls.appendChild(btExit);
        lobbyControls.appendChild(btNext);
        lobbyControls.appendChild(iconExit);
        lobbyControls.appendChild(iconNext);
        QS("#game-bar").appendChild(lobbyControls);
    },
    initWordHint: () => {
        // Add wordcount under input
        const input = QS("#game-chat form input");
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
            //canvasGame.parentElement.style.boxShadow = "";
            canvasGame.style.width = "";
            canvasGame.style.height = "";
            canvasGame.style.top = "";
            canvasGame.style.left = "";
            document.removeEventListener("keydown", changeZoom);
            [...QSA(".zoomNote")].forEach(n => n.remove());
            zoomActive = false;
            // document.querySelector(".size-picker .slider").dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
        }
        let toggleZoom = (event, skipctrl = false) => {
            if (!isCurrentlyDrawing()) return;

            if ((event.ctrlKey || skipctrl) && localStorage.zoomdraw == "true") {

                if (document.fullscreenElement) {
                    new Toast("Zoom is not available while using fullscreen mode.", 2000);
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                if (skipctrl || !zoomActive && !QS("#game-toolbar").classList.contains("hidden")) {
                    zoomActive = true;
                    const zoom = Number(sessionStorage.zoom) > 1 ? Number(sessionStorage.zoom) : 3;
                    // refresh brush cursor
                    canvasGame.setAttribute("data-zoom", zoom);
                    //document.querySelector(".size-picker .slider").dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
                    // get current height and set to parent
                    let bRect = canvasGame.getBoundingClientRect();
                    canvasGame.style.height = /* bRect.height + */ `calc(600px * ${zoom})`;
                    canvasGame.style.width = /* bRect.width + */ `calc(800px * ${zoom})`;
                    canvasGame.parentElement.style.height = /* bRect.height + */ `calc(600px * ${1})`;
                    canvasGame.parentElement.style.width = /* bRect.width + */ `calc(800px * ${1})`;
                    if (!QS(".zoomNote")) {
                        QS("#game-word .description").insertAdjacentHTML("beforeend", "<span class='zoomNote'> (ZOOM MODE ACTIVE)</span>");
                    }
                    //canvasGame.parentElement.style.boxShadow = "black 0px 0px 25px 5px";
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

                    // undo brush action glitch
                    //document.addEventListener("pointerup", () => setTimeout(() => QS("[data-tooltip=Undo]").click(), 100), { once: true });
                }
                else {
                    uiTweaks.resetZoom();
                }
            }
        }
        document.addEventListener("pointerdown", toggleZoom);
        document.addEventListener("logCanvasClear", (e) => { uiTweaks.resetZoom(); });

        // disable pointer events when ctrl pressed
        document.addEventListener("keydown", (e) => canvasGame.style.pointerEvents = e.ctrlKey ? "none" : "");
        document.addEventListener("keyup", (e) => canvasGame.style.pointerEvents = e.ctrlKey ? "none" : "");
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
                [...QSA("#game-toolbar .colors.custom")].forEach(p => p.remove());
                QS("#game-toolbar .colors").style.display = "";
            }
        });
        uiTweaks.palettes.find(palette => palette.name == localStorage.palette)?.activate();
    },
    initLobbyDescriptionForm: () => {
        // add Description form 
        let customwords = QS(".group-customwords, .game-room-group.customwords");
        const input = elemFromString(`<div class="group-customwords game-room-group" style="min-height:3rem">
<div class="game-room-name">Palantir Description</div>
<textarea id="lobbyDesc" maxlength="200" spellcheck="false" placeholder="Add a description that will show up in the Palantir bot"></textarea>
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
                    let player = QS("#game-players .player[playerid='" + id + "']");
                    player.click();
                }
            }
        });

        const addPlayerPopup = (node) => {
            let attr = node.getAttribute("playerid");
            if (attr) {
                node.querySelector("b").style.cursor = "pointer";
                if (localStorage.experimental != "true") return;
                let clone = document.querySelector("#game-players .player[playerid='" + attr + "'] .player-avatar-container").cloneNode(true);
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

        // add typro
        let typroCloud = elemFromString("<div data-typo-tooltip='Typo Cloud' data-tooltipdir='E'  style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/cloud.gif")
            + ") center no-repeat;'></div>");
        typroCloud.addEventListener("click", typro.show);
        QS("#controls").append(typroCloud);

        // add appearance options
        let visualsButton = elemFromString("<div data-typo-tooltip='Themes' data-tooltipdir='E' style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/themes.gif")
            + ") center no-repeat;'></div>");
        visualsButton.addEventListener("click", visuals.show);
        QS("#controls").append(visualsButton);

        // add brush tools
        //let brushmagicButton = elemFromString("<div style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
        //    + chrome.runtime.getURL("/res/brush.gif")
        //    + ") center no-repeat;'></div>");
        //brushmagicButton.addEventListener("click", brushtools.showSettings);
        //QS("#controls").append(brushmagicButton);
    },
    initDefaultKeybinds: () => {
        const chatInput = QS('#game-chat form input');
        let lastColorSwitch = 0;
        document.addEventListener('keydown', e => {
            if (!document.activeElement.matches("#game-chat form input")) {
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
            else if (document.activeElement.matches("#game-chat form input") && e.key === 'Tab' && !(e.altKey || e.ctrlKey || e.shiftKey)) e.preventDefault();

            if (e.key === 'AltGraph' && !(e.altKey || e.ctrlKey || e.shiftKey)) {// Show player IDs
                let removeIDs = (event) => {
                    if (event.key == "AltGraph") {
                        document.removeEventListener("keyup", removeIDs);
                        QSA("#game-players .player").forEach(player => {
                            player.querySelector(".player-icons span")?.remove();
                        });
                    }
                }
                document.addEventListener("keyup", removeIDs);
                QSA("#game-players .player").forEach(player => {
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
        let restrict = elemFromString("<div id='restrictLobby' data-tooltipdir='E' data-typo-tooltip='Lobby Privacy' style='z-index:50;display:none;flex: 0 0 auto;cursor:pointer; user-select: none; width:48px; height:48px; background: center no-repeat'></div>");
        controls.append(restrict);
        let updateIcon = () => {
            if (localStorage.restrictLobby == "unrestricted") restrict.style.backgroundImage = "url(" + chrome.runtime.getURL("res/lock-unrestricted.gif") + ")";
            else restrict.style.backgroundImage = "url(" + chrome.runtime.getURL("res/lock-restricted.gif") + ")";
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
        QS("#game-chat").appendChild(react);
        let chatinput = QS("#game-chat form input");
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
        const chatbox = QS("#game-chat > .chat-content");
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
        const input = QS("#game-chat form input");
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

                if (!QS(".slNote")) {
                    QS("#game-word .description").insertAdjacentHTML("beforeend", "<span class='slNote'> (STRAIGHT MODE ACTIVE)</span>");
                }
            },
            stop: () => {
                preview.canvas.remove();
                preview.gameCanvas.style.pointerEvents = "";
                QS(".slNote")?.remove();
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
        };
        const chatInput = QS("#game-chat form input");
        let straight = false;
        let lastPress = 0;
        let snap = false;
        let pointerdown = false;
        let lastDown = [null, null];
        let lastDownClient = [null, null];
        let lastDirectClient = [null, null];
        const pointerEvent = (type, id, x, y, pressure = 0.5) => {
            return new PointerEvent(type, {
                bubbles: true,
                clientX: x,
                clientY: y,
                button: 0,
                pressure: pressure,
                pointerType: "mouse",
                pointerId: id
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
            if (document.activeElement == chatInput || !isCurrentlyDrawing()) return;
            let state = straight;
            straight = straight || event.which === 16;
            if (straight && !state) preview.use();
            if (straight && !state && Date.now() - lastPress < 300) snap = true;
            if (straight && !state && event.which === 16) {
                lastPress = Date.now();
            }
        });
        document.addEventListener("keyup", (event) => {
            let state = straight;
            straight = straight && event.which !== 16;
            snap = straight && snap;
            if (!straight/*  && !pointerdown */) preview.stop();
            if (!straight) lastDirectClient = [null, null];
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
        document.addEventListener("pointerup", (event) => {
            pointerdown = false;
            // check for event target to filter out generated events that are used for actual drawing
            if (straight && event.target !== preview.gameCanvas) {
                event.preventDefault();
                event.stopPropagation();
                preview.clear();
                lastDown = [null, null];
                let dest = [event.clientX, event.clientY];
                if (snap) dest = snapDestination(lastDownClient[0], lastDownClient[1], event.clientX, event.clientY);
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerdown", event.pointerId, lastDownClient[0], lastDownClient[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointermove", event.pointerId, dest[0], dest[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerup", event.pointerId, dest[0], dest[1]));
            }
        });
        document.addEventListener("pointermove", (event) => {
            // update preview only if cursor moved on preview
            if (straight && event.target == preview.canvas) {
                event.preventDefault();
                event.stopPropagation();
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
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerdown", event.pointerId, lastDirectClient[0], lastDirectClient[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointermove", event.pointerId, dest[0], dest[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerup", event.pointerId, dest[0], dest[1]));
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
            userinfo.innerText = "No palantir account connected.";
            userinfo.style.cssText = "opacity:1; transition: opacity 0.5s";
            setTimeout(() => { userinfo.style.opacity = "0"; }, 3000);
            setTimeout(() => { userinfo.style.display = "none" }, 3500);

            sprites.setLandingSprites(false);
            sprites.resetCabin(false);
        }
    },
    initColorTools: () => {
        QS(".toolbar-group-tools").insertAdjacentElement("afterbegin", elemFromString(`<div class="color-tools">
        <div class="top">
          <div class="color" id="color-canvas-picker" data-tooltipdir='N' data-typo-tooltip="Select a color from the canvas" style="background-image: url(${chrome.runtime.getURL("res/crosshair.gif")});"></div>
        </div>
        <div class="bottom">
          <div class="color" id="color-free-picker" data-tooltipdir='S' data-typo-tooltip="Open the color picker" style="background-image: url(${chrome.runtime.getURL("res/inspect.gif")});"></div>
        </div>
        </div>`
        ));


        // color picker
        const picker = QS("#color-free-picker");
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

        // pipette
        // activate skribbl tool on pipette btn click
        QS("#color-canvas-picker").addEventListener("click", () => {
            QS("[data-tooltip=Pipette]").click();
        });

        if(QS(".toolbar-group-tools [data-tooltip=Pipette]")){
            // update cursor when pipette changed activity
            new MutationObserver((e) => {
                if(e.some(r => r.type == "attributes" && r.attributeName == "class")) {
                    if(QS(".toolbar-group-tools [data-tooltip=Pipette]").classList.contains("selected")) {
                        QS("#game-canvas canvas").style.cursor = `url(${chrome.runtime.getURL("res/pipette_cur.png")}) 7 38, default`;
                    }
                }
            }).observe(QS(".toolbar-group-tools [data-tooltip=Pipette]"), { attributes: true, childList: false });
        }
        else {
            document.addEventListener("skribblInitialized", () => {
                // update cursor when pipette changed activity
                new MutationObserver((e) => {
                    if(e.some(r => r.type == "attributes" && r.attributeName == "class")) {
                        if(QS(".toolbar-group-tools [data-tooltip=Pipette]").classList.contains("selected")) {
                            QS("#game-canvas canvas").style.cursor = `url(${chrome.runtime.getURL("res/pipette_cur.png")}) 7 38, default`;
                        }
                    }
                }).observe(QS(".toolbar-group-tools [data-tooltip=Pipette]"), { attributes: true, childList: false });
            });
        }


        QS("#game-canvas canvas").addEventListener("click", (e) => {
            if(!document.querySelector(".toolbar-group-tools [data-tooltip=Pipette].selected")) return;

            const b = e.target.getBoundingClientRect();
            const scale = e.target.width / parseFloat(b.width);
            const x = (e.clientX - b.left) * scale;
            const y = (e.clientY - b.top) * scale;
            const rgba = e.target.getContext("2d").getImageData(x,y,1,1).data;
            const color = new Color({r: rgba[0], g:rgba[1], b:rgba[2]}).hex.replace("#", "");

            document.dispatchEvent(newCustomEvent("setColor", { detail: { code: parseInt(color, 16) + 10000 } }));
        });
    },
    initAll: () => {
        // clear ads for space 
        //document.querySelectorAll(".adsbygoogle").forEach(a => a.style.display = "none");
        //document.querySelectorAll('a[href*="tower"]').forEach(function (ad) { ad.remove(); });
        // mel i love you i would never do this
        uiTweaks.initGameNavigation();
        uiTweaks.initColorTools();
        uiTweaks.initWordHint();
        uiTweaks.initClipboardCopy();
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

        document.dispatchEvent(new Event("addTypoTooltips"));

        QS("#game-chat > form > input[type=text]").setAttribute("maxlength", 300);

        const GAME = QS("#game");
        var gameObserver = new MutationObserver(() => {
            QS("#typoThemeBg")?.classList.toggle("ingame", GAME.style.display != "none");
        });
        gameObserver.observe(GAME, { attributes: true, childList: false });

        // random easteregg
        if (Math.random() < 0.1) QS("#game-chat form input").placeholder = "Typo your guess here...";
    }
}