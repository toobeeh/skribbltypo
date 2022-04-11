// add listener to get settings string from skribbl-context
var settings = null;
var skribbl = true;
var member = null;
var tabid;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        settings = JSON.parse(request.get);
        localStorage.skribblSettings = request.get;
        document.querySelectorAll("button").forEach(function (bt) {
            if (bt.id == "tablet" && settings.ink == "true") {
                bt.className = "active";
                bt.innerText += (": " + settings.inkMode);
            }
            if (bt.id == "imageagent" && settings.imageAgent == "true") bt.className = "active";
            if (bt.id == "markup" && settings.markup == "true") bt.className = "active";
            if (bt.id == "holy" && settings.ownHoly == "true") bt.className = "active";
            if (bt.id == "charbar" && settings.charBar == "true") bt.className = "active";
            if (bt.id == "backbutton" && settings.displayBack == "true") bt.className = "active";
            if (bt.id == "randomToggle" && settings.randomColorButton == "true") bt.className = "active";
            if (bt.id == "palantirToggle" && settings.userAllow == "true") bt.className = "active";
            if (bt.id == "clearcanvas" && settings.keepCanvas == "true") bt.className = "active";
            if (bt.id == "controls" && settings.controls == "true") bt.className = "active";
            if (bt.id == "keybinds" && settings.keybinds == "true") bt.className = "active";
            if (bt.id == "gamemodes" && settings.gamemodes == "true") bt.className = "active";
            if (bt.id == "translate" && settings.translate == "true") bt.className = "active";
            if (bt.id == "chatcommands" && settings.chatcommands == "true") bt.className = "active";
            if (bt.id == "emojipicker" && settings.emojipicker == "true") bt.className = "active";
            if (bt.id == "drops" && settings.drops == "true") bt.className = "active";
            if (bt.id == "zoomdraw" && settings.zoomdraw == "true") bt.className = "active";
            if (bt.id == "sizeslider" && settings.sizeslider == "true") bt.className = "active";
            if (bt.id == "quickreact" && settings.quickreact == "true") bt.className = "active";
        });
        tabid = sender.tab.id;

        let sensSlider = document.querySelector("#sensSlider input[type='range']");
        sensSlider.value = settings.sens;
        sensSlider.dispatchEvent(new Event('input'));

        let markupSlider = document.querySelector("#markupSlider input[type='range']");
        markupSlider.value = hexToHSL(settings.markupColor).h * 360;
        markupSlider.dispatchEvent(new Event('input'));

        let randomSlider = document.querySelector("#randomSlider input[type='range']");
        randomSlider.value = settings.randomColorInterval;
        randomSlider.dispatchEvent(new Event('input'));

        if (settings.member != "") {

            document.querySelector("#login").style.display = "none";
            document.querySelector("#server").style.display = "";
            member = JSON.parse(settings.member);
            document.querySelector("#loginName").textContent = "Logged in as '" + member.UserName + "'";

            document.querySelector("#authGuilds").innerHTML = "";
            member.Guilds.forEach((g) => {
                addAuthGuild(g.GuildID, g.GuildName, g.ObserveToken);
            });
        }

        if (settings.palette == "originalPalette") document.querySelector("#originalPalette").classList.add("active");
        if (settings.customPalettes && settings.customPalettes.length > 0) {
            JSON.parse(settings.customPalettes).forEach(p => {
                let bt = document.createElement("button");
                if (p.name == settings.palette) bt.classList.add("active");
                bt.innerText = p.name;
                bt.id = p.name;
                bt.onclick = togglePalette;
                let contextm = false;
                bt.oncontextmenu = (e) => {
                    e.preventDefault();
                    if (contextm == true) {
                        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                            chrome.tabs.sendMessage(tabs[0].id, "rempalette " + bt.id);
                        });
                        bt.remove();
                    }
                    else if(bt.id != "sketchfulPalette") {
                        contextm = true;
                        bt.innerText = "Rightclick to delete";
                        setTimeout(() => { contextm = false; bt.innerText = bt.id; }, 2000);
                    }
                }
                document.querySelector("#palettes").appendChild(bt);
            });
        }
    }
);

function togglePalette(e) {
    if (!localStorage.paletteInfo) {
        alert("WARNING:\nOnly players with the same installed palette can see the colors!\nUse this ONLY for private games and if all players aggreed & added the palette!\nIf you want to know how to create custom palettes, contact tobeh#7437.")
        localStorage.paletteInfo = true;
    }
    [...document.querySelector("#palettes").children].forEach(c => c.classList.remove("active"));
    e.target.classList.add("active");
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, "usepalette " + this.id);
    });
}

