# Skribbl-Typo
An extension for chromium-based and firefox which adds many extra features to skribbl.io.  
Stable versions are submitted to the [Chrome Store](https://chrome.google.com/webstore/detail/bpcilmjlpebjklinlbdjhfkkgmmfghfj). 
Get infos on the [Website](https://chrome.google.com/webstore/detail/bpcilmjlpebjklinlbdjhfkkgmmfghfj). 

Bugs or requests: @Discord tobeh#7437

## Structure
**patcher.js** modifies DOM during load, eg replacing the game JS or adding instantly visible elements.  
**content.js** loads all features procedurally.  
Features are located in the **features** directory and are objects, each object has an init function to initialize the feature.

**color.js** simplifies color conversions, **commands.js** toggles features based on commands from the popup.  
**errors.js** provides a way to log js errors and send them via a Discord webhook.  
**gamePatch.js** is the patched game.js from skribbl.


## Involved repos
##### typo.rip  
 * Website for all the stuff together

##### Palantir
 * Gets skribbl lobby data from typo
 * Shows these in Discord
 * Manages bubbles, drops, sprites and events to be shown on skribbl
 
##### Ithil
 * A socket.io server
 * Establishes a real-time connection between the palantir server & typo client
 * Used for authentification, lobby data loading, drop cathing, sprites etc
 * Some features of the original Orthanc API are still not implemented
 
##### Orthanc (private repo, OUTDATED)  
 * PHP webdirectory which provides an interface between the database and web-access
 * Secure authorization via login token
 * Json based
