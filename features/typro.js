// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, socket.js
let typro = {
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

                const meta = await (await fetch(drawing.meta)).json();

                container.classList.add(JSON.stringify(meta.name).replaceAll(" ", "_"));
                container.classList.add(JSON.stringify(meta.author).replaceAll(" ", "_"));
                let date = (new Date(meta.date)).toISOString().split("T")[0];
                container.classList.add(date);
                if (meta.own == true) container.classList.add("own");

                let thumb = document.createElement("img");
                thumb.style.backgroundImage = "url(" + typro.thumbnail + ")";
                thumb.style.backgroundSize = "cover";
                thumb.src = drawing.image;
                let overlay = elemFromString(`<div></div>`);
                overlay.appendChild(elemFromString("<h3>" + meta.name + " by " + meta.author + "</h3>"));
                let options = elemFromString("<div ></div>");
                overlay.appendChild(options);

                let imgtools = elemFromString("<button class='flatUI blue min air'>Add to ImageTools</button>");
                imgtools.addEventListener("click", async () => {
                    new Toast("Loading...");
                    let commands = await (await fetch(drawing.commands)).json()
                    imageTools.addPasteCommandsButton(commands, meta.name);
                    new Toast("Added drawing to ImageTools. You can paste it now!");
                });
                options.appendChild(imgtools);

                let imgpost = elemFromString("<button class='flatUI blue min air'>Add to ImagePost</button>");
                imgpost.addEventListener("click", async () => {
                    new Toast("Loading...");
                    const data = await (await fetch(drawing.drawing)).text()
                    captureCanvas.capturedDrawings.push({
                        drawing: data,
                        drawer: meta.author,
                        word: meta.name
                    });
                    new Toast("Added drawing to ImagePost history. Click left on the post image to select it!");
                });
                options.appendChild(imgpost);

                let clipboard = elemFromString("<button class='flatUI blue min air'>Copy to Clipboard</button>");
                clipboard.addEventListener("click", async () => {
                    new Toast("Loading...");
                    const data = await (await fetch(drawing.drawing)).text()
                    await dataURLtoClipboard(data);
                    new Toast("Copied the image to your clipboard. Share it! :3");
                });
                options.appendChild(clipboard);

                let link = elemFromString("<button class='flatUI blue min air'>Copy Link</button>");
                link.addEventListener("click", async () => {
                    drawing.image
                    await navigator.clipboard.writeText(drawing.image);
                    new Toast("Copied the image link to your clipboard. Share it! :3");
                });
                options.appendChild(link);

                let savepng = elemFromString("<button class='flatUI green min air'>Save PNG</button>");
                savepng.addEventListener("click", async () => {
                    new Toast("Loading...");
                    const data = await (await fetch(drawing.drawing)).text()
                    imageOptions.downloadDataURL(data, "skribblCloud-" + meta.name + "-by-" + meta.author);
                    new Toast("Started the image download.");
                });
                options.appendChild(savepng);

                let savegif = elemFromString("<button class='flatUI green min air'>Save GIF</button>");
                savegif.addEventListener("click", async () => {
                    new Toast("Loading...");
                    let commands = await (await fetch(drawing.commands)).json();
                    imageOptions.drawCommandsToGif(meta.name, commands);
                    new Toast("Started rendering the GIF. It's pronounced JIF, not GIF!!!");
                });
                options.appendChild(savegif);

                let remove = elemFromString("<button class='flatUI orange min air'>Delete</button>");
                let removeConfirm = false;
                remove.addEventListener("click", async () => {
                    if (!removeConfirm) { remove.innerHTML = "Really?"; removeConfirm = true; return; }
                    await socket.emitEvent("remove drawing", { id: drawing.id });
                    new Toast("Deleted drawing from the cloud.");
                    container.remove();
                });
                options.appendChild(remove);

                container.appendChild(thumb);
                container.appendChild(overlay);

                let triggers = [overlay, [...overlay.querySelectorAll("*")]].flat();
                triggers.forEach(trigger => trigger.addEventListener("pointermove", async () => {
                    // load detailed drawing
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
                        <= contentDrawings.clientHeight + 2 * QS("#imageCloud > div").getBoundingClientRect().height) {
                        contentDrawings.removeEventListener("scroll", onscroll);
                        setTimeout(() => resolve(true), 50);
                    }
                }
                contentDrawings.addEventListener("scroll", onscroll);
            });
        }
    },
    show: async () => {
        let drawings = [];
        let contentDrawings = document.createElement("div");
        contentDrawings.id = "imageCloud";

        let modalContent = document.createElement("div");
        modalContent.style.width = "100%";
        modalContent.style.position = "relative";
        modalContent.appendChild(contentDrawings);

        let sidebar = elemFromString("<div id='imageCloudSidebar'><h3 style='text-align:center;'>Filter Drawings</h3></div>");
        let query = {
            author: undefined,
            name: undefined,
            date: undefined,
            own: undefined
        }
        const getSkeletons = () => {
            contentDrawings.innerHTML = `<div class="skeletonDiv"><image class="skeletonImage" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAYAAADxJz2MAAAAAXNSR0IArs4c6QAAAudJREFUeF7tmumq4kAQhfu64C6KiqLi+7+Gr+IPRVx/uK/DyZDhjsxIUqdakpkqEEVyKt1fqrurK/01Ho+fzkxM4MsAitkFQgPI8TOAJD8DaABZAqTe5kADSBIg5RaBBpAkQMotAg0gSYCUWwQaQJIAKbcINIAkAVKeigh8PB4On/l87u73+9suZzIZ12g0XLlcdvjt2xIPEOC2263b7XaxWJRKJYdPtVqNpYt7ceIBLpdLdzgc4vbr1/X1ej2ISF+WaIAYsufzme67T4heAWK+ej5/vnI5nU7uer3+BiOfz7tisRj8h/nq+5y1Wq3cfr+n4YUOms2mq9Vqav5CR94AInI2m427XC6RGo25CkMNEAEeAAFdy7LZrOv1eg7fmuYFIOABwO12i9VWrJztdjuY86APozeWkzcXh/61/MGPOkBEz2w2C9IOieVyuSAKo0Zu3HuMRqO4krfXqwPEPAeASbXhcKiaH6oDXK/XsXO2T8LWXkzUAU4mk0/yiH0vJNedTie27m+C/w4g5th+v28ApQQSDxALyGvCLO2sD12lUnGtVkvNtfoQPh6PbrFYqDVQ29FgMFBNptUBInmeTqfa/Vbzl9g8MNz34htFgKRauIC87r2l7aUjEDsObPpRr0vy3PcKCHvvQqHgMCcyRgNk63VM4zW0bKmLAqhVr9MAIfWB6ky323VIbyQmBoiKC1ZbadFA0lhfGia1EQH0Ua/zBSeK348D9FWvi9JZH9d8HCBWXRQ8/xUzgOSTNIBpA4jtGoawxitHsu+0HDsS1AeRVEtMtArjRtqvHSWN19Cw5S0xwKSX7qPARRKN6gxjYoAoWyEK05pIY8hi6LIHkMQA8dSQD2IvnDYDPBRVpdu37/2lAMIRFhSAxAmqNBjKWVqlLPSXBvgnaChr4VgGSlzapwskDwknEnyd0PICUNLJtGoMIPnkDKABJAmQcotAA0gSIOUWgQaQJEDKLQINIEmAlFsEkgB/AJLI18R7H33eAAAAAElFTkSuQmCC
'><div></div></div></div>`.repeat(20);
        }
        let applyFilter = async () => {
            let queryID = typro.queryID = Date.now();
            setTimeout(async () => {
                if (queryID != typro.queryID) return;
                getSkeletons();
                drawings = await socket.getStoredDrawings(query);
                if (drawings && drawings.length > 0) await typro.setDrawings(drawings, contentDrawings);
                else contentDrawings.innerHTML = "<br><br><h3>Typo Gallery Cloud stores all drawings from your skribbl sessions automatically.<br> Rewatch images, post on discord or re-draw them in skribbl whenever you want!<br><br>By default, images are stored for two weeks<br> Subscribe on patreon to store images forever! </h3>";
            }, 500);
        }
        // artist filter
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Artist</h4>"));
        let filterAuthor = elemFromString("<input type='text' class='flatUI' placeholder='tobeh'>");
        filterAuthor.addEventListener("input", async () => {
            query.author = filterAuthor.value.trim() != "" ? filterAuthor.value.trim() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterAuthor);
        // title filter
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Title</h4>"));
        let filterName = elemFromString("<input type='text' class='flatUI' placeholder='Sonic'>");
        filterName.addEventListener("input", async () => {
            query.title = filterName.value.trim() != "" ? filterName.value.trim() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterName);
        // date filter
        // sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Date</h4>"));
        // let filterDate = elemFromString("<input type='text' class='flatUI' placeholder='Jan 15 2020'>");
        // filterDate.addEventListener("input", async () => {
        //     query.date = filterDate.value.trim() != "" ? filterDate.value.trim() : undefined;
        //     await applyFilter();
        // });
        // sidebar.appendChild(filterDate);
        // own filter
        let filterOwn = elemFromString("<label><input type='checkbox' class='flatUI'><span>Only your drawings</span></label>");
        filterOwn.querySelector("input").addEventListener("input", async () => {
            query.own = filterOwn.querySelector("input").checked ? true : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterOwn);
        modalContent.appendChild(sidebar);
        let modal = new Modal(modalContent, () => { }, "Typo Cloud Gallery", "90vw", "90vh");
        getSkeletons();
        drawings = await socket.getStoredDrawings({}, 1000);
        await typro.setDrawings(drawings, contentDrawings);
    }
}