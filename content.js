/*
 * So this is... finally reworked code?! :O
 * Right!! Almost everything is split into easy-to-understand procedural initialized modules, capsulated and called here in service.js.
 */
// Comment section: Todo list .. close this section in your IDE
{     /*
     * Todo and bugs:
     *  ----fix conflict with image poster (container freespace) 
     *  ----fix lobby id check -> as soon as lobby connected
     *  ----fix lobby status when search is still active (slow connection)
     *  ----fix lobby search not triggering sometimes on first lobby
     *  ----lobby buttons take several clicks sometimes
     *  ----keydown changes tools when other players draw
     *  ----mysterious drawing over next persons' canvas sometimes
     *  ----still that audio thing
     *  ----holy not working
     *  ----lobby search stops if lobby is tempoarly down
     *  ----private lobby settings not set
     *  gif progress bar is not consistent
     *  ----gif drawing speed could be tweaked
     *  ----image tools height gets too high
     *  ----fetch for imageagent
     *  image agent doesnt close if very lately opened and loading during word choose
     * 
     * Feature requests:
     * ----implement gif saving
     * ----maybe bigger color palette
     * ----lobby description
     * ----tab style popup
     * ----custom sprites+
     * ----ff port :(
     * ----zoom to canvas for accurate drawing
     * ----abort image tools drawing process
     * ----image agent error state message
     * ----finish dark mode # wont: way too lazy
     * ----recall older drawings to share
     */
}
'use strict';
// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const loaded = true;
patcher.disconnect(); // stop patcher observing
setDefaults(false); // Set default settings

// communication with popup.js
chrome.runtime.onMessage.addListener(msgObj => { 
    if (msgObj == "get") chrome.runtime.sendMessage({ get: JSON.stringify(localStorage) });
    else performCommand(msgObj + "--");
});
// check if execution is aborted due to skribbl update. will be removed after update is reliably live.
if (!STOP_EXECUTION) {
    if (document.body.innerText.includes("Fresh paint")) {
        localStorage.typoincompatibility = "true";
        window.location.reload();
    }
    // initialize modules
    lobbyStream.init();
    captureCanvas.initListeners(); // init capturing draw ommands and drawings
    imageAgent.initImageAgent(); // init image agent from agent.js
    //pressure.initEvents(); // init pressure
    uiTweaks.initAll(); // init various ui tweaks as navigation buttons, wordhint, backbutton, random color dice.. from uiTweaks.js
    imageOptions.initAll(); // init image options from imageOptions.js
    imageTools.initAll(); // init image tools from imageTools.js
    gamemodes.setup();
    brushtools.setup();
    setTimeout(async () => await emojis.init(), 0); // init emojis
    // sprites, visuals and drops are initialized in patcher.js as soon as DOM and palantir loaded
    QS("#loginAvatarCustomizeContainer  .avatarContainer").addEventListener("click", showPractise); // add listener to show practise
    QS('button[type="submit"]').addEventListener("click", () => { sessionStorage.practise = false; }); // disable when any button is clicked

    // thats a rickroll! :)))
    QS("a[href='https://twitter.com/ticedev']").href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
}
else {
    //new Toast("Welcome to the new Skribbl update! Typo will be updated soon and activated automatically. Have fun!", 5000);
    if (!document.body.innerText.includes("Fresh paint")) localStorage.typoincompatibility = "";
    document.querySelector(".button-create").insertAdjacentHTML("afterend", `<div style="
    color: white;
    font-size: small;
    background: rgba(0,0,0,.1);
    padding: .5em;
    margin: .5em;
    border-radius: .5em;
"><span>Welcome to the new skribbl update! 🥳<br>Typo is deactivated until everything is up-to-date. <br>It will reactivate automatically soon 💚
</span></div>`);
}
