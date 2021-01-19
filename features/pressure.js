// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// enables pressure sensitivity
// dependent on: genericfunctions.js
pressure = {
    kLevel: 1 / 36,
    refreshCycle: 5,
    refresh: true,
    pointermove: (event) => {
        // event handler for pressure drawing
        if (!pressure.refresh || localStorage.ink != "true" || event.pointerType != "pen" || event.pressure == 0) return;
        pressure.refresh = false;
        setTimeout(function () { pressure.refresh = true; }, pressure.refreshCycle);
        if (localStorage.inkMode && localStorage.inkMode.includes("thickness")) {
            let size = 4;
            while (size * pressure.kLevel * (100 / (101 - localStorage.sens)) < event.pressure) size += 0.2;
            pressure.setBrushsize(size);
        }
        if (localStorage.inkMode && (localStorage.inkMode.includes("brightness") || localStorage.inkMode.includes("degree")) && localStorage.brushtool == "pen") {
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
        if (localStorage.ink == "true" && event.pointerType == "pen" && localStorage.inkMode == "thickness") pressure.setBrushsize(1);
        else if (localStorage.ink == "true" && event.pointerType == "pen" && (localStorage.inkMode.includes("brightness") || localStorage.inkMode.includes("degree")) && localStorage.brushtool == "pen") {
            let color = new Color({ rgb: document.querySelector(".colorPreview").style.backgroundColor });
            document.body.dispatchEvent(new CustomEvent("setColor", { detail: { reset: true, hex: color.hex } }));
        }
    },
    pointerdown: (event) => {
        // event handler if pen was pressed - start thickness at 1
        if (localStorage.ink == "true" && event.pointerType == "pen" && localStorage.inkMode == "thickness") pressure.setBrushsize(1);
    },
    setBrushsize: (newsize) => {
        // func to set the brushsize (event to game.js)
        let event = new CustomEvent("setBrushSize", {
            detail: newsize
        });
        document.body.dispatchEvent(event);
    },
    initEvents: () => {
        QS("#canvasGame").addEventListener("pointermove", pressure.pointermove);
        QS("#canvasGame").addEventListener("pointerup", pressure.pointerup);
        QS("#canvasGame").addEventListener("pointerdown", pressure.pointerdown);
    }
}