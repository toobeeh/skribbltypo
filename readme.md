# Skribbl-Typo
[![part of Typo ecosystem](https://img.shields.io/badge/Typo%20ecosystem-skribbltypo-blue?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACV0lEQVR4nO3dPUrDYByA8UQ8g15AI+gsOOnmrufoIBT0DAUFB+/R3bFTobOCwQvoJSouNcObhHyZ9n2eHwiirW3Th79J2iaJJEmSJEmSJIC06iGu1+vgz9M0Df9CY6t8PkP2fMrYDADOAOAMAM4A4OrWGl3bj0Pp8+wEgDMAuP2uD//w7I6+DEf19fbc6eadAHAGAGcAcAYAZwBwnbcCTrIj+jL8Fx/55yA34wSAMwA4A4AzADgDgDMAOAOAMwC4zjuCzi+uN9+fZgeNrvuefw+69FfL10H/fgycAHAGAGcAcAYAZwBwnbcCioZeq2+quIVS5NbBHycAnAHARffRsOksr71Ml38Bi/mk9XVH5EfDFGYAcHVbAWWjw08NbyePEaRmDADOAOAMAM4A4Fq9FjCd5cG1zaeHrPeleXnzsvl+MZ802vooe4fSatn9ftUILp/iYxlCm51UTgA4A4Dr9eXgsv3wtJdfhx71fXICwBkAXGUAv+cLCH0pHk4AOAOAMwA4A4AzALhedwRpXBVneSu9X04AOAOAMwA4A4AzADgDgDMAOAOAMwA4A4AzADgDgDMAOAOAMwA4A4AzALio3xG0bUcu3UZOADgDgDMAOAOAMwC4qLcCRjxG0M5wAsAZAJwBwBkAnAHAGQCcAcAZAJwBwBkAnAHA+Y4gOCcAnAHAGQCcAcAZAFyrrYDH++NGl7+6ZZ0yZpc4AeAMAC66HUFDnLwyZk4AOAOAKz+QfMXx58dScdz7se5o8A7t0HJzAtAZAJwBwBkAnAFIkiRJkiRJUtySJPkBweNXgRaWkYQAAAAASUVORK5CYII=)](https://github.com/topics/skribbl-typo)
## About
An extension for chromium-based browsers and firefox which adds many extra features to skribbl.io.  
Stable versions are submitted to the [Chrome Store](https://chrome.google.com/webstore/detail/bpcilmjlpebjklinlbdjhfkkgmmfghfj). 
Get infos on the [Website](https://chrome.google.com/webstore/detail/bpcilmjlpebjklinlbdjhfkkgmmfghfj). 

### 🐛 Bugs or requests: @Discord tobeh#7437

## Structure
**patcher.js** modifies DOM during load, eg replacing the game JS or adding instantly visible elements.  
**content.js** loads all features procedurally.  
Features are located in the **features** directory and are objects, each object has an init function to initialize the feature.

**color.js** simplifies color conversions, **commands.js** toggles features based on commands from the popup.  
**errors.js** provides a way to log js errors and send them via a Discord webhook.  
**gamePatch.js** is the patched game.js from skribbl.


## Involved repos
##### [typo.rip](https://github.com/toobeeh/typo.rip)
 * Website for all typo things, also includes some Palantir user management

##### [Palantir](https://github.com/toobeeh/Palantir)
 * A C#-Discord bot and backend management application
 * Gets skribbl lobby data from typo
 * Shows these in Discord
 * Manages bubbles, drops, sprites and events to be shown on skribbl
 
 ##### [Ithil-Rebirth](https://github.com/toobeeh/Ithil-Rebirth)
 * Typescript nodejs application
 * Establishes a real-time connection between the palantir server & typo client via socket.io & WebSockets
 * Used for authentification, lobby data loading, drop catching, sprites etc
 
 ##### [Orthanc](https://github.com/toobeeh/Orthanc) - DEPRECATED
 * Recently also features a up-to-date discord OAuth login for typo, a userdata api as well as an emoji api; **everything else is deprecated**
 * PHP webdirectory which provides an pseudo-api interface between the database and web-access
 * Secure authorization via login token
 * Json based

##### [Ithil](https://github.com/toobeeh/Ithil) - DEPRECATED
 * Predecessor of Ithil-Rebirth with the same tasks
