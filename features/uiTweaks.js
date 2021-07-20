// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// adds all smaller ui improvements to skribbl
// depends on: capture.js, generalFunctions.js, emojis.js
const uiTweaks = {
    initGameNavigation: () => {
        // Create next button
        let btNext = document.createElement("input");
        btNext.type = "button";
        btNext.value = "Next Lobby";
        btNext.classList.add("btn", "btn-info", "btn-block");
        btNext.style.margin = "0 0.5em";
        btNext.addEventListener("click", () => {
            if (QS("#containerFilters").style.display == "none") {
                let modal = new Modal(elemFromString("<h3>Click anywhere to cancel</h3>"), () => {
                    lobbies_.searchData.searching = false;
                }, "Searching next lobby...", "30vw", "10em");
                lobbies_.startSearch(() => {
                    return lobbies_.lobbyProperties.Players.length > 1;
                }, () => {
                    setTimeout(() => leaveLobby(true), 50);
                }, () => {
                    modal.close();
                });
                leaveLobby(true);
            }
            else {
                uiTweaks.startFilterSearch();
                leaveLobby(true);
            }
        });

        // Create exit button
        let btExit = document.createElement("input");
        btExit.type = "button";
        btExit.value = "Exit Lobby";
        btExit.classList.add("btn", "btn-warning", "btn-block");
        btExit.style.margin = "0 0.5em";
        btExit.addEventListener("click", () => { leaveLobby(false); });

        // create table container for buttons
        let lobbyControls = document.createElement("div");
        lobbyControls.style = "display:flex; font-size:15; float: right; justify-content:center; align-items:center;";
        lobbyControls.appendChild(btExit);
        lobbyControls.appendChild(btNext);
        QS(".gameHeaderButtons").appendChild(lobbyControls);
    },
    initWordHint: () => {
        // Add wordcount under input
        // this is terrible and has to be changed to something modern
        let chat_cont = document.querySelector("#boxChat");
        let msg_cont = document.querySelector("#boxMessages");
        let table = document.createElement("table");
        let tr = table.insertRow();
        let td = tr.insertCell();
        td.innerHTML = "<div id=\"info\"\ style='color:black !important'></div>";
        table.id = "tableBox";
        table.style.fontSize = "16px"
        table.style.width = "15%";
        table.style.marginLeft = "5px";
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
            table.style.position = "absolute";
            _height = 34;
        }
        let style_cont_msg = document.createElement("style");
        // style_cont_msg.innerHTML = "#boxMessages{height:calc(100% - " + _height + "px);}"
        style_cont_msg.setAttribute("id", "style_cont_msg");
        chat_cont.insertBefore(style_cont_msg, msg_cont);
        QS("#boxChatInput").appendChild(table);
        QS("#boxChatInput").insertAdjacentHTML("beforeEnd", "</div><div id=\"emojiPrev\"\ style='z-index: 10; display:none; padding: .5em;box-shadow: black 1px 1px 9px -2px;position: absolute;bottom: 5em;background: white;border-radius: 0.5em;'></div>");
        let input = QS("#inputChat");
        let word = QS("#currentWord");
        let refreshCharBar = () => {
            // remove content if clear token is present
            if (input.value.includes(localStorage.token)) input.value = "";
            // recognize command and call interpreter
            else if (input.value.includes("--")) {
                performCommand(input.value);
                input.value = "";
            }
            QS("#info").innerText = word.innerText.length - input.value.length;
            if (input.value.length > word.innerText.length
                || !replaceUmlaute(input.value).toLowerCase().match(new RegExp(word.innerText.substr(0, input.value.length).toLowerCase().replaceAll("_", "[\\w\\d]")))) {
                QS("#tableBox").style.background = "#ff5c33";
            }
            else QS("#tableBox").style.background = "#BAFFAA";
        }

        // Add event listener to keyup and process to hints
        input.addEventListener("keyup", refreshCharBar);
        // Add event listener to word mutations
        (new MutationObserver(refreshCharBar)).observe(QS("#currentWord"), { attributes: true, childList: true });
    },
    initBackbutton: () => {
        // add back btn
        let backBtn = document.createElement("div");
        let clearContainer = QS(".containerClearCanvas");
        backBtn.classList.add("tool");
        backBtn.id = "restore";
        backBtn.style.display = localStorage.displayBack ? "" : "none";
        backBtn.innerHTML = "<img class='toolIcon' src='" + chrome.extension.getURL("/res/back.gif") + "'>";
        backBtn.onclick = function () { captureCanvas.restoreDrawing(1); };
        clearContainer.style.marginLeft = "8px";
        clearContainer.firstChild.classList.add("tool");
        clearContainer.firstChild.style.opacity = "1";
        clearContainer.classList.add("containerTools");
        clearContainer.appendChild(backBtn);
        toggleBackbutton(localStorage.displayBack == "true", true);
    },
    initRandomColorDice: () => {
        // add random color image
        let rand = QS(".colorPreview");
        rand.innerHTML = "<img src='res/randomize.gif' class='toolIcon'>";
        rand.style.justifyContent = "center";
        rand.style.alignItems = "center";
        rand.style.display = "flex";
        rand.firstChild.display = localStorage.randomColorButton ? "" : "none";
        rand.firstChild.id = "randomIcon";
        rand.addEventListener("click", function () {
            let colors = [];
            [...QSA(".colorItem")].forEach(c => {
                if (c.parentElement.parentElement.style.display != "none") {
                    colors.push(Number(c.getAttribute("data-color")));
                }
                c.onclick = () => {
                    document.body.dispatchEvent(newCustomEvent("setRandomColor", { detail: { enable: "false" } }));
                }
            });
            document.body.dispatchEvent(newCustomEvent("setRandomColor", { detail: { enable: localStorage.randomColorInterval, colors: colors } }));
        });
    },
    initColorPicker: () => {
        // color picker
        let toolbar = QS(".containerToolbar");
        let picker = document.createElement("div");
        picker.id = "colPicker";
        picker.style.display = localStorage.randomColorButton == "true" ? "flex" : "none";
        picker.style.justifyContent = "center";
        picker.style.alignItems = "center";
        picker.innerHTML = "<img src='" + chrome.runtime.getURL("res/mag.gif") + "' class='toolIcon'>";
        picker.classList.add("colorPreview");
        toolbar.insertBefore(picker, toolbar.children[0]);
        let pickerpopup = new ColorPicker(picker.firstChild);
        picker.firstChild.addEventListener('colorChange', function (event) {
            document.querySelector("body").dispatchEvent(newCustomEvent("setColor", { detail: event.detail.color }));
            picker.style.backgroundColor = event.detail.color.hex;
            picker.firstChild.style.background = "none";
            document.body.dispatchEvent(newCustomEvent("setRandomColor", { detail: { enable: "false" } }));
        });
        document.querySelector("#opacity_slider").style.pointerEvents = "none";
        document.querySelector("#opacity_slider").style.opacity = "0";
    },
    initCanvasZoom: () => {
        // init precise drawing mode
        let canvasGame = QS("#canvasGame");
        let zoomActive = false;
        let changeZoom;
        let toggleZoom = (event, skipctrl = false) => {
            if (event.ctrlKey || skipctrl) {
                event.preventDefault();
                if (!zoomActive && document.querySelector(".containerToolbar").style.display != "none") {
                    zoomActive = true;
                    const zoom = Number(localStorage.zoom) > 1 ? Number(localStorage.zoom) : 3;
                    // refresh brush cursor
                    canvasGame.setAttribute("data-zoom", zoom);
                    document.querySelector(".tool.toolActive").dispatchEvent(newCustomEvent("click"));
                    // get current height and set to parent
                    let bRect = canvasGame.getBoundingClientRect();
                    canvasGame.parentElement.style.height = bRect.height + "px";
                    canvasGame.parentElement.style.width = bRect.width + "px";
                    canvasGame.parentElement.style.boxShadow = "black 0px 0px 25px 5px";
                    // zoom canvas
                    canvasGame.style.width = (zoom * 100) + "%";
                    // get position offset
                    canvasGame.style.position = "relative";
                    canvasGame.style.top = "-" + ((event.offsetY * zoom) - (bRect.height / 2)) + "px";
                    canvasGame.style.left = "-" + ((event.offsetX * zoom) - (bRect.width / 2)) + "px";
                    changeZoom = (e) => {
                        if (Number(e.key) > 1 && Number(e.key) <= 9) {
                            localStorage.zoom = e.key;
                            toggleZoom(event);
                            toggleZoom(event);
                        }
                    }
                    document.addEventListener("keydown", changeZoom);
                }
                else {
                    // reset zoom
                    canvasGame.setAttribute("data-zoom", 1);
                    document.querySelector(".tool.toolActive").dispatchEvent(newCustomEvent("click"));
                    canvasGame.parentElement.style.height = "";
                    canvasGame.parentElement.style.width = "";
                    canvasGame.parentElement.style.boxShadow = "";
                    canvasGame.style.width = "100%";
                    canvasGame.style.top = "";
                    canvasGame.style.left = "";
                    document.removeEventListener("keydown", changeZoom);
                    zoomActive = false;
                }
            }
        }
        document.addEventListener("pointerdown", toggleZoom);
        document.querySelector("body").addEventListener("logCanvasClear", (e) => { if (zoomActive) toggleZoom(e, true); });
    },
    initColorPalettes: () => {
        // add color palettes
        QS(".containerColorbox").id = "originalPalette";
        QS("#buttonClearCanvas").style.height = "48px";
        let palettes = localStorage.customPalettes ? JSON.parse(localStorage.customPalettes) : [];
        palettes.forEach(p => addColorPalette(p));
    },
    initLobbyDescriptionForm: () => {
        // add Description form 
        let containerForms = QS(".containerSettings");
        let containerGroup = QS("div");
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
    },
    initMarkMessages: () => {
        // Observer for chat mutations and emoji replacement
        let chatObserver = new MutationObserver(function (mutations) {
            mutations.forEach(mutation => mutation.addedNodes.forEach(markMessage));
            mutations.forEach(mutation => mutation.addedNodes.forEach(emojis.replaceEmojiContent));
        });
        chatObserver.observe(QS("#boxMessages"), { attributes: false, childList: true });
    },
    initRicardoSpecial: () => {
        let ricardo = document.createElement("div");
        ricardo.style.cssText = `
width: 20%; 
height: 100%; 
z-index: 0; 
background-image: url("https://cdn.discordapp.com/attachments/715996980849147968/800431598922235944/ricardo.gif"); 
background-size: contain; 
position: absolute; 
background-repeat: no-repeat; 
image-rendering: pixelated; 
left: 0px; bottom: 0px; 
background-position: center bottom; 
cursor: pointer;
transition: left 1s ease 0s;`;
        setInterval(() => ricardo.style.left = "80%", 10000);
        setTimeout(() => { setInterval(() => ricardo.style.left = "0%", 10000); }, 5000);
        ricardo.addEventListener("click", () => {
            let popup = document.createElement("div");
            popup.innerHTML = `
<h2 class="updateInfo"> I heard you like Memes?</h2><br>
<span>Great, of course you do. <br><br>You now got the chance to watch the best videos everr and get rewarded with a nice sprite!</span><br>
<a href="/"><button class="btn btn-info">Nah, take me back to skribbl</button></a><br><br>
<button class="btn btn-success">Yeah I'm not afraid of the internet and want to spend 15 mins for memes</button><br>
<div style="position:absolute; z-index:-1;bottom:0; right:0;height:50%;width:20%;background-image:url(https://cdn.discordapp.com/attachments/715996980849147968/800444501796978719/knuckles.gif);background-size:contain;background-opition:bottom right;background-repeat:no-repeat;"></div>
`;
            popup.style.cssText = `
position: fixed; 
background: white; 
overflow-y: scroll; 
z-index: 5; 
width: 50vw; 
height:50vh;
border-radius: 0.5em; 
box-shadow: black 1px 1px 9px -2px; 
display: block; 
left: 25vw;
top:25vh;
padding: 1em; `;
            popup.querySelector(".btn-success").addEventListener("click", () => {
                popup.innerHTML = `
<h2 class="updateInfo"> Goooood.</h2><br>
<span>Then lets gooo! Watch <a target="_blank" href="https://www.youtube.com/watch?v=O9ZeFoSxA1Y&list=PLfqjJfOuOI5r6QQBgoUtBgNi7aMj3_Yb4&">this random Five-Episode-Series (first 5 videos)</a> that I fell in love with and enjoy the trip.
<br><br>Afterwards, answer some super-sophisticated questions and about this masterpiece and very likely you'll get rewarded with an exclusive sprite ;))<br>
<br>Btw, you got 5 mins once you start the form and ONLY got ONE TRY! :O.</span><br>
<a href="/"><button class="btn btn-info">SOS I'm not ready, take me back to skribbl</button></a><br><br>
<button class="btn btn-success">START THE QUESTIONS</button><br>
<div style="position:absolute; z-index:-1;bottom:0; right:0;height:50%;width:20%;background-image:url(https://cdn.discordapp.com/attachments/715996980849147968/800450879689064488/bonk.gif);background-size:contain;background-opition:bottom right;background-repeat:no-repeat;"></div>
`;
                popup.querySelector(".btn-success").addEventListener("click", () => {
                    // questions logic
                });
            });
            document.body.appendChild(popup);
        });
        QS("#loginAvatarCustomizeContainer").appendChild(ricardo);
    },
    initSideControls: () => {
        //init new controls div
        QS("#audio").insertAdjacentHTML("beforebegin", "<div id='controls'></div>");
        QS("#controls").appendChild(QS("#audio"));
        QS("#controls").style.cssText = "z-index: 50;position: fixed;display: flex; flex-direction:column; left: 9px; top: 9px";
        QS("#controls").style.display = localStorage.controls == "true" ? "flex" : "none";
        QS("#audio").style.cssText += "z-index: unset;position: unset;left: unset; top:unset";
        // add fullscreen btn
        let fulls = elemFromString("<div style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/fullscreen.gif")
            + ") center no-repeat;'></div>");
        fulls.addEventListener("click", () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            else {
                if (QS("#screenGame").style.display == "none") {
                    new Toast("Fullscreen mode is only available in-game.",2000);
                    return;
                }
                document.documentElement.requestFullscreen();
                document.head.insertAdjacentHTML("beforeEnd", "<style id='fullscreenRules'>#screenGame{position:fixed; left:0; width:100vw; height:100vh; padding: 0 1em; overflow-y:scroll} .header{display:none !important} .gameHeader{width:100%} *::-webkit-scrollbar{display:none} #controls{flex-direction:row !important; top: 0 !important; left:20vw !important;</style>");
            }
        });
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                QS("#fullscreenRules").remove();
            }
        });
        QS("#controls").append(fulls);
        // add typro
        let typroCloud = elemFromString("<div style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/cloud.gif")
            + ") center no-repeat;'></div>");
        typroCloud.addEventListener("click", typro.show);
        QS("#controls").append(typroCloud);
        // add tabletmode
        let tabletMode = elemFromString("<div id='tabMode' style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/tablet.gif")
            + ") center no-repeat;'></div>");
        tabletMode.addEventListener("click", () => {
            let modeNone = elemFromString("<div class='tabletOption'><div style='width:99px; height:48px; background: center no-repeat url("
                + chrome.runtime.getURL("/res/modeNone.png")
                + ")'></div><h4>Disable</h4></div>");
            modeNone.addEventListener("click", () => performCommand("disable ink "));

            let modeThickness = elemFromString("<div class='tabletOption'><div style='width:99px; height:48px; background: center no-repeat url("
                + chrome.runtime.getURL("/res/modeThickness.png")
                + ")'></div><h4>Size (Absolute)</h4></div>");
            modeThickness.addEventListener("click", () => localStorage.ink == "true" ?
                performCommand("inkmode thickness") :
                performCommand("enable ink") || performCommand("inkmode thickness"));

            let modeRelative = elemFromString("<div class='tabletOption'><div style='width:99px; height:48px; background: center no-repeat url("
                + chrome.runtime.getURL("/res/modeThickness.png")
                + ")'></div><h4>Size (Relative)</h4></div>");
            modeRelative.addEventListener("click", () => localStorage.ink == "true" ?
                performCommand("inkmode relative") :
                performCommand("enable ink") || performCommand("inkmode relative"));

            let modeBrightness = elemFromString("<div class='tabletOption'><div style='width:99px; height:48px; background: center no-repeat url("
                + chrome.runtime.getURL("/res/modeBrightness.png")
                + ")'></div><h4>Brightness</h4></div>");
            modeBrightness.addEventListener("click", () => localStorage.ink == "true" ?
                performCommand("inkmode brightness") :
                performCommand("enable ink") || performCommand("inkmode brightness"));

            let modeDegree = elemFromString("<div class='tabletOption'><div style='width:99px; height:48px; background: center no-repeat url("
                + chrome.runtime.getURL("/res/modeDegree.png")
                + ")'></div><h4>Degree</h4></div>");
            modeDegree.addEventListener("click", () => localStorage.ink == "true" ?
                performCommand("inkmode degree") :
                performCommand("enable ink") || performCommand("inkmode degree"));

            let modeBrightnessDegree = elemFromString("<div class='tabletOption'><div style='width:99px; height:48px; background: center no-repeat url("
                + chrome.runtime.getURL("/res/modeBrightnessDegree.png")
                + ")'></div><h4>Brightness Degree</h4></div>");
            modeBrightnessDegree.addEventListener("click", () => localStorage.ink == "true" ?
                performCommand("inkmode degree brightness") :
                performCommand("enable ink") || performCommand("inkmode degree brightness"));

            let options = elemFromString("<div style='display:flex; gap:3em; flex-wrap: wrap; width:100%; height: min-content; flex-direction:row; justify-content: space-evenly'></div>");
            options.appendChild(elemFromString("<style>.tabletOption:hover{background:#00000040}.tabletOption{transition: background 0.2s;display:flex; margin:.5em; padding:.5em; flex-direction: column; align-items: center; justify-items: center; background: #00000026; cursor: pointer; border-radius: .5em;}</style>"));
            options.append(modeNone, modeThickness, modeRelative, modeBrightness, modeDegree, modeBrightnessDegree);
            let modal = new Modal(options, () => { }, "Select a tablet mode", "50vw", "0px");
            options.addEventListener("click", () => modal.close());
        });
        QS("#controls").append(tabletMode);
        // add appearance options
        let visualsButton = elemFromString("<div style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/visuals.gif")
            + ") center no-repeat;'></div>");
        visualsButton.addEventListener("click", visuals.show);
        QS("#controls").append(visualsButton);
    },
    initLobbyChat: () => {
        // show chat in lobby idle
        let sectionParent = QS(".containerLobby");
        let screen = QS("#screenLobby");
        let sectionChat = elemFromString("<div id='sectionChat' style='width: 0; display: flex; flex-direction: column;'><div class='title'>Chat</div></div>");
        sectionChat.appendChild(elemFromString("<style>#sectionChat > #containerSidebar{flex: 1 1 0; width: 100%; margin-bottom: 8px}</style>"));
        sectionParent.append(sectionChat);
        screen.classList = [];
        [...sectionParent.children].forEach(c => c.style.flex = "1 1 0");
        (new MutationObserver(() => {
            if (screen.style.display == "none") QS(".containerGame").appendChild(QS("#containerSidebar"));
            else sectionChat.appendChild(QS("#containerSidebar"));
            scrollMessages();
        })).observe(screen, { attributes: true, childList: false });
    },
    startFilterSearch: undefined,
    SearchFilter: class {
        constructor(inputOptions) {
            // get names and define name match func
            this.names = [];
            this.names = inputOptions.find(e => e.id == "inputSearchName").value.trim() != "" ? inputOptions.find(e => e.id == "inputSearchName").value.trim().split(",").map(p => p.trim()) : []
            const matchesNames = (players) => {
                return this.names.length == 0 || players.some(lobbyplayer =>
                    this.names.some(searchPlayer => searchPlayer.toLowerCase() == lobbyplayer.Name.toLowerCase()));
            };
            // get round and round modifier + match func
            this.targetRound = 0;
            this.targetRoundModifier = 0;
            let valRound = inputOptions.find(e => e.id == "inputSearchRound").value.trim();
            this.targetRound = parseInt(valRound);
            this.targetRoundModifier = valRound[valRound.indexOf(this.targetRound) + this.targetRound.toString().length];
            if (this.targetRoundModifier != "+" && this.targetRoundModifier != "-" && this.targetRoundModifier != undefined
                || isNaN(this.targetRound)) this.targetRoundModifier = "+";
            const matchesRound = (round) => {
                return isNaN(this.targetRound) ||
                    (this.targetRoundModifier == "+" ? round >= this.targetRound
                        : this.targetRoundModifier == "-" ? round <= this.targetRound
                            : round == this.targetRound);
            };
            // get score and score modifier + match func
            this.targetScore = 0;
            this.targetScoreModifier = 0;
            let valScore = inputOptions.find(e => e.id == "inputSearchScore").value.trim();
            this.targetScore = parseInt(valScore);
            this.targetScoreModifier = valScore[valScore.indexOf(this.targetScore) + this.targetScore.toString().length];
            if (this.targetScoreModifier != "+" && this.targetScoreModifier != "-" && this.targetScoreModifier != undefined
                || isNaN(this.targetScore)) this.targetScoreModifier = "+";
            const matchesScore = (players) => {
                let avg = ((ps) => { let avg = 0; ps.forEach(p => avg += p.Score / ps.length); return avg; })(players);
                return isNaN(this.targetScore)
                    || (this.targetScoreModifier == "-" ? avg < this.targetScoreModifier : avg >= this.targetScore);
            };
            // get count and count modifier + match func
            this.targetCount = 0;
            this.targetCountModifier = 0;
            let valCount = inputOptions.find(e => e.id == "inputSearchCount").value.trim();
            this.targetCount = parseInt(valCount);
            this.targetCountModifier = valCount[valCount.indexOf(this.targetCount) + this.targetCount.toString().length];
            if (this.targetCountModifier != "+" && this.targetCountModifier != "-" && this.targetCountModifier != undefined
                || isNaN(this.targetCount)) this.targetCountModifier = "+";
            const matchesCount = (players) => {
                return isNaN(this.targetCount)
                    || (this.targetCountModifier == "-" ? players.length <= this.targetCount : this.targetCountModifier == "+" ? players.length >= this.targetCount : players.length == this.targetCount);
            };
            // get ptr players checked + match func
            this.targetPalantirPresent = inputOptions.find(e => e.id == "inputSearchPalantir").checked;
            const matchesPalantir = (lobbyKey) => {
                return !this.targetPalantirPresent || sprites.playerSprites.some(sprite => sprite.LobbyKey == lobbyKey);
            };
            //function to check if all filters match - if private, dont check filters
            this.matchAll = (lobbyProperties) => {
                return lobbyProperties.Private || matchesNames(lobbyProperties.Players) 
                    && matchesCount(lobbyProperties.Players)
                    && matchesScore(lobbyProperties.Players)
                    && matchesRound(lobbyProperties.Round)
                    && matchesPalantir(lobbyProperties.Key)
            }
        }
    },
    initLobbyFilters: () => {
        let filterBtn = QS("#toggleFilter");
        let containerFilters = elemFromString('<div id="containerFilters" class="loginPanelContent" style="display: none; flex-direction:column; justify-content: space-between; box-shadow: unset; margin-top: 1em; background: transparent !important; border: none !important;"></div>')
        let filterNamesForm = elemFromString('<div style="display:flex; width: 100%; margin-bottom:.5em;"><h5>Search Names:</h5><input id="inputSearchName" class="form-control" placeholder="\'name\' or \'name, name1, name2\'" style="flex-grow: 2; width:unset; margin-left: .5em;"></div>');
        let filterDetailsForm = elemFromString('<div style="display:flex; width: 100%; margin-bottom:.5em;"><h5 style="flex:1;">In Round:</h5><input id="inputSearchRound" class="form-control" placeholder="\'1\' or \'2+\'" style="flex: 1;margin-left: .5em;"><h5 style="margin-left: .5em; flex:1;">Avg Score:</h5><input id="inputSearchScore" class="form-control" placeholder="\'500+\' or \'500-\'" style="flex: 1; margin-left: .5em;"></div>');
        let filterPlayersForm = elemFromString('<div style="display:flex; width: 100%;"><h5 style="flex:1;">Player Count:</h5><input id="inputSearchCount" class="form-control" placeholder="\'4-\' or \'8\'" style="flex: 1;margin-left: .5em;"><div class="checkbox" style="margin-left: .5em; flex:2"><label><input type="checkbox" id="inputSearchPalantir"><span>With Palantir Player</span></label></div><div class="btn btn-success" id="addFilter" style="height: fit-content;">✔ Add</div></div>');
        containerFilters.appendChild(filterNamesForm);
        containerFilters.appendChild(filterDetailsForm);
        containerFilters.appendChild(filterPlayersForm);
        filterBtn.parentElement.appendChild(containerFilters);
        filterBtn.addEventListener("click", () => containerFilters.style.display = containerFilters.style.display == "none" ? "flex" : "none");
        // get last form values
        if (localStorage.filterForm) {
            try {
                JSON.parse(localStorage.filterForm).forEach(input => {
                    if (containerFilters.querySelector("#" + input.id)) {
                        containerFilters.querySelector("#" + input.id).value = input.value;
                        containerFilters.querySelector("#" + input.id).checked = input.checked;
                    }
                });
            } catch{ }
            containerFilters.style.display = "flex";
        }
        // save form on window unload
        const savesettings = (saveform = true) => {
            let values = [];
            [...containerFilters.querySelectorAll("input")].forEach(elem => {
                values.push({ id: elem.id, checked: elem.checked, value: elem.value });
            });
            if (containerFilters.style.display == "none") localStorage.removeItem("filterForm");
            else if(saveform) localStorage.filterForm = JSON.stringify(values);
            return JSON.stringify(values);
        };
        window.addEventListener("beforeunload", savesettings);
        // function to add a filter
        const addFilter = (filterstring, active, id) => {
            let filter = new uiTweaks.SearchFilter(JSON.parse(filterstring));
            let names = (filter.targetPalantirPresent ? [...filter.names, "Palantir users"] : filter.names).join(", ");
            let visual = [];
            if (names != "") visual.push("🔎 " + names);
            if (!isNaN(filter.targetRound)) visual.push("🔄 " + filter.targetRound + (filter.targetRoundModifier ? filter.targetRoundModifier : ""));
            if (!isNaN(filter.targetScore)) visual.push("📈 " + filter.targetScore + (filter.targetScoreModifier ? filter.targetScoreModifier : ""));
            if (!isNaN(filter.targetCount)) visual.push("👥 " + filter.targetCount + (filter.targetCountModifier ? filter.targetCountModifier : ""));
            let remove = () => {
                let added = JSON.parse(localStorage.addedFilters);
                added = added.filter(filter => filter.id != id);
                localStorage.addedFilters = JSON.stringify(added);
            }
            if (visual.join("") == "") {
                new Toast("No filters set.");
                remove();
                return;
            }
            let filterbutton = elemFromString('<div class="checkbox btn" style="margin-left: .5em;width: fit-content; margin-bottom:.5em;"><label><input type="checkbox"><span>' + visual.join(" & ") + '</span></label></div>');
            containerFilters.insertBefore(filterbutton, containerFilters.firstChild);
            filterbutton.querySelector("input").checked = active;
            filterbutton.addEventListener("click", () => {
                let added = JSON.parse(localStorage.addedFilters);
                added.forEach(filter => { if (filter.id == id) filter.active = filterbutton.querySelector("input").checked });
                localStorage.addedFilters = JSON.stringify(added);
            });
            filterbutton.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                remove();
                filterbutton.remove();
            });
        }
        // add filter when save is pressed
        QS("#addFilter").addEventListener("click", () => {
            let filterstring = savesettings(false);
            let id = Date.now();
            localStorage.addedFilters = JSON.stringify([...JSON.parse(localStorage.addedFilters), { active: true, filter: filterstring, id: id }]);
            addFilter(filterstring, true, id);
        });
        // add saved filters
        JSON.parse(localStorage.addedFilters).forEach(filter => {
            addFilter(filter.filter, filter.active, filter.id);
        });

        // filter search function
        uiTweaks.startFilterSearch = () => {
            // load and create filters
            let filters = [];
            let humanCriterias = [];
            JSON.parse(localStorage.addedFilters).forEach(filter => {
                if (filter.active) {
                    let filterObj = new uiTweaks.SearchFilter(JSON.parse(filter.filter));
                    filters.push(filterObj);
                    criteria = [];
                    if (filterObj.names.length > 0 || filterObj.targetPalantirPresent) criteria.push("<b>Names:</b> " + (filterObj.targetPalantirPresent ? [...filterObj.names, "Palantir Users"] : filterObj.names).join(", "));
                    if (!isNaN(filterObj.targetRound)) criteria.push("<b>Round:</b> " + filterObj.targetRound + (filterObj.targetRoundModifier ? filterObj.targetRoundModifier : ""));
                    if (!isNaN(filterObj.targetScore)) criteria.push("<b>Avg Score:</b> " + filterObj.targetScore + (filterObj.targetScoreModifier ? filterObj.targetScoreModifier : ""));
                    if (!isNaN(filterObj.targetCount)) criteria.push("<b>Players:</b> " + filterObj.targetCount + (filterObj.targetCountModifier ? filterObj.targetCountModifier : ""));
                    if (criteria.length > 0) humanCriterias.push(criteria.join(" & "));
                }
            });
            // create search modal 
            let searchParamsHuman = (humanCriterias.join("<br>or<br>") != "" ?
                "Search Criteria:<br>" + humanCriterias.join("<br>or<br>") : "<b>Whoops,</b> You didn't set any filters.");
            let modalCont = elemFromString("<div style='text-align:center'><h4>" + searchParamsHuman + "</h4><span id='skippedPlayers'>Skipped:<br></span><br><h4>Click anywhere to cancel</h4><div>");
            let modal = new Modal(modalCont, () => {
                lobbies_.searchData.searching = false;
            }, "Searching for filter match:", "40vw", "15em");
            let skippedPlayers = [];
            lobbies_.startSearch(() => {
                lobbies_.lobbyProperties.Players.forEach(p => {
                    if (skippedPlayers.indexOf(p.Name) < 0 && p.Name != socket.clientData.playerName) {
                        skippedPlayers.push(p.Name);
                        modalCont.querySelector("#skippedPlayers").innerHTML += " [" + p.Name + "] <wbr>";
                    }
                });
                let lobby = lobbies_.lobbyProperties;
                return filters.length <= 0 || filters.some(filter => filter.matchAll(lobby)); 
            }, () => {
                leaveLobby(true);
            }, () => {
                modal.close();
            });
        }
        // start search on play button
        QS("#formLogin button[type=submit].btn.btn-success").addEventListener("click", () => {
            // if filters enabled
            if (containerFilters.style.display != "none") uiTweaks.startFilterSearch();
        });
    },
    initAccessibility: () => {
        // Keep freespace, but remove content for for bigger chat window
        const containerFreespace = document.querySelector('#containerFreespace');
        containerFreespace.innerHTML = '';
        
        // Word count next to the word
        const currentWord = document.querySelector('#currentWord');
        const currentWordSize = document.createElement('div');
        currentWordSize.id = 'wordSize';
        if(localStorage.charBar != "true") currentWordSize.style.visibility = "hidden";
        currentWord.parentNode.insertBefore(currentWordSize, currentWord.nextSibling);
        const wordObserver = new MutationObserver(m => {
            let wordCount = currentWord.innerText;
            if (wordCount) {
                wordCount = wordCount.split(' ');
                wordCount.forEach((v, i, a) => a[i] = v.replaceAll('-', '').length);
                currentWordSize.innerHTML = `&nbsp;(${wordCount.join(',')})`;
            } else {
                currentWordSize.innerHTML = '';
            }
        });
        wordObserver.observe(currentWord, { childList: true, });
        
        // Create tooltips
        // remove original votekick tooltip
        QS("#containerPlayerlist .tooltip-wrapper").setAttribute("data-toggle", "");
        const tooltips = Array.from(document.querySelectorAll('[data-toggle="tooltip"], .colorPreview, #restore, #votekickCurrentPlayer, #saveDrawingOptions, #controls [style*="tablet.gif"],#controls [style*="fullscreen.gif"], #controls [style*="cloud.gif"], #controls [style*="visuals.gif"]'));
        tooltips.forEach((v, i, a) => {
            if (v.matches('.colorPreview:not(#colPicker)')) {
                v.setAttribute('title', 'Color preview (click for magic)');
            } else if (v.matches('#colPicker')) {
                v.setAttribute('title', 'Color picker (click to pick)');
            } else if (v.matches('.containerColorbox')) {
                v.setAttribute('title', 'Select a color (0-9)');
            } else if (v.matches('.containerBrushSizes')) {
                v.setAttribute('title', 'Set brush size (1-4)');
            } else if (v.matches('#buttonClearCanvas')) {
                v.setAttribute('title', 'Clear the board (ESC)');
            } else if (v.matches('#restore')) {
                v.setAttribute('title', 'Undo (Ctrl+Z)');
            } else if (v.matches('#votekickCurrentPlayer')) {
                v.setAttribute('title', 'Votekick the current player if they are misbehaving');
            } else if (v.matches('#saveDrawingOptions')) {
                v.setAttribute('title', 'Save the current drawing to re-use it later');
            } else if (v.matches('#controls [style*="tablet.gif"]')) {
                v.setAttribute('title', 'Set the graphics tablet pressure mode');
            } else if (v.matches('#controls [style*="visuals.gif"]')) {
                v.setAttribute('title', 'Customize how skribbl.io looks like');
            } else if (v.matches('#controls [style*="cloud.gif"]')) {
                v.setAttribute('title', 'Access all images in the cloud');
            } else if(v.matches('#controls [style*="fullscreen.gif"]')) {
            v.setAttribute('title', 'Toggle fullscreen mode');
            }
            a[i] = buildTooltip(v);
        });
        document.body.dispatchEvent(newCustomEvent('tooltip', { detail: { selector: '[data-typo-tooltip]' }}));
    },
    initDefaultKeybinds: () => {
        const chatInput = document.querySelector('#inputChat');
        document.addEventListener('keydown', e => {
            if (!document.activeElement.matches("input[type='text']")) {
                // Undo
                if (e.key === 'z' && e.ctrlKey) {
                    e.preventDefault();
                    captureCanvas.restoreDrawing(1);
                    return;
                }
                // Focus chat
                if (e.key === 'Tab' && !(e.altKey || e.ctrlKey || e.shiftKey)) {
                    e.preventDefault();
                    chatInput.focus();
                    return;
                }
            }
            else if (document.activeElement.id == "inputChat" && e.key === 'Tab' && !(e.altKey || e.ctrlKey || e.shiftKey)) e.preventDefault();
        });
    },
    initLobbyRestriction: () => {
        let timer = QS(".timer-container");
        let restrict = elemFromString("<div id='restrictLobby' style='position:relative;display:none;flex: 0 0 auto;cursor:pointer; user-select: none; width:48px; height:48px; background: center no-repeat'></div>");
        timer.parentElement.insertBefore(restrict, timer);
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
                    if (lobbies_.joined && lobbies_.userAllow) { // report lobby if joined
                        let description = lobbies_.lobbyProperties.Private ? (QS("#lobbyDesc").value ? QS("#lobbyDesc").value : '') : "";
                        await socket.setLobby(lobbies_.lobbyProperties, lobbies_.lobbyProperties.Key, description);
                    }
            }, "Lobby Privacy");
            if (localStorage.restrictLobby == "restricted") modal.content.querySelector("#restricted").setAttribute("checked", "checked");
            else if (localStorage.restrictLobby == "unrestricted") modal.content.querySelector("#unrestricted").setAttribute("checked", "checked");
            else if(localStorage.restrictLobby != ""){
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
        cursor: not-allowed;
        user-select: none;
        display:none;
        outline: none;
    ">
    <style>
        #quickreact > span {
            background: white;
            border-radius: .5em;
            padding: .5em;
            color: black;
            font-weight: 600;
        }
    </style>
    <span>⬅️Close</span><span>⬆️Like</span><span>⬇️Shame</span><span>➡️Kick</span></div>`);
        QS("#boxChat").appendChild(react);
        let chatinput = QS("#inputChat");
        chatinput.addEventListener("keyup", (e) => {
            if (e.which == 37 && react.style.display == "none") {
                react.style.display = "flex";
                react.focus();
            }
            else if (e.which == 37 && react.style.display == "flex") {
                react.style.display = "none";
            }
        });
        react.addEventListener("focusout", () => react.style.display = "none");
        react.addEventListener("keyup", (e) => {
            e.bubbles = false;
            if (e.which == 38) { // up
                performCommand(cmd_like);
            }
            else if (e.which == 39) { // right
                performCommand(cmd_votekick);
            }
            else if (e.which == 40) { // down
                performCommand(cmd_dislike);
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
">Copy chat selection for Discord</div>`);
        popup.style.display = "none";
        const chatbox = QS("#boxChat");
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
            navigator.clipboard.writeText("```diff\n" + chat + "\n```");
            document.getSelection().removeAllRanges();
            new Toast("Copied chat to clipboard!", 1000);
        });
        document.addEventListener("selectionchange", () => {
            const selection = document.getSelection();
            if (selection.toString() != "" && chatbox.contains(selection.anchorNode)) popup.style.display = "";
            else setTimeout(()=>popup.style.display = "none", 20);
        });
        QS("#containerChat").appendChild(popup);
    },
    initAll: () => {
        // clear ads for space 
        //document.querySelectorAll(".adsbygoogle").forEach(a => a.style.display = "none");
        //document.querySelectorAll('a[href*="tower"]').forEach(function (ad) { ad.remove(); });
        // mel i love you i'd never do this
        uiTweaks.initGameNavigation();
        uiTweaks.initWordHint();
        uiTweaks.initBackbutton();
        uiTweaks.initRandomColorDice();
        uiTweaks.initColorPicker();
        uiTweaks.initCanvasZoom();
        uiTweaks.initColorPalettes();
        uiTweaks.initLobbyDescriptionForm();
        uiTweaks.initMarkMessages();
        uiTweaks.initLobbyChat();
        uiTweaks.initLobbyFilters();
        uiTweaks.initLobbyRestriction();
        uiTweaks.initQuickReact();
        uiTweaks.initSelectionFormatter();
        //uiTweaks.initRicardoSpecial();
        document.addEventListener("copyToClipboard", async () => {
            if (QS("#screenGame").style.display == "none" || document.getSelection().type == "Range") return;
            let canvas = QS("#canvasGame");
            let scaled = await scaleDataURL(canvas.toDataURL(), canvas.width * localStorage.qualityScale, canvas.height * localStorage.qualityScale);
            await dataURLtoClipboard(scaled);
            new Toast("Copied image to clipboard.", 1500);
        });
        uiTweaks.initSideControls();
        uiTweaks.initAccessibility();
        // add bar that indicates left word choose time; class is added and removed in gamejs when choosing begins
        QS("#overlay").insertAdjacentHTML("beforeBegin",
            "<style>#overlay::after {content: '';position: absolute;top: 0;left: 0;width: 100%;}#overlay.countdown::after{background: lightgreen;height: .5em;transition: width 15s linear;width: 0;}</style>");
        uiTweaks.initDefaultKeybinds();
        if (localStorage.gamemodes == "true") gamemode.init();
        if (localStorage.keybinds == "true") keybind.init();
        if(Math.random() < 0.1) QS("#inputChat").placeholder = "Typo your guess here...";
    }
}