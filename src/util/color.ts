export class Color {
  get r() { return this._r; }
  get g() { return this._g; }
  get b() { return this._b; }

  constructor(private _r: number, private _g: number, private _b: number, private _a?: number) { }

  // get the rgb string of the color
  get rgbString() {
    return "rgb(" + [this._r, this._g, this._b, this._a].filter(v => v !== undefined).join(",") + ")";
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

  //source: https://gist.github.com/mjackson/5311256
  get hsl() {
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
    return [h*360, s * 100, l * 100, this._a];
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
    return new Color(r, g, b, a);
  }

  static fromHex(hex: string) {
    if (hex[0] == "#") hex = hex.substring(1);
    const r = parseInt("0x" + hex.substring(0, 2));
    const g = parseInt("0x" + hex.substring(2, 4));
    const b = parseInt("0x" + hex.substring(4, 6));
    const a = hex.length > 6 ? parseInt("0x" + hex.substring(6, 8)) : undefined;
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

  // source: https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
  static fromHsl(h: number, s: number, l: number, alpha: number) {
    console.log(h,s,l);
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