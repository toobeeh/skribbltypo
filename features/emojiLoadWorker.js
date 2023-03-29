// Webworker to load emojis
(async () => {
    let emojis = [];
    // sources
    const categories = [
        "https://discordmojis.com/emojis/popular_static",
        "https://discordmojis.com/emojis/popular_animated",
        "https://slackmojis.com/categories/3-meme-emojis",
        "https://slackmojis.com/categories/2-logo-emojis",
        "https://slackmojis.com/emojis/popular",
        "https://slackmojis.com/",
        "https://slackmojis.com/categories/19-random-emojis"
    ];
    // get spcific emojis from emoji api
    let apiEm = await (await fetch("https://tobeh.host/Orthanc/emojiapi/all.json")).json();
    apiEm.forEach(emoji => {
        emojis.push({
            name: emoji.name,
            url: emoji.url,
            animated: emoji.url.indexOf(".gif") > 0 ? true : false
        });
    });
    emojis = emojis.filter(emoji => emoji.animated || !emoji.animated && emojis.filter(
        emojidupe => emojidupe.animated && emojidupe.name == emoji.name).length == 0);
    let removedDupes = [];
    emojis.forEach(emoji => removedDupes.some(dupe => dupe.name == emoji.name) || removedDupes.push(emoji));
    emojis = removedDupes;
    // send emojis
    self.postMessage(emojis);
})();