// func to check if skribbl is opened and adjust content
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs[0].url.includes("skribbl.io")) {
        skribbl = true;
        document.querySelectorAll(".sketchful:not(.skribbl)").forEach(function (node) { node.remove(); });
    }
    else if (tabs[0].url.includes("sketchful.io")) {
        skribbl = false;
        document.querySelectorAll(".skribbl:not(.sketchful)").forEach(function (node) { node.remove(); });
        document.querySelector("#tabDiscord").classList.add("tabActive");
        document.querySelector("#palantirSettings").style.display = "block";
        let skribblSettings = JSON.parse(localStorage.skribblSettings);
        let member = JSON.parse(skribblSettings.member);
        //alert(member.UserName);
        if (member) document.querySelector("#sketchfulLogin").textContent = member.UserName;
        else document.querySelector("#sketchfulLogin").textContent = "Go to skribbl and log in with your token!";
        if (member.Guilds.length > 0) {
            let guildContainer = document.querySelector("#sketchfulGuilds");
            guildContainer.innerHTML = "";
            member.Guilds.forEach(g => {
                guildContainer.innerHTML += "<div class='label'>" + g.GuildName + "</div>";
            });
        }
        if (!localStorage.sketchfulAllow) localStorage.sketchfulAllow = "false";
        let sketchfulAllowButton = document.querySelector("#palantirToggleSketchful");
        if (localStorage.sketchfulAllow == "true") sketchfulAllowButton.classList.add("active");
        sketchfulAllowButton.addEventListener("click", () => {
            if (localStorage.sketchfulAllow == "true") { sketchfulAllowButton.className = ''; localStorage.sketchfulAllow = "false" }
            else { sketchfulAllowButton.className = 'active'; localStorage.sketchfulAllow = "true" }
            updateSketchfulUser(member, localStorage.sketchfulAllow);
        })
        updateSketchfulUser(member, localStorage.sketchfulAllow);
    }
    else {
        skribbl = false;
        document.querySelectorAll(".skribbl.sketchful").forEach(function (node) { node.remove(); });

        let h1 = document.querySelector("h1");
        h1.style.cursor = "pointer";
        h1.innerHTML = "<image id='play' height='50px' width='50px' src='/res/playL.gif'><br>Play!";
        h1.onmouseenter = function () { document.querySelector("#play").src = '/res/playH.gif'; };
        h1.onmouseleave = function () { document.querySelector("#play").src = '/res/playL.gif'; };
        h1.onclick = function () {
            chrome.tabs.update({ url: "https://skribbl.io" });
            window.close();
        };
    }
});

function updateSketchfulUser(member, userallow) {
    data = {
        member: member,
        userallow: userallow
    };
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { updateUser: true, data: JSON.stringify(data) });
    });
}

// Check if settins string was received - if not, indicates that the popup didnt sync with skribbl (after update for example)
setTimeout(function () { if (!settings && skribbl) document.querySelector("h1").innerHTML = "Updated... <br/>Reload Skribbl!"; }, 500);

// set button events
document.querySelectorAll("button").forEach(function (bt) {
    if (bt.id == "help") bt.onclick = function () {
        chrome.tabs.create({
            url: "https://typo.rip" });
    }
    else if (bt.id == "verifyToken") bt.onclick = verifyTokenInput;
    else if (bt.id == "loginSubmit") bt.onclick = verifyLoginInput;
    else if (bt.id == "originalPalette") bt.onclick = togglePalette;
    else if (bt.id == "enterJSON") bt.onclick = verifyJSON;
    else if (bt.id == "tablet") bt.onclick = setTabletState;
    else bt.onclick = toggleActive;
});

// func to switch tablet state
function setTabletState() {
    let btn = document.querySelector("#tablet");
    let messages = [];
    let thickness = btn.innerText.includes("thickness");
    let brightness = btn.innerText.includes("brightness");
    let degree = btn.innerText.includes("degree");
    //if (btn.innerText.includes("All")) brightness = degree = thickness = true;

    if (!thickness && !brightness && !degree) { thickness = true; messages.push("enable ink"); messages.push("inkmode thickness"); }
    else if (thickness && !brightness && !degree) { brightness = true; thickness = false; messages.push("inkmode brightness"); }
    else if (!thickness && brightness && !degree) { degree = true; brightness = false; messages.push("inkmode degree"); }
    else if (!thickness && !brightness && degree) { brightness = true; messages.push("inkmode degree brightness");}
    else if (!thickness && brightness && degree) { brightness = false; degree = false; messages.push("disable ink");}

    btn.innerText = "Tablet";
    if (degree || brightness || thickness) {
        btn.classList.add("active")
        btn.innerText += ": " +
            (thickness ? "thickness " : "") +
            (brightness ? "brightness " : "") +
            (degree ? "degree " : "");
    }
    else btn.classList.remove("active");

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        messages.forEach(m => { chrome.tabs.sendMessage(tabs[0].id, m); });
    });
}

