/*
 *

░██████╗██╗░░██╗██████╗░██╗██████╗░██████╗░██╗░░░░░  ████████╗██╗░░░██╗██████╗░░█████╗░
██╔════╝██║░██╔╝██╔══██╗██║██╔══██╗██╔══██╗██║░░░░░  ╚══██╔══╝╚██╗░██╔╝██╔══██╗██╔══██╗
╚█████╗░█████═╝░██████╔╝██║██████╦╝██████╦╝██║░░░░░  ░░░██║░░░░╚████╔╝░██████╔╝██║░░██║
░╚═══██╗██╔═██╗░██╔══██╗██║██╔══██╗██╔══██╗██║░░░░░  ░░░██║░░░░░╚██╔╝░░██╔═══╝░██║░░██║
██████╔╝██║░╚██╗██║░░██║██║██████╦╝██████╦╝███████╗  ░░░██║░░░░░░██║░░░██║░░░░░╚█████╔╝
╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝╚═════╝░╚═════╝░╚══════╝  ░░░╚═╝░░░░░░╚═╝░░░╚═╝░░░░░░╚════╝░
 * 
 * 
 * So this is... finally reworked code?! :O
 * Right!! Almost everything is split into easy-to-understand procedural initialized modules, capsulated and called here in service.js.
 */
// Comment section: Todo list .. close this section in your IDE
{
    /*
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
     *  ----gif progress bar is not consistent
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

// Important things go first
'use strict'; // Show no weaknesses
// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

if(localStorage.typoCompatible !== "1") {
    new Toast("Typo is not compatible with the current version of Skribbl.io. An update wil follow soon!", 2000);
    throw new Error("Aborted content because typo not compatible with current skribbl version");
}

patcher.disconnect(); // stop patcher observing
setDefaults(false); // Set default settings

// communication with popup.js
chrome.runtime.onMessage.addListener(message => {
    if (message == "getSettings") chrome.runtime.sendMessage({ settings: JSON.stringify(localStorage) });
    else performCommand(message + "--");
});

// initialize modules
captureCanvas.initListeners(); // init capturing draw ommands and drawings
imageAgent.initImageAgent(); // init image agent from agent.js
imageOptions.initAll(); // init image options from imageOptions.js
imageTools.initAll(); // init image tools from imageTools.js
gamemodes.setup();
brushtools.setup();
awards.setup();
//pressure.initEvents(); // init pressure
document.dispatchEvent(new Event("addTypoTooltips"));
uiTweaks.initAll(); // init various ui tweaks as navigation buttons, wordhint, backbutton, random color dice.. from uiTweaks.js
search.setup();
setTimeout(async () => await emojis.init(), 0); // init emojis
// sprites, visuals and drops are initialized in patcher.js as soon as DOM and palantir loaded

// thats a rickroll! :)))
//QS("a[href='https://twitter.com/ticedev']").href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

