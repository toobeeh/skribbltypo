// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// class to simplify color conversions
class Color {
    //_r;
    //_g;
    //_b;
    get r() { return this._r; }
    get g() { return this._g; }
    get b() { return this._b; }
    // get the rgb string of the color
    get rgb() { return "rgb(" + [this._r, this._g, this._b].join(",") + ")"; }
    // get the rgb values of the color
    get rgbValues() { return { r: this._r, g: this._g, b: this._b }; }
    // get the hex string of the color
    get hex() { return "#" + this._r.toString(16).padStart(2, "0") + this._g.toString(16).padStart(2, "0") + this._b.toString(16).padStart(2, "0"); }
    get hsl() {
        //source: https://gist.github.com/mjackson/5311256
        let r = this.r / 255, g = this.g / 255, b = this.b / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h*360, s * 100, l * 100];
    }
    constructor(color) {
        if (color.h != null && color.s != null && color.l != null) {
            // source: https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
            color.l /= 100;
            const a = color.s * Math.min(color.l, 1 - color.l) / 100;
            const f = n => {
                const k = (n + color.h / 30) % 12;
                const col = color.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * col).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
            };
            color.hex = `${f(0)}${f(8)}${f(4)}`;
        }
        // create a color by hex val
        if (color.hex) {
            let hex = color.hex;
            if (hex[0] == '#') hex = hex.substring(1);
            this._r = parseInt("0x" + hex.substring(0, 2));
            this._g = parseInt("0x" + hex.substring(2, 4));
            this._b = parseInt("0x" + hex.substring(4, 6));
        }
        // create a color by single r, g and b values
        else if (color.r != null && color.g != null && color.b != null) {
            this._r = color.r;
            this._g = color.g;
            this._b = color.b;
        }
        else if (color.rgb) {
            // create a color by rgb string
            let rgb = color.rgb.trim().replace(" ", "").split(",");
            this._r = parseInt(rgb[0].replace(/[^\d]/g, ''), 10);
            this._g = parseInt(rgb[1].replace(/[^\d]/g, ''), 10);
            this._b = parseInt(rgb[2].replace(/[^\d]/g, ''), 10);
        }
    };
}