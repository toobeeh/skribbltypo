const translate = {
    isInit: false,
    hasRunOnce: false,
    runOnce: () => {
        'use strict';

        if (!translate.hasRunOnce) {

            translate.hasRunOnce = true;
        }
    },
    init: () => {
        'use strict';

        if (!translate.isInit) {
            translate.runOnce();
            
            translate.isInit = true;
        }
    },
    destroy: () => {
        'use strict';

        if (translate.isInit) {

            translate.isInit = false;
        }
    }
};
