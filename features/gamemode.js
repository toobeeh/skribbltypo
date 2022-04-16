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
                    QS("#canvasGame").style.opacity = 1;
                },
                observeSelector: "#containerPlayerlist",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update opacity based on self drawing or not - if currently player's name contains (you), canvas is shown
                    QS("#canvasGame").style.opacity = document.querySelector("#containerGamePlayers .drawing:not([style*=none])")?.closest(".player").querySelector(".name").textContent.indexOf("(You)") > 0 ? 1 : 0;
                }
            }
        }, {
            name: "Deaf Guess",
            options: {
                description: "Every chat input is blurred and you can't see hints.",
                init: () => {
                    // add mod stylesheed
                    QS("#boxMessages").appendChild(elemFromString(`<style id="gamemodeDeafRules"></style>`));
                },
                initWithAction: true,
                destroy: () => {
                    QS("#boxMessages style#gamemodeDeafRules")?.remove()
                },
                observeSelector: "#containerPlayerlist",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update message blur based on self drawing / guessed or not
                    QS("#boxMessages style#gamemodeDeafRules").innerHTML =
                        (QS("[me].guessedWord") || QS("[me]").querySelector(".drawing:not([style*=none])")) ?
                        "" : "#boxMessages > p > span:not(:empty) {filter: grayscale(1) blur(4px) opacity(0.8);} #game-word {opacity:0} .player .bubble {display:none !important}";
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
                    QS("#inputChat").disabled = false;
                },
                observeSelector: "#boxMessages",
                observeOptions: {
                    childList: true
                },
                observeAction: () => {
                    const someoneDrawing = QS(".drawing:not([style*=none])") ? true : false;
                    const selfDrawing = QS("[me]")?.querySelector(".drawing:not([style*=none])") ? true : false;
                    const selfGuessed = QS("[me].guessed") ? true : false;
                    if (selfDrawing || selfGuessed || !someoneDrawing) {
                        // everything fine, you can type
                        QS("#inputChat").disabled = false;
                    }
                    else {
                        let chat = QS("#boxMessages").innerHTML;
                        // if someone else is drawing
                        let lastDrawingIndex = chat.lastIndexOf("is drawing now!</span>");
                        if (lastDrawingIndex < 0) lastDrawingIndex = 0;
                        chat = chat.substr(lastDrawingIndex);
                        const selfName = QS("[me] .name").innerText.replace("(You)", "").trim();
                        let regHasGuessed = new RegExp("is drawing now!</span>.*(?:>" + selfName + ": <\/b>)", "g");
                        let regIsRevealed = new RegExp(/is drawing now!<\/b >.*;\\">The word was/g);
                        if (regHasGuessed.test(chat) && !regIsRevealed.test(chat)) {
                            // you guessed already & word is not revealed!
                            QS("#inputChat").disabled = true;
                        }
                        else {
                            // you guessed, but word was revealed. u lost anyway :)
                            QS("#inputChat").disabled = false;
                        }
                    }
                }
            }
        }, {
            name: "Don't Clear",
            options: {
                description: "The canvas won't clear - you draw over the previous images!",
                init: () => {
                    QS("#buttonClearCanvas").style.cssText = "cursor: pointer; pointer-events:none;opacity:.5;";
                    this.restoreCanvas = (event) => {
                        const img = new Image;
                        img.onload = () => QS("#canvasGame").getContext("2d").drawImage(img,0,0);
                        img.src = event.detail;
                    }
                    document.body.addEventListener("logCanvasClear", this.restoreCanvas);
                },
                initWithAction: false,
                destroy: () => {
                    QS("#buttonClearCanvas").style.cssText = "cursor: pointer; opacity: 1;";
                    document.body.removeEventListener("logCanvasClear", this.restoreCanvas);
                },
                observeSelector: "#canvasGame",
                observeOptions: {
                    childList: true
                },
                observeAction: () => {

                }
            }
        }, {
            name: "Monochrome",
            options: {
                description: "You can only choose between three random color shades.",
                init: () => {
                    QS(".containerToolbar").appendChild(elemFromString(`<style id="gamemodeMonochromeRules"></style>`));
                    //brushtools.groups.color.brightness.disable();
                    //brushtools.groups.color.rainbow.disable();
                },
                initWithAction: true,
                destroy: () => {
                    QS(".containerToolbar style#gamemodeMonochromeRules")?.remove()
                    QS("#randomIcon").setAttribute("data-monochrome", "");
                },
                observeSelector: ".containerToolbar",
                observeOptions: {
                    attributes: true,
                    childList: true
                },
                observeAction: () => {
                    const itemWidth = getComputedStyle(QS(".containerToolbar .containerColorbox:not([style*=none])")).width;
                    const itemCount = QS(".containerToolbar .containerColorbox:not([style*=none]) > div").children.length;
                    const randomIndex = Math.round(Math.random() * (itemCount - 1)) + 1;

                    // activate color
                    QS(`.containerToolbar .containerColorbox .containerColorColumn div.colorItem:nth-child(${randomIndex})`).click();

                    QS("#randomIcon").setAttribute("data-monochrome", randomIndex);
                    QS(".containerToolbar style#gamemodeMonochromeRules").innerHTML =
                        `.containerToolbar .containerColorbox .containerColorColumn div.colorItem:not(:nth-child(${randomIndex}))
                            {display:none;}
                         #colPicker{display:none !important;}
                         .containerToolbar .containerColorbox .containerColorColumn div.colorItem:nth-child(${randomIndex}) {width:calc(${1} * ${itemWidth});}`;
                }
            }
        }
    ],
    modesPopout: null,
    setup: () => {
        // add gamemodes button
        const modesButton = elemFromString(`<img src="${chrome.runtime.getURL("res/noChallenge.gif")}" id="gameModes" style="cursor: pointer;">`);
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
                                                </label><br><span class="small">${mode.options.description}</span><br><br></div>`);
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