// func to check palette json
function verifyJSON() {
    let json = document.querySelector("#paletteJSON").value;
    let obj;
    try {
        obj = JSON.parse(json);
    }
    catch(e){ alert("Invalid palette JSON!"); return; }

    if (!obj.name || !obj.rowCount || !obj.colors || obj.colors.length < 1) { alert("Invalid palette JSON!") }
    obj.name = obj.name.replace(" ", "").trim();

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, "addpal " + JSON.stringify(obj) );
    });
    document.querySelector("#paletteJSON").value = "";

    let bt = document.createElement("button");
    bt.innerText = obj.name;
    bt.id = obj.name;
    bt.onclick = togglePalette;
    document.querySelector("#palettes").appendChild(bt);
}


// set tab click events
document.querySelectorAll(".tabSelection .tabTitle").forEach((t) => t.addEventListener("click", setActiveTab));

function setActiveTab(event) {
    let activeTab = document.querySelector(".tabActive");
    activeTab.classList.toggle("tabActive");
    this.classList.toggle("tabActive");
    if (activeTab.id == "tabDashboard") $("#mainSettings").slideToggle(200);
    if (activeTab.id == "tabAdvanced") $("#advancedSettings").slideToggle(200);
    if (activeTab.id == "tabDiscord") $("#palantirSettings").slideToggle(200);

    if (this.id == "tabDashboard") $("#mainSettings").slideToggle(200);
    if (this.id == "tabAdvanced") $("#advancedSettings").slideToggle(200);
    if (this.id == "tabDiscord") $("#palantirSettings").slideToggle(200);
}

// initialize sliders
(function () {
    let markupSlider = document.querySelector("#markupSlider input[type='range']");
    let sensSlider = document.querySelector("#sensSlider input[type='range']");
    let markupFill = document.querySelector("#markupSlider .sliderFill");
    let sensFill = document.querySelector("#sensSlider .sliderFill");
    let randomSlider = document.querySelector("#randomSlider input[type='range']");
    let randomFill = document.querySelector("#randomSlider .sliderFill");

    sensSlider.addEventListener("input", function () {
        sensFill.style.width = this.value + "%";
    });

    function setSens() {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, "sensitivity " + this.value);
        });
    }

    sensSlider.addEventListener("mouseup", setSens);
    sensSlider.addEventListener("touchend", setSens);

    randomSlider.addEventListener("input", function () {
        randomFill.style.width = this.value / 5 + "%";
    });

    function setRandom() {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, "randominterval " + this.value);
        });
    }

    randomSlider.addEventListener("mouseup", setRandom);
    randomSlider.addEventListener("touchend", setRandom);

    markupSlider.addEventListener("input", function () {
        markupFill.style.width = this.value + "%";
    });

    markupSlider.addEventListener("input", function () {
        markupFill.style.width = this.value / 3.57 + "%";
        let hsl = this.value + ", 100%, 90%";
        document.querySelector("#sliderThumbColorStyle").innerHTML = "#markupSlider .slider::-webkit-slider-thumb{background-color:hsl(" + hsl + ");}";
    });

    function setMarkup() {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, "markupcolor " + hslToHex(this.value, 100, 90));
        });
    }

    markupSlider.addEventListener("mouseup", setMarkup);
    markupSlider.addEventListener("touchend", setMarkup);

})();


// set discord-events
(function () {
    let cred = document.querySelector("#credits");
    let dc = document.querySelector("#credits::before");
    let cont = cred.innerHTML;
    credits.parentElement.onclick = ()=> window.open("https://discord.com/invite/pAapmUmWAM");
    cred.onmouseover = function () { cred.innerHTML = "call me maybe?"; };
    cred.onmouseout = function () { cred.innerHTML = cont; };
})();

// request setting string
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, "get");
});


