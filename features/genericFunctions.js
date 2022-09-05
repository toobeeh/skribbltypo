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

// start login process
const login = () => {
    localStorage.removeItem("member");
    localStorage.removeItem("accessToken");
    window.addEventListener("message", async msg => {
        // save access token
        localStorage.accessToken = msg.data.accessToken;
        socket.sck.disconnect();
        document.addEventListener("palantirLoaded", () => {
            uiTweaks.updateAccountElements();
        }, { once: true });
        socket.init();
    }, { once: true });
    window.open('https://tobeh.host/Orthanc/auth/ext/', 'Log in to Palantir', 'height=650,width=500,right=0,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

const logout = () => {
    localStorage.removeItem("member");
    localStorage.removeItem("accessToken");
    socket.sck.disconnect();
    socket.authenticated = false;
    document.addEventListener("palantirLoaded", () => {
        uiTweaks.updateAccountElements();
    }, { once: true });
    socket.init();
}

// func to mark a message node with background color
const markMessage = (newNode) => {
    if (localStorage.markup != "true") return;
    let sender = newNode.firstChild.textContent.trim().slice(0, -1);
    if (sender == socket.clientData.playerName || sender != "" && localStorage.vip.split("/").includes(sender))
        newNode.style.background = (new Color({ h: Number(localStorage.markupcolor), s: 100, l: 90 })).hex + "AA";
}

//func to scroll to bottom of message container
const scrollMessages = (onlyIfScrolledDown = false) => {
    let box = document.querySelector("#game-chat .content");
    if (!onlyIfScrolledDown ||  Math.floor(box.scrollHeight - box.scrollTop) <= box.clientHeight + 30) {
        box.lastChild.scrollIntoView(false)
    }
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
    addChatMessage("","Copied to clipboard");
}

// func to replace umlaute in a string
const replaceUmlaute = (str) => {
    // umlaute which have to be replaced
    const umlautMap = {
        '\u00dc': 'u',
        '\u00c4': 'a',
        '\u00d6': 'o',
        '\u00fc': 'u',
        '\u00e4': 'a',
        '\u00f6': 'o'
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
    if (QS(".avatar .drawing[style*=block]"))
        drawer = QS(".avatar .drawing[style*=block]").closest(".player").querySelector(".name").textContent.replace("(You)", "").trim();
    else {
        try {
            drawer = (new RegExp(">([^>]+?) is drawing now!<\/b>", "g")).exec(QS("#game-chat .content").innerHTML).pop();
        }
        catch {}
    }
    return drawer;
}

const getCurrentWordOrHint = () => {
    if (QS("#game-word .description").textContent.includes("DRAW")) {
        // get whole word
        return QS("#game-word .word").textContent;
    }
    else return [...document.querySelectorAll("#game-word .hints .container .hint")].map(elem => elem.textContent).join("");
}

// adds a color palette
const setColorPalette = (colorPalette) => {
    paletteContainer = elemFromString(`<div class="colors custom"></div>`);
    let swatches = [...colorPalette.swatches];
    while (swatches.length > 0) {
        const rowElem = elemFromString("<div class='top'></div>");
        swatches.splice(0, colorPalette.rowCount).forEach(swatch => {
            rowElem.appendChild(swatch.swatch);
        });
        paletteContainer.appendChild(rowElem);
    }
    paletteContainer.addEventListener("pointerdown", () => clearInterval(uiTweaks.randomInterval));
    if (QS("#game-toolbar .color-picker .colors.custom")) {
        QS("#game-toolbar .color-picker .colors.custom").replaceWith(paletteContainer);
    }
    else QS("#game-toolbar .color-picker .colors").insertAdjacentElement("afterend", paletteContainer);
    QS("#game-toolbar .color-picker .colors").style.display = "none";
}

const createColorPalette = (paletteObject) => {
    const palette = {
        rowCount: 1,
        name: paletteObject.name,
        colors: [
        ],
        swatches: [
        ],
        json: "",
        activate: () => {
            setColorPalette(palette);
        }
    };
    palette.rowCount = paletteObject && paletteObject.rowCount ? paletteObject.rowCount : 2;
    let dummyColorTester = elemFromString("<div style='display:none'></div>");
    document.body.appendChild(dummyColorTester);
    paletteObject?.colors?.forEach(color => {
        if (color.color) {
            dummyColorTester.style.backgroundColor = color.color;
            const col = new Color({ rgb: window.getComputedStyle(dummyColorTester).backgroundColor });
            palette.colors.push({ color: col.hex });
            const swatch = elemFromString(`<div class="color" style="background-color:${col.hex}"></div>`);
            const code = parseInt(col.hex.replace("#",""), 16) + 10000;
            swatch.addEventListener("mousedown", (e) => {
                document.dispatchEvent(newCustomEvent("setColor", { detail: { code: code, secondary: e.button === 2 } }));
            });
            palette.swatches.push({ swatch: swatch });
        }
    });
    document.body.removeChild(dummyColorTester);
    palette.json = JSON.stringify({ rowCount: palette.rowCount, name: palette.name, colors: palette.colors });
    return palette;
}

const convertActionsArray = (actions) => {
    const commands = actions.flat();
    commands.forEach(command => {
        switch (command[0]) {
            case 2: command[0] = 1;
            case 0:
                if (command[1] > 11) command[1] += 2; // if index > 11, skip new cyan color column
                if (command[1] > 19) command[1] += 2; // if index > 11, skip new skin tone color column
                command[1] = command[1] % 2 == 0 ? // if command is fill or brush
                    command[1] + (command[1] / 2) : // if color is even, add half of index
                    command[1] + ((command[1] + 1) / 2); // if odd, add half of index+1
                break;
            case 1:
                command = [command[0], 0, command[1], command[2], command[3], command[4], command[5]];
                break;
        }
    });
    return commands;
}

// leave lobby
const leaveLobby = async (next = false) => {
    return new Promise((resolve, reject) => {
        if (next) {
            let joined = false;
            setTimeout(() => { joined || reject(); }, 4000);
            document.addEventListener("leftLobby", () => {
                document.addEventListener("joinedLobby", () => {
                    joined = true;
                    resolve();
                }, { once: true });
                document.dispatchEvent(newCustomEvent("joinLobby"));
            }, { once: true });   
        }
        document.dispatchEvent(newCustomEvent("leaveLobby"));
        if (!next && document.fullscreenElement) {
            document.exitFullscreen();
            resolve();
        }
    });    
}
document.addEventListener("toast", (e) => new Toast(e.detail.text, 1000));


// set default settings
const setDefaults = (override = false) => {
    if (!localStorage.member || override) localStorage.member = "";
    if (!localStorage.client || override) localStorage.client = Date.now();
    if (!localStorage.visualOptions || override) localStorage.visualOptions = "{}";
    if (!localStorage.themes || override) localStorage.themes = `[{"name":"Original","options":{"urlLogo":"","urlBackground":"","containerImages":"","fontColor":"","fontColorButtons":"","fontStyle":"","containerBackgroundsCheck":false,"containerBackgrounds":"","inputBackgroundsCheck":false,"inputBackgrounds":"","containerOutlinesCheck":false,"containerOutlines":"","inputOutlinesCheck":false,"inputOutlines":"","hideFooter":false,"hideCaptcha":false,"hideMeta":false,"hideAvatarLogo":false,"hideInGameLogo":false,"hideAvatarSprites":false}},{"name":"Dark Discord","options":{"urlLogo":"","urlBackground":"https://cdn.discordapp.com/attachments/715996980849147968/814955491876012032/dcdark.png); background-size: 800px;(","containerImages":"","fontColor":"white","fontColorButtons":"white","fontStyle":"Karla:wght@400;600","containerBackgroundsCheck":true,"containerBackgrounds":"#2C2F3375","inputBackgroundsCheck":true,"inputBackgrounds":"#00000075","containerOutlinesCheck":true,"containerOutlines":"transparent !important; border-left: 4px solid #7289DA !important; ","inputOutlinesCheck":true,"inputOutlines":"transparent !important; border-left: 3px solid #363636 !important; ","hideFooter":true,"hideCaptcha":true,"hideMeta":true,"hideAvatarLogo":true,"hideInGameLogo":true,"hideAvatarSprites":false}},{"name":"Alpha","options":{"urlLogo":"https://imgur.com/k8e70AG.png","urlBackground":"https://i.imgur.com/UNZtzl6.jpg","containerImages":"","fontColor":"white","fontColorButtons":"white","fontStyle":"Mulish:wght@400;600","containerBackgroundsCheck":true,"containerBackgrounds":"#ffffff50","inputBackgroundsCheck":true,"inputBackgrounds":"#00000040","containerOutlinesCheck":true,"containerOutlines":"","inputOutlinesCheck":true,"inputOutlines":"","hideFooter":true,"hideCaptcha":true,"hideMeta":true,"hideAvatarLogo":true,"hideInGameLogo":true,"hideAvatarSprites":false}}]`;
    if (!localStorage.controls || override) localStorage.controls = "true";
    if (!localStorage.restrictLobby || override) localStorage.restrictLobby = "";
    if (!localStorage.qualityScale || override) localStorage.qualityScale = "1";
    if (!localStorage.palantir || override) localStorage.palantir = "true";
    if (!localStorage.typoink || override) localStorage.typoink = "true";
    if (!localStorage.typotoolbar || override) localStorage.typotoolbar = "true";
    if (!localStorage.inkMode || override) localStorage.inkMode = "thickness";
    if (!localStorage.sensitivity || override) localStorage.sensitivity = 50;
    if (!localStorage.charbar || override) localStorage.charbar = "false";
    if (!localStorage.agent || override) localStorage.agent = "false";
    if (!localStorage.sizeslider || override) localStorage.sizeslider = "false";
    if (!localStorage.emojipicker || override) localStorage.emojipicker = "true";
    if (!localStorage.drops || override) localStorage.drops = "true";
    if (!localStorage.zoomdraw || override) localStorage.zoomdraw = "true";
    if (!localStorage.drops || override) localStorage.drops = "true";
    if (!localStorage.dropmsgs || override) localStorage.dropmsgs = "true";
    if (!localStorage.quickreact || override) localStorage.quickreact = "true";
    if (!localStorage.chatcommands || override) localStorage.chatcommands = "true";
    if (!localStorage.vip || override) localStorage.vip = "[]";
    if (!localStorage.markup || override) localStorage.markup = "false";
    if (!localStorage.markupcolor || override) localStorage.markupcolor = "254";
    if (!localStorage.randominterval || override) localStorage.randominterval = 50;
    if (!localStorage.typotools || override) localStorage.typotools = "true";
    if (!localStorage.palette || override) localStorage.palette = "originalPalette";
    if (!localStorage.lobbyStream || override) localStorage.lobbyStream = "{}";
    if (!localStorage.customPalettes || override) localStorage.customPalettes = '[{"rowCount":13, "name":"sketchfulPalette", "colors":[{"color":"rgb(255, 255, 255)","index":100},{"color":"rgb(211, 209, 210)","index":101},{"color":"rgb(247, 15, 15)","index":102},{"color":"rgb(255, 114, 0)","index":103},{"color":"rgb(252, 231, 0)","index":104},{"color":"rgb(2, 203, 0)","index":105},{"color":"rgb(1, 254, 148)","index":106},{"color":"rgb(5, 176, 255)","index":107},{"color":"rgb(34, 30, 205)","index":108},{"color":"rgb(163, 0, 189)","index":109},{"color":"rgb(204, 127, 173)","index":110},{"color":"rgb(253, 173, 136)","index":111},{"color":"rgb(158, 84, 37)","index":112},{"color":"rgb(81, 79, 84)","index":113},{"color":"rgb(169, 167, 168)","index":114},{"color":"rgb(174, 11, 0)","index":115},{"color":"rgb(200, 71, 6)","index":116},{"color":"rgb(236, 158, 6)","index":117},{"color":"rgb(0, 118, 18)","index":118},{"color":"rgb(4, 157, 111)","index":119},{"color":"rgb(0, 87, 157)","index":120},{"color":"rgb(15, 11, 150)","index":121},{"color":"rgb(110, 0, 131)","index":122},{"color":"rgb(166, 86, 115)","index":123},{"color":"rgb(227, 138, 94)","index":124},{"color":"rgb(94, 50, 13)","index":125},{"color":"rgb(0, 0, 0)","index":126},{"color":"rgb(130, 124, 128)","index":127},{"color":"rgb(87, 6, 12)","index":128},{"color":"rgb(139, 37, 0)","index":129},{"color":"rgb(158, 102, 0)","index":130},{"color":"rgb(0, 63, 0)","index":131},{"color":"rgb(0, 118, 106)","index":132},{"color":"rgb(0, 59, 117)","index":133},{"color":"rgb(14, 1, 81)","index":134},{"color":"rgb(60, 3, 80)","index":135},{"color":"rgb(115, 49, 77)","index":136},{"color":"rgb(209, 117, 78)","index":137},{"color":"rgb(66, 30, 6)","index":138}]}]';
    if (!Number(localStorage.qualityScale) || Number(localStorage.qualityScale) < 1  ) localStorage.qualityScale = 1;
}
258;

const hints = [
    "Hold shift to draw a perfect straight line! Double-press shift to make it snap horizontally / vertically.",
    "Connect the Palantir Discord bot to easily join your friend's lobbies.",
    "Enable the ImageAgent to show template pictures when you're drawing.",
    "Use arrow up/down to recover the last chat input.",
    "Enable random colors and click the dice in the color field to get a rainbow brush.<br>Click any color to abort.",
    "Change the markup color for your chat messages with the slider in the popup tab 'advanced'.",
    "Toggle your discord bot visibility in the extension popup.",
    "Get more colors by adding a custom palette in the popup tab 'advanced'.<br>Only extension users see those colors.",
    "When creating a private lobby, you can set a description which can be seen in the discord bot.",
    "Click the letter icon to share the current image directly to any of your discord servers.",
    "To remove an added Discord server, click its name in the popup tab 'Discord'.",
    "To save a practise drawing in Typo Cloud Gallery, click the floppy disc icon and select 'In Typo Cloud'.",
    "Use emojis in the chat! To send one, type :emoji-name:",
    "Use like-- or shame-- to quickly like or dislike without having to grab your mouse.",
    "Remove drawings from ImageTools by right-clicking them.",
    "Remove themes by right-clicking them.",
    "SPAMGUESS!!!1! - oh wait, you didn't click the input field. <br>Click TAB to quickly select the chatbox.",
    "Create masterpieces with the Don't Clear challenge - the canvas won't be cleared after your turn.<br>This is fun on custom rounds!",
    "Get artsy with the monochrome challenge - you can only select between a pair of colors!",
    "If you're feeling pro, try the one shot challenge. You have only one try to guess.",
    "With the deaf guess challenge, you can't see other's guesses (or typos) in the chat.",
    "To practise word blank spamming, use the blind guess challenge!",
    "Press STRG+C to copy the current drawing to the clipboard.",
    "To set a custom font, go to <a href='https://fonts.google.com/'>Google Fonts</a>, select a font and copy the bold text in the input field in the visual options.",
    "Click the magnifier icon to use a color picker! All Typo users can see the colors.",
    "Precision Work? Use the zoom feature!<br> [STRG + Click] to zoom to point, any number to set zoom level and leave with [STRG + Click].",
    "If you like the extension, tell others about it or rate it on the chrome store! <3",
    "Quickly switch colors by pressing 's'",
    "The game feels slow & lags after a time in the same lobby?<br>Use the command 'clr--' to clear old chat & make the game fast gain.",
    "Use the quickreact-menu to like, dislike & kick with your keyboard!<br>You can access it by klicking 'CTRL' in the chat box.",
    "Want to share a chat snippet on Discord?<br>Select the messages and click 'Copy chat election for Discord' to create a nicely formatted chat history.",
    "In practise, you can also paste .png to the skribbl canvas! To do so, click 'Paste Image' in Image Tools.",
    "To draw without time limit, click the avatar on the landing page!",
    "Want to kick someone without grapping your mouse? Type 'kick--' to kick the current drawer or 'kick [id]--' to kick a player by their id! View IDs by pressing AltGr."
];

const changelogRawHTML =
    `<div style="width: 100%">
<h2>October - The new skribbl.. and typo!</h2>
The first huge skribbl update is here, and typo also had massive changes to keep it working.
<ul>
<li>Removed all lobby-search or lobby-filter related </li>
<li>Removed now skribbl-supported drawing tools like pipette, pressure thickness and redo.</li>
<li>Removed a bunch of other now supported features like lobby chat, mute, winner message, etc</li>
<li>Added many new and improved challenges</li>
<li>Added the brush laboratory for brush tools</li>
<li>Added the sprite cabin to make sprite selecting easy</li>
<li>Really, really much redesign and compatibility work</li>
</ul>
<hr>
<h2>Aaaaand some August-fixes</h2>
<ul>
<li>Added a size slider for picking a precise drawing brush thickness</li>
<li>Added many new toggles in the extension popup</li>
<li>Reworked backend applications to make everything faster & smoother</li>
<li>Chat doesn't jump when scrolled up</li>
</ul>
<hr>
<h2>July's quality-of-life update</h2>
Some small & medium fixes, improvements and additions: <br>
<ul>
<li>Quickreact-menu: when the chat input is focused, you can press "CTRL" and choose from kick, like & dislike with the arrow keys</li>
<li>Formatted chat: when you select text from the chat history, you can click the popup to get a nicely formatted chat protocol in your clipboard for pasting on Discord</li>
<li>Practise drawing: the option "paste image" allows you to paste a png to the skribbl canvas. This only works in practise!<br>
Choose the image and click while having the 1 key pressed to paste the image on the click position, click twice while having the 2 pressed to draw the image between the range of the clicks or click with 3 pressed to fill the canvas with the image</li>
<li>Pressure drawing is much smoother now for many people</li>
<li>Relative pressure mode: the brushsize is depending on pressure, but in a range relative to the selected size</li>
<li>Chat clear: type "clr--" to delete all except the last 50 messsages.<br>This fixes lags when you've been in a lobby for a long time.</li>
<li>A rare color picking bug is vanished now!</li>
</ul>
<hr>
<h2>April privacy update</h2>
<hr>
You can now control which of your connected discord servers see your lobby invite link. <br>
If you're the lobby owner or topmost player with Palantir, a lock icon is shown next to the timer in-game. <br>
Click the lock to set the lobby privacy. This will overrule the setting of every other lobby member. <br>
The lock indicates your privacy setting (red - public, green - restricted). <br>
<hr>
<h2>March update #3 - the fixes</h2>
<hr>
<ul>
<li>Fixed the left-time-choosing bar, which was only visible once</li>
<li>Added thousands of new emojis from dynamic sources.</li>
<li>Gallery Cloud works now with pixelate thumbnails.<br>
This results in a much better loading time and better server stability.</li>
<li>Added a message declaring the winner of a finished game in the chat</li>
<li>Fixed the tab-to-focus-chat thing behaving weird</li>
<li>Fixed some rare sprite bugs</li>
<li>Reduced extension permissions to the bare minimum</li>
<li>Fixed pressing ESC to close popups instead clearing the canvas</li>
<li>... and the lobby search should be even faster now</li>
</ul>
<hr>
<h2>March update #2</h2>
<hr>
<h3>Merged S's <a href='https://github.com/sbarrack/skribbl-community-scripts'>community script</a> features.</h3>
This includes 3 new gamemodes to make skribbl more challenging for you as well as keybinds for colors, brush sizes and some UI improvements!<br>
Toggle both features in the extension popup. 
<br>Kudos to S & and all involved contributors!
<br><h3>Lobby filters</h3>
Lobby filters enable you to exactly set at which lobbies you want the search to stop.<br>
To see & activate filters, click "Toggle Lobby Filter". As soon as you set the filter properties, click add. <br>
When the filter panel is visible, you can check filters you'd like to apply and click "Play" to search with them.<br>
Player Names & Palantir Users combine with "OR", other properties with "AND" and multiple active filters also combine with "AND".
<br><h3>Quality-Of-Life stuff</h3>
More tooltips (thanks S), prettier "player guessed word" indicator on custom themes and a visualizer of the left time to choose a word.
<hr>
<h2>Epic march update #1</h2>
<hr>
<h3>The fastest lobby search engine ever.</h3>
The all-new lobbycrawler jumps right through lobbies without reloading skribbl.<br>
With fair internet, 100+ lobbies per minute are possible - comparison: Old typo was tested with 20 lobbies/min, "frienddl" with 31/min and "Friend Finder" with 21 lobbies/min.<br>
<br><h3>Typo Gallery Cloud</h3>
For players who connected typo with palantir, every drawing in every lobby will be saved at the Typo Cloud Gallery for two weeks.<br>
Relieve the amazing lobby from yesterday, re-draw the image from last round etc etc - access the cloud at the "T"-icon at the top-left side. <br>
<br><h3>Skribbl Themes & Visual Options</h3>
There have been some darkmodes around, but you could never style skribbl exactly the way as you liked. <br>
Play around with Colors, Fonts, Custom Backgrounds and lots more by clicking the Eye-Icon on the top-left side.<br>
You can choose between preset themes or create your own - there are pretty powerful theming options by CSS-Injections; to get to know more about all options message tobeh.<br>
<br><h3>.. Emojis!!</h3>
I *bet* you missed your discord custom emojis; and so did I. <br>
Type <code>:</code> and the emoji name in the chat input field to use an emoji, just as in discord.<br>
Other typo users will see the emoji, the others just the emoji name.<br>
<br><h3>Quick tablet mode access</h3>
Among the other controls, you can now quickly select the tablet mode by clicking the tablet icon.<br>
Remember the colors drawn with brightness or degree are only visible to typo users.<br>
To access the options even faster, use the shortcut "T".<br>
<br><h3>Sprite slots</h3>
Use multiple sprites on your avatar!<br>
For every 1000 drops you'll get an additional slot.<br>
Slots are like layers; slot 1 is under slot 2 etc.<br>
<br><h3>Draw-Over mode</h3>
Draw over the image of the others by activating "Don't Clear" in the popup. <br>
This only makes sense in custom rounds where everyone has activated this option from the start. <br>
Credits for the idea go to some cool DS members.<br>
<br><h3>Mute Players</h3>
Mute someone by clicking their name - this will still show that they sent messages, but makes the content invisible.<br>
<br><h3> Copy images on the fly</h3>
Click STRG+C to copy the current image. <br>
This is disabled when the chat input is focused or some text is selected.<br>
<br><h3>Fullscreen Mode</h3>
Click the Resize-Icon on the top-left side to enter a fullscreen mode with more space for drawing and chatting.<br>
<br><h3>Straight lines</h3>
Click somewhere on the canvas, press ALT and click where you want the line to end - voila!<br>
<br><h3>In case you missed: Canvas zoom</h3>
Old but gold: STRG+Click anywhere on the canvas to zoom there.<br>
Click any number key to set the zoom level. Leave with STRG+Click.<br>
<br><h3>Custom lobby chat</h3>
When in the idle mode of a custom lobby, the chat is now shown.<br>
As long as the lobby is idle, only typo users see the chat. As soon as the game starts, everyone sees the sent messages.<br>
<br><h3>Chat commands</h3>
Use <code>kick--</code> <code>like--</code> <code>shame--</code> to quickly kick, like or dislike.<br>
<br><h3>That damn chat focus thing..</h3>
Clicking "TAB" will auto-focus the chat input.<br>
<br><br><h3>And of course... all known bugs were fixed.<h3>
</div>`;

const privacyRawHTML = `<div style="width:100%"><h4><a href="https://typo.rip#privacy">A more detailed privacy statement is available on https://typo.rip#privacy</a></h4><br>
    <code><h4>Without connecting Palantir, Typo will collect and store NO data.</h4>
    <h4>Collected data is ONLY used for feature-related purposes.</h4>
    <h5>However, for Palantir-features like Sprites, Discord Lobbies and Typo Gallery Cloud, collecting data is inevitable.</h5></code>
<br><h4>When Palantir isn't connected:</h4>
Typo will fetch some necessary data from the servers, but will NOT send ANY data back.<br>
This data are the online sprites as well as the current sprite ressources.<br>
<br><h4>When Palantir is connected, but Discord Bot Status disabled:</h4>
Typo fetches additionally to the above data all active lobbies of your connected Discord servers. <br>
Typo will NOT send any data of your lobby.<br>
Anyway, Typo Gallery is active which will send every drawing, its author,name and draw commands to the server.<br>
This data is ONLY visible to you and its only purpose is the Typo Gallery Cloud feature.<br>
<br><h4>When Palantir is connected and Discord Bot Status enabled:</h4>
Additionally to the above, typo will fetch drops from the server and display them.<br>
Typo will send your current lobby (players, points, link etc) to the server so that it can be displayed in Discord and your sprite is visible to others.<br>
You will be able to collect bubbles and drops.<br>
<br><h4>Where data is stored:</h4>
All data is stored on a private server and is only used for the typo features.<br>
No-one except you and the typo dev will have insight in the typo data.<br>
If you want to know more about your stored data, contact the typo dev.
</div>`;