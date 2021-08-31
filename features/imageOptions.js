// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// inits the image options bar
// dependend on: genericfunctions.js, capture.js, commands.js
let imageOptions = {
    optionsContainer: undefined,
    drawCommandsToGif: async (filename = "download", commands = null) => {
        // generate a gif of stored draw commands
        let workerJS = "";
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/b64.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/GIFEncoder.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/LZWEncoder.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/NeuQuant.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/skribblCanvas.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/capture.js"))).text();
        let renderWorker = new Worker(URL.createObjectURL(new Blob([(workerJS)], { type: 'application/javascript' })));
        if (!commands) commands = captureCanvas.capturedCommands;
        renderWorker.postMessage({ 'filename': filename, 'capturedCommands': commands});

        // T H I C C progress bar 
        let progressBar = document.createElement("p");
        progressBar.style.color = "rgb(0, 0, 0)";
        progressBar.style.background = "rgb(247, 210, 140)";
        progressBar.innerText = String.fromCodePoint("0x2B1C").repeat(10) + " 0%";

        renderWorker.onerror = (err) => {
            progressBar.innerText = "Failed creating the GIF :(";
            console.log(err);
        };
        renderWorker.addEventListener('message', function (e) {
            if (e.data.download) {
                progressBar.innerText = String.fromCodePoint("0x1F7E9").repeat(10) + " Done!";
                let templink = document.createElement("a");
                templink.download = filename;
                templink.href = e.data.download;
                templink.click();
            }
            else if (e.data.progress) {
                let prog = Math.floor(e.data.progress * 10);
                let miss = 10 - prog;
                let bar = "";
                while (prog > 0) {
                    bar += String.fromCodePoint("0x1F7E9"); prog--;
                }
                while (miss > 0) {
                    bar += String.fromCodePoint("0x2B1C"); miss--;
                }
                progressBar.innerText = bar;
                let percent = Math.round(e.data.progress * 100)
                progressBar.innerText += " " + percent + "%";
            }
        }, false);
        //printCmdOutput("render");
        QS("#game-chat .container .content").appendChild(progressBar);
    },
    initContainer: () => {
        // new imageoptions container on the right side
        let imgtools = elemFromString(`<div id="imageOptions"></div>`);
        QS("#game-players").appendChild(imgtools);
        imageOptions.optionsContainer = imgtools;
    },
    downloadDataURL: async (url, name = "skribbl-unknown", scale = 1) => {
        let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer = getCurrentOrLastDrawer();
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);
        d.download = name;
        d.href = await scaleDataURL(url,
            document.querySelector("#game-canvas canvas").width * scale,
            document.querySelector("#game-canvas canvas").height * scale);
        d.dispatchEvent(e);
    },
    initDownloadOptions: () => {
        // add DL button for gif
        const downloadOptions = elemFromString(`<img src="${chrome.runtime.getURL("res/floppy.gif")}" id="downloadImg" style="cursor: pointer;">`);
        // popup for sharing image
        const downloadPopup = elemFromString(`<div id="downloadPopup" tabIndex="-1" style="display:none">
    Save Image<br><br><label for="sendImageOnly">
        <input type="checkbox" id="dlQuality" class="flatUI small">
        <span>High quality</span>
    </label>
    <button class="flatUI blue" id="dlPng" >As PNG</button><br>
    <button class="flatUI blue" id="dlGif" >As GIF</button>
    <button class="flatUI green" id="saveCloud">In Typo Cloud</button>
</div>`);
        imageOptions.optionsContainer.appendChild(downloadOptions);
        downloadOptions.addEventListener("click", () => {
            downloadPopup.style.display = "";
            downloadPopup.focus();
        });
        imageOptions.optionsContainer.appendChild(downloadPopup);
        QS("#dlGif").addEventListener("click", () => {
            let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer = getCurrentOrLastDrawer();
            e.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0, false, false, false,
                false, 0, null);
            d.download = "skribbl" + document.querySelector("#game-word .word").textContent + (drawer ? drawer : "");
            d.href = document.querySelector("#game-canvas canvas").toDataURL("image/png;base64");
            imageOptions.drawCommandsToGif(d.download);
            downloadPopup.style.display = "none";
        });
        QS("#dlPng").addEventListener("click", async () => {
            await imageOptions.downloadDataURL(
                document.querySelector("#game-canvas canvas").toDataURL("image/png;base64"),
                "skribbl-" + getCurrentWordOrHint() + "-by-" + getCurrentOrLastDrawer(),
                QS("#dlQuality").checked ? 3 : 1
            );
            downloadPopup.style.display = "none";
        });
        QS("#saveCloud").addEventListener("click", async () => {
            if (socket.authenticated) {
                document.body.dispatchEvent(newCustomEvent("drawingFinished"));
                new Toast("Saved the drawing in the cloud.");
            }
            else {
                new Toast("Create a palantir account to save drawings in the cloud!");
            }
            downloadPopup.style.display = "none";
        });
        Array.from(downloadPopup.children).concat(downloadPopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!downloadPopup.contains(document.activeElement)) downloadPopup.style.display = "none" }, 20); }));
    },
    initImagePoster: () => {
        // popup for sharing image
        let sharePopup = elemFromString(`<div id="sharePopup" tabIndex="-1" style="display:none">
    Post @ Discord<br><br>
    <input type="text" class="flatUI" id="postNameInput" placeholder="Post Title"><br>
    <label for="sendImageOnly">
        <input type="checkbox" id="sendImageOnly" class="flatUI small">
        <span>Send only image</span>
    </label>
    <img id="shareImagePreview">
    <div id="shareButtons">
    </div>
</div>`);
        imageOptions.optionsContainer.appendChild(sharePopup);
        let buttonCont = QS("#shareButtons");

        // btn to open share popup
        let imageShareString;
        let imageShareStringDrawer;
        let shareButton = elemFromString(`<img src="${chrome.runtime.getURL("res/letter.gif")}" id="shareImg" style="cursor: pointer;">`);
        shareButton.addEventListener("click", () => {
            if (!localStorage.hintShareImage) {
                alert("The shown image will be posted to one of the displayed Discord channels.\nClick with the left or right mouse button on the preview to navigate older images.");
                localStorage.hintShareImage = "true";
            }
            imageShareString = QS("#game-canvas canvas").toDataURL("image/png;base64");
            imageShareStringDrawer = getCurrentOrLastDrawer();
            QS("#shareImagePreview").src = imageShareString;
            QS("#shareImagePreview").setAttribute("imageIndex", -1);
            let word = getCurrentWordOrHint();
            QS("#postNameInput").value = word + " (" + word.length + ")";
            sharePopup.style.display = "";
            sharePopup.focus();
        });
        imageOptions.optionsContainer.appendChild(shareButton);

        // image preview
        let imagePreview = QS("#shareImagePreview");
        let navigateImagePreview = (direction) => {
            let currentIndex = Number(imagePreview.getAttribute("imageIndex"));
            let allDrawings = [...captureCanvas.capturedDrawings];
            allDrawings.push({
                drawing: document.querySelector("#game-canvas canvas").toDataURL("2d"),
                drawer: getCurrentOrLastDrawer(),
                word: getCurrentWordOrHint(),
                hint: "(" + getCurrentWordOrHint().length + ")"
            });
            if (currentIndex < 0) currentIndex = allDrawings.length - 1;
            currentIndex += direction;
            if (currentIndex >= 0 && currentIndex < allDrawings.length) {
                imagePreview.src = allDrawings[currentIndex].drawing;
                QS("#postNameInput").value = allDrawings[currentIndex].word + allDrawings[currentIndex].hint;
                imageShareString = allDrawings[currentIndex].drawing;
                imageShareStringDrawer = allDrawings[currentIndex].drawer;
                imagePreview.setAttribute("imageIndex", currentIndex);
            }
        };
        imagePreview.addEventListener("click", () => { navigateImagePreview(-1); });
        imagePreview.addEventListener("contextmenu", (e) => { e.preventDefault(); navigateImagePreview(1); });

        // get webhooks
        let webhooks = [];
        if (localStorage.member) JSON.parse(localStorage.member).Guilds?.forEach(g => { if (g.Webhooks) g.Webhooks.forEach(w => webhooks.push(w)) });

        // add buttons to post image
        if (webhooks.length <= 0) buttonCont.innerHTML = "Ooops! <br> None of your added DC servers has a webhook connected. <br> Ask an admin to add one.";
        webhooks.forEach(async (w) => {
            // add share button for image
            let shareImg = elemFromString(`<button class="flatUI blue">[${w.Guild}]<br>${w.Name}</button>`);
            shareImg.addEventListener("click", async () => {
                // close popup first to avoid spamming
                sharePopup.style.display = "none";
                // upload to orthanc
                let title = QS("#postNameInput").value.replaceAll("_", " ⎽ ");
                let imgstring = imageShareString;
                let data = new FormData();
                data.append("image", imgstring);
                data.append("name", "post");
                let state = await fetch('https://tobeh.host/Orthanc/images/upload.php', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*'
                    },
                    body: data
                });
                let url = "https://tobeh.host/Orthanc/images/" + await state.text() + ".png";

                // build webhook content
                let message;
                let imageOnly =QS("#sendImageOnly").checked;
                let loginName = socket.clientData.playerName ? socket.clientData.playerName : QS(".name me").textContent.replace("(You)", "").trim();
                if (imageOnly) {
                    message = JSON.stringify({
                        username: loginName,
                        avatar_url:
                            'https://tobeh.host/Orthanc/images/letterred.png',
                        content: url
                    });
                }
                else {
                    let drawer = imageShareStringDrawer;
                    message = JSON.stringify({
                        username: "Skribbl Image Post",
                        avatar_url:
                            'https://tobeh.host/Orthanc/images/letterred.png',
                        embeds: [
                            {
                                "title": title,
                                "description": "Posted by " + loginName,
                                "color": 4368373,
                                "image": {
                                    "url": url
                                },
                                "footer": {
                                    "icon_url": "https://cdn.discordapp.com/attachments/334696834322661376/860509383104528425/128CircleFit.png",
                                    "text": "skribbl typo"
                                },
                                "author": {
                                    "name": "Drawn by " + drawer,
                                    "url": "https://typo.rip",
                                    "icon_url": "https://skribbl.io/res/pen.gif"
                                }
                            }
                        ]
                    })
                }

                // send webhook
                await fetch(w.URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: message
                });
                new Toast("Posted image on Discord", 2000);
            });
            sharePopup.appendChild(shareImg);
        });
        Array.from(sharePopup.children).concat(sharePopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!sharePopup.contains(document.activeElement)) sharePopup.style.display = "none" }, 20); }));
    },
    initAll: () => {
        imageOptions.initContainer();
        imageOptions.initDownloadOptions();
        imageOptions.initImagePoster();
    }
}