// func to toggle buttons
function toggleActive() {
    let msg;
    if (this.className.includes('active')) { this.className = ''; msg = "disable "; }
    else { this.className = 'active'; msg = "enable "; }

    if (this.id == "tablet") msg += "ink";
    if (this.id == "imageagent") msg += "agent";
    if (this.id == "markup") msg += "markup";
    if (this.id == "holy") msg += "holy";
    if (this.id == "charbar") msg += "charbar";
    if (this.id == "backbutton") msg += "back";
    if (this.id == "randomToggle") msg += "random";
    if (this.id == "palantirToggle") msg += "palantir";
    if (this.id == "clearcanvas") msg += "keepCanvas";
    if (this.id == "controls") msg += "controls";
    if (this.id == "gamemodes") msg += "gamemodes";
    if (this.id == "keybinds") msg += "keybinds";
    if (this.id == "translate") msg += "translate";
    if (this.id == "chatcommands") msg += "chatcommands";
    if (this.id == "sizeslider") msg += "sizeslider";
    if (this.id == "zoomdraw") msg += "zoomdraw";
    if (this.id == "quickreact") msg += "quickreact";
    if (this.id == "drops") msg += "drops";
    if (this.id == "emojipicker") msg += "emojipicker";

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}

async function verifyTokenInput() {
    let token;
    token = document.querySelector("#observeToken").value.trim();
    token = parseInt(token);
    if (token == NaN || token < 0 || token > 99999999) {
        document.querySelector("#observeToken").style.color = "#f04747";
        return;
    }

    let memberResponse = await (await fetch('https://tobeh.host/Orthanc/verify/', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: "observeToken=" + token + "&member=" + encodeURIComponent(JSON.stringify(member))
    }
    )).json();
    if (!memberResponse.Valid) {
        document.querySelector("#observeToken").style.color = "#f04747";
        return;
    }

    member = memberResponse.Member;
    let skribblSettings = JSON.parse(localStorage.skribblSettings);
    skribblSettings.member = JSON.stringify(member);
    localStorage.skribblSettings = JSON.stringify(skribblSettings);

    document.querySelector("#authGuilds").innerHTML = "";
    member.Guilds.forEach((g) => {
        addAuthGuild(g.GuldID, g.GuildName, g.ObserveToken);
    });

    // reload skribbl
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });

}

async function removeGuildByToken(token) {
    let memberResponse = await (await fetch('https://tobeh.host/Orthanc/verify/', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: "remove=true&observeToken=" + token + "&member=" + encodeURIComponent(JSON.stringify(member))
    }
    )).json();
    if (!memberResponse.Valid) {
        document.querySelector("#observeToken").style.color = "#f04747";
        return;
    }

    member = memberResponse.Member;
    let skribblSettings = JSON.parse(localStorage.skribblSettings);
    skribblSettings.member = JSON.stringify(member);
    localStorage.skribblSettings = JSON.stringify(skribblSettings);

    document.querySelector("#authGuilds").innerHTML = "";
    member.Guilds.forEach((g) => {
        addAuthGuild(g.GuldID, g.GuildName, g.ObserveToken);
    });

    // reload skribbl
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
}

async function verifyLoginInput() {
    let login;
    login = document.querySelector("#loginEnter").value;
    login = parseInt(login);
    if (login == NaN || login < 0 || login > 99999999) {
        document.querySelector("#loginEnter").style.color = "#f04747";
        return;
    }

    let loginResponse = await (await fetch('https://tobeh.host/Orthanc/login/', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: "login=" + login
    }
    )).json();
    if (!loginResponse.Valid) {
        document.querySelector("#loginEnter").style.color = "#f04747";
        return;
    }

    document.querySelector("#login").style.display = "none";
    document.querySelector("#server").style.display = "";
    member = loginResponse.Member;
    if (member.Guilds.length > 0) document.querySelector("#authGuilds").innerHTML = "";
    member.Guilds.forEach(g => {
        addAuthGuild(g.GuildID, g.GuildName, g.ObserveToken);
    });
    let skribblSettings = JSON.parse(localStorage.skribblSettings);
    skribblSettings.member = JSON.stringify(member);
    localStorage.skribblSettings = JSON.stringify(skribblSettings);
    document.querySelector("#loginName").textContent = "Logged in as '" + member.UserName + "'";

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, "memberlogin " + loginResponse.Member.UserLogin);
    });

}

function addAuthGuild(guildID, guildName, guildToken) {
    let container = document.querySelector("#authGuilds");
    let guild = document.createElement("div");
    let remove = false;
    guild.className = "label";
    guild.style.cursor = "pointer";
    guild.onclick = () => {
        if (remove == false) {
            guild.textContent = "Remove " + guildName + "?";
            remove = true;
            setTimeout(() => {
                guild.textContent = guildName;
                remove = false;
            }, 2000);
        }
        else {
            removeGuildByToken(guildToken);
        }
    }
    guild.textContent = guildName;
    guild.id = guildID;
    container.appendChild(guild);
}

// convert color code .. thx @stackoverflow
function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// convert color code .. thx @stackoverflow
function hexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    var HSL = new Object();
    HSL['h'] = h;
    HSL['s'] = s;
    HSL['l'] = l;
    return HSL;
}
