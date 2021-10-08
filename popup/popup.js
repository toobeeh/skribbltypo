let settings = null;
let skribbl = true;
let palantirMember = null;
let tabID = 0;
if (typeof (localStorage) !== "object") { // localstoray polyfill dummy for safari
    this.localStorage = [];
}

const setMemberTab = (member) => {
    if (member) {
        document.querySelector("#login").style.display = "none";
        document.querySelector("#server").style.display = "";
        document.querySelector("#loginName").textContent = "Logged in: '" + member.UserName + "'";
        document.querySelector("#authGuilds").innerHTML = member.Guilds.map(
            guild => `<div class="label" style="cursor:pointer" data-guild="${guild.GuildID}" data-token="${guild.ObserveToken}">${guild.GuildName}</div>`).join("");
        document.querySelectorAll("#authGuilds > div").forEach(btn => {
            let removeGuild = false;
            let guildName = btn.innerText;
            let token = btn.getAttribute("data-token");
            btn.addEventListener("pointerdown", async () => {
                if (removeGuild == false) {
                    btn.textContent = "Remove " + guildName + "?";
                    removeGuild = true;
                    setTimeout(() => {
                        btn.textContent = guildName;
                        removeGuild = false;
                    }, 2000);
                }
                else {
                    let removeResponse = await (await fetch('https://tobeh.host/Orthanc/verify/', {
                        method: 'POST',
                        headers: {
                            'Accept': '*/*',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        body: "remove=true&observeToken=" + token + "&member=" + encodeURIComponent(JSON.stringify(member))
                    }
                    )).json();
                    if (removeResponse.Valid) {
                        // reload skribbl
                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
                        });
                        // update guilds
                        palantirMember = removeResponse.Member;
                        setMemberTab(removeResponse.Member);
                    }
                }
            });
        });
    }
    else {
        document.querySelector("#login").style.display = "";
        document.querySelector("#server").style.display = "none";
    }
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
            // prepare palantir page if logged in
            palantirMember = settings.member != "" ? JSON.parse(settings.member) : null;
            if (palantirMember) {
                setMemberTab(palantirMember);
            }
            // set login function
            document.querySelector("#loginSubmit").addEventListener("pointerdown", async () => {
                const enter = document.querySelector("#loginEnter");
                let login = parseInt(enter.value);
                if (login == NaN || login < 0 || login > 99999999) {
                    enter.style.color = "#f04747";
                    return;
                }
                const loginResponse = await (await fetch('https://tobeh.host/Orthanc/login/', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: "login=" + login
                })).json();
                if (!loginResponse.Valid) {
                    enter.style.color = "#f04747";
                    return;
                }
                // update member
                chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, "setmember " + JSON.stringify(loginResponse.Member));
                });
                // reload skribbl
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
                });
                palantirMember = loginResponse.Member;
                setMemberTab(palantirMember);
            });
            // set add server function
            document.querySelector("#verifyToken").addEventListener("pointerdown", async () => {
                const enter = document.querySelector("#observeToken");
                let token = parseInt(enter.value);
                if (token == NaN || token < 0 || token > 99999999) {
                    enter.style.color = "#f04747";
                    return;
                }
                const verifyResponse = await (await fetch('https://tobeh.host/Orthanc/verify/', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: "observeToken=" + token + "&member=" + encodeURIComponent(JSON.stringify(palantirMember))
                }
                )).json();
                if (!verifyResponse.Valid) {
                    enter.style.color = "#f04747";
                    return;
                }
                // reload skribbl
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
                });
                palantirMember = verifyResponse.Member;
                setMemberTab(palantirMember);
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
    else if (tabs[0].url.includes("sketchful.io")) {
        skribbl = false;
        // remove content that doesnt belong to sketchful
        document.querySelectorAll(".skribbl:not(.sketchful)").forEach((node) => { node.remove(); });
        document.querySelector("#tabDiscord").classList.add("tabActive");
        document.querySelector("#palantirSettings").style.display = "block";

        // load settings from skribbl
        let skribblSettings = JSON.parse(localStorage.skribblSettings);
        let member = JSON.parse(skribblSettings.member);

        // show palantir user
        if (member) document.querySelector("#sketchfulLogin").textContent = member.UserName;
        else document.querySelector("#sketchfulLogin").textContent = "Go to skribbl and log in with your token!";
        if (member.Guilds.length > 0) {
            let guildContainer = document.querySelector("#sketchfulGuilds");
            guildContainer.innerHTML = "";
            member.Guilds.forEach(g => { guildContainer.innerHTML += "<div class='label'>" + g.GuildName + "</div>" });
        }

        // sketchful allow toggle
        if (!localStorage.sketchfulAllow) localStorage.sketchfulAllow = "false";
        let sketchfulAllowButton = document.querySelector("#palantirToggleSketchful");
        if (localStorage.sketchfulAllow == "true") sketchfulAllowButton.classList.add("active");
        const updateSketchfulUser = (member, userallow) => {
            data = {
                member: member,
                userallow: userallow
            };
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, { updateUser: true, data: JSON.stringify(data) });
            });
        }
        // callback for sketchful toggle
        sketchfulAllowButton.addEventListener("click", () => {
            if (localStorage.sketchfulAllow == "true") {
                sketchfulAllowButton.className = '';
                localStorage.sketchfulAllow = "false"
            }
            else { sketchfulAllowButton.className = 'active'; localStorage.sketchfulAllow = "true" }
            updateSketchfulUser(member, localStorage.sketchfulAllow);
        });
        updateSketchfulUser(member, localStorage.sketchfulAllow);
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

