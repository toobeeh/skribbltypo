export class Color {

  public static readonly skribblColors = [
    [255, 255, 255],
    [0, 0, 0],
    [193, 193, 193],
    [80, 80, 80],
    [239, 19, 11],
    [116, 11, 7],
    [255, 113, 0],
    [194, 56, 0],
    [255, 228, 0],
    [232, 162, 0],
    [0, 204, 0],
    [0, 70, 25],
    [0, 255, 145],
    [0, 120, 93],
    [0, 178, 255],
    [0, 86, 158],
    [35, 31, 211],
    [14, 8, 101],
    [163, 0, 186],
    [85, 0, 105],
    [223, 105, 167],
    [135, 53, 84],
    [255, 172, 142],
    [204, 119, 77],
    [160, 82, 45],
    [99, 48, 13]
  ] as const;

  get r() { return this._r; }
  get g() { return this._g; }
  get b() { return this._b; }

  constructor(private _r: number, private _g: number, private _b: number, private _a?: number) {
    this._r = Color.sanitizeRgbComponent(_r);
    this._g = Color.sanitizeRgbComponent(_g);
    this._b = Color.sanitizeRgbComponent(_b);

    if (_a !== (void 0)) {
      this._a = Color.sanitizeRgbComponent(_a);
    }
  }

  // ensure component value is an integer 0-255
  private static sanitizeRgbComponent(value: number) {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.min(255, Math.max(0, Math.round(value)));
  }

  // get the rgb string of the color
  get rgbString() {
    return "rgb(" + [this._r, this._g, this._b, this._a].filter(v => v !== undefined).join(",") + ")";
  }

  get rgbArray() {
    return this._a ? [this._r, this._g, this._b, this._a] : [this._r, this._g, this._b];
  }

  // get the rgb values of the color
  get rgb() {
    return {
      r: this._r,
      g: this._g,
      b: this._b,
      a: this._a
    };
  }

  // get the hex string of the color
  get hex() {
    return "#" +
      this._r.toString(16).padStart(2, "0") +
      this._g.toString(16).padStart(2, "0") +
      this._b.toString(16).padStart(2, "0") +
      (this._a ? Math.floor(255 * this._a).toString(16).padStart(2, "0") : "");
  }

  set hex(hex: string) {
    const color = Color.fromHex(hex);
    this._r = color._r;
    this._g = color._g;
    this._b = color._b;
    this._a = color._a;
  }

  /**
   * The atttempted skribbl color code
   * If not found, return tyopo code instead (hex val + 10000)
   */
  get skribblCode() {

    /* try to convert to original skribbl color */
    const skribblIndex = Color.skribblColors.findIndex(c => c[0] === this._r && c[1] === this._g && c[2] === this._b);
    if(skribblIndex !== -1) return skribblIndex;

    return this.typoCode;
  }

  /**
   * The color code for the typo color (hex val + 10000)
   */
  get typoCode() {

    const hexString = ((this._r << 16) | (this._g << 8) | this._b).toString(16).toUpperCase();
    return parseInt(hexString, 16) + 10000; // 10000 is the offset to identify that color index is a hex code
  }

  //source: https://gist.github.com/mjackson/5311256
  get hsl(): [number, number, number, number] | [number, number, number] {
    const r = this.r / 255, g = this.g / 255, b = this.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return this._a !== undefined ? [h*360, s * 100, l * 100, this._a] : [h*360, s * 100, l * 100];
  }

  // Convert to HSV
  get hsv() {
    const r = this.r / 255, g = this.g / 255, b = this.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0, s = 0;
    const v = max;

    if (max !== 0) {
      s = delta / max;
    } else {
      h = 0;
      s = 0;
    }

    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
        case g: h = (b - r) / delta + 2; break;
        case b: h = (r - g) / delta + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, v * 100, this._a];
  }

  static fromRgb(r: number, g: number, b: number, a?: number) {
    return new Color(Math.round(r), Math.round(g), Math.round(b), a ? Math.round(a*100)/100 : undefined);
  }

  static fromHex(hex: string) {
    if (hex[0] == "#") hex = hex.substring(1);
    const r = Math.round(parseInt("0x" + hex.substring(0, 2)));
    const g = Math.round(parseInt("0x" + hex.substring(2, 4)));
    const b = Math.round(parseInt("0x" + hex.substring(4, 6)));
    const a = hex.length > 6 ? Math.round(parseInt("0x" + hex.substring(6, 8))) : undefined;
    return new Color(r, g, b, a);
  }

  static fromRgbString(rgb: string) {
    const rgbs = rgb.trim().replace(" ", "").split(",");
    const r = parseInt(rgbs[0].replace(/[^\d]/g, ""), 10);
    const g = parseInt(rgbs[1].replace(/[^\d]/g, ""), 10);
    const b = parseInt(rgbs[2].replace(/[^\d]/g, ""), 10);
    const a = rgbs.length > 3 ? parseInt(rgbs[4].replace(/[^\d]/g, ""), 10) : undefined;
    return new Color(r, g, b, a);
  }

  static fromSkribblCode(code: number) {
    if (code < 10000) {
      const rgb = Color.skribblColors[code];
      return Color.fromRgb(rgb[0], rgb[1], rgb[2]);
    }
    const hex = (code - 10000).toString(16).padStart(6, "0");
    return Color.fromHex(hex);
  }

  // source: https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
  static fromHsl(h: number, s: number, l: number, alpha?: number) {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const r = Math.round(f(0) * 255);
    const g = Math.round(f(8) * 255);
    const b = Math.round(f(4) * 255);
    return new Color(r, g, b, alpha);
  }

  // Static factory method for HSV to RGB conversion
  static fromHsv(h: number, s: number, v: number, a?: number) {
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return new Color(r, g, b, a);
  }

  copy() {
    return new Color(this._r, this._g, this._b, this._a);
  }

  withAlpha(a: number) {
    this._a = a;
    return this;
  }
}