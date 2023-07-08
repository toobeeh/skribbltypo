/**
 * script to generate a userscript from the web extension.
 * most features should be supported, except the extension popup.
 */

const fs = require('fs');
const mainfest = require("./manifest.json");

/* bundle contents */
let bundle_begin = "";
let bundle_end = "";
let bundle_styles = ""

/* add js to bundle */
const addToBundle = (text, name, end = false) => {
    if (end) bundle_end += "// #content " + name + "\n" + text + "\n\n";
    else bundle_begin += "// #content " + name + "\n" + text + "\n\n";
}

/* add css to bundle */
const addToStyle = (text, name) => {
    bundle_styles += /* "// #content " + name + "\n" + */ text + "\n\n";
}

/* add typo scripts and css */
mainfest.content_scripts.forEach(script => {
    if (script.matches.some(url => url.includes("skribbl"))) {
        if (script.js) script.js.forEach(js =>
            addToBundle(fs.readFileSync("./" + js), js, script.run_at == "document_idle")
        );
        if (script.css) script.css.forEach(css =>
            addToStyle(fs.readFileSync("./" + css), css)
        );
    }
});

/* build bundle header */
let bundle = `
// ==UserScript==
// @name skribbltypo 
// @website https://typo.rip
// @author tobeh#7437
// @description Userscript version of skribbltypo - the most advanced toolbox for skribbl.io
// @icon64 https://rawcdn.githack.com/toobeeh/skribbltypo/cf478d8b402044398e52e72cad0a843815a46594/res/icon/128MaxFit.png
// @version ${mainfest.version}.${Date.now().toString().substring(0, 9)}
// @updateURL https://raw.githubusercontent.com/toobeeh/skribbltypo/master/skribbltypo.user.js
// @grant none
// @match https://skribbl.io/*
// @run-at document-start
// ==/UserScript==

/* polyfill */
const chrome = {
    extension: {
        getURL: (url) => {
            return "https://rawcdn.githack.com/toobeeh/skribbltypo/cf478d8b402044398e52e72cad0a843815a46594/" + url;
        }
    },
    runtime: {
        getURL: (url) => {
            return "https://rawcdn.githack.com/toobeeh/skribbltypo/cf478d8b402044398e52e72cad0a843815a46594/" + url;
        },
        getManifest: () => {
            return {version: "${mainfest.version} usrsc"};
        },
        onMessage: {
            addListener: (callback) => {
                window.addEventListener("message",msg => { 
                    if(msg.origin.includes("//skribbl.io")) callback(msg.data, {tab:{id:0}}); 
                });
            }
        },
        sendMessage: undefined
    }
}

`;

/* combine bundles */
bundle += `

/* async typo setup for same-context of differently timed executions */
const execTypo = async () => {

    /* dom content load promise */
    const loaded = new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() =>resolve(), 2000);
        });
        setTimeout(() =>resolve(), 2000);
    });

    /* wait until dom loaded */
    /* await loaded; */
    console.clear();
    
    /* bundle pre dom exec */
    ${bundle_begin}

    /* disconnect patcher, not used */
    patcher.disconnect();

    /* get new document to re-run without original game js */
    let html = await (await fetch("./")).text();
    html = html.replaceAll("game.js", "game.jsx");
    const newDoc = document.createElement("html");
    newDoc.innerHTML = html;
    document.body = newDoc.querySelector("body");

    /* patch nodes manually */
    let nodes = document.querySelectorAll("*");
    for(const node of nodes){
        await patchNode(node);
    }

    /* bundle styles */
    document.body.insertAdjacentHTML("afterbegin", \`<style>
        ${bundle_styles} 
        .adsbygoogle, .ad-2 {display:none !important}
    </style>\`);

    /* add touch prevention and select prevention */
    if(navigator.platform.match(/iPad/i) || navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)){
        document.body.style.touchAction = "none";
        document.body.userSelect = "none";
    }

    /* dispatch fake load events */
    window.dispatchEvent(new Event("load"));
    document.dispatchEvent(new Event("DOMContentLoaded"));

    /* init popup polyfill */
    const popupHTML = \`${fs.readFileSync("./popup/popup.html")}\`;
    const popupDoc = document.createElement("html");

    /* parse doc and add new base uri + polyfill for tabs api */
    popupDoc.innerHTML = popupHTML;
    popupDoc.querySelector("head").insertAdjacentHTML("afterbegin",
        '<base href="https://rawcdn.githack.com/toobeeh/skribbltypo/cf478d8b402044398e52e72cad0a843815a46594/popup/" />'
    );
    popupDoc.querySelector("head").insertAdjacentHTML("afterbegin",
        \`<script>
            window.chrome = {
                runtime: {
                    onMessage: {
                        addListener: (callback) => {
                            window.addEventListener("message", msg => callback(msg.data, {tab:{id:0}}));
                        }
                    }
                },
                tabs: {
                    query: (a,b) => {
                        b([
                            {id: "0", url: "https://skribbl.io/"}
                        ]);
                    },
                    sendMessage: (id, msg) => {
                        window.parent.postMessage(msg, "*");
                    }
                }
            }
        </script>\`
    );

    /* create show popup function */
    window.openTypoPopup = () => {
        window.typoPopupOpened = true;
        const frame = document.createElement("iframe");
        frame.style.border = "none";
        frame.style.height = "100vh";
        frame.style.width = "min(25em, 90vw)";
        frame.srcdoc = popupDoc.innerHTML;
        document.querySelector("#typoPopupPolyfill").append(frame);
    
        /* apply message polyfill */
        chrome.runtime.sendMessage = (msg) => {
            frame.contentWindow.postMessage(msg);
        }

        window.closeTypoPopup = () => {
            window.typoPopupOpened = false;
            frame.remove();
        }
    }

    /* create popup toggle  */
    document.body.insertAdjacentHTML("afterbegin", \`
    
        <div style="position:fixed; right:0; top:0; display:flex; flex-direction:row; z-index:10000" id="typoPopupPolyfill">
            <div onclick="window.typoPopupOpened === true ? window.closeTypoPopup() : window.openTypoPopup()" style="cursor:pointer; border-bottom-left-radius: 0.5em; height: 2.5em; aspect-ratio: 1; background-color:#9daff0a3; background-image: url('https://rawcdn.githack.com/toobeeh/skribbltypo/d416e4f61888b48a9650e74cf716559904e2fcbf/res/icon/128CircleFit.png'); background-size: contain;">
            </div>
        <div>
    
    \`);
    

    /* bundle post dom exec */
    ${bundle_end}
};

/* run setup */
execTypo();
`;

/* save bundle */
fs.writeFileSync("skribbltypo.user.js", bundle);