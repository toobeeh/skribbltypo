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
            // get last anvas clear index
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
            optionsPopup.appendChild(popupCustomSaved);
            popupCustomSaved.innerText = name;
            popupCustomSaved.addEventListener("click", () => {
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
        popupPasteSavedCommands.addEventListener("click", () => {
            let fileInput = document.createElement('input');
            let actions;
            fileInput.type = 'file';
            fileInput.accept = ".skd";
            fileInput.onchange = e => {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = readerEvent => {
                    actions = readerEvent.target.result;
                    let popupCustomSaved = document.createElement("button");
                    optionsPopup.appendChild(popupCustomSaved);
                    popupCustomSaved.style.display = document.querySelector(".containerToolbar").style.display
                    popupCustomSaved.classList = "btn btn-success btn-block pasteSaved"; if (document.querySelector(".containerToolbar").style.display == "none") {
                        popupCustomSaved.classList.remove("btn-success");
                        popupCustomSaved.classList.add("btn-secondary");
                        popupCustomSaved.style.pointerEvents = "none";
                    }
                    popupCustomSaved.innerText = file.name;
                    popupCustomSaved.addEventListener("click", () => {
                        captureCanvas.drawOnCanvas(JSON.parse(actions));
                        captureCanvas.capturedActions = JSON.parse(actions);
                    });
                    document.querySelector("#saveDrawingPopup").style.top = "calc(100% - 2em - " + document.querySelector("#saveDrawingPopup").offsetHeight + "px)";
                }
            }
            fileInput.click();
        });

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