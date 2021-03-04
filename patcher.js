// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// inject patched game.js and modify elements that are immediately after page load visible
const waitForDocAndPalantir = async () => {
    let palantirReady = false;
    let DOMready = false;
    return new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            DOMready = true;
            if (palantirReady) resolve(true);
        });
        document.addEventListener("palantirLoaded", () => {
            palantirReady = true;
            if (DOMready) resolve(true);
        });
        setTimeout(() => { reject(false); }, 10000);
    });
}
// await DOM load and palantir connection
(async () => {
    if (await waitForDocAndPalantir()) {
        await sprites.init(); // init sprites
        drops.initDrops(); // init drops
    }
    else alert("Error connecting to Palantir :/");
})().catch(console.error);

visuals.init(); //init visual options popup

const hints = [
    "Did you notice the tool shortcuts B,F and E?<br>Try out C to use a color pipette tool.",
    "Click on the canvas and use Shift+Arrow to draw a perfect straight line!",
    "Connect the Palantir Discord bot to search for your friends easily.",
    "Enable the ImageAgent to show template pictures when you're drawing.",
    "Use arrow up/down to recover the last chat input.",
    "Enable random colors and click the dice in the color field to get a rainbow brush.<br>Click any color to abort.",
    "Search for multiple player names by separating them with a comma.",
    "Change the markup color for your chat messages with the slider in the popup tab 'advanced'.",
    "Change the pressure sensitivity with the slider in the popup tab 'advanced'.",
    "Toggle your discord bot visibility in the extension popup.",
    "Get more colors by choosing the sketchful palette in the popup tab 'advanced'.<br>Only extension users see those colors.",
    "When creating a private lobby, you can set a description which can be seen in the discord bot.",
    "Click a lobby button to search for a lobby automatically.<br>The search will pause until there are free slots.",
    "Click the letter icon to share the current image directly to any of your discord servers.",
    "To remove an added Discord server, click its name in the popup tab 'Discord'.",
    "To save a practise drawing in Typo Cloud Gallery, click 'Save current' in 'ImageTools'.",
    "Use emojis in the chat! To send one, type :emoji-name:",
    "Use kick-- like-- shame-- to quickly kick, like or dislike without having to grab your mouse.",
    "Remove drawings from ImageTools by right-clicking them.",
    "Remove themes by right-clicking them.",
    "SPAMGUESS!!!1! - oh wait, you didn't click the input field. <br>Click TAB to quickly select the chatbox.",
    "Mute players by clicking their name. A red name is a muted player.",
    "Create masterpieces with the Don't Clear mode - the canvas won't be cleared after your turn.<br>This is fun on custom rounds!",
    "Press STRG+C to copy the current drawing to the clipboard.",
    "Press T to quickly open the tablet options.",
    "To set a custom font, go to <a href='https://fonts.google.com/'>Google Fonts</a>, select a font and copy the bold text in the input field in the visual options.",
    "Click the magnifier icon to use a color picker! All Typo users can see the colors.",
    "Precision Work? Use the zoom feature!<br> [STRG + Click] to zoom to point, any number to set zoom level and leave with [STRG + Click].",
    "If you like the extension, tell others about it or rate it on the chrome store! <3"
];

