class Vision {
    element;

    constructor() {
        this.element = elemFromString(
`<div class="visionFrame ghost">
    <div class="visionHead" draggable="true">
        <div class="visionControls">
            <input type="text" placeholder="Image URL">
            <input type="range" min="1" max="9">
        </div>
        <span class="visionControl">
            <span class="visionClose">🞫</span>
            <span class="visionMode"> 🞅 </span>
            <span class="visionType"> ◇ </span>
    </span>
    </div>
    <div class="visionBorder"></div>
    <div class="visionBorder rightResize" draggable="true"></div>
    <div class="visionBorder"></div>
    <div class="visionBorder bottomResize" draggable="true"></div>
    <div class="visionBorder allResize" draggable="true"></div>
    <iframe class="visionContent">
    </iframe>
    <div class="visionContent">
    </div>
</div>`        );
        document.body.appendChild(this.element);
        let drag = false;
        let dragOffsetY = 0;
        let dragOffsetX = 0;
        
        // make frame draggable
        document.addEventListener("pointermove", (event) => {
            if (drag) {
                this.element.style.left = (event.pageX - dragOffsetX) + "px";
                this.element.style.top = (event.pageY - dragOffsetY) + "px";
            }
        });
        this.element.querySelector(".visionHead").addEventListener("dragstart", (event) => {
            event.preventDefault();
            if (document.activeElement.closest(".visionControls") || event.target.classList.contains("visionBorder")) return;
            drag = true;
            let { x, y } = this.element.getBoundingClientRect();
            dragOffsetX = event.pageX - x;
            dragOffsetY = event.pageY - y;
            document.addEventListener("pointerup", () => { drag = false; }, { once: true });
        });

        // add input handlers
        this.element.querySelector("input[type=range]").addEventListener("change", (event) => {
            this.setOpacity(event.target.value / 10);
        });
        this.element.querySelector("input[type=text]").addEventListener("change", (event) => {
            this.setSource(event.target.value);
        });

        // make frame resizable
        let dragRight = false, dragBottom = false;
        let dragRightStart = 0, dragBottomStart = 0;
        let widthStart = 0, heightStart = 0;
        this.element.querySelector(".visionBorder.rightResize").addEventListener("dragstart", (event) => {
            event.preventDefault();
            document.addEventListener("pointerup", () => { dragRight = false; }, { once: true });
            dragRight = true;
            dragRightStart = event.pageX;
            widthStart = this.element.getBoundingClientRect().width;
        });
        this.element.querySelector(".visionBorder.bottomResize").addEventListener("dragstart", (event) => {
            event.preventDefault();
            document.addEventListener("pointerup", () => { dragBottom = false; }, { once: true });
            dragBottom = true;
            dragBottomStart = event.pageY;
            heightStart = this.element.getBoundingClientRect().height;
        });
        this.element.querySelector(".visionBorder.allResize").addEventListener("dragstart", (event) => {
            event.preventDefault();
            document.addEventListener("pointerup", () => { dragBottom = false; dragRight = false;}, { once: true });
            dragBottom = true;
            dragRight = true;
            dragBottomStart = event.pageY;
            dragRightStart = event.pageX;
            heightStart = this.element.getBoundingClientRect().height;
            widthStart = this.element.getBoundingClientRect().width;
        });
        document.addEventListener("pointermove", (event) => {
            if (dragRight) {
                this.element.style.width = (widthStart + (event.pageX - dragRightStart)) + "px";
            }
            if (dragBottom) {
                this.element.style.height = (heightStart + (event.pageY - dragBottomStart)) + "px";
            }
        });

        // close handler
        this.element.querySelector(".visionClose").addEventListener("click", this.destroy);

        // toggle click mode handler
        this.element.querySelector(".visionMode").addEventListener("click", (e) => {
            if (this.element.classList.contains("ghost")) {
                e.target.textContent = " ⯄ ";
                this.element.classList.remove("ghost");
            }
            else {
                e.target.textContent = " 🞅 ";
                this.element.classList.add("ghost");
            }
        });

        // toggle frame mode handler
        this.element.querySelector(".visionType").addEventListener("click", (e) => {
            if (this.element.classList.contains("iframe")) {
                e.target.textContent = " ◇ ";
                this.element.classList.remove("iframe");
            }
            else {
                e.target.textContent = " ◆ ";
                this.element.classList.add("iframe");
            }
        });
    }

    setSource = (source) => {
        this.element.querySelector("div.visionContent").style.backgroundImage = "url(" + source + ")";
        this.element.querySelector("iframe.visionContent").src = source;
    }

    setOpacity = (op) => {
        this.element.querySelector(".visionContent").style.opacity = op;
    }

    destroy = () => {
        this.element.remove();
    }
}