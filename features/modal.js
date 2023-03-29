// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const STOP_EXECUTION = localStorage.typoincompatibility == "true";

class Modal {
    constructor(contentParent, onclose, title = "Modal", width = "50vw", height = "50vh") {
        let modal = document.createElement("div");
        modal.classList.add("modalContainer");
        modal.style.cssText = `
            width: ${width};
            min-height: ${height};
            left: calc((100vw - ${width}) / 2);
            top: calc((100vh - ${height}) / 4);
        `;
        let blur = document.createElement("div");
        blur.classList.add("modalBlur");
        modal.insertAdjacentHTML("afterbegin", "<h3 style='text-align:center; font-weight: 600; font-size:1.7em;'>" + title + "</h2>");
        modal.insertAdjacentHTML("afterbegin", `<div id="modalClose">🞬</div>`);
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
        let esc = (e) => {
            if (e.which == 27) {
                e.preventDefault();
                this.close();
            }
        }
        document.addEventListener("keydown", esc);
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
            modal.style.transform = "translate(0,-20vh)";
            modal.style.opacity = "0";
            blur.style.opacity = "0";

            document.body.style.height = "";
            document.body.style.overflowY = "";
            document.body.style.paddingRight = "";

            document.removeEventListener("keydown", esc);
            setTimeout(() => {
                this.onclose();
                this.blur.remove();
                this.modal.remove();
            }, 200)
        };
        blur.addEventListener("click", this.close);
        modal.querySelector("#modalClose").addEventListener("click", this.close);
        setTimeout(() => {
            modal.style.transform = "translate(0)";
            modal.style.opacity = "1";
            blur.style.opacity = "0.5";
        }, 20);

        /*  */
        document.body.style.height = "100vh";
        document.body.style.overflowY = "hidden";
        document.body.style.paddingRight = "15px";
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
        toast.innerHTML = content;
        toast.classList.add("toast");
        document.body.appendChild(toast);
        let width = toast.getBoundingClientRect().width;
        toast.style.left = "calc(50vw - (" + width + "px) / 2)";
        toast.style.opacity = "1";
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 500);
        }, duration);
        this.toast = toast;
    }
    remove() {
        this.toast.remove();
    }
}