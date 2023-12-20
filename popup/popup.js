let settings = null;
let skribbl = true;
let tabID = 0;
if (typeof (localStorage) !== "object") { // localstoray polyfill dummy for safari
    this.localStorage = [];
}

// check if skribbl is opened & adjust visible content, then do all setup stuff
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs[0].url.includes("skribbl.io") || tabs[0].url.includes("135.125.189.105")) {
        skribbl = true;
        // remove conent that doesnt belong to skribbl
        document.querySelectorAll(".sketchful:not(.skribbl)").forEach((node) => { node.remove(); });

        // check if settings string was received - if not, indicates that the popup didnt sync with skribbl (after update for example)
        setTimeout(function () { if (!settings && skribbl) document.querySelector("h1").innerHTML = "Updated... <br/>Reload Skribbl!"; }, 500);

        // set events to toggle tabs
        document.querySelectorAll(".tabSelection .tabTitle").forEach((tab) => tab.addEventListener("click", () => {
            let activeTab = document.querySelector(".tabActive");
            activeTab.classList.toggle("tabActive");
            tab.classList.toggle("tabActive");
            if (activeTab.id == "tabDashboard") $("#mainSettings").slideToggle(200);
            if (activeTab.id == "tabAdvanced") $("#advancedSettings").slideToggle(200);
            if (activeTab.id == "tabDiscord") $("#palantirSettings").slideToggle(200);

            if (tab.id == "tabDashboard") $("#mainSettings").slideToggle(200);
            if (tab.id == "tabAdvanced") $("#advancedSettings").slideToggle(200);
            if (tab.id == "tabDiscord") $("#palantirSettings").slideToggle(200);
        }));
        // add settings receive callback
        chrome.runtime.onMessage.addListener((request, sender) => {
            tabID = sender.tab.id;
            settings = JSON.parse(request.settings);

            // set button states
            document.querySelectorAll("#mainSettings button").forEach(btn => {
                if (settings[btn.id] == "true") btn.classList.add("active");
            });

            // init slider events
            document.querySelectorAll(".sliderBox").forEach(slider => {
                const sliderInput = slider.querySelector("input");
                const max = Number(sliderInput.max);
                const min = Number(sliderInput.min);
                const setSliderFill = (set = null) => {
                    const val = set ? set : Number(sliderInput.value);
                    const width = (val - min) / (max - min);
                    slider.querySelector(".sliderBar .sliderFill").style.width = (width * 100) + "%";
                }
                sliderInput.addEventListener("input", () => setSliderFill(null));
                sliderInput.addEventListener("change", () => {
                    // update value
                    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, slider.id + " " + sliderInput.value);
                    });
                });
                // set start value
                setSliderFill(Number(settings[slider.id]));
                sliderInput.value = Number(settings[slider.id]);
            });

            // add slider thumb color change for color slider
            setThumbCol = (val) => {
                const hsl = val + ", 100%, 90%";
                document.querySelector("#sliderThumbColorStyle").innerHTML = "#markupcolor .slider::-webkit-slider-thumb{background-color:hsl(" + hsl + ");}";
            }
            document.querySelector("#markupcolor input").addEventListener("input", (e) => { setThumbCol(e.target.value); });
            setThumbCol(document.querySelector("#markupcolor input").value);

            // show color palettes
            const addPaletteButton = (palette) => {
                const id = "palette_" + palette.name;
                document.querySelector("#palettes").insertAdjacentHTML("beforeend", `<button id="${id}">${palette.name} (${palette.colors.length} colors)</button>`);
            };
            if (settings.customPalettes && settings.customPalettes != "") {
                try {
                    const palettes = JSON.parse(settings.customPalettes);
                    palettes.forEach(palette => {
                        addPaletteButton(palette);
                    });
                }
                catch { }
            }

            // add palette events
            const initPaletteEvents = (btn) => {
                btn.addEventListener("click", () => {
                    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, "usepalette " + btn.id.replace("palette_", ""));
                    });
                    document.querySelectorAll("#palettes > button.active").forEach(p => p.classList.remove("active"));
                    btn.classList.add("active");
                });
                let remove = false;
                const cap = btn.innerText;
                if (btn.id.replace("palette_", "") != "originalPalette" && btn.id.replace("palette_", "") != "oldSkribbl") btn.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (!remove) {
                        remove = true;
                        btn.innerText = "Repeat 2 delete";
                        setTimeout(() => {
                            btn.innerText = cap;
                            remove = false;
                        }, 2000);
                    }
                    else {
                        if (btn.classList.contains("active")) {
                            settings.palette = "originalPalette";
                            document.querySelector("#palette_originalPalette").classList.add("active");
                            chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                                chrome.tabs.sendMessage(tabs[0].id, "usepalette originalPalette");
                            });
                        }
                        btn.remove();
                        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                            chrome.tabs.sendMessage(tabs[0].id, "rempalette " + btn.id.replace("palette_", ""));
                        });
                    }
                });
                document.querySelector("#palette_" + settings.palette)?.classList.add("active");
            }
            document.querySelectorAll("#palettes > button").forEach(btn => {
                initPaletteEvents(btn);
            });

            // add add palette event
            document.querySelector("#enterJSON").addEventListener("click", () => {
                const json = document.querySelector("#paletteJSON").value;
                const palette = { name: "", colors: [], rowCount: 0 };
                try {
                    let parse = JSON.parse(json);
                    if (parse.name.length > 0 && !document.querySelector("#palette_" + parse.name)) palette.name = parse.name;
                    else throw new Error("no name");
                    if (parse.colors.length > 0) palette.colors = parse.colors;
                    else throw new Error("no colors");
                    if (parse.rowCount > 0) palette.rowCount = parse.rowCount;
                    else throw new Error("no rowcount");
                    document.querySelector("#paletteJSON").style.color = ""; chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, "addpalette " + JSON.stringify(palette));
                    });
                    addPaletteButton(palette);
                    initPaletteEvents(document.querySelector("#palette_" + palette.name));
                }
                catch {
                    document.querySelector("#paletteJSON").style.color = "red";
                }
            });
        });

        // add togglebutton events
        document.querySelectorAll("#mainSettings button").forEach(btn => {
            btn.addEventListener("pointerdown", () => {
                const setting = btn.id;
                const state = btn.classList.contains("active");
                if (state) btn.classList.remove("active");
                else btn.classList.add("active");
                chrome.tabs.sendMessage(tabID, (state ? "disable " : "enable ") + setting);
            });
        });

        // request setting string from skribbl
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, "getSettings");
        });
    }
    else {
        skribbl = false;
        // remove all nodes that are skribbl and sketchful
        document.querySelectorAll(".skribbl, .sketchful").forEach((node) => { node.remove(); });

        let h1 = document.querySelector("h1");
        h1.style.cursor = "pointer";
        h1.innerHTML = "<image id='play' height='50px' width='50px' src='/res/playL.gif'><br>Play!";
        h1.onmouseenter = function () { document.querySelector("#play").src = '/res/playH.gif'; };
        h1.onmouseleave = function () { document.querySelector("#play").src = '/res/playL.gif'; };
        h1.onclick = () => {
            chrome.tabs.update({ url: "https://skribbl.io" });
            window.close();
        };
    }
    // set events of discord info
    const credits = document.querySelector("#credits");
    const website = document.querySelector("#help");
    const cont = credits.innerHTML;
    credits.parentElement.onclick = () => window.open("https://discord.com/invite/pAapmUmWAM");
    credits.onmouseover = () => { credits.innerHTML = "call me maybe?"; };
    credits.onmouseout = () => { credits.innerHTML = cont; };
    website.addEventListener("click", () => chrome.tabs.create({ url: "https://typo.rip/" }));
});

