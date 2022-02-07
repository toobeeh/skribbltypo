const translate = {
    isInit: false,
    hasRunOnce: false,
    observer: new MutationObserver(observerCallback),
    observerConfig: {
        childList: true
    },
    runOnce: () => {
        'use strict';

        if (!translate.hasRunOnce) {
            // Insert code here

            translate.hasRunOnce = true;
        }
    },
    init: () => {
        'use strict';

        if (!translate.isInit) {
            translate.runOnce();

            const boxMessages = document.getElementById('boxMessages');
            translate.observer.observe(boxMessages, translate.observerConfig);

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
    observerCallback: (mutations, _observer) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    console.debug(node);
                }
            }
        }
    }
};
