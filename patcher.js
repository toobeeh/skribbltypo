// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// execute inits when both DOM and palantir are loaded
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
        setTimeout(() => { reject(false); }, 20000);
    });
}
// await DOM load and palantir connection
(async () => {
    if (await waitForDocAndPalantir()) {
        await sprites.init(); // init sprites
        drops.initDrops(); // init drops
        if (localStorage.restrictLobby == "") {
            QS("#restrictLobby").dispatchEvent(new Event("click"));
        }
    }
    else alert("Error connecting to Palantir :/");
})().catch(console.error);
// init socket
setTimeout(async () => {
    lobbies.init();
    await socket.init();
}, 0);

visuals.init(); //init visual options popup


// inject patched game.js and modify elements that are immediately after page load visible
let patcher = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
             mutation.addedNodes.forEach(async function (node) {
                if (localStorage.visualOptions && (node.tagName == "BODY" || node.tagName == "IMG")) { // head or image is loaded
                    // load current options
                    let opts = JSON.parse(localStorage.visualOptions);
                    visuals.applyOptions(opts);
                    // check if theme querystring is active
                    let name = (new URLSearchParams(window.location.search)).get("themename");
                    let theme = JSON.parse((new URLSearchParams(window.location.search)).get("theme"));
                    if (name && theme) {
                        window.history.pushState({}, document.title, "/");
                        if (visuals.themes.some(t => JSON.stringify(t.options) == JSON.stringify(theme))){
                            visuals.applyOptions(theme);
                            localStorage.visualOptions = JSON.stringify(theme);
                            setTimeout(() => new Toast("🥳 Activated theme " + name), 200);
                        }
                        else {
                            visuals.addTheme(name, theme);
                            visuals.applyOptions(theme);
                            localStorage.visualOptions = JSON.stringify(theme);
                            setTimeout(() => new Toast("🥳 Imported theme " + name), 200);
                        }
                    }
                }
                if (node.tagName == "SCRIPT" && node.src.includes("game.js")) {
                    // block game.js
                    node.type = "javascript/blocked"; // block for chrome
                    node.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true });
                    // insert patched script
                    let script = document.createElement("script");
                    script.src = chrome.extension.getURL("newGamePatch.js");
                    node.parentElement.appendChild(script);
                    
                }