let patcher = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
             mutation.addedNodes.forEach(async function (node) {
                if (localStorage.visualOptions && (node.tagName == "BODY" || node.tagName == "IMG")) { // head or image is loaded
                    // load current options
                    let opts = JSON.parse(localStorage.visualOptions);
                    visuals.applyOptions(opts);
                }
                 if (node.tagName == "BODY") node.style.imageRendering = "crisp-edges"; // ff support
                if (node.tagName == "SCRIPT" && node.src.includes("game.js")) {
                    // block game.js
                    node.type = "javascript/blocked"; // block for chrome
                    node.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true });
                    // insert patched script
                    let script = document.createElement("script");
                    script.src = chrome.extension.getURL("gamePatch.js");
                    node.parentElement.appendChild(script);
                    
                }
                if (node.tagName == "DIV") {
                    // init guild lobbies and socket
                    if (node.classList.contains("login-side-right")) {
                        lobbies_.init();
                        node.style.height = "min-content";
                        await socket.init();
                    }
                    // put infobox below on the left side
                    else if (node.classList.contains("loginPanelContent") && document.querySelectorAll(".loginPanelContent").length > 2 && document.querySelectorAll(".login-side-left .loginPanelContent").length <= 0) {
                        let cont = document.querySelector(".login-side-left");
                        cont.appendChild(node);
                        cont.style.width = "400px";
                        cont.style.flex = "0 1 auto";
                    }
                    // add update info to infobox
                    else if (node.classList.contains("updateInfo")) { 
                        node.innerHTML = "Heya, take a cookie! 🍪<br><br>BTW: " + hints[Math.floor((Math.random() * hints.length))] + "<br><br> Typo is back with a massive update - it's epic!<br> <div class='btn btn-success'>View the changes</div>";
                        node.innerHTML += "<br><br> Data can be used to do pretty cool stuff.<br> By using Typo, you agree on <a id='typodata' role='button'>how Typo uses data.</a>";
                        node.innerHTML += "<br><br>To learn more about Typo, visit the <a href='https://typo.rip' role='button'>website</a> or <a href='https://discord.link/typo' role='button'>join the Discord server.</a>"
                        let popupChanges = elemFromString(
`<div style="width: 100%"><h3>The fastest lobby search engine ever.</h3>
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
</div>`);
                        node.querySelector("div").addEventListener("click", () => {
                            new Modal(popupChanges, () => { }, "Changelog");
                        });
                        let popupData = elemFromString(
                            `<div style="width:100%">
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
</div>`);
                        node.querySelector("#typodata").addEventListener("click", () => {
                            new Modal(popupData, () => { }, "Data & Privacy");
                        });
                    }
                    else if (node.id == 'screenLogin') {
                        node.style.justifyContent = "center";
                    }
                    if (node.id == "containerLogoBig" || node.id == "logoAvatarContainer") node.style.display = "";
                }
                if (node.id == 'formLogin') {
                    //add dead lobbies button
                    let privateBtn = document.querySelector("#buttonLoginCreatePrivate");
                    let skipDead = document.createElement("button");
                    privateBtn.style.display = "inline";
                    privateBtn.style.width = "48%";
                    skipDead.classList.add('btn', 'btn-info');
                    skipDead.textContent = "Skip Dead Lobbies";
                    skipDead.style.width = "48%";
                    skipDead.style.marginTop = "4px";
                    skipDead.style.marginLeft = "4%";
                    skipDead.addEventListener('click', () => {
                        let modal = new Modal(elemFromString("<h3>Click anywhere to cancel</h3>"), () => {
                            lobbies_.searchData.searching = false;
                        }, "Skipping dead lobbies...","30vw","10em");
                        lobbies_.startSearch(() => {
                            return lobbies_.lobbyProperties.Players.length > 1;
                        }, () => {
                            setTimeout(()=>leaveLobby(true), 100);
                        }, () => {
                             modal.close();
                         });
                    });
                    privateBtn.parentNode.appendChild(skipDead);

                    //add search names button and field
                    let container = node;
                    let containerForm = document.createElement("div");
                    let inputName = document.createElement("input");
                    let inputSubmit = document.createElement("button");
                    let icon = document.createElement("div");
                    icon.style.display = "inline";
                    icon.classList.add("iconPlay");
                    inputName.id = "inputSearchNickName";
                    inputName.value = sessionStorage.searchPlayers ? JSON.parse(sessionStorage.searchPlayers) : "";
                    inputName.classList.add("form-control");
                    inputName.style.width = "70%";
                    inputName.placeholder = "'name' or 'name, name1, name2'";
                    containerForm.classList.add("loginPanelContent");
                    containerForm.style.display = "flex";
                    containerForm.style.justifyContent = "space-between";
                    containerForm.style.boxShadow = "unset";
                    containerForm.style.marginTop = "1em";
                    containerForm.style.setProperty("background", "transparent", "important");
                    containerForm.style.setProperty("border", "none", "important");
                    inputSubmit.classList.add("btn", "btn-success");
                    inputSubmit.textContent = "Search Player!";
                    inputSubmit.addEventListener("click", () => {
                        if (inputName.value.trim() == "") return;
                        let players = inputName.value.split(",");
                        let skippedPlayers = [];
                        players = players.map(p => p.trim());
                        let modalCont = elemFromString("<div style='text-align:center'><h4>" + inputName.value + "</h4><span id='skippedPlayers'>Skipped:<br></span><br><h4>Click anywhere to cancel</h4><div>");
                        let modal = new Modal( modalCont, () => {
                                lobbies_.searchData.searching = false;
                        }, "Searching for players:", "30vw", "15em");
                        lobbies_.startSearch(() => {
                            lobbies_.lobbyProperties.Players.forEach(p => {
                                if (skippedPlayers.indexOf(p.Name) < 0 && p.Name != socket.clientData.playerName) {
                                    skippedPlayers.push(p.Name);
                                    modalCont.querySelector("#skippedPlayers").innerHTML += " [" + p.Name + "] <wbr>";
                                }
                            });
                            return lobbies_.lobbyProperties.Players.some(lobbyplayer =>
                                players.some(searchPlayer => searchPlayer.toLowerCase() == lobbyplayer.Name.toLowerCase()));
                        }, () => {
                            setTimeout(() => leaveLobby(true), 200);
                        }, () => {
                            modal.close();
                        });
                        document.body.dispatchEvent(newCustomEvent("joinLobby"));
                    });
                    containerForm.append(inputName);
                    containerForm.append(inputSubmit);
                    container.appendChild(containerForm);
                }
            });
        });
});
patcher.observe(document, { attributes: false, childList: true, subtree: true });
