// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

class Modal {
    constructor(contentParent, onclose, title = "Modal", width = "50vw", height = "50vh") {
        let modal = document.createElement("div");
        modal.classList.add("modalContainer");
        modal.style.cssText = `
            position: fixed;
            width: ${width};
            min-height: ${height};
            max-height: 85vh;
            overflow:hidden;
            left: calc((100vw - ${width}) / 2);
            top: calc((100vh - ${height}) / 4);
            padding: 1em;
            background-color: white;
            border-radius: 1em;
            box-shadow: black 1px 1px 9px -2px;
            z-index: 60;
            display:flex;
            flex-direction:column;
        `;
        let blur = document.createElement("div");
        blur.classList.add("modalBlur");
        blur.style.cssText = `
            position: fixed;
            width: 100vw;
            height: 100vh;
            left: 0;
            top: 0;
            background-color: black;
            opacity:0.25;
            z-index: 59;
        `;
        modal.insertAdjacentHTML("afterbegin","<h2 style='text-align:center; font-weight: 600;'>" + title + "</h2>");
        if (contentParent) {
            let content = document.createElement("div");
            content.style.cssText = `
                width: 100%;
                flex-grow: 2;
                display:flex;
                justify-content: center;
                overflow-y:auto;
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
        this.setNewContent = parentElement => {
            this.content.replaceWith(parentElement);
        };
        this.setNewTitle = title => {
            this.modal.querySelector("h2").innerText = title;
        };
        this.close = () => {
            this.onclose();
            this.blur.remove();
            this.modal.remove();
        };
        blur.addEventListener("click", this.close);
    }
}

class Toast {
    constructor(content, duration = 4500) {
        let toast = elemFromString(`<div style= "
position: fixed;
bottom: 10vh;
font-size:2em;
border-radius:.5em;
z-index:300;
width: fit-content;
pointer-events: none;
color: black;
text-align:middle;
padding: 0.5em 1em;
background-color: white;
opacity: 0;
transition: opacity 0.5s;
box-shadow: black 1px 1px 9px -2px;
"></div>`);
        toast.innerText = content;
        toast.classList.add("toast");
        document.body.appendChild(toast);
        let width = toast.getBoundingClientRect().width;
        toast.style.left = "calc(50vw - (" + width + "px) / 2)";
        toast.style.opacity = "1";
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(()=> toast.remove(), 500);
        }, duration);
    }
}