//                if (node.tagName == "DIV" && node.classList.contains("updateInfo")) { 
//                        node.innerHTML = "Heya, take a cookie! 🍪<br><br>BTW: " + hints[Math.floor((Math.random() * hints.length))] + "<br><br> Additional to the march update, some features have rolled out.<br><br> <div class='btn btn-block btn-success'>View the changelog" + (localStorage.lastChangelogview != chrome.runtime.getManifest().version ? " 📢 New!" : "") + "</div>";
//                        node.innerHTML += "<br>Data can be used to do pretty cool stuff.<br> By using Typo, you agree on <a id='typodata' role='button'>how Typo uses data.</a>";
//                        node.innerHTML += "<br><br>To learn more about Typo, visit the <a href='https://typo.rip' role='button'>website</a> or <a href='https://discord.link/typo' role='button'>join the Discord server.</a>"
//                        let popupChanges = elemFromString(
//`<div style="width: 100%">
//<h2>Aaaaand some August-fixes</h2>
//<hr>
//<ul>
//<li>Added a size slider for picking a precise drawing brush thickness</li>
//<li>Added many new toggles in the extension popup</li>
//<li>Reworked backend applications to make everything faster & smoother</li>
//<li>Chat doesn't jump when scrolled up</li>
//</ul>
//<hr>
//<h2>July's quality-of-life update</h2>
//<hr>
//Some small & medium fixes, improvements and additions: <br>
//<ul>
//<li>Quickreact-menu: when the chat input is focused, you can press "CTRL" and choose from kick, like & dislike with the arrow keys</li>
//<li>Formatted chat: when you select text from the chat history, you can click the popup to get a nicely formatted chat protocol in your clipboard for pasting on Discord</li>
//<li>Practise drawing: the option "paste image" allows you to paste a png to the skribbl canvas. This only works in practise!<br>
//Choose the image and click while having the 1 key pressed to paste the image on the click position, click twice while having the 2 pressed to draw the image between the range of the clicks or click with 3 pressed to fill the canvas with the image</li>
//<li>Pressure drawing is much smoother now for many people</li>
//<li>Relative pressure mode: the brushsize is depending on pressure, but in a range relative to the selected size</li>
//<li>Chat clear: type "clr--" to delete all except the last 50 messsages.<br>This fixes lags when you've been in a lobby for a long time.</li>
//<li>A rare color picking bug is vanished now!</li>
//</ul>
//<hr>
//<h2>April privacy update</h2>
//<hr>
//You can now control which of your connected discord servers see your lobby invite link. <br>
//If you're the lobby owner or topmost player with Palantir, a lock icon is shown next to the timer in-game. <br>
//Click the lock to set the lobby privacy. This will overrule the setting of every other lobby member. <br>
//The lock indicates your privacy setting (red - public, green - restricted). <br>
//<hr>
//<h2>March update #3 - the fixes</h2>
//<hr>
//<ul>
//<li>Fixed the left-time-choosing bar, which was only visible once</li>
//<li>Added thousands of new emojis from dynamic sources.</li>
//<li>Gallery Cloud works now with pixelate thumbnails.<br>
//This results in a much better loading time and better server stability.</li>
//<li>Added a message declaring the winner of a finished game in the chat</li>
//<li>Fixed the tab-to-focus-chat thing behaving weird</li>
//<li>Fixed some rare sprite bugs</li>
//<li>Reduced extension permissions to the bare minimum</li>
//<li>Fixed pressing ESC to close popups instead clearing the canvas</li>
//<li>... and the lobby search should be even faster now</li>
//</ul>
//<hr>
//<h2>March update #2</h2>
//<hr>
//<h3>Merged S's <a href='https://github.com/sbarrack/skribbl-community-scripts'>community script</a> features.</h3>
//This includes 3 new gamemodes to make skribbl more challenging for you as well as keybinds for colors, brush sizes and some UI improvements!<br>
//Toggle both features in the extension popup. 
//<br>Kudos to S & and all involved contributors!
//<br><h3>Lobby filters</h3>
//Lobby filters enable you to exactly set at which lobbies you want the search to stop.<br>
//To see & activate filters, click "Toggle Lobby Filter". As soon as you set the filter properties, click add. <br>
//When the filter panel is visible, you can check filters you'd like to apply and click "Play" to search with them.<br>
//Player Names & Palantir Users combine with "OR", other properties with "AND" and multiple active filters also combine with "AND".
//<br><h3>Quality-Of-Life stuff</h3>
//More tooltips (thanks S), prettier "player guessed word" indicator on custom themes and a visualizer of the left time to choose a word.
//<hr>
//<h2>Epic march update #1</h2>
//<hr>
//<h3>The fastest lobby search engine ever.</h3>
//The all-new lobbycrawler jumps right through lobbies without reloading skribbl.<br>
//With fair internet, 100+ lobbies per minute are possible - comparison: Old typo was tested with 20 lobbies/min, "frienddl" with 31/min and "Friend Finder" with 21 lobbies/min.<br>
//<br><h3>Typo Gallery Cloud</h3>
//For players who connected typo with palantir, every drawing in every lobby will be saved at the Typo Cloud Gallery for two weeks.<br>
//Relieve the amazing lobby from yesterday, re-draw the image from last round etc etc - access the cloud at the "T"-icon at the top-left side. <br>
//<br><h3>Skribbl Themes & Visual Options</h3>
//There have been some darkmodes around, but you could never style skribbl exactly the way as you liked. <br>
//Play around with Colors, Fonts, Custom Backgrounds and lots more by clicking the Eye-Icon on the top-left side.<br>
//You can choose between preset themes or create your own - there are pretty powerful theming options by CSS-Injections; to get to know more about all options message tobeh.<br>
//<br><h3>.. Emojis!!</h3>
//I *bet* you missed your discord custom emojis; and so did I. <br>
//Type <code>:</code> and the emoji name in the chat input field to use an emoji, just as in discord.<br>
//Other typo users will see the emoji, the others just the emoji name.<br>
//<br><h3>Quick tablet mode access</h3>
//Among the other controls, you can now quickly select the tablet mode by clicking the tablet icon.<br>
//Remember the colors drawn with brightness or degree are only visible to typo users.<br>
//To access the options even faster, use the shortcut "T".<br>
//<br><h3>Sprite slots</h3>
//Use multiple sprites on your avatar!<br>
//For every 1000 drops you'll get an additional slot.<br>
//Slots are like layers; slot 1 is under slot 2 etc.<br>
//<br><h3>Draw-Over mode</h3>
//Draw over the image of the others by activating "Don't Clear" in the popup. <br>
//This only makes sense in custom rounds where everyone has activated this option from the start. <br>
//Credits for the idea go to some cool DS members.<br>
//<br><h3>Mute Players</h3>
//Mute someone by clicking their name - this will still show that they sent messages, but makes the content invisible.<br>
//<br><h3> Copy images on the fly</h3>
//Click STRG+C to copy the current image. <br>
//This is disabled when the chat input is focused or some text is selected.<br>
//<br><h3>Fullscreen Mode</h3>
//Click the Resize-Icon on the top-left side to enter a fullscreen mode with more space for drawing and chatting.<br>
//<br><h3>Straight lines</h3>
//Click somewhere on the canvas, press ALT and click where you want the line to end - voila!<br>
//<br><h3>In case you missed: Canvas zoom</h3>
//Old but gold: STRG+Click anywhere on the canvas to zoom there.<br>
//Click any number key to set the zoom level. Leave with STRG+Click.<br>
//<br><h3>Custom lobby chat</h3>
//When in the idle mode of a custom lobby, the chat is now shown.<br>
//As long as the lobby is idle, only typo users see the chat. As soon as the game starts, everyone sees the sent messages.<br>
//<br><h3>Chat commands</h3>
//Use <code>kick--</code> <code>like--</code> <code>shame--</code> to quickly kick, like or dislike.<br>
//<br><h3>That damn chat focus thing..</h3>
//Clicking "TAB" will auto-focus the chat input.<br>
//<br><br><h3>And of course... all known bugs were fixed.<h3>
//</div>`);
//                        node.querySelector("div").addEventListener("click", () => {
//                            new Modal(popupChanges, () => { }, "Changelog");
//                            localStorage.lastChangelogview = chrome.runtime.getManifest().version;
//                        });
//                        let popupData = elemFromString(
//                            `<div style="width:100%"><h4><a href="https://typo.rip#privacy">A more detailed privacy statement is available on https://typo.rip#privacy</a></h4><br>
//    <code><h4>Without connecting Palantir, Typo will collect and store NO data.</h4>
//    <h4>Collected data is ONLY used for feature-related purposes.</h4>
//    <h5>However, for Palantir-features like Sprites, Discord Lobbies and Typo Gallery Cloud, collecting data is inevitable.</h5></code>
//<br><h4>When Palantir isn't connected:</h4>
//Typo will fetch some necessary data from the servers, but will NOT send ANY data back.<br>
//This data are the online sprites as well as the current sprite ressources.<br>
//<br><h4>When Palantir is connected, but Discord Bot Status disabled:</h4>
//Typo fetches additionally to the above data all active lobbies of your connected Discord servers. <br>
//Typo will NOT send any data of your lobby.<br>
//Anyway, Typo Gallery is active which will send every drawing, its author,name and draw commands to the server.<br>
//This data is ONLY visible to you and its only purpose is the Typo Gallery Cloud feature.<br>
//<br><h4>When Palantir is connected and Discord Bot Status enabled:</h4>
//Additionally to the above, typo will fetch drops from the server and display them.<br>
//Typo will send your current lobby (players, points, link etc) to the server so that it can be displayed in Discord and your sprite is visible to others.<br>
//You will be able to collect bubbles and drops.<br>
//<br><h4>Where data is stored:</h4>
//All data is stored on a private server and is only used for the typo features.<br>
//No-one except you and the typo dev will have insight in the typo data.<br>
//If you want to know more about your stored data, contact the typo dev.
//</div>`);
//                        node.querySelector("#typodata").addEventListener("click", () => {
//                            new Modal(popupData, () => { }, "Data & Privacy");
//                        });
//                    }
//                    else if (node.id == 'screenLogin') {
//                        node.style.justifyContent = "center";
//                    }
//                }
                
            });
        });
});
patcher.observe(document, { attributes: false, childList: true, subtree: true });
