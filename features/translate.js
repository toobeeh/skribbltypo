const translate = {
    isInit: false,
    hasRunOnce: false,
    observerConfig: {
        childList: true,
    },
    mirrors: [
        'https://libretranslate.de/translate',
        'https://translate.mentality.rip/translate',
        'https://translate.argosopentech.com/translate',
        'https://translate.api.skitzen.com/translate',
        'https://trans.zillyhuhn.com/translate',
    ],
    mirror: 0,
    runOnce: () => {
        'use strict';

        if (!translate.hasRunOnce) {
            translate.observer = new MutationObserver(translate.observerCallback);

            translate.hasRunOnce = true;
        }
    },
    init: () => {
        'use strict';

        if (!translate.isInit) {
            translate.runOnce();

            translate.boxMessages = document.getElementById('boxMessages');
            translate.observer.observe(translate.boxMessages, translate.observerConfig);

            translate.isInit = true;
        }
    },
    destroy: () => {
        'use strict';

        if (translate.isInit) {
            translate.observer.disconnect();

            translate.isInit = false;
        }
    },
    observerCallback: mutations => {
        if (localStorage.getItem('lang') !== 'German') {
            return;
        }
        if (!translate.you) {
            for (const node of document.querySelectorAll('#containerGamePlayers .name')) {
                if (
                    node.textContent.slice(-6) === ' (You)' &&
                    node.attributes.getNamedItem('style').value.indexOf('color: rgb(0, 0, 255);') !=
                        -1
                ) {
                    translate.you = node.textContent.slice(0, -6);
                    break;
                }
            }
        }

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.classList.contains('translated')) continue;
                    if (node.classList.contains('translating')) continue;
                    if (node.classList.contains('untranslated')) continue;
                    if (node.tagName.toLowerCase() !== 'p') continue;
                    if (node.childNodes.length != 2) continue;
                    if (node.firstChild.tagName.toLowerCase() !== 'b') continue;
                    if (node.firstChild.attributes.length != 0) continue;
                    if (!/^.*: $/.test(node.firstChild.innerHTML)) continue;
                    if (node.lastChild.tagName.toLowerCase() != 'span') continue;
                    if (new RegExp(`^${translate.you}: `).test(node.firstChild.innerHTML)) continue;

                    const text = node.lastChild.textContent;
                    node.classList.add('translating');

                    fetch(translate.mirrors[translate.mirror++], {
                        method: 'POST',
                        body: JSON.stringify({
                            q: text,
                            source: 'de',
                            target: 'en',
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    })
                        .then(res => {
                            if (!res.ok) {
                                node.classList.remove('translating');
                                node.classList.add('untranslated');

                                return;
                            }

                            res.json()
                                .then(data => {
                                    node.classList.remove('translating');
                                    node.classList.add('translated');
                                    node.lastChild.textContent = `DE: ${text} EN: ${data.translatedText}`;
                                    translate.boxMessages.scrollTop =
                                        translate.boxMessages.scrollHeight;
                                })
                                .catch(() => {
                                    node.classList.remove('translating');
                                    node.classList.add('untranslated');
                                });
                        })
                        .catch(() => {
                            node.classList.remove('translating');
                            node.classList.add('untranslated');
                        });

                    if (translate.mirror >= translate.mirrors.length) {
                        translate.mirror = 0;
                    }
                }
            }
        }
    },
};
