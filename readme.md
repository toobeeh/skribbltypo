# Skribbl-Typo

[![part of Typo ecosystem](https://img.shields.io/badge/Typo%20ecosystem-Ithil-blue?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACV0lEQVR4nO3dPUrDYByA8UQ8g15AI+gsOOnmrufoIBT0DAUFB+/R3bFTobOCwQvoJSouNcObhHyZ9n2eHwiirW3Th79J2iaJJEmSJEmSJIC06iGu1+vgz9M0Df9CY6t8PkP2fMrYDADOAOAMAM4A4OrWGl3bj0Pp8+wEgDMAuP2uD//w7I6+DEf19fbc6eadAHAGAGcAcAYAZwBwnbcCTrIj+jL8Fx/55yA34wSAMwA4A4AzADgDgDMAOAOAMwC4zjuCzi+uN9+fZgeNrvuefw+69FfL10H/fgycAHAGAGcAcAYAZwBwnbcCioZeq2+quIVS5NbBHycAnAHARffRsOksr71Ml38Bi/mk9XVH5EfDFGYAcHVbAWWjw08NbyePEaRmDADOAOAMAM4A4Fq9FjCd5cG1zaeHrPeleXnzsvl+MZ802vooe4fSatn9ftUILp/iYxlCm51UTgA4A4Dr9eXgsv3wtJdfhx71fXICwBkAXGUAv+cLCH0pHk4AOAOAMwA4A4AzALhedwRpXBVneSu9X04AOAOAMwA4A4AzADgDgDMAOAOAMwA4A4AzADgDgDMAOAOAMwA4A4AzALio3xG0bUcu3UZOADgDgDMAOAOAMwC4qLcCRjxG0M5wAsAZAJwBwBkAnAHAGQCcAcAZAJwBwBkAnAHA+Y4gOCcAnAHAGQCcAcAZAFyrrYDH++NGl7+6ZZ0yZpc4AeAMAC66HUFDnLwyZk4AOAOAKz+QfMXx58dScdz7se5o8A7t0HJzAtAZAJwBwBkAnAFIkiRJkiRJUtySJPkBweNXgRaWkYQAAAAASUVORK5CYII=)](https://github.com/topics/skribbl-typo)

Skribbl Typo is an extension for various browsers which adds many extra features to skribbl.io.  
Details about features & functionality can be found on the [Website](https://chrome.google.com/webstore/detail/bpcilmjlpebjklinlbdjhfkkgmmfghfj). 

## 🌍 Browser availability
Typo is available for all major browsers in one or another way.
- For chrome and all chromium based browsers, you can get it from the chrome store or use the zip in the releases section.
- For firefox, use the "add typo" link on the website or use the signed xpi file from the releases section.
- For all other browsers (including safari on iOS and iPadOS), you can use the userscript in the repo root with a userscript manager of your choice.

## 🔀 Contribution & Code Quality
> First a disclaimer: This extension emerged from a pretty bad codebase (which i am responsible for), and although it had some minor refactors the architecture and code quality is not that great.

**Contributions are welcome!**
Just fork the repo and create a pull request into develop when you're done.
Finished & tested versions will be merged from develop to master.

However, if you want to contribute or have some feedback, it is a good idea to message me fist on discord @tobeh. 

If you want to report some bugs, feel free to open an issue.

## 🧩 Structure
To get an idea what code is run at which point, have a brief look at the manifest.  

**patcher.js** modifies DOM during load, eg replacing the game JS or adding instantly visible elements.  
**content.js** initiates all features procedurally.  
Features are located in the **features** directory and are objects, each object has an init function to initialize the feature.

**color.js** simplifies color conversions, **commands.js** toggles features based on commands from the popup.  
**errors.js** provides a way to log js errors and send them via a Discord webhook.  
**gamePatch.js** is the patched game.js from skribbl.

## 🎚️ Patching the game.js
Since typo is using advanced features to modify the behavior of skribbl, the original client-code of skribbl is being patched. 
Typo utilizes the tool [patchEx](https://github.com/toobeeh/patchEx) written for specifically this issue.  

Instead of manually patching the source code, it allows adding rules and inserting code & templates automatically.  
The patch configuration can be found in `patch.json` in the repo root. Whenever a new skribbl version is published, it is necessary to update the patched game.js.  
It may be needed to adjust the patch config since the client-code is minified.

## 🧿 Involved repos
To view all involved repos, click the badge at the top of the readme. 
Similar as with this repo, the codebase grew from an absolute beginner-level and is being refactored step by step.  
Here is an overview of new & legacy repositories which are in use to some extent.
  
### Frontend
- *typo.rip* is the currently active website and user dashboard written in vanilla JS as SPA.
- *Tirith (frontend)* is an angular application which aims to replace the current website and feature an admin dashboard (which is already in use).  

### Backend / API
- *Orthanc* is a collection of PHP scripts which provides API-ish access to some data like available sprites, themes and scraped emojis. 
- *Tirith (backend)* is a NEST application which aims to replace Orthanc in the near future. Used also by the Tirith frontend.
- *typo-agent-scraper* is a microservice to provide image sources for the image agent.
- *Palantir* is a discord bot that integrates skribbltypo to discord and lets user manage their account in a social and interactive way.

### Deployment
- *typo-compose* is a git repository which features a setup of various docker-composes to establish an easy-to-deploy ecosystem. This is currently used on the vps where all containers are hosted.  
- *typo-static-files* is a repository which serves as collection of all static assets (sprites, drops, awards, scenes).
