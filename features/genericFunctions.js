// generic re-usable functions which have no dependencies

//Queryselector bindings
const QS = document.querySelector.bind(document);
const QSA = document.querySelectorAll.bind(document);

// polyfill customevent
const newCustomEvent = (type, detail = {}) => {
    if (typeof(cloneInto) == "undefined") return new CustomEvent(type, detail);
    let eventDetail = cloneInto(detail, document.defaultView);
    return clonedEvent = new document.defaultView.CustomEvent(type, eventDetail);
}

// func to mark a message node with background color
const markMessage = (newNode) => {
    if (localStorage.markup != "true") return;
    let sender = newNode.innerHTML.slice(newNode.innerHTML.indexOf("<b>"), newNode.innerHTML.indexOf("</b>")).slice(3, -2);
    if (sender == socket.clientData.playerName || sender != "" && localStorage.vip.split("/").includes(sender))
        newNode.style.background = localStorage.markupColor;
}

//func to scroll to bottom of message container
const scrollMessages = () => {
    let box = document.querySelector("#boxMessages");
    box.scrollTop = box.scrollHeight;
}

const elemFromString = (html) => {
    let dummy = document.createElement("div");
    dummy.innerHTML = html;
    return dummy.firstChild;
}

const waitMs = async (timeMs) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), timeMs);
    });
};

const scaleDataURL = async (url, width, height) => {
    return new Promise((resolve, reject) => {
        let source = new Image();
        source.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(source, 0, 0, width, height);
            resolve(canvas.toDataURL());
        }
        source.src = url;
    });
}

const dataURLtoClipboard = async (dataUrl) => { // parts from: https://stackoverflow.com/questions/23182933/converting-an-image-dataurl-to-image
    // Decode the dataURL
    let binary = atob(dataUrl.split(',')[1]);
    // Create 8-bit unsigned array
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    // Return blob
    let blob = new Blob([new Uint8Array(array)], {
        type: 'image/png'
    });
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    printCmdOutput("Copied to clipboard");
}

// func to replace umlaute in a string
const replaceUmlaute = (str) => {
    // umlaute which have to be replaced
    const umlautMap = {
        '\u00dc': 'UE',
        '\u00c4': 'AE',
        '\u00d6': 'OE',
        '\u00fc': 'ue',
        '\u00e4': 'ae',
        '\u00f6': 'oe',
        '\u00df': 'ss',
    }
    return str
        .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
            const big = umlautMap[a.slice(0, 1)];
            return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
        })
        .replace(new RegExp('[' + Object.keys(umlautMap).join('|') + ']', "g"),
            (a) => umlautMap[a]
        );
}

// get the current or last drawer as safe as possible
const getCurrentOrLastDrawer = () => {
    let drawer = "Unknown";
    if (sessionStorage.practise == "true") drawer = document.querySelector("#inputName").value.split("#")[0];
    else if (sessionStorage.lastDrawing) drawer = sessionStorage.lastDrawing;
    else try {
        drawer = QS('#containerGamePlayers .drawing:not([style*="display: none"])').parentElement.parentElement.QS(".name").textContent.replace(" (You)", "");
    }
    catch{ }
    return drawer;
}

// adds a color palette
const addColorPalette = (paletteJson) => {
    let containerColorbox = document.createElement("div");
    containerColorbox.classList.add("containerColorbox");

    let columns = [];
    paletteJson.colors.forEach(c => {
        let index = paletteJson.colors.indexOf(c);
        if (!columns[Math.floor(index / paletteJson.rowCount)]) columns.push([]);
        columns[Math.floor(index / paletteJson.rowCount)].push(c);
    });

    let paletteContainer = document.createElement("div");
    paletteContainer.id = paletteJson.name;

    if (localStorage.palette == paletteJson.name) document.querySelector(".containerColorbox").style.display = "none";
    else paletteContainer.style.display = "none";

    paletteContainer.classList.add("containerColorbox");
    paletteContainer.classList.add("customPalette");
    paletteContainer.setAttribute("data-toggle", "tooltip");
    paletteContainer.setAttribute("data-placement", "top");
    paletteContainer.setAttribute("title", "");
    paletteContainer.setAttribute("data-original-title", "Select a color");

    columns.forEach(c => {
        let colorColumn = document.createElement("div");
        colorColumn.classList.add("containerColorColumn");
        c.forEach(i => {
            let colorItem = document.createElement("div");
            colorItem.classList.add("colorItem");
            colorItem.setAttribute("data-color", i.index);
            colorItem.style.background = i.color;
            colorItem.addEventListener("click", () => document.querySelector("body").dispatchEvent(newCustomEvent("setColor", { detail: i.index })));
            colorColumn.appendChild(colorItem);
        });
        paletteContainer.appendChild(colorColumn);
    });
    let tools = document.querySelector(".containerTools");
    tools.parentElement.insertBefore(paletteContainer, tools);
    return paletteContainer;
}

