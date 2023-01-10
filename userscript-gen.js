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
    if(end) bundle_end += "// #content " + name + "\n" + text + "\n\n";
    else bundle_begin += "// #content " + name + "\n" + text + "\n\n";
}

/* add css to bundle */
const addToStyle = (text, name) => {
    bundle_styles += /* "// #content " + name + "\n" + */ text + "\n\n";
}

/* add typo scripts and css */
mainfest.content_scripts.forEach(script => {
    if(script.matches.some(url => url.includes("skribbl"))) {
        if(script.js) script.js.forEach(js => 
            addToBundle(fs.readFileSync("./" + js), js, script.run_at == "document_idle")
        );
        if(script.css) script.css.forEach(css => 
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
// @description Userscript version of skribbltypo. Limited support
// @version ${mainfest.version}.${Date.now()}
// @updateURL https://raw.githubusercontent.com/toobeeh/skribbltypo/master/skribbltypo.userscript.js
// @grant none
// @match https://skribbl.io/*
// @run-at document-start
// ==/UserScript==

/* polyfill */
const chrome = {
    extension: {
        getURL: (url) => {
            console.log(url);
            return "https://rawcdn.githack.com/toobeeh/skribbltypo/d416e4f61888b48a9650e74cf716559904e2fcbf/" + url;
        }
    },
    runtime: {
        getURL: (url) => {
            console.log(url);
            return "https://rawcdn.githack.com/toobeeh/skribbltypo/d416e4f61888b48a9650e74cf716559904e2fcbf/" + url;
        },
        getManifest: () => {
            return {version: "0.0.1"};
        },
        onMessage: {
            addListener: (l) => {
                console.log("Listener not supported in typo userscript version");
            }
        }
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
            resolve();
        });
    });

    /* bundle styles */
    document.body.insertAdjacentHTML("afterbegin", \`<style>${bundle_styles}</style>\`);

    /* bundle pre dom exec */
    ${bundle_begin}

    /* wait until dom loaded */
    await loaded;

    /* bundle post dom exec */
    ${bundle_end}
};

/* run setup */
execTypo();
`;

/* save bundle */
fs.writeFileSync("skribbltypo.userscript.js", bundle);