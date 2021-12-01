// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// creates a dialogue to save and re-draw drawings on the skribbl canvas
// depends on: capture.js, generalFunctions.js
let imageTools = {
    optionsPopup: null,
    initImageOptionsButton: () => {
        // add image options button
        let optionsButton = document.createElement("button");
        QS("#containerPlayerlist div.tooltip-wrapper").appendChild(optionsButton);
        QS("#containerPlayerlist div.tooltip-wrapper").setAttribute("data-original-title", "");

        optionsButton.classList = "btn btn-info btn-block";
        optionsButton.id = "saveDrawingOptions";
        optionsButton.innerText = "Image tools";
        optionsButton.addEventListener("click", () => {
            if (!localStorage.imageTools) {
                alert("'Image tools' allow you to save drawings so they can be re-drawn in skribbl.\nUse the blue button to copy an image on fly or download and open images with the orange buttons.\nWhen you're drawing, you can paste them by clicking the green buttons.\nDO NOT TRY TO ANNOY OTHERS WITH THIS.");
                localStorage.imageTools = "READ IT";
            };
            QS("#popupPasteImage").style.display = sessionStorage.practise == "true" ? "" : "none";
            QS("#saveDrawingPopup").style.display = "block";
            QS("#saveDrawingPopup").style.top = "calc(100% - 2em - " + document.querySelector("#saveDrawingPopup").offsetHeight + "px)";
            imageTools.optionsPopup.children[0].focus();
            [...document.querySelectorAll(".pasteSaved")].forEach(p => {
                if (document.querySelector(".containerToolbar").style.display == "none") {
                    p.classList.remove("btn-success");
                    p.classList.add("btn-secondary");
                    p.style.pointerEvents = "none";
                }
                else {
                    p.classList.add("btn-success");
                    p.classList.remove("btn-secondary");
                    p.style.pointerEvents = "";
                }
            });
        });
    },
    addSKD: null,
    initImageOptionsPopup: () => {
        // add image options popup
        let optionsPopup = document.createElement("div");
        QS("#containerPlayerlist").appendChild(optionsPopup);
        optionsPopup.style.position = "absolute";
        optionsPopup.style.background = "white";
        optionsPopup.style.overflow = "hidden";
        optionsPopup.style.zIndex = "5";
        optionsPopup.style.width = "90%";
        optionsPopup.style.padding = "1em;";
        optionsPopup.style.borderRadius = ".5em";
        optionsPopup.style.marginLeft = "5%";
        optionsPopup.style.boxShadow = "1px 1px 9px -2px black";
        optionsPopup.style.display = "none";
        optionsPopup.style.minHeight = "15%";
        optionsPopup.style.padding = "1em";
        optionsPopup.id = "saveDrawingPopup";
        optionsPopup.tabIndex = "-1";
        imageTools.optionsPopup = optionsPopup;

        let popupTempSaveCommands = document.createElement("button");
        optionsPopup.appendChild(popupTempSaveCommands);
        popupTempSaveCommands.classList = "btn btn-info btn-block";
        popupTempSaveCommands.innerText = "Save current";
        popupTempSaveCommands.addEventListener("click", () => {
            let originalActions = captureCanvas.getCapturedActions();
            // get last canvas clear index
            let clear = originalActions.length - 1;
            while (originalActions[clear][0] != 3) clear--;
            let popupCustomSaved = document.createElement("button");
            popupCustomSaved.classList = "btn btn-success btn-block pasteSaved";
            if (document.querySelector(".containerToolbar").style.display == "none") {
                popupCustomSaved.classList.remove("btn-success");
                popupCustomSaved.classList.add("btn-secondary");
                popupCustomSaved.style.pointerEvents = "none";
            }
            let actions = [...originalActions.slice(clear)];
            let drawer = getCurrentOrLastDrawer();
            let name = prompt("How would you like to name the drawing?", drawer);
            if (!name) return;
            sessionStorage.lastWord = name;
            document.body.dispatchEvent(newCustomEvent("drawingFinished"));
            new Toast("Saved all image data on the typo gallery cloud.");
            optionsPopup.appendChild(popupCustomSaved);
            popupCustomSaved.innerText = name;
            let removeToggle = null;
            popupCustomSaved.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (removeToggle) {
                    popupCustomSaved.remove();
                }
                else {
                    popupCustomSaved.innerText = "Repeat to remove";
                    removeToggle = setTimeout(() => {
                        removeToggle = null;
                        popupCustomSaved.innerText = name;
                    }, 2000);
                }
            });
            popupCustomSaved.addEventListener("click", (e) => {
                captureCanvas.drawOnCanvas(actions);
                captureCanvas.capturedActions = [...actions];
            });
            document.querySelector("#saveDrawingPopup").style.top = "calc(100% - 2em - " + document.querySelector("#saveDrawingPopup").offsetHeight + "px)";
        });

        let popupSaveCommands = document.createElement("button");
        optionsPopup.appendChild(popupSaveCommands);
        popupSaveCommands.classList = "btn btn-warning btn-block ";
        popupSaveCommands.innerText = "Download current";
        popupSaveCommands.addEventListener("click", () => {
            let originalActions = captureCanvas.getCapturedActions();
            let clear = originalActions.length - 1;
            while (originalActions[clear][0] != 3) clear--;
            if (originalActions.length < 1 || originalActions[0][0] == 3 && originalActions.length == 1) { alert("Error capturing drawing data :("); return; }
            let content = JSON.stringify([...originalActions.slice(clear)]);
            let dl = document.createElement('a');
            dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            let name = prompt("What name should the drawing be saved under?", "niceDrawing");
            if (!name) return;
            name = name + ".skd";
            dl.setAttribute('download', name);
            dl.style.display = 'none';
            document.body.appendChild(dl);
            dl.click();
            document.body.removeChild(dl);
            let popupCustomSaved = document.createElement("button");
            optionsPopup.appendChild(popupCustomSaved);
            popupCustomSaved.classList = "btn btn-success btn-block";
            let actions = [...originalActions.slice(clear)];
            popupCustomSaved.innerText = dl.getAttribute("download");
            popupCustomSaved.addEventListener("click", () => {
                captureCanvas.drawOnCanvas(actions);
                captureCanvas.capturedActions = [...actions];
            });
        });

        let popupPasteSavedCommands = document.createElement("button");
        optionsPopup.appendChild(popupPasteSavedCommands);
        popupPasteSavedCommands.id = "saveDrawingPopupPasteSaved";
        popupPasteSavedCommands.classList = "btn btn-warning btn-block";
        popupPasteSavedCommands.innerText = "Load file";
        imageTools.addSKD = (actions, name) => {
            let popupCustomSaved = document.createElement("button");
            optionsPopup.appendChild(popupCustomSaved);
            //popupCustomSaved.style.display = document.querySelector(".containerToolbar").style.display
            popupCustomSaved.classList = "btn btn-success btn-block pasteSaved";
            if (document.querySelector(".containerToolbar").style.display == "none") {
                popupCustomSaved.classList.remove("btn-success");
                popupCustomSaved.classList.add("btn-secondary");
                popupCustomSaved.style.pointerEvents = "none";
            }
            popupCustomSaved.innerText = name;
            let removeToggle = null;
            popupCustomSaved.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (removeToggle) {
                    popupCustomSaved.remove();
                }
                else {
                    popupCustomSaved.innerText = "Repeat to remove";
                    removeToggle = setTimeout(() => {
                        removeToggle = null;
                        popupCustomSaved.innerText = name;
                    }, 2000);
                }
            });
            popupCustomSaved.addEventListener("click", () => {
                captureCanvas.drawOnCanvas(JSON.parse(actions));
                captureCanvas.capturedActions = JSON.parse(actions);
            });
            document.querySelector("#saveDrawingPopup").style.top = "calc(100% - 2em - " + document.querySelector("#saveDrawingPopup").offsetHeight + "px)";
        };
        popupPasteSavedCommands.addEventListener("click", () => {
            let fileInput = document.createElement('input');
            let actions;
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

        // EXPERIMENTAL
        let popupPasteImage = document.createElement("button");
        optionsPopup.appendChild(popupPasteImage);
        popupPasteImage.id = "popupPasteImage";
        popupPasteImage.classList = "btn btn-warning btn-block";
        popupPasteImage.innerText = "Paste Image";
        popupPasteImage.addEventListener("click", () => {
            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = ".png";
            fileInput.onchange = e => {
                let dummyimg = new Image();
                dummyimg.onload = () => {
                    let canvas = QS("#canvasGame");
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

        let popupAbort = document.createElement("button");
        optionsPopup.appendChild(popupAbort);
        popupAbort.id = "abortDrawing";
        popupAbort.classList = "btn btn-danger btn-block";
        popupAbort.innerText = "Abort Drawing";
        popupAbort.style.display = "none";
        popupAbort.addEventListener("click", () => {
            captureCanvas.abortDrawingProcess = true;
            popupAbort.style.display = "none";
        });

        let checkbox = document.createElement("input");
        let checkboxWrap = document.createElement("div");
        let checkboxLabel = document.createElement("label");
        checkbox.type = "checkbox";
        checkbox.id = "clearCanvasBeforePaste";
        checkboxLabel.innerText = "Clear canvas before paste";
        checkboxLabel.insertBefore(checkbox, checkboxLabel.firstChild);
        checkboxWrap.appendChild(checkboxLabel);
        checkboxWrap.classList.add("checkbox");
        optionsPopup.appendChild(checkboxWrap);

        Array.from(optionsPopup.children).concat(optionsPopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!optionsPopup.contains(document.activeElement)) optionsPopup.style.display = "none" }, 20); }));
    },
    initAll: () => {
        imageTools.initImageOptionsButton();
        imageTools.initImageOptionsPopup();
    }
}