// show practise mode
const showPractise = () => {
    sessionStorage.practise = true;
    QS(".containerToolbar").style.display = "";
    QS("#screenGame").style.display = "block";
    QS("#screenLogin").style.display = "none";
    QS("#containerLogoBig").style.display = "none";
    document.querySelector("#currentWord").innerHTML = "Practise";
}

// leave lobby
const leaveLobby = (next = false) => {
    if (next && sessionStorage.practise != "true") {
        let join = () => {
            document.removeEventListener("disconnectedSocket", join);
            setTimeout(document.body.dispatchEvent(newCustomEvent("joinLobby")),100);
        }
        document.addEventListener("disconnectedSocket", join);
    }
    document.body.dispatchEvent(newCustomEvent("leaveLobby"));
    if (sessionStorage.practise == "true") {
        sessionStorage.practise = "false";
        QS("#screenGame").style.display = "none";
        QS(".containerToolbar").style.display = "none";
        if(next)document.body.dispatchEvent(newCustomEvent("joinLobby"))
    }
    if (!next) document.exitFullscreen();
}
document.addEventListener("toast", (e) => new Toast(e.detail.text, 1000));


// set default settings
const setDefaults = (override = false) => {
    if (!localStorage.member || override) localStorage.member = '';
    if (!localStorage.visualOptions || override) localStorage.visualOptions = "{}";
    if (!localStorage.addedFilters || override) localStorage.addedFilters = "[]";
    if (!localStorage.themes || override) localStorage.themes = `[{"name":"Original","options":{"urlLogo":"","urlBackground":"","containerImages":"","fontColor":"","fontColorButtons":"","fontStyle":"","containerBackgroundsCheck":false,"containerBackgrounds":"","inputBackgroundsCheck":false,"inputBackgrounds":"","containerOutlinesCheck":false,"containerOutlines":"","inputOutlinesCheck":false,"inputOutlines":"","hideFooter":false,"hideCaptcha":false,"hideMeta":false,"hideAvatarLogo":false,"hideInGameLogo":false,"hideAvatarSprites":false}},{"name":"Dark Discord","options":{"urlLogo":"","urlBackground":"https://cdn.discordapp.com/attachments/715996980849147968/814955491876012032/dcdark.png); background-size: 800px;(","containerImages":"","fontColor":"white","fontColorButtons":"white","fontStyle":"Karla:wght@400;600","containerBackgroundsCheck":true,"containerBackgrounds":"#2C2F3375","inputBackgroundsCheck":true,"inputBackgrounds":"#00000075","containerOutlinesCheck":true,"containerOutlines":"transparent !important; border-left: 4px solid #7289DA !important; ","inputOutlinesCheck":true,"inputOutlines":"transparent !important; border-left: 3px solid #363636 !important; ","hideFooter":true,"hideCaptcha":true,"hideMeta":true,"hideAvatarLogo":true,"hideInGameLogo":true,"hideAvatarSprites":true}},{"name":"Alpha","options":{"urlLogo":"https://imgur.com/k8e70AG.png","urlBackground":"https://i.imgur.com/UNZtzl6.jpg","containerImages":"","fontColor":"white","fontColorButtons":"white","fontStyle":"Mulish:wght@400;600","containerBackgroundsCheck":true,"containerBackgrounds":"#ffffff50","inputBackgroundsCheck":true,"inputBackgrounds":"#00000040","containerOutlinesCheck":true,"containerOutlines":"","inputOutlinesCheck":true,"inputOutlines":"","hideFooter":true,"hideCaptcha":true,"hideMeta":true,"hideAvatarLogo":true,"hideInGameLogo":true,"hideAvatarSprites":false}}]`;
    localStorage.keepCanvas = "false";
    if (!localStorage.controls || override) localStorage.controls = "true";
    if (!localStorage.qualityScale || override) localStorage.qualityScale = "1";
    if (!localStorage.userAllow || override) localStorage.userAllow = "true";
    if (!localStorage.login || override) localStorage.login = "";
    if (!localStorage.ownHoly || override) localStorage.ownHoly = "false";
    if (!localStorage.ink || override) localStorage.ink = "true";
    if (!localStorage.inkMode || override) localStorage.inkMode = "thickness";
    if (!localStorage.sens || override) localStorage.sens = 50;
    if (!localStorage.charBar || override) localStorage.charBar = "false";
    if (!localStorage.imageAgent || override) localStorage.imageAgent = "false";
    if (!localStorage.vip || override) localStorage.vip = "";
    if (!localStorage.markup || override) localStorage.markup = "false";
    if (!localStorage.markupColor || override) localStorage.markupColor = "#ffd6cc";
    if (!localStorage.randomColorInterval || override) localStorage.randomColorInterval = 50;
    if (!localStorage.randomColorButton || override) localStorage.randomColorButton = false;
    if (!localStorage.displayBack || override) localStorage.displayBack = false;
    if (!sessionStorage.lobbySearch || override) sessionStorage.lobbySearch = "false";
    if (!sessionStorage.searchPlayers || override) sessionStorage.searchPlayers = "[]";
    if (!sessionStorage.skipDeadLobbies || override) sessionStorage.skipDeadLobbies = "false";
    if (!localStorage.palette || override) localStorage.palette = "originalPalette";
    if (!localStorage.customPalettes || override) localStorage.customPalettes = '[{"rowCount":13, "name":"sketchfulPalette", "colors":[{"color":"rgb(255, 255, 255)","index":100},{"color":"rgb(211, 209, 210)","index":101},{"color":"rgb(247, 15, 15)","index":102},{"color":"rgb(255, 114, 0)","index":103},{"color":"rgb(252, 231, 0)","index":104},{"color":"rgb(2, 203, 0)","index":105},{"color":"rgb(1, 254, 148)","index":106},{"color":"rgb(5, 176, 255)","index":107},{"color":"rgb(34, 30, 205)","index":108},{"color":"rgb(163, 0, 189)","index":109},{"color":"rgb(204, 127, 173)","index":110},{"color":"rgb(253, 173, 136)","index":111},{"color":"rgb(158, 84, 37)","index":112},{"color":"rgb(81, 79, 84)","index":113},{"color":"rgb(169, 167, 168)","index":114},{"color":"rgb(174, 11, 0)","index":115},{"color":"rgb(200, 71, 6)","index":116},{"color":"rgb(236, 158, 6)","index":117},{"color":"rgb(0, 118, 18)","index":118},{"color":"rgb(4, 157, 111)","index":119},{"color":"rgb(0, 87, 157)","index":120},{"color":"rgb(15, 11, 150)","index":121},{"color":"rgb(110, 0, 131)","index":122},{"color":"rgb(166, 86, 115)","index":123},{"color":"rgb(227, 138, 94)","index":124},{"color":"rgb(94, 50, 13)","index":125},{"color":"rgb(0, 0, 0)","index":126},{"color":"rgb(130, 124, 128)","index":127},{"color":"rgb(87, 6, 12)","index":128},{"color":"rgb(139, 37, 0)","index":129},{"color":"rgb(158, 102, 0)","index":130},{"color":"rgb(0, 63, 0)","index":131},{"color":"rgb(0, 118, 106)","index":132},{"color":"rgb(0, 59, 117)","index":133},{"color":"rgb(14, 1, 81)","index":134},{"color":"rgb(60, 3, 80)","index":135},{"color":"rgb(115, 49, 77)","index":136},{"color":"rgb(209, 117, 78)","index":137},{"color":"rgb(66, 30, 6)","index":138}]}]';
    sessionStorage.pipetteURL = chrome.runtime.getURL("res/pipette.gif");
    sessionStorage.practise = "false";
}