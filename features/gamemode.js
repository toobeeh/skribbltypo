const gamemodes = {
    modes: [
        {
            name: "Blind Guess",
            options: {
                description: "The canvas is hidden - you don't see what people draw!",
                init: () => {
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-canvas canvas").style.opacity = 1;
                },
                observeSelector: "#game-players .players-list",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update opacity based on self drawing or not
                    QS("#game-canvas canvas").style.opacity = QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ? 1 : 0;
                }
            }
        },{
            name: "Drunk Vision",
            options: {
                description: "The canvas is blurred - you can only vaguely see what people draw!",
                init: () => {
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-canvas canvas").style.filter = "";
                },
                observeSelector: "#game-players .players-list",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update filter based on self drawing or not
                    QS("#game-canvas canvas").style.filter = QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ? "" : "blur(20px)";
                }
            }
        }, {
            name: "Deaf Guess",
            options: {
                description: "Every chat input is blurred and you can't see hints.",
                init: () => {
                    // add mod stylesheed
                    QS("#game-chat .chat-container ").appendChild(elemFromString(`<style id="gamemodeDeafRules"></style>`));
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-chat .chat-container style#gamemodeDeafRules")?.remove()
                },
                observeSelector: "#game-players .players-list",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update message blur based on self drawing / guessed or not
                    QS("#game-chat .chat-container style#gamemodeDeafRules").innerHTML =
                        (QS(".player-name.me").closest(".player.guessed")) || QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ?
                            "" : "#game-chat .chat-container .chat-content > p > span:not(:empty) {filter: grayscale(1) blur(4px) opacity(0.8);} #game-word {opacity:0} .player .player-bubble {display:none !important} .characters{color:black !important}";
                }
            }
        }, {
            name: "One Shot",
            options: {
                description: "You have only one try to guess the word!",
                init: () => {
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-chat .chat-container form input").disabled = false;
                },
                observeSelector: "#game-chat .chat-container .chat-content",
                observeOptions: {
                    childList: true
                },
                observeAction: () => {
                    const someoneDrawing = QS(".drawing[style*=block]") ? true : false;
                    const selfDrawing = QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ? true : false;
                    const selfGuessed = QS(".player-name.me").closest(".player.guessed");
                    if (selfDrawing || selfGuessed || !someoneDrawing) {
                        // everything fine, you can type
                        QS("#game-chat .chat-container form input").disabled = false;
                    }
                    else {
                        let chat = QS("#game-chat .chat-container .chat-content").innerHTML;
                        // if someone else is drawing
                        let lastDrawingIndex = chat.lastIndexOf("is drawing now!</b>");
                        if (lastDrawingIndex < 0) lastDrawingIndex = 0;
                        chat = chat.substr(lastDrawingIndex);
                        const selfName = QS(".player-name.me").innerText.replace("(You)", "").trim();
                        let regHasGuessed = new RegExp("is drawing now!</b>[\\s\\S]*(?:>" + selfName + ": </b>)", "g");
                        let regIsRevealed = new RegExp(/is drawing now!<\/b >[\s\S]*;\\">The word was/g);
                        if (regHasGuessed.test(chat) && !regIsRevealed.test(chat)) {
                            // you guessed already & word is not revealed!
                            QS("#game-chat .chat-container form input").disabled = true;
                        }
                        else {
                            // you guessed, but word was revealed. u lost anyway :)
                            QS("#game-chat .chat-container form input").disabled = false;
                        }
                    }
                }
            }
        }, {
            name: "Don't Clear",
            options: {
                description: "The canvas won't clear - you draw over the previous images!",
                init: () => {
                    QS(".toolbar-group-actions").style.cssText = "pointer-events:none;opacity:.5;";
                    this.restoreCanvas = (event) => {
                        const img = new Image;
                        img.onload = () => QS("#game-canvas canvas").getContext("2d").drawImage(img, 0, 0);
                        img.src = event.detail;
                        img.crossOrigin = "anonymous"
                    }
                    document.addEventListener("logCanvasClear", this.restoreCanvas);
                },
                initWithAction: false,
                destroy: () => {
                    QS(".toolbar-group-actions").style.cssText = "";
                    document.removeEventListener("logCanvasClear", this.restoreCanvas);
                },
                observeSelector: "#game-canvas canvas",
                observeOptions: {
                    childList: true
                },
                observeAction: () => {

                }
            }
        }, {
            name: "Monochrome",
            options: {
                description: "You can only choose between shades of a random color.",
                init: () => {
                    QS("#game-toolbar").appendChild(elemFromString(`<style id="gamemodeMonochromeRules"></style>`));
                    //brushtools.groups.color.brightness.disable();
                    //brushtools.groups.color.rainbow.disable();
                    brushtools.groups.color.rainbowcircle.disable()
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-toolbar style#gamemodeMonochromeRules")?.remove()
                    QS("#randomColor")?.setAttribute("data-monochrome", "");
                },
                observeSelector: "#game-toolbar",
                observeOptions: {
                    attributes: true
                },
                observeAction: () => {
                    const itemWidth = getComputedStyle(QS("#game-toolbar div.color-picker > div.colors:not([style*=none]) > div > div")).width;
                    const itemCount = QS("#game-toolbar div.color-picker > div.colors:not([style*=none]) > div").children.length;
                    const randomIndex = Math.round(Math.random() * (itemCount - 1)) + 1;
                    QS("#game-canvas").setAttribute("data-monochrome", randomIndex);
                    QS("#game-toolbar style#gamemodeMonochromeRules").innerHTML =
                        QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ?
                            `#game-toolbar div.color-picker > div.colors > div > div.color:not(:nth-child(${randomIndex}))
                            {display:none;}
                         #colPicker{display:none;}
                         #game-toolbar div.color-picker > div.colors > div > div.color:nth-child(${randomIndex}) {width:calc(${itemCount} * ${itemWidth});}` : "";
                }
            }
        }
    ],
    modesPopout: null,
    setup: () => {
        // add gamemodes button
        const modesButton = elemFromString(`<img src="${chrome.runtime.getURL("res/noChallenge.gif")}" id="gameModes" style="cursor: pointer;"  data-typo-tooltip="Challenges" data-tooltipdir="N">`);
        // add gamemode options popup
        const modesPopout = elemFromString(`<div id="gamemodePopup" tabIndex="-1" style="display:none">
Challenges
<br><br>
    <div>
    </div>
</div>`);
        gamemodes.modesPopout = modesPopout;
        imageOptions.optionsContainer.appendChild(modesPopout);
        imageOptions.optionsContainer.appendChild(modesButton);
        // init popupevents
        modesButton.addEventListener("click", () => {
            modesPopout.style.display = "";
            modesPopout.focus();
        });
        Array.from(modesPopout.children).concat(modesPopout).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!modesPopout.contains(document.activeElement)) modesPopout.style.display = "none" }, 20); }));
        // init mode toggles
        gamemodes.modes.forEach(mode => {
            const modeObserver = new MutationObserver(mode.options.observeAction);
            const modeToggle = elemFromString(`<div><label for="mode_toggle${mode.name}">
                                                    <input type="checkbox" id="mode_toggle${mode.name}" class="flatUI small">
                                                    <span>${mode.name}</span>
                                                </label><span class="small">${mode.options.description}</span><br><br></div>`);
            modeToggle.addEventListener("change", (e) => {
                if (e.target.checked === true) {
                    modesButton.src = chrome.runtime.getURL("res/challenge.gif");
                    mode.options.init();
                    if (mode.options.initWithAction) mode.options.observeAction();
                    modeObserver.observe(QS(mode.options.observeSelector), mode.options.observeOptions);
                }
                else {
                    if (!modesPopout.querySelector("input:checked")) modesButton.src = chrome.runtime.getURL("res/noChallenge.gif");
                    mode.options.destroy();
                    modeObserver.disconnect();
                }
            });
            modesPopout.querySelector("div").insertAdjacentElement("beforeend", modeToggle);
        });
    }
};
