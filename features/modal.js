// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

class Modal {
    constructor(contentParent, onclose, title = "Modal", width = "50vw", height = "50vh") {
        let modal = document.createElement("div");
        modal.style.cssText = `
            position: fixed;
            width: ${width};
            min-height: ${height};
            left: calc((100vw - ${width}) / 2);
            top: calc((100vh - ${height}) / 4);
            padding: 1em;
            background-color: white;
            border-radius: 1em;
            box-shadow: black 1px 1px 9px -2px;
            z-index: 50;
            display:flex;
            flex-direction:column;
        `;
        let blur = document.createElement("div");
        blur.addEventListener("click", this.close);
        blur.style.cssText = `
            position: fixed;
            width: 100vw;
            height: 100vh;
            left: 0;
            top: 0;
            background-color: black;
            opacity:0.25;
            z-index: 49;
        `;
        modal.insertAdjacentHTML("afterbegin","<h2 style='text-align:center'>" + title + "</h2>");
        if (contentParent) {
            let content = document.createElement("div");
            content.style.cssText = `
                width: 100%;
                flex-grow: 2;
                display:flex;
                justify-content: center;
                align-items:center;
            `;
            modal.appendChild(content);
            content.appendChild(contentParent);
            this.content = content;
        }
        document.body.appendChild(modal);
        document.body.appendChild(blur);
        this.modal = modal;
        this.blur = blur;
        this.onclose = onclose;
    }
    setNewContent = (parentElement) => {
        this.content.replaceWith(parentElement);
    }
    setNewTitle = (title) => {
        this.modal.querySelector("h2").innerText = title;
    }
    close = () => {
        this.blur.remove();
        this.modal.remove();
        this.onclose();
    }
}