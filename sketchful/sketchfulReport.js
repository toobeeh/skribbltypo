//alert("i am here");
const GAME = document.querySelector("div.game");

var reportEnabled = false;

// mutation observer for game visibility
var gameObserver = new MutationObserver(() => {
    if (GAME.style.display != "none") {
        if (!reportEnabled) {
            reportEnabled = true;
        }
    }
});
gameObserver.observe(GAME, { attributes: true, childList: false });

//blah blah maybe somewhere in the future