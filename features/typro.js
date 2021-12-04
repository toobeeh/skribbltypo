// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, socket.js
const typro = {
    thumbnail: "data:image/png;base64,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",
    queryID: 0,
    setDrawings: async (drawings, contentDrawings) => {
        contentDrawings.innerHTML = "";
        let currentQuery = typro.queryID;
        let batches = [];
        while (drawings.length > 0) batches.push(drawings.splice(0, 20));
        for (const drawingBatch of batches) {
            for (const drawing of drawingBatch) {
                if (currentQuery != typro.queryID) return;
                let container = document.createElement("div");
                container.id = drawing.id;

                container.classList.add(drawing.meta.name.replaceAll(" ", "_"));
                container.classList.add(drawing.meta.author.replaceAll(" ", "_"));
                let date = (new Date(drawing.meta.date)).toISOString().split("T")[0];
                container.classList.add(date);
                if (drawing.meta.own == true) container.classList.add("own");

                let thumb = document.createElement("img");
                let data = null;
                thumb.src = drawing.meta.thumbnail ? drawing.meta.thumbnail : typro.thumbnail;
                let overlay = elemFromString(`<div></div>`);
                overlay.appendChild(elemFromString("<h3>" + drawing.meta.name + " by " + drawing.meta.author + "</h3>"));
                let options = elemFromString("<div ></div>");
                overlay.appendChild(options);

                let imgtools = elemFromString("<div class='btn btn-success'>Add to ImageTools</div>");
                imgtools.addEventListener("click", async () => {
                    new Toast("Loading...");
                    let resp = (await socket.emitEvent("get commands", { id: drawing.id}, true, 5000));
                    let commands = resp.commands;
                    imageTools.addSKD(JSON.stringify(commands), drawing.meta.name);
                    new Toast("Added drawing to ImageTools. You can paste it now!");
                });
                options.appendChild(imgtools);

                let imgpost = elemFromString("<div class='btn btn-success'>Add to ImagePost</div>");
                imgpost.addEventListener("click", async () => {
                    new Toast("Loading...");
                    if (!data) data = await socket.emitEvent("fetch drawing", { id: drawing.id }, true, 5000);
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
                    new Toast("Loading...");
                    if (!data) data = await socket.emitEvent("fetch drawing", { id: drawing.id }, true, 5000);
                    await dataURLtoClipboard(data.drawing.uri);
                    new Toast("Copied the image to your clipboard. Share it! :3");
                });
                options.appendChild(clipboard);

                let savepng = elemFromString("<div class='btn btn-info'>Save PNG</div>");
                savepng.addEventListener("click", async () => {
                    new Toast("Loading...");
                    if (!data) data = await socket.emitEvent("fetch drawing", { id: drawing.id }, true, 5000);
                    imageOptions.downloadDataURL(data.drawing.uri, "skribblCloud-" + drawing.meta.name + "-by-" + drawing.meta.author);
                    new Toast("Started the image download.");
                });
                options.appendChild(savepng);

                let savegif = elemFromString("<div class='btn btn-info'>Save GIF</div>");
                savegif.addEventListener("click", async () => {
                    new Toast("Loading...");
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
                triggers.forEach(trigger => trigger.addEventListener("pointermove", async () => {
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
        let imagecloudStyle = elemFromString(`<style>
#drawings > div {
    width: 30%;
    margin: 0.5em;
    position: relative;
}
#drawings > div > img {
    width: 100%;
    height: auto;
    transition: opacity 0.25s ease 0s;
    box-shadow: rgb(0 0 0 / 15%) 1px 1px 9px 1px;
    opacity: 1;
}
#drawings > div > div {
    transition: opacity 0.25s ease 0s;
    opacity: 0;
    position: absolute;
    inset: 0px;
    display: flex;
    place-items: center;
    justify-content: space-around;
    border-radius: 1em;
    z-index: 200;
    background: rgba(0, 0, 0, 0.1);
    flex-direction: column;
}
#drawings > div > div > div {
    display:flex;
    flex-wrap: wrap;
    align-content: space-evenly;
    justify-content: space-evenly;
    height:100%;
    width: 100%;
}
#drawings > div > img.skeletonImage{
    opacity: 0.4;
}
#drawings > div.skeletonDiv{
    animation-name:skeleton;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in;
}
@keyframes skeleton{
  from {background-color: #fafafa;}
  to {background-color: #969595;}
}</style>`);

        let drawings = [];
        let contentDrawings = document.createElement("div");
        contentDrawings.id = "drawings";
        contentDrawings.style.cssText = "display:flex; flex-direction:row; flex-wrap:wrap; justify-content: center;margin-left:18%; max-height: 100%; overflow-y:auto;";

        let modalContent = document.createElement("div");
        modalContent.style.width = "100%";
        modalContent.style.position = "relative";
        modalContent.appendChild(imagecloudStyle);
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
        const getSkeletons = () => {
            contentDrawings.innerHTML = `<div class="skeletonDiv" ><image class="skeletonImage" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAYAAADxJz2MAAAAAXNSR0IArs4c6QAAAudJREFUeF7tmumq4kAQhfu64C6KiqLi+7+Gr+IPRVx/uK/DyZDhjsxIUqdakpkqEEVyKt1fqrurK/01Ho+fzkxM4MsAitkFQgPI8TOAJD8DaABZAqTe5kADSBIg5RaBBpAkQMotAg0gSYCUWwQaQJIAKbcINIAkAVKeigh8PB4On/l87u73+9suZzIZ12g0XLlcdvjt2xIPEOC2263b7XaxWJRKJYdPtVqNpYt7ceIBLpdLdzgc4vbr1/X1ej2ISF+WaIAYsufzme67T4heAWK+ej5/vnI5nU7uer3+BiOfz7tisRj8h/nq+5y1Wq3cfr+n4YUOms2mq9Vqav5CR94AInI2m427XC6RGo25CkMNEAEeAAFdy7LZrOv1eg7fmuYFIOABwO12i9VWrJztdjuY86APozeWkzcXh/61/MGPOkBEz2w2C9IOieVyuSAKo0Zu3HuMRqO4krfXqwPEPAeASbXhcKiaH6oDXK/XsXO2T8LWXkzUAU4mk0/yiH0vJNedTie27m+C/w4g5th+v28ApQQSDxALyGvCLO2sD12lUnGtVkvNtfoQPh6PbrFYqDVQ29FgMFBNptUBInmeTqfa/Vbzl9g8MNz34htFgKRauIC87r2l7aUjEDsObPpRr0vy3PcKCHvvQqHgMCcyRgNk63VM4zW0bKmLAqhVr9MAIfWB6ky323VIbyQmBoiKC1ZbadFA0lhfGia1EQH0Ua/zBSeK348D9FWvi9JZH9d8HCBWXRQ8/xUzgOSTNIBpA4jtGoawxitHsu+0HDsS1AeRVEtMtArjRtqvHSWN19Cw5S0xwKSX7qPARRKN6gxjYoAoWyEK05pIY8hi6LIHkMQA8dSQD2IvnDYDPBRVpdu37/2lAMIRFhSAxAmqNBjKWVqlLPSXBvgnaChr4VgGSlzapwskDwknEnyd0PICUNLJtGoMIPnkDKABJAmQcotAA0gSIOUWgQaQJEDKLQINIEmAlFsEkgB/AJLI18R7H33eAAAAAElFTkSuQmCC
'><div></div></div></div>`.repeat(40);
        }
        let applyFilter = async () => {
            let queryID = typro.queryID = Date.now();
            setTimeout(async () => {
                if (queryID != typro.queryID) return;
                getSkeletons();
                drawings = await socket.getStoredDrawings(query);
                if (drawings && drawings.length > 0) await typro.setDrawings(drawings, contentDrawings);
                else contentDrawings.innerHTML = "<br><br><h3> No drawings found for this filter :( <br> Subscribe on patreon to store images forever! </h3>";
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
        // own filter
        let filterOwn = elemFromString("<div class='checkbox'><label><input type='checkbox'>Only your drawings</label></div>");
        filterOwn.querySelector("input").addEventListener("input", async () => {
            query.own = filterOwn.querySelector("input").checked;
            await applyFilter();
        });
        sidebar.appendChild(filterOwn);
        sidebar.appendChild(elemFromString("<h5 style='text-align:center;'><br><br>Typo Gallery Cloud stores all drawings from your skribbl sessions automatically.<br> Rewatch images, post on discord or re-draw them in skribbl whenever you want!<br><br>By default, images are stored for two weeks.</h5>"));
        modalContent.appendChild(sidebar);
        let modal = new Modal(modalContent, () => { }, "Typo Cloud Gallery", "90vw", "90vh");
        getSkeletons();
        drawings = await socket.getStoredDrawings({}, 500);
        await typro.setDrawings(drawings, contentDrawings);
    }
}