const translate = {
    isInit: false,
    hasRunOnce: false,
    runOnce: () => {
        'use strict';

        if (!translate.hasRunOnce) {
            // TODO

            translate.hasRunOnce = true;
        }
    },
    init: () => {
        'use strict';

        if (!translate.isInit) {
            translate.runOnce();

            // TODO

            translate.isInit = true;
        }
    },
    destroy: () => {
        'use strict';

        if (translate.isInit) {
            // TODO

            translate.isInit = false;
        }
    }
};
