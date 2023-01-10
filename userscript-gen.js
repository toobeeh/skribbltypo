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
        script.js?.forEach(js => 
            addToBundle(fs.readFileSync("./" + js), js, script.run_at == "document_idle")
        );
        script.css?.forEach(css => 
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
// @version ${mainfest.version}
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

/* add bundle styles */
bundle += `
document.body.insertAdjacentHTML("afterbegin", \`<style>${bundle_styles}</style>\`);
`;

/* add bundle pre dom load */
bundle += bundle_begin;

/* add bundle post dom load */
bundle += `
document.addEventListener("DOMContentLoaded", () => {
    ${bundle_end}
});
`;

/* save bundle */
fs.writeFileSync("skribbltypo.userscript.js", bundle);