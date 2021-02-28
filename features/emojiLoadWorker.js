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
    // get emojis by regex since dom parser and queryselector not available
    for (const category of categories) {
        let doc = await (await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(category)}`)).text();
        for (const match of doc.matchAll(new RegExp("<li[^>]*title=[^>]*>(.+?|\n)</li>", "g"))) {
            const title = match[0].matchAll(new RegExp(/<li[^>]*title='(.+?)'/gi)).next().value[1];
            const url = match[0].matchAll(new RegExp(/src=[^"]*"(.+?)[^"]"/gi)).next().value[1];
            emojis.push({
                name: title,
                url: url,
                animated: url.indexOf(".gif") > 0 ? true : false
            });
        }
    }
    emojis = emojis.filter(emoji => emoji.animated || !emoji.animated && emojis.filter(
        emojidupe => emojidupe.animated && emojidupe.name == emoji.name).length == 0);
    let removedDupes = [];
    emojis.forEach(emoji => removedDupes.some(dupe => dupe.name == emoji.name) || removedDupes.push(emoji));
    emojis = removedDupes;
    // send emojis
    self.postMessage(emojis);
})();