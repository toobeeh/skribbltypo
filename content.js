/*
 * So this is... finally reworked code?! :O
 * Right!! Almost everything is split into easy-to-understand procedural initialized modules, capsulated and called here in service.js.
 */
// Comment section: Todo list .. close this section in your IDE
{ 
    /*
     * Todo and bugs:
     * ----fix conflict with image poster (container freespace) 
     * ----fix lobby id check -> as soon as lobby connected
     *  ----fix lobby status when search is still active (slow connection)
     * fix lobby search not triggering sometimes on first lobby
     * lobby buttons take several clicks sometimes
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
     * xxxxfinish dark mode # wont: way too lazy
     * ----recall older drawings to share
     */
}

// Important things go first
'use strict'; // Show no weaknesses
// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

patcher.disconnect(); // stop patcher observing
setDefaults(false); // Set default settings

// communication with popup.js
chrome.runtime.onMessage.addListener(msgObj => { 
    if (msgObj == "get") chrome.runtime.sendMessage({ get: JSON.stringify(localStorage) });
    else performCommand(msgObj + "--");
});

// initialize modules
Report.initEvents(); // init report data events from report.js
lobbies.initSearchEvents(); // init lobby search buttons, lobby guild container is already initialized in patcher
setInterval(async () => { // Keep report alive
    await Report.trigger();
}, 30000);
captureCanvas.initListeners(); // init capturing draw ommands and drawings
imageAgent.initImageAgent(); // init image agent from afent.js
imageOptions.initAll(); // init image options from imageOptions.js
imageTools.initAll(); // init image tools from imageTools.js
uiTweaks.initAll(); // init various ui tweaks as navigation buttons, wordhint, backbutton, random color dice.. from uiTweaks.js
drops.initDrops(); // init drops
pressure.initEvents(); // init pressure
QS("#loginAvatarCustomizeContainer  .avatarContainer").addEventListener("click", showPractise); // add listener to show practise
QS('button[type="submit"]').addEventListener("click", () => { sessionStorage.practise = false; }); // disable when any button is clicked

// thats a rickroll! :)))
QS("a[href='https://twitter.com/ticedev']").href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
