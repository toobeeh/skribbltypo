// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// adds all smaller ui improvements to skribbl
// depends on: capture.js, generalFunctions.js, emojis.js
let uiTweaks = {
    initGameNavigation: () => {
        // Create next button
        let btNext = document.createElement("input");
        btNext.type = "button";
        btNext.value = "Next Lobby";
        btNext.classList.add("btn", "btn-info", "btn-block");
        btNext.style.margin = "0 0.5em";
        btNext.addEventListener("click", () => {
            let modal = new Modal(elemFromString("<h3>Click anywhere to cancel</h3>"), () => {
                lobbies_.searchData.searching = false;
            }, "Searching next lobby...", "30vw", "10em");
            lobbies_.startSearch(() => {
                return lobbies_.lobbyProperties.Players.length > 1;
            }, () => {
                setTimeout(() => leaveLobby(true), 100);
            }, () => {
                modal.close();
            });
            leaveLobby(true);
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
        td.innerHTML = "<div id=\"info\"\ style='color:black !important'></div><div id=\"emojiPrev\"\ style='z-index: 10; display:none; padding: .5em;box-shadow: black 1px 1px 9px -2px;position: absolute;bottom: 5em;background: white;border-radius: 0.5em;'></div>";
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
        //let sketchfulPalette = '{"rowCount":13, "name":"sketchfulPalette", "colors":[{"color":"rgb(255, 255, 255)","index":100},{"color":"rgb(211, 209, 210)","index":101},{"color":"rgb(247, 15, 15)","index":102},{"color":"rgb(255, 114, 0)","index":103},{"color":"rgb(252, 231, 0)","index":104},{"color":"rgb(2, 203, 0)","index":105},{"color":"rgb(1, 254, 148)","index":106},{"color":"rgb(5, 176, 255)","index":107},{"color":"rgb(34, 30, 205)","index":108},{"color":"rgb(163, 0, 189)","index":109},{"color":"rgb(204, 127, 173)","index":110},{"color":"rgb(253, 173, 136)","index":111},{"color":"rgb(158, 84, 37)","index":112},{"color":"rgb(81, 79, 84)","index":113},{"color":"rgb(169, 167, 168)","index":114},{"color":"rgb(174, 11, 0)","index":115},{"color":"rgb(200, 71, 6)","index":116},{"color":"rgb(236, 158, 6)","index":117},{"color":"rgb(0, 118, 18)","index":118},{"color":"rgb(4, 157, 111)","index":119},{"color":"rgb(0, 87, 157)","index":120},{"color":"rgb(15, 11, 150)","index":121},{"color":"rgb(110, 0, 131)","index":122},{"color":"rgb(166, 86, 115)","index":123},{"color":"rgb(227, 138, 94)","index":124},{"color":"rgb(94, 50, 13)","index":125},{"color":"rgb(0, 0, 0)","index":126},{"color":"rgb(130, 124, 128)","index":127},{"color":"rgb(87, 6, 12)","index":128},{"color":"rgb(139, 37, 0)","index":129},{"color":"rgb(158, 102, 0)","index":130},{"color":"rgb(0, 63, 0)","index":131},{"color":"rgb(0, 118, 106)","index":132},{"color":"rgb(0, 59, 117)","index":133},{"color":"rgb(14, 1, 81)","index":134},{"color":"rgb(60, 3, 80)","index":135},{"color":"rgb(115, 49, 77)","index":136},{"color":"rgb(209, 117, 78)","index":137},{"color":"rgb(66, 30, 6)","index":138}]}'
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
                + ")'></div><h4>Thickness</h4></div>");
            modeThickness.addEventListener("click", () => localStorage.ink == "true" ?
                performCommand("inkmode thickness") :
                performCommand("enable ink") || performCommand("inkmode thickness"));

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

            let options = elemFromString("<div style='display:flex; width:100%; height: min-content; flex-direction:row; justify-content: space-evenly'></div>");
            options.appendChild(elemFromString("<style>.tabletOption:hover{background:#00000040}.tabletOption{transition: background 0.2s;display:flex; margin:.5em; padding:.5em; flex-direction: column; align-items: center; justify-items: center; background: #00000026; cursor: pointer; border-radius: .5em;}</style>"));
            options.append(modeNone, modeThickness, modeBrightness, modeDegree, modeBrightnessDegree);
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
    initAccessibility: () => {
        // Keep freespace, but remove content for for bigger chat window
        const containerFreespace = document.querySelector('#containerFreespace');
        containerFreespace.innerHTML = '';
        
        // Word count next to the word
        const currentWord = document.querySelector('#currentWord');
        const currentWordSize = document.createElement('div');
        currentWordSize.id = 'wordSize';
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
        const tooltips = Array.from(document.querySelectorAll('[data-toggle="tooltip"], .colorPreview, #restore'));
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
            }
            a[i] = buildTooltip(v);
        });
        document.body.dispatchEvent(newCustomEvent('tooltip', { detail: { selector: '[data-typo-tooltip]' }}));
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
    }
}