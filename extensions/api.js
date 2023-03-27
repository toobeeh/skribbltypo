class TypoExtensionApi {

    requests = 0;

    access = Object.freeze({
        addMessage: addChatMessage
    });

    listen() {
        document.addEventListener("typoapiRequest", event => {
            const request = event.detail;
            const resource = this.access[request.resource];

            const response = {
                found: false,
                resource: resource
            };

            if (resource != undefined) {
                response.found = true;
            }

            document.dispatchEvent(new CustomEvent("typoapiResponse#" + request.id, { detail: response }));
        });
    }

    async request(resource) {
        return new Promise((resolve, reject) => {
            const id = this.requests++

            document.addEventListener("typoapiResponse#" + id, event => {
                const response = event.detail;
                if (response.found) resolve(response.resource);
                else reject();
            }, { once: true });

            document.dispatchEvent(new CustomEvent("typoapiRequest", {
                detail: {
                    id: id,
                    resource: resource
                }
            }));
        });
    }
}




