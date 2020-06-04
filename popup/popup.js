// add listener to get settings string from skribbl-context
var settings = null;
var skribbl = true;
var member = null;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        settings = JSON.parse(request.get);
        document.querySelectorAll("button").forEach(function (bt) {
            if (bt.id == "tablet" && settings.ink == "true") bt.className = "active";
            if (bt.id == "imageagent" && settings.imageAgent == "true") bt.className = "active";
            if (bt.id == "markup" && settings.markup == "true") bt.className = "active";
            if (bt.id == "holy" && settings.ownHoly == "true") bt.className = "active";
            if (bt.id == "charbar" && settings.charBar == "true") bt.className = "active";
            if (bt.id == "backbutton" && settings.displayBack == "true") bt.className = "active";
            if (bt.id == "randomToggle" && settings.randomColorButton == "true") bt.className = "active";
        });

        let sensSlider = document.querySelector("#sensSlider input[type='range']");
        sensSlider.value = settings.sens;
        sensSlider.dispatchEvent(new Event('input'));

        let markupSlider = document.querySelector("#markupSlider input[type='range']");
        markupSlider.value = hexToHSL(settings.markupColor).h * 360;
        markupSlider.dispatchEvent(new Event('input'));

        let randomSlider = document.querySelector("#randomSlider input[type='range']");
        randomSlider.value = settings.randomColorInterval;
        randomSlider.dispatchEvent(new Event('input'));

        if (settings.member) {

            document.querySelector("#login").style.display = "none";
            document.querySelector("#server").style.display = "";
            member = JSON.parse(settings.member);
            document.querySelector("#loginName").textContent = member.UserName;

            document.querySelector("#authGuilds").innerHTML = "";
            member.Guilds.forEach((g) => {
                addAuthGuild(g.GuildID, g.GuildName);
            });
        }

        
    }
);

// func to check if skribbl is opened and adjust content
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (!tabs[0].url.includes("skribbl.io")) {
        skribbl = false;
        document.querySelectorAll(".skribbl").forEach(function (node) { node.remove(); });

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

// Check if settins string was received - if not, indicates that the popup didnt sync with skribbl (after update for example)
setTimeout(function () { if (!settings && skribbl) document.querySelector("h1").innerHTML = "Updated... <br/>Reload Skribbl!"; }, 500);

// set button events
document.querySelectorAll("button").forEach(function (bt) {
    if (bt.id == "help") bt.onclick = function () { window.location.href = "readme.html"; };
    else if (bt.id == "verifyToken") bt.onclick = verifyTokenInput;
    else if (bt.id == "loginSubmit") bt.onclick = verifyLoginInput;
    else bt.onclick = toggleActive;
});

// set advanced peek event
document.querySelector("#advancedPeek").onclick = function () {
    if (this.className != "peekDown") {
        this.className = "peekDown";
        $("#mainSettings").slideToggle(200);
        $("#palantirPeek").slideToggle(200);
        $("#advancedSettings").slideToggle(200);
        $("h1").text("Advanced");
    }
    else {
        this.className = "peekUp";
        $("#mainSettings").slideToggle(200);
        $("#palantirPeek").slideToggle(200);
        $("#advancedSettings").slideToggle(200);
        $("h1").text("Dashboard");
    }
};

// set palantir peek event
document.querySelector("#palantirPeek").onclick = function () {
    if (this.className != "peekUp") {
        this.className = "peekUp";
        $("#mainSettings").slideToggle(200);
        $("#advancedPeek").slideToggle(200);
        $("#palantirSettings").slideToggle(200);
        $("h1").text("Discord Lobbies");
    }
    else {
        this.className = "peekDown";
        $("#mainSettings").slideToggle(200);
        $("#advancedPeek").slideToggle(200);
        $("#palantirSettings").slideToggle(200);
        $("h1").text("Dashboard");
    }
};

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
            chrome.tabs.sendMessage(tabs[0].id, "set sens " + this.value);
        });
    }

    sensSlider.addEventListener("mouseup", setSens);
    sensSlider.addEventListener("touchend", setSens);

    randomSlider.addEventListener("input", function () {
        randomFill.style.width = this.value / 5 + "%";
    });

    function setRandom() {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, "set random " + this.value);
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
            chrome.tabs.sendMessage(tabs[0].id, "set markup " + hslToHex(this.value, 100, 90));
        });
    }

    markupSlider.addEventListener("mouseup", setMarkup);
    markupSlider.addEventListener("touchend", setMarkup);

})();


// set discord-events
(function () {
    let cred = document.querySelector("#credits");
    let dc = document.querySelector("#dc img");
    let cont = cred.innerHTML;
    dc.onmouseover = function () { cred.innerHTML = "call me maybe ;)"; };
    dc.onmouseout = function () { cred.innerHTML = cont; };
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

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}

async function verifyTokenInput() {
    let token;
    token = document.querySelector("#observeToken").value;
    token = parseInt(token);
    if (token == NaN || token < 0 || token > 99999999) {
        document.querySelector("#observeToken").style.color = "#f04747";
        return;
    }

    let memberResponse = await (await fetch('https://www.tobeh.host/Orthanc/verify/', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: "observeToken=" + token + "&member=" + JSON.stringify(member)
    }
    )).json();
    if (!memberResponse.Valid) {
        document.querySelector("#observeToken").style.color = "#f04747";
        return;
    }

    member = memberResponse.Member;

    document.querySelector("#authGuilds").innerHTML = "";
    member.Guilds.forEach((g) => {
        addAuthGuild(g.GuldID, g.GuildName);
    });

    //chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    //    chrome.tabs.sendMessage(tabs[0].id, "memberlogin " + JSON.stringify(member));
    //});

}

async function verifyLoginInput() {
    let login;
    login = document.querySelector("#loginEnter").value;
    login = parseInt(login);
    if (login == NaN || login < 0 || login > 99999999) {
        document.querySelector("#loginEnter").style.color = "#f04747";
        return;
    }

    let loginResponse = await (await fetch('https://www.tobeh.host/Orthanc/login/', {
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
    document.querySelector("#loginName").textContent = member.UserName;

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, "memberlogin " + loginResponse.Member.UserLogin);
    });

}

function addAuthGuild(guildID, guildName) {
    let container = document.querySelector("#authGuilds");
    let guild = document.createElement("div");
    guild.className = "label";
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
