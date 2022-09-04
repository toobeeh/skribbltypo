// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// creates a dialogue to save and re-draw drawings on the skribbl canvas
// depends on: capture.js, generalFunctions.js
let imageTools = {
    optionsPopup: null,
    initImageOptionsButton: () => {
        // add image options button
        const toolsIcon = elemFromString(`<img src="${chrome.runtime.getURL("res/potion.gif")}" id="imgTools" style="cursor: pointer;" data-typo-tooltip="Image Tools" data-tooltipdir="N">`);
        imageOptions.optionsContainer.appendChild(toolsIcon);

        toolsIcon.addEventListener("click", () => {
            imageTools.optionsPopup.style.display = "";
            if (!localStorage.imageTools) {
                alert("'Image tools' allow you to save drawings so they can be re-drawn in skribbl.\nUse the blue button to copy an image on fly or download and open images with the orange buttons.\nWhen you're drawing, you can paste them by clicking the green buttons.\nDO NOT TRY TO ANNOY OTHERS WITH THIS.");
                localStorage.imageTools = "READ IT";
            };
            imageTools.optionsPopup.focus();
            [...document.querySelectorAll("#itoolsButtons button")].forEach(p => {
                if (QS("#game-toolbar.hidden")) {
                    p.classList.remove("green");
                    p.classList.remove("orange");
                    p.style.pointerEvents = "none";
                }
                else {
                    p.classList.add("green");
                    p.classList.remove("orange");
                    p.style.pointerEvents = "";
                }
            });
        });
    },
    initImageOptionsPopup: () => {
        // add image options popup
        let optionsPopup = elemFromString(`<div id="optionsPopup" tabIndex="-1" style="display:none">
Image tools
    <button class="flatUI blue air" id="itoolsTempSave">Save current</button>
    <button class="flatUI orange air" id="itoolsDownload">Download current</button>
    <button class="flatUI orange air" id="itoolsLoad">Load file(s)</button>
    <button class="flatUI orange air" id="itoolsPasteImage">Paste image</button>
    <div id="itoolsButtons"></div>
    <button class="flatUI blue air" id="itoolsAbort">Abort</button>
    <label for="itoolsClearBefore">
        <input type="checkbox" id="itoolsClearBefore" class="flatUI small">
        <span>Clear before paste</span>
    </label>
</div>`);
        imageTools.optionsPopup = optionsPopup;
        imageOptions.optionsContainer.appendChild(optionsPopup);
        // func to add paste btn
        const addPasteCommandsButton = (commands, name) => {
            // if old actions format
            if (commands[0][0][0]) commands = convertActionsArray(commands);
            const btn = elemFromString(`<button class="flatUI orange green" id="itoolsDownload">📋${name}</button>`); 
            optionsPopup.querySelector("#itoolsButtons").appendChild(btn);
            btn.addEventListener("click", () => {
                if (QS("#itoolsClearBefore").checked)
                    QS("div.icon[style*='/img/clear.gif']").parentElement.dispatchEvent(new Event("click"));
                captureCanvas.drawOnCanvas(commands);
            });
            let removeToggle = 0;
            btn.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (removeToggle) {
                    optionsPopup.focus();
                    btn.remove();
                }
                else {
                    btn.innerText = "Repeat to remove";
                    removeToggle = setTimeout(() => {
                        removeToggle = null;
                        btn.innerText = "📋" + name;
                    }, 2000);
                }
            });
        }
        imageTools.addPasteCommandsButton = addPasteCommandsButton;
        // add temp save listener
        QS("#itoolsTempSave").addEventListener("click", () => {
            const commands = captureCanvas.capturedCommands;
            const name = getCurrentOrLastDrawer() + getCurrentWordOrHint();
            addPasteCommandsButton(commands, name);
        });
        // add skd save listener
        QS("#itoolsDownload").addEventListener("click", () => {
            const commands = captureCanvas.capturedCommands;
            const content = JSON.stringify(commands);
            const name = getCurrentOrLastDrawer() + getCurrentWordOrHint();
            let dl = document.createElement('a');
            dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            dl.setAttribute('download', name + ".skd");
            dl.style.display = 'none';
            document.body.appendChild(dl);
            dl.click();
            document.body.removeChild(dl);
            addPasteCommandsButton(commands, name);
        });
        // add load skd listener
        QS("#itoolsLoad").addEventListener("click", () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = ".skd";
            fileInput.multiple = "multiple"
            fileInput.onchange = e => {
                for (var file_counter = 0; file_counter < e.target.files.length; file_counter++) {
                    let file = e.target.files[file_counter];
                    let reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = readerEvent => {
                        actions = readerEvent.target.result;
                        imageTools.addSKD(actions, file.name);
                    }

                }
            }
            fileInput.click();
        });
        // add abort listener
        QS("#itoolsAbort").addEventListener("click", () => {
            captureCanvas.abortDrawingProcess = true;
        });

        // EXPERIMENTAL
        QS("#itoolsPasteImage").addEventListener("click", () => {
            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = ".png";
            fileInput.onchange = e => {
                let dummyimg = new Image();
                dummyimg.onload = () => {
                    let canvas = QS("#game-canvas canvas");
                    let pressedKeys = [];
                    let trackPress = (e) => e.type == "keydown" ? pressedKeys.push(e.key) : pressedKeys = pressedKeys.filter(k => k != e.key);
                    canvas.addEventListener("pointerdown", (e) => {
                        if (pressedKeys.some(k => k == "1")) {
                            canvas.getContext("2d").drawImage(dummyimg, e.layerX, e.layerY);
                            stoptrack();
                        }
                        else if (pressedKeys.some(k => k == "2")) {
                            let firstClick = { x: e.layerX, y: e.layerY };
                            canvas.addEventListener("pointerdown", (e) => {
                                let aspect = dummyimg.width / dummyimg.height;
                                let clickwidth = e.layerX - firstClick.x;
                                let clickheight = e.layerY - firstClick.y;
                                let clickaspect = clickwidth / clickheight;
                                if (clickaspect > aspect) clickwidth = clickheight * aspect;
                                else clickheight = clickwidth * 1 / aspect;
                                canvas.getContext("2d").drawImage(dummyimg, firstClick.x, firstClick.y, clickwidth, clickheight);
                                stoptrack();
                            }, { once: true });
                        }
                        else if (pressedKeys.some(k => k == "3")) {
                            canvas.getContext("2d").drawImage(dummyimg, 0, 0, canvas.width, canvas.height);
                            stoptrack();
                        }
                        else {
                            canvas.getContext("2d").drawImage(dummyimg, 0, 0);
                            stoptrack();
                        }
                    }, { once: true });
                    document.addEventListener("keydown", trackPress);
                    document.addEventListener("keyup", trackPress);
                    let stoptrack = () => {
                        document.removeEventListener("keydown", trackPress);
                        document.removeEventListener("keyup", trackPress);
                    }
                    new Toast("Click the canvas to paste now. Options:<br>[1] pressed: draw on click position<br>[2] pressed: draw on area between two clicks<br>[3] pressed: draw on full canvas");
                }
                dummyimg.src = URL.createObjectURL(e.target.files[0]);
            }
            fileInput.click();
        });
        // -----------

        Array.from(optionsPopup.children).concat(optionsPopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!optionsPopup.contains(document.activeElement)) optionsPopup.style.display = "none" }, 20); }));
    },
    initAll: () => {
        imageTools.initImageOptionsButton();
        imageTools.initImageOptionsPopup();
    }
}
