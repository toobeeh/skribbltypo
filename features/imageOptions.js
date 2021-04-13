// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// inits the image options bar
// dependend on: genericfunctions.js, capture.js, commands.js
let imageOptions = {
    optionsContainer: undefined,
    drawCommandsToGif: async (filename = "download", actions = null) => {
        // generate a gif of stored draw commands
        let workerJS = "";
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/b64.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/GIFEncoder.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/LZWEncoder.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/NeuQuant.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/skribblCanvas.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/capture.js"))).text();
        let renderWorker = new Worker(URL.createObjectURL(new Blob([(workerJS)], { type: 'application/javascript' })));
        if (!actions) actions = captureCanvas.getCapturedActions();
        renderWorker.postMessage({ 'filename': filename, 'capturedActions': actions, 'palettes': localStorage.customPalettes });

        // T H I C C progress bar 
        let progressBar = document.createElement("p");
        progressBar.style.color = "rgb(0, 0, 0)";
        progressBar.style.background = "rgb(247, 210, 140)";
        progressBar.innerText = String.fromCodePoint("0x2B1C").repeat(10) + " 0%";

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
        printCmdOutput("render");
        QS("#boxMessages").appendChild(progressBar);
    },
    initContainer: () => {
        // add options container and re-organize sidebar for handling popups
        let newSidebar = document.createElement("div");
        newSidebar.id = "newSidebar";
        newSidebar.style.cssText = "position: relative; display: flex; flex-direction: column;";

        let optionsContainer = document.createElement("div");
        optionsContainer.id = "imageOptions";
        optionsContainer.style.height = "48px";
        optionsContainer.style.background = "white";
        optionsContainer.style.borderRadius = "2px";
        optionsContainer.style.display = "flex";
        optionsContainer.style.justifyContent = "space-evenly";
        optionsContainer.style.alignItems = "baseline";
        optionsContainer.style.marginTop = "8px";
        optionsContainer.style.marginRight = "8px";

        let containerPlayers = QS("#containerPlayerlist");
        containerPlayers.style.height = "100%";
        containerPlayers.parentElement.insertBefore(newSidebar, containerPlayers);
        newSidebar.appendChild(containerPlayers);
        newSidebar.appendChild(optionsContainer);

        imageOptions.optionsContainer = optionsContainer;
    },
    downloadDataURL: async (url) => {
        let scale = Number(localStorage.qualityScale) ? Number(localStorage.qualityScale) : 1;
        let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer = getCurrentOrLastDrawer();
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);
        d.download = "skribbl" + document.querySelector("#currentWord").textContent + (drawer ? drawer : "");
        d.href = await scaleDataURL(url,
            document.querySelector("#canvasGame").width * scale,
            document.querySelector("#canvasGame").height * scale);
        d.dispatchEvent(e);
    },
    initDownloadPicture: () => {
        // add DL button for images
        let download = document.createElement("img");
        download.src = "https://media.giphy.com/media/RLKYVelNK5bP3yc8LJ/giphy.gif";
        download.style.cursor = "pointer";
        download.id = "downloadImage";
        download.addEventListener("click", async () => {
            await imageOptions.downloadDataURL(document.querySelector("#canvasGame").toDataURL("image/png;base64"));
        });
        imageOptions.optionsContainer.appendChild(download);
    },
    initDownloadGif: () => {
        // add DL button for gif
        let downloadGif = document.createElement("img");
        downloadGif.src = chrome.runtime.getURL("res/gif.gif");
        downloadGif.style.cursor = "pointer";
        downloadGif.id = "downloadGif";
        downloadGif.addEventListener("click", () => {
            let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer = getCurrentOrLastDrawer();
            e.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0, false, false, false,
                false, 0, null);
            d.download = "skribbl" + document.querySelector("#currentWord").textContent + (drawer ? drawer : "");
            d.href = document.querySelector("#canvasGame").toDataURL("image/png;base64");
            imageOptions.drawCommandsToGif(d.download);
        });
        imageOptions.optionsContainer.appendChild(downloadGif);
    },
    initImagePoster: () => {
        // popup for sharing image
        let sharePopup = document.createElement("div");
        sharePopup.style.position = "absolute";
        sharePopup.style.background = "white";
        sharePopup.style.overflow = "hidden";
        sharePopup.style.zIndex = "5";
        sharePopup.style.width = "90%";
        sharePopup.style.padding = "1em;";
        sharePopup.style.borderRadius = ".5em";
        sharePopup.style.marginLeft = "5%";
        sharePopup.style.boxShadow = "1px 1px 9px -2px black";
        sharePopup.style.display = "none";
        sharePopup.style.minHeight = "15%";
        sharePopup.style.padding = "1em";
        sharePopup.style.bottom = "1em";
        sharePopup.id = "sharePopup";
        sharePopup.tabIndex = "-1";
        imageOptions.optionsContainer.appendChild(sharePopup);

        // btn to open share popup
        let shareButton = document.createElement("img");
        let imageShareString;
        let imageShareStringDrawer;
        shareButton.src = chrome.runtime.getURL("res/letter.gif");
        shareButton.style.cursor = "pointer";
        shareButton.id = "downloadGif";
        shareButton.addEventListener("click", () => {
            if (!localStorage.hintShareImage) {
                alert("The shown image will be shared to one of the displayed discord channels.\nClick with the left or right mouse button on the preview to navigate older images.");
                localStorage.hintShareImage = "true";
            }
            imageShareString = QS("#canvasGame").toDataURL("image/png;base64");
            imageShareStringDrawer = getCurrentOrLastDrawer();
            QS("#shareImagePreview").src = imageShareString;
            QS("#shareImagePreview").setAttribute("imageIndex", -1);
            sharePopup.style.display = "";
            sharePopup.focus();
            QS("#postNameInput").value = QS("#currentWord").innerText + QS("#wordSize").innerText;
        });
        imageOptions.optionsContainer.appendChild(shareButton);

        // input field 
        let postName = document.createElement("input");
        postName.type = "text";
        postName.id = "postNameInput";
        postName.placeholder = "Title";
        postName.classList.add("form-control");
        postName.style.marginBottom = "0.75em";
        sharePopup.appendChild(postName);
        postName.outerHTML = "Post image @Discord: <br><br>" + postName.outerHTML;

        // image only checkbox
        let imageOnly = document.createElement("div");
        imageOnly.classList.add("checkbox");
        imageOnly.innerHTML = "<label><input type='checkbox' id='sendImageOnly'>Send only image</label>";
        sharePopup.appendChild(imageOnly);

        // image preview
        let imagePreview = document.createElement("img");
        imagePreview.id = "shareImagePreview";
        imagePreview.style.width = "100%";
        imagePreview.style.cursor = "pointer";
        let navigateImagePreview = (direction) => {
            let currentIndex = Number(imagePreview.getAttribute("imageIndex"));
            let allDrawings = [...captureCanvas.capturedDrawings];
            allDrawings.push({
                drawing: document.querySelector("#canvasGame").toDataURL("2d"),
                drawer: getCurrentOrLastDrawer(),
                word: QS("#currentWord").innerText,
                hint: QS("#wordSize").innerText
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
        sharePopup.appendChild(imagePreview);
        imagePreview.addEventListener("click", () => { navigateImagePreview(-1); });
        imagePreview.addEventListener("contextmenu", (e) => { e.preventDefault(); navigateImagePreview(1); });

        // get webhooks
        let webhooks = [];
        if (localStorage.member) JSON.parse(localStorage.member).Guilds.forEach(g => { if (g.Webhooks) g.Webhooks.forEach(w => webhooks.push(w)) });

        // add buttons to post image
        if (webhooks.length <= 0) sharePopup.innerHTML = "Ooops! <br> None of your added DC servers has a webhook connected. <br> Ask an admin to add one.";
        webhooks.forEach(async (w) => {
            // add share button for image
            let shareImg = document.createElement("button");
            shareImg.innerHTML = "[" + w.Guild + "] <br>" + w.Name;
            shareImg.classList.add("btn", "btn-info", "btn-block");
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
                let loginName = socket.clientData.playerName ? socket.clientData.playerName : QS("#inputName").value;
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
                                    "icon_url": "https://tobeh.host/Orthanc/images/typo.png",
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
                new Toast("Posted image on Discord.", 2000);
            });
            sharePopup.appendChild(shareImg);
        });
        Array.from(sharePopup.children).concat(sharePopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!sharePopup.contains(document.activeElement)) sharePopup.style.display = "none" }, 20); }));
    },
    initAll: () => {
        imageOptions.initContainer();
        imageOptions.initDownloadGif();
        imageOptions.initDownloadPicture();
        imageOptions.initImagePoster();
    }
}