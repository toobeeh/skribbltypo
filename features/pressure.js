// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// enables pressure sensitivity
// dependent on: genericfunctions.js
pressure = {
    kLevel: 1 / 36,
    refreshCycle: 5,
    refresh: true,
    sizeElement: null,
    lastClickedSize: 0,
    relativeSteps: [
        { min: 0, max: 0.1, diff: 0.1 },
        { min: 0.1, max: 0.3, diff: 0.2 },
        { min: 0.3, max: 0.6, diff: 0.3 },
        { min: 0.6, max: 1, diff: 0.4 },
    ],
    pointermove: (event) => {
        // event handler for pressure drawing
        if (!pressure.refresh || localStorage.ink != "true" || event.pointerType != "pen" || event.pressure == 0) return;
        if (localStorage.inkMode && (localStorage.inkMode.includes("thickness") || localStorage.inkMode.includes("relative"))) {
            if (localStorage.inkMode.includes("relative")) pressure.setBrushsizeData(event.pressure, pressure.lastClickedSize);
            else pressure.setBrushsizeData(event.pressure);
        }
        else if (localStorage.inkMode &&
            (localStorage.inkMode.includes("brightness") || localStorage.inkMode.includes("degree")) && localStorage.brushtool == "pen") {
            pressure.refresh = false;
            setTimeout(function () { pressure.refresh = true; }, pressure.refreshCycle);
            localStorage.down = "true";
            let colorhsl = new Color({ rgb: document.querySelector(".colorPreview").style.backgroundColor }).hsl;
            let h = localStorage.inkMode.includes("degree") ? ((event.pressure) * 360) + colorhsl[0] : colorhsl[0];
            let l = localStorage.inkMode.includes("brightness") ? (event.pressure) * 100 : colorhsl[2];
            h = h > 360 ? h -= 360 : h;
            document.body.dispatchEvent(new CustomEvent("setColor", { detail: { hex: (new Color({ h: h, s: colorhsl[1], l: l })).hex } }));
            localStorage.down = "false";
        }
    },
    pointerup: (event) => {
        // event handler if pen was released - reset thickness or color
        if (localStorage.ink == "true" && event.pointerType == "pen" && localStorage.inkMode == "thickness") {
            sessionStorage.pressureDown = false;
            pressure.setBrushsize(1);
        }
        else if (localStorage.ink == "true" && event.pointerType == "pen" && (localStorage.inkMode.includes("brightness") || localStorage.inkMode.includes("degree")) && localStorage.brushtool == "pen") {
            let color = new Color({ rgb: document.querySelector(".colorPreview").style.backgroundColor });
            document.body.dispatchEvent(new CustomEvent("setColor", { detail: { reset: true, hex: color.hex } }));
        }
    },
    pointerdown: (event) => {
        // event handler if pen was pressed - start thickness at 1
        if (localStorage.ink == "true" && event.pointerType == "pen" && localStorage.inkMode == "thickness") {
            pressure.setBrushsize(1);
            sessionStorage.pressureDown = true;
        }
    },
    setBrushsize: (newsize) => {
         /*func to set the brushsize (event to game.js) OLD WAY*/
        let event = new CustomEvent("setBrushSize", {
            detail: newsize
        });
        document.body.dispatchEvent(event);
    },
    setBrushsizeData: (pressureval, relativeTo = -1) => {
        // NEW WAY
        // val: 0-1 sens: 0-100 
        const oldVal = Number(pressure.sizeElement.getAttribute("data-size"));
        const calcLevelledSize = (val, level) => Math.pow(Number(val), Math.pow(1.5, (Number(level) - 50) / 10))
            * (relativeTo == -1 ? 1 : pressure.relativeSteps.find(step => step.min <= relativeTo && step.max >= relativeTo).diff)
            + (relativeTo == -1 ? 0 : pressure.relativeSteps.find(step => step.min <= relativeTo && step.max >= relativeTo).min);
        const calcSkribblSize = (val) => Number(val) * 36 + 4;
        const sensitivity = 100 - localStorage.sens;

        if (Math.round(calcSkribblSize(oldVal)) != Math.round(calcSkribblSize(calcLevelledSize(pressureval, sensitivity)))) {
            pressure.sizeElement.setAttribute("data-size", calcLevelledSize(pressureval, sensitivity));
            pressure.sizeElement.dispatchEvent(newCustomEvent("click", { pressureSet: true }));
            pressure.sizeElement.setAttribute("data-size", oldVal);
        }
    },
    initEvents: () => {
        pressure.sizeElement = QS(".brushSize");
        QS("#canvasGame").addEventListener("pointermove", pressure.pointermove);
        QS("#canvasGame").addEventListener("pointerup", pressure.pointerup);
        QS("#canvasGame").addEventListener("pointerdown", pressure.pointerdown);
        [...QSA(".brushSize")].forEach(sizeelem => {
            sizeelem.addEventListener("click", (e) => {
                if (e.detail?.pressureSet) return;
                pressure.lastClickedSize = Number(sizeelem.getAttribute("data-size"));
            });
        });
    }
}