// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, socket.js
let typro = {
    queryID: 0,
    setDrawings: async (drawings, contentDrawings) => {
        let currentQuery = typro.queryID;
        let batches = [];
        while (drawings.length > 0) batches.push(drawings.splice(0, 20));
        for (const drawingBatch of batches) {
            for (const drawing of drawingBatch) {
                if (currentQuery != typro.queryID) return;
                let container = document.createElement("div");
                container.style.width = "30%";
                container.style.margin = "0.5em";
                container.style.position = "relative";
                container.id = drawing.id;

                container.classList.add(drawing.meta.name.replaceAll(" ", "_"));
                container.classList.add(drawing.meta.author.replaceAll(" ", "_"));
                let date = (new Date(drawing.meta.date)).toISOString().split("T")[0];
                container.classList.add(date);
                if (drawing.meta.own == true) container.classList.add("own");

                let thumb = document.createElement("img");
                thumb.style.cssText = "width:100%; height:auto; transition: opacity 0.25s; box-shadow:rgb(0 0 0 / 15%) 1px 1px 9px 1px";
                let data = await socket.emitEvent("fetch drawing", { id: drawing.id }, true, 5000);
                thumb.src = data.drawing.uri;
                let overlay = elemFromString(`<div style='
                transition: opacity 0.25s;
                opacity: 0;
                position:absolute;
                inset: 0;
                display:flex;
                place-items:center;
                justify-content:space-around;
                border-radius: 1em;
                z-index:200;
                background: rgba(0, 0, 0, 0.1);
                flex-direction: column;'
                ></div>`);
                overlay.appendChild(elemFromString("<h3>" + drawing.meta.name + " by " + drawing.meta.author + "</h3>"));
                let options = elemFromString("<div style='display:flex; flex-wrap: wrap; align-content: space-evenly; justify-content: space-evenly; height:100%; width: 100%;'></div>");
                overlay.appendChild(options);


                let imgtools = elemFromString("<div class='btn btn-success'>Add to ImageTools</div>");
                imgtools.addEventListener("click", async () => {
                    let resp = (await socket.emitEvent("get commands", { id: drawing.id}, true, 5000));
                    let commands = resp.commands;
                    imageTools.addSKD(JSON.stringify(commands), drawing.meta.name);
                    new Toast("Added drawing to ImageTools. You can paste it now!");
                });
                options.appendChild(imgtools);

                let imgpost = elemFromString("<div class='btn btn-success'>Add to ImagePost</div>");
                imgpost.addEventListener("click", () => {
                    captureCanvas.capturedDrawings.push({
                        drawing: data.drawing.uri,
                        drawer: drawing.meta.author,
                        word: drawing.meta.name
                    });
                    new Toast("Added drawing to ImagePost history. Click left on the post image to select it!");
                });
                options.appendChild(imgpost);

                let clipboard = elemFromString("<div class='btn btn-info'>Copy to Clipboard</div>");
                clipboard.addEventListener("click", async () => {
                    await dataURLtoClipboard(data.drawing.uri);
                    new Toast("Copied the image to your clipboard. Share it! :3");
                });
                options.appendChild(clipboard);

                let savepng = elemFromString("<div class='btn btn-info'>Save PNG</div>");
                savepng.addEventListener("click", () => {
                    imageOptions.downloadDataURL(data.drawing.uri);
                    new Toast("Started the image download.");
                });
                options.appendChild(savepng);

                let savegif = elemFromString("<div class='btn btn-info'>Save GIF</div>");
                savegif.addEventListener("click", async () => {
                    let commands = (await socket.emitEvent("fetch drawing", { id: drawing.id, withCommands: true }, true, 5000)).drawing.commands;
                    imageOptions.drawCommandsToGif(drawing.name, commands);
                    new Toast("Started rendering the GIF. It's pronounced JIF, not GIF!!!");
                });
                options.appendChild(savegif);

                let remove = elemFromString("<div class='btn btn-warning'>Delete</div>");
                let removeConfirm = false;
                remove.addEventListener("click", async () => {
                    if (!removeConfirm) { remove.innerHTML = "Really?"; removeConfirm = true; return;}
                    await socket.emitEvent("remove drawing", { id: drawing.id });
                    new Toast("Deleted drawing from the cloud.");
                    container.remove();
                });
                options.appendChild(remove);

                container.appendChild(thumb);
                container.appendChild(overlay);

                let triggers = [overlay, [...overlay.querySelectorAll("*")]].flat();
                triggers.forEach(trigger => trigger.addEventListener("pointermove", () => {
                    thumb.style.opacity = "0.2";
                    overlay.style.opacity = "1";
                    let hide = () => {
                        thumb.style.opacity = "1";
                        overlay.style.opacity = "0";
                        trigger.removeEventListener("pointerleave", hide);
                    }
                    trigger.addEventListener("pointerleave", hide);
                }));
                contentDrawings.appendChild(container);
            }
            await new Promise((resolve, reject) => {
                let onscroll = () => {
                    if (Math.floor(contentDrawings.scrollHeight - contentDrawings.scrollTop)
                        <= contentDrawings.clientHeight + 2 * QS("#drawings > div").getBoundingClientRect().height) {
                        contentDrawings.removeEventListener("scroll", onscroll);
                        setTimeout(() => resolve(true), 50);
                    }
                }
                contentDrawings.addEventListener("scroll", onscroll);
            });
        }
    },
    show: async () => {
        let drawings = await socket.getStoredDrawings();
        let contentDrawings = document.createElement("div");
        contentDrawings.id = "drawings";
        contentDrawings.style.cssText = "display:flex; flex-direction:row; flex-wrap:wrap; justify-content: center;margin-left:18%; max-height: 100%; overflow-y:auto;";

        let modalContent = document.createElement("div");
        modalContent.style.width = "100%";
        modalContent.style.position = "relative";
        modalContent.appendChild(contentDrawings);

        let sidebar = elemFromString("<div style='position:absolute; left:0; padding:1em; top: 0; bottom: 0; width:18%; background: rgba(0, 0, 0, 0.05); border-radius:1em'></div>");
        sidebar.appendChild(elemFromString("<h3 style='text-align:center;'>Filter<br><br></h3>"));
        let query = {
            author: undefined,
            name: undefined,
            date: undefined,
            own: undefined
        }
        let debounce = null;
        let applyFilter = async () => {
            let queryID = typro.queryID = Date.now();
            setTimeout(async () => {
                if (queryID != typro.queryID) return;
                drawings = await socket.getStoredDrawings(query);
                contentDrawings.innerHTML = "";
                if (drawings && drawings.length > 0) await typro.setDrawings(drawings, contentDrawings);
                else contentDrawings.innerHTML = "<br><br><h3> No drawings found for this filter.</h3><br><h3> The lite-version of the gallery saves images only for 48h. </h3><br><h3>To get full access, ask tobeh.</h3>";
            }, 500);
        }
        // artist filter
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Artist</h4>"));
        let filterAuthor = elemFromString("<input type='text' class='form-control' placeholder='tobeh'>");
        filterAuthor.addEventListener("input", async () => {
            query.author = filterAuthor.value.trim() != "" ? filterAuthor.value.trim() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterAuthor);
        // title filter
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Title</h4>"));
        let filterName = elemFromString("<input type='text' class='form-control' placeholder='Sonic'>");
        filterName.addEventListener("input", async () => {
            query.name = filterName.value.trim() != "" ? filterName.value.trim() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterName);
        // date filter
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Date</h4>"));
        let filterDate = elemFromString("<input type='text' class='form-control' placeholder='Jan 15 2020'>");
        filterDate.addEventListener("input", async () => {
            query.date = filterDate.value.trim() != "" ? filterDate.value.trim() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterDate);
        sidebar.appendChild(elemFromString("<h5 style='text-align:center;'><br><br>Typo Gallery Cloud stores all drawings from your skribbl sessions automatically.<br> Rewatch images, post on discord or re-draw them in skribbl whenever you want!<br><br>By default, images are stored for two days.</h5>"));
        modalContent.appendChild(sidebar);
        let modal = new Modal(modalContent, () => { }, "Typo Cloud Gallery", "90vw", "90vh");
        await typro.setDrawings(drawings, contentDrawings);
    }
}