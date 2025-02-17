
// ==UserScript==
// @name skribbltypo 
// @website https://www.typo.rip
// @author tobeh#7437
// @description Userscript version of skribbltypo - the most advanced toolbox for skribbl.io
// @icon64 https://rawcdn.githack.com/toobeeh/skribbltypo/master/res/icon/128MaxFit.png
// @version 26.3.13.173978611
// @updateURL https://raw.githubusercontent.com/toobeeh/skribbltypo/master/skribbltypo.user.js
// @grant none
// @match https://skribbl.io/*
// @run-at document-start
// ==/UserScript==

/* polyfill */
const chrome = {
    extension: {
        getURL: (url) => {
            return "https://rawcdn.githack.com/toobeeh/skribbltypo/master/" + url;
        }
    },
    runtime: {
        getURL: (url) => {
            return "https://rawcdn.githack.com/toobeeh/skribbltypo/master/" + url;
        },
        getManifest: () => {
            return {version: "26.3.13 usrsc"};
        },
        onMessage: {
            addListener: (callback) => {
                window.addEventListener("message",msg => { 
                    if(msg.origin.includes("//skribbl.io")) callback(msg.data, {tab:{id:0}}); 
                });
            }
        },
        sendMessage: undefined
    }
}



/* async typo setup for same-context of differently timed executions */
const execTypo = async () => {

    /* dom content load promise */
    const loaded = new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() =>resolve(), 2000);
        });
        setTimeout(() =>resolve(), 2000);
    });

    /* wait until dom loaded */
    /* await loaded; */
    console.clear();
    
    /* bundle pre dom exec */
    // #content picker/colr_pickr.min.js
﻿/*! Pickr 1.8.1 MIT | https://github.com/Simonwep/pickr */
!function (t, e) { "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.Pickr = e() : t.Pickr = e() }(window, (function () {
    return function (t) { var e = {}; function o(n) { if (e[n]) return e[n].exports; var i = e[n] = { i: n, l: !1, exports: {} }; return t[n].call(i.exports, i, i.exports, o), i.l = !0, i.exports } return o.m = t, o.c = e, o.d = function (t, e, n) { o.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n }) }, o.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, o.t = function (t, e) { if (1 & e && (t = o(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var n = Object.create(null); if (o.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var i in t) o.d(n, i, function (e) { return t[e] }.bind(null, i)); return n }, o.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return o.d(e, "a", e), e }, o.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, o.p = "", o(o.s = 0) }([function (t, e, o) {
        "use strict"; o.r(e); var n = {}; function i(t, e, o, n, i = {}) { e instanceof HTMLCollection || e instanceof NodeList ? e = Array.from(e) : Array.isArray(e) || (e = [e]), Array.isArray(o) || (o = [o]); for (const r of e) for (const e of o) r[t](e, n, { capture: !1, ...i }); return Array.prototype.slice.call(arguments, 1) } o.r(n), o.d(n, "on", (function () { return r })), o.d(n, "off", (function () { return s })), o.d(n, "createElementFromString", (function () { return a })), o.d(n, "createFromTemplate", (function () { return l })), o.d(n, "eventPath", (function () { return c })), o.d(n, "resolveElement", (function () { return p })), o.d(n, "adjustableInputNumbers", (function () { return u })); const r = i.bind(null, "addEventListener"), s = i.bind(null, "removeEventListener"); function a(t) { const e = document.createElement("div"); return e.innerHTML = t.trim(), e.firstElementChild } function l(t) { const e = (t, e) => { const o = t.getAttribute(e); return t.removeAttribute(e), o }, o = (t, n = {}) => { const i = e(t, ":obj"), r = e(t, ":ref"), s = i ? n[i] = {} : n; r && (n[r] = t); for (const n of Array.from(t.children)) { const t = e(n, ":arr"), i = o(n, t ? {} : s); t && (s[t] || (s[t] = [])).push(Object.keys(i).length ? i : n) } return n }; return o(a(t)) } function c(t) { let e = t.path || t.composedPath && t.composedPath(); if (e) return e; let o = t.target.parentElement; for (e = [t.target, o]; o = o.parentElement;)e.push(o); return e.push(document, window), e } function p(t) { return t instanceof Element ? t : "string" == typeof t ? t.split(/>>/g).reduce((t, e, o, n) => (t = t.querySelector(e), o < n.length - 1 ? t.shadowRoot : t), document) : null } function u(t, e = (t => t)) { function o(o) { const n = [.001, .01, .1][Number(o.shiftKey || 2 * o.ctrlKey)] * (o.deltaY < 0 ? 1 : -1); let i = 0, r = t.selectionStart; t.value = t.value.replace(/[\d.]+/g, (t, o) => o <= r && o + t.length >= r ? (r = o, e(Number(t), n, i)) : (i++, t)), t.focus(), t.setSelectionRange(r, r), o.preventDefault(), t.dispatchEvent(new Event("input")) } r(t, "focus", () => r(window, "wheel", o, { passive: !1 })), r(t, "blur", () => s(window, "wheel", o)) } const { min: h, max: d, floor: f, round: m } = Math; function v(t, e, o) { e /= 100, o /= 100; const n = f(t = t / 360 * 6), i = t - n, r = o * (1 - e), s = o * (1 - i * e), a = o * (1 - (1 - i) * e), l = n % 6; return [255 * [o, s, r, r, a, o][l], 255 * [a, o, o, s, r, r][l], 255 * [r, r, a, o, o, s][l]] } function b(t, e, o) { const n = (2 - (e /= 100)) * (o /= 100) / 2; return 0 !== n && (e = 1 === n ? 0 : n < .5 ? e * o / (2 * n) : e * o / (2 - 2 * n)), [t, 100 * e, 100 * n] } function y(t, e, o) { const n = h(t /= 255, e /= 255, o /= 255), i = d(t, e, o), r = i - n; let s, a; if (0 === r) s = a = 0; else { a = r / i; const n = ((i - t) / 6 + r / 2) / r, l = ((i - e) / 6 + r / 2) / r, c = ((i - o) / 6 + r / 2) / r; t === i ? s = c - l : e === i ? s = 1 / 3 + n - c : o === i && (s = 2 / 3 + l - n), s < 0 ? s += 1 : s > 1 && (s -= 1) } return [360 * s, 100 * a, 100 * i] } function g(t, e, o, n) { e /= 100, o /= 100; return [...y(255 * (1 - h(1, (t /= 100) * (1 - (n /= 100)) + n)), 255 * (1 - h(1, e * (1 - n) + n)), 255 * (1 - h(1, o * (1 - n) + n)))] } function _(t, e, o) { e /= 100; const n = 2 * (e *= (o /= 100) < .5 ? o : 1 - o) / (o + e) * 100, i = 100 * (o + e); return [t, isNaN(n) ? 0 : n, i] } function w(t) { return y(...t.match(/.{2}/g).map(t => parseInt(t, 16))) } function A(t) { t = t.match(/^[a-zA-Z]+$/) ? function (t) { if ("black" === t.toLowerCase()) return "#000"; const e = document.createElement("canvas").getContext("2d"); return e.fillStyle = t, "#000" === e.fillStyle ? null : e.fillStyle }(t) : t; const e = { cmyk: /^cmyk[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)/i, rgba: /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i, hsla: /^((hsla)|hsl)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i, hsva: /^((hsva)|hsv)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i, hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i }, o = t => t.map(t => /^(|\d+)\.\d+|\d+$/.test(t) ? Number(t) : void 0); let n; t: for (const i in e) { if (!(n = e[i].exec(t))) continue; const r = t => !!n[2] == ("number" == typeof t); switch (i) { case "cmyk": { const [, t, e, r, s] = o(n); if (t > 100 || e > 100 || r > 100 || s > 100) break t; return { values: g(t, e, r, s), type: i } } case "rgba": { const [, , , t, e, s, a] = o(n); if (t > 255 || e > 255 || s > 255 || a < 0 || a > 1 || !r(a)) break t; return { values: [...y(t, e, s), a], a: a, type: i } } case "hexa": { let [, t] = n; 4 !== t.length && 3 !== t.length || (t = t.split("").map(t => t + t).join("")); const e = t.substring(0, 6); let o = t.substring(6); return o = o ? parseInt(o, 16) / 255 : void 0, { values: [...w(e), o], a: o, type: i } } case "hsla": { const [, , , t, e, s, a] = o(n); if (t > 360 || e > 100 || s > 100 || a < 0 || a > 1 || !r(a)) break t; return { values: [..._(t, e, s), a], a: a, type: i } } case "hsva": { const [, , , t, e, s, a] = o(n); if (t > 360 || e > 100 || s > 100 || a < 0 || a > 1 || !r(a)) break t; return { values: [t, e, s, a], a: a, type: i } } } } return { values: null, type: null } } function C(t = 0, e = 0, o = 0, n = 1) { const i = (t, e) => (o = -1) => e(~o ? t.map(t => Number(t.toFixed(o))) : t), r = { h: t, s: e, v: o, a: n, toHSVA() { const t = [r.h, r.s, r.v, r.a]; return t.toString = i(t, t => `hsva(${t[0]}, ${t[1]}%, ${t[2]}%, ${r.a})`), t }, toHSLA() { const t = [...b(r.h, r.s, r.v), r.a]; return t.toString = i(t, t => `hsla(${t[0]}, ${t[1]}%, ${t[2]}%, ${r.a})`), t }, toRGBA() { const t = [...v(r.h, r.s, r.v), r.a]; return t.toString = i(t, t => `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${r.a})`), t }, toCMYK() { const t = function (t, e, o) { const n = v(t, e, o), i = n[0] / 255, r = n[1] / 255, s = n[2] / 255, a = h(1 - i, 1 - r, 1 - s); return [100 * (1 === a ? 0 : (1 - i - a) / (1 - a)), 100 * (1 === a ? 0 : (1 - r - a) / (1 - a)), 100 * (1 === a ? 0 : (1 - s - a) / (1 - a)), 100 * a] }(r.h, r.s, r.v); return t.toString = i(t, t => `cmyk(${t[0]}%, ${t[1]}%, ${t[2]}%, ${t[3]}%)`), t }, toHEXA() { const t = function (t, e, o) { return v(t, e, o).map(t => m(t).toString(16).padStart(2, "0")) }(r.h, r.s, r.v), e = r.a >= 1 ? "" : Number((255 * r.a).toFixed(0)).toString(16).toUpperCase().padStart(2, "0"); return e && t.push(e), t.toString = () => "#" + t.join("").toUpperCase(), t }, clone: () => C(r.h, r.s, r.v, r.a) }; return r } const k = t => Math.max(Math.min(t, 1), 0); function $(t) { const e = { options: Object.assign({ lock: null, onchange: () => 0, onstop: () => 0 }, t), _keyboard(t) { const { options: o } = e, { type: n, key: i } = t; if (document.activeElement === o.wrapper) { const { lock: o } = e.options, r = "ArrowUp" === i, s = "ArrowRight" === i, a = "ArrowDown" === i, l = "ArrowLeft" === i; if ("keydown" === n && (r || s || a || l)) { let n = 0, i = 0; "v" === o ? n = r || s ? 1 : -1 : "h" === o ? n = r || s ? -1 : 1 : (i = r ? -1 : a ? 1 : 0, n = l ? -1 : s ? 1 : 0), e.update(k(e.cache.x + .01 * n), k(e.cache.y + .01 * i)), t.preventDefault() } else i.startsWith("Arrow") && (e.options.onstop(), t.preventDefault()) } }, _tapstart(t) { r(document, ["mouseup", "touchend", "touchcancel"], e._tapstop), r(document, ["mousemove", "touchmove"], e._tapmove), t.cancelable && t.preventDefault(), e._tapmove(t) }, _tapmove(t) { const { options: o, cache: n } = e, { lock: i, element: r, wrapper: s } = o, a = s.getBoundingClientRect(); let l = 0, c = 0; if (t) { const e = t && t.touches && t.touches[0]; l = t ? (e || t).clientX : 0, c = t ? (e || t).clientY : 0, l < a.left ? l = a.left : l > a.left + a.width && (l = a.left + a.width), c < a.top ? c = a.top : c > a.top + a.height && (c = a.top + a.height), l -= a.left, c -= a.top } else n && (l = n.x * a.width, c = n.y * a.height); "h" !== i && (r.style.left = `calc(${l / a.width * 100}% - ${r.offsetWidth / 2}px)`), "v" !== i && (r.style.top = `calc(${c / a.height * 100}% - ${r.offsetHeight / 2}px)`), e.cache = { x: l / a.width, y: c / a.height }; const p = k(l / a.width), u = k(c / a.height); switch (i) { case "v": return o.onchange(p); case "h": return o.onchange(u); default: return o.onchange(p, u) } }, _tapstop() { e.options.onstop(), s(document, ["mouseup", "touchend", "touchcancel"], e._tapstop), s(document, ["mousemove", "touchmove"], e._tapmove) }, trigger() { e._tapmove() }, update(t = 0, o = 0) { const { left: n, top: i, width: r, height: s } = e.options.wrapper.getBoundingClientRect(); "h" === e.options.lock && (o = t), e._tapmove({ clientX: n + r * t, clientY: i + s * o }) }, destroy() { const { options: t, _tapstart: o, _keyboard: n } = e; s(document, ["keydown", "keyup"], n), s([t.wrapper, t.element], "mousedown", o), s([t.wrapper, t.element], "touchstart", o, { passive: !1 }) } }, { options: o, _tapstart: n, _keyboard: i } = e; return r([o.wrapper, o.element], "mousedown", n), r([o.wrapper, o.element], "touchstart", n, { passive: !1 }), r(document, ["keydown", "keyup"], i), e } function S(t = {}) { t = Object.assign({ onchange: () => 0, className: "", elements: [] }, t); const e = r(t.elements, "click", e => { t.elements.forEach(o => o.classList[e.target === o ? "add" : "remove"](t.className)), t.onchange(e), e.stopPropagation() }); return { destroy: () => s(...e) } }
        /*! NanoPop 2.1.0 MIT | https://github.com/Simonwep/nanopop */
        const O = { variantFlipOrder: { start: "sme", middle: "mse", end: "ems" }, positionFlipOrder: { top: "tbrl", right: "rltb", bottom: "btrl", left: "lrbt" }, position: "bottom", margin: 8 }, E = (t, e, o) => { const n = "object" != typeof t || t instanceof HTMLElement ? { reference: t, popper: e, ...o } : t; return { update(t = n) { const { reference: e, popper: o } = Object.assign(n, t); if (!o || !e) throw new Error("Popper- or reference-element missing."); return ((t, e, o) => { const { container: n, margin: i, position: r, variantFlipOrder: s, positionFlipOrder: a } = { container: document.documentElement.getBoundingClientRect(), ...O, ...o }, { left: l, top: c } = e.style; e.style.left = "0", e.style.top = "0"; const p = t.getBoundingClientRect(), u = e.getBoundingClientRect(), h = { t: p.top - u.height - i, b: p.bottom + i, r: p.right + i, l: p.left - u.width - i }, d = { vs: p.left, vm: p.left + p.width / 2 + -u.width / 2, ve: p.left + p.width - u.width, hs: p.top, hm: p.bottom - p.height / 2 - u.height / 2, he: p.bottom - u.height }, [f, m = "middle"] = r.split("-"), v = a[f], b = s[m], { top: y, left: g, bottom: _, right: w } = n; for (const t of v) { const o = "t" === t || "b" === t, n = h[t], [i, r] = o ? ["top", "left"] : ["left", "top"], [s, a] = o ? [u.height, u.width] : [u.width, u.height], [l, c] = o ? [_, w] : [w, _], [p, f] = o ? [y, g] : [g, y]; if (!(n < p || n + s > l)) for (const s of b) { const l = d[(o ? "v" : "h") + s]; if (!(l < f || l + a > c)) return e.style[r] = l - u[r] + "px", e.style[i] = n - u[i] + "px", t + s } } return e.style.left = l, e.style.top = c, null })(e, o, n) } } }; function L(t, e, o) { return e in t ? Object.defineProperty(t, e, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = o, t } class x { constructor(t) { L(this, "_initializingActive", !0), L(this, "_recalc", !0), L(this, "_nanopop", null), L(this, "_root", null), L(this, "_color", C()), L(this, "_lastColor", C()), L(this, "_swatchColors", []), L(this, "_setupAnimationFrame", null), L(this, "_eventListener", { init: [], save: [], hide: [], show: [], clear: [], change: [], changestop: [], cancel: [], swatchselect: [] }), this.options = t = Object.assign({ ...x.DEFAULT_OPTIONS }, t); const { swatches: e, components: o, theme: n, sliders: i, lockOpacity: r, padding: s } = t;["nano", "monolith"].includes(n) && !i && (t.sliders = "h"), o.interaction || (o.interaction = {}); const { preview: a, opacity: l, hue: c, palette: p } = o; o.opacity = !r && l, o.palette = p || a || l || c, this._preBuild(), this._buildComponents(), this._bindEvents(), this._finalBuild(), e && e.length && e.forEach(t => this.addSwatch(t)); const { button: u, app: h } = this._root; this._nanopop = E(u, h, { margin: s }), u.setAttribute("role", "button"), u.setAttribute("aria-label", this._t("btn:toggle")); const d = this; this._setupAnimationFrame = requestAnimationFrame((function e() { if (!h.offsetWidth) return requestAnimationFrame(e); d.setColor(t.default), d._rePositioningPicker(), t.defaultRepresentation && (d._representation = t.defaultRepresentation, d.setColorRepresentation(d._representation)), t.showAlways && d.show(), d._initializingActive = !1, d._emit("init") })) } _preBuild() { const { options: t } = this; for (const e of ["el", "container"]) t[e] = p(t[e]); this._root = (t => { const { components: e, useAsButton: o, inline: n, appClass: i, theme: r, lockOpacity: s } = t.options, a = t => t ? "" : 'style="display:none" hidden', c = e => t._t(e), p = l(`\n      <div :ref="root" class="pickr">\n\n        ${o ? "" : '<button type="button" :ref="button" class="pcr-button"></button>'}\n\n        <div :ref="app" class="pcr-app ${i || ""}" data-theme="${r}" ${n ? 'style="position: unset"' : ""} aria-label="${c("ui:dialog")}" role="window">\n          <div class="pcr-selection" ${a(e.palette)}>\n            <div :obj="preview" class="pcr-color-preview" ${a(e.preview)}>\n              <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="${c("btn:last-color")}"></button>\n              <div :ref="currentColor" class="pcr-current-color"></div>\n            </div>\n\n            <div :obj="palette" class="pcr-color-palette">\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="${c("aria:palette")}" role="listbox"></div>\n            </div>\n\n            <div :obj="hue" class="pcr-color-chooser" ${a(e.hue)}>\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="${c("aria:hue")}" role="slider"></div>\n            </div>\n\n            <div :obj="opacity" class="pcr-color-opacity" ${a(e.opacity)}>\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="${c("aria:opacity")}" role="slider"></div>\n            </div>\n          </div>\n\n          <div class="pcr-swatches ${e.palette ? "" : "pcr-last"}" :ref="swatches"></div>\n\n          <div :obj="interaction" class="pcr-interaction" ${a(Object.keys(e.interaction).length)}>\n            <input :ref="result" class="pcr-result" type="text" spellcheck="false" ${a(e.interaction.input)} aria-label="${c("aria:input")}">\n\n            <input :arr="options" class="pcr-type" data-type="HEXA" value="${s ? "HEX" : "HEXA"}" type="button" ${a(e.interaction.hex)}>\n            <input :arr="options" class="pcr-type" data-type="RGBA" value="${s ? "RGB" : "RGBA"}" type="button" ${a(e.interaction.rgba)}>\n            <input :arr="options" class="pcr-type" data-type="HSLA" value="${s ? "HSL" : "HSLA"}" type="button" ${a(e.interaction.hsla)}>\n            <input :arr="options" class="pcr-type" data-type="HSVA" value="${s ? "HSV" : "HSVA"}" type="button" ${a(e.interaction.hsva)}>\n            <input :arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${a(e.interaction.cmyk)}>\n\n            <input :ref="save" class="pcr-save" value="${c("btn:save")}" type="button" ${a(e.interaction.save)} aria-label="${c("aria:btn:save")}">\n            <input :ref="cancel" class="pcr-cancel" value="${c("btn:cancel")}" type="button" ${a(e.interaction.cancel)} aria-label="${c("aria:btn:cancel")}">\n            <input :ref="clear" class="pcr-clear" value="${c("btn:clear")}" type="button" ${a(e.interaction.clear)} aria-label="${c("aria:btn:clear")}">\n          </div>\n        </div>\n      </div>\n    `), u = p.interaction; return u.options.find(t => !t.hidden && !t.classList.add("active")), u.type = () => u.options.find(t => t.classList.contains("active")), p })(this), t.useAsButton && (this._root.button = t.el), t.container.appendChild(this._root.root) } _finalBuild() { const t = this.options, e = this._root; if (t.container.removeChild(e.root), t.inline) { const o = t.el.parentElement; t.el.nextSibling ? o.insertBefore(e.app, t.el.nextSibling) : o.appendChild(e.app) } else t.container.appendChild(e.app); t.useAsButton ? t.inline && t.el.remove() : t.el.parentNode.replaceChild(e.root, t.el), t.disabled && this.disable(), t.comparison || (e.button.style.transition = "none", t.useAsButton || (e.preview.lastColor.style.transition = "none")), this.hide() } _buildComponents() { const t = this, e = this.options.components, o = (t.options.sliders || "v").repeat(2), [n, i] = o.match(/^[vh]+$/g) ? o : [], r = () => this._color || (this._color = this._lastColor.clone()), s = { palette: $({ element: t._root.palette.picker, wrapper: t._root.palette.palette, onstop: () => t._emit("changestop", "slider", t), onchange(o, n) { if (!e.palette) return; const i = r(), { _root: s, options: a } = t, { lastColor: l, currentColor: c } = s.preview; t._recalc && (i.s = 100 * o, i.v = 100 - 100 * n, i.v < 0 && (i.v = 0), t._updateOutput("slider")); const p = i.toRGBA().toString(0); this.element.style.background = p, this.wrapper.style.background = `\n                        linear-gradient(to top, rgba(0, 0, 0, ${i.a}), transparent),\n                        linear-gradient(to left, hsla(${i.h}, 100%, 50%, ${i.a}), rgba(255, 255, 255, ${i.a}))\n                    `, a.comparison ? a.useAsButton || t._lastColor || l.style.setProperty("--pcr-color", p) : (s.button.style.color = p, s.button.classList.remove("clear")); const u = i.toHEXA().toString(); for (const { el: e, color: o } of t._swatchColors) e.classList[u === o.toHEXA().toString() ? "add" : "remove"]("pcr-active"); c.style.setProperty("--pcr-color", p) } }), hue: $({ lock: "v" === i ? "h" : "v", element: t._root.hue.picker, wrapper: t._root.hue.slider, onstop: () => t._emit("changestop", "slider", t), onchange(o) { if (!e.hue || !e.palette) return; const n = r(); t._recalc && (n.h = 360 * o), this.element.style.backgroundColor = `hsl(${n.h}, 100%, 50%)`, s.palette.trigger() } }), opacity: $({ lock: "v" === n ? "h" : "v", element: t._root.opacity.picker, wrapper: t._root.opacity.slider, onstop: () => t._emit("changestop", "slider", t), onchange(o) { if (!e.opacity || !e.palette) return; const n = r(); t._recalc && (n.a = Math.round(100 * o) / 100), this.element.style.background = `rgba(0, 0, 0, ${n.a})`, s.palette.trigger() } }), selectable: S({ elements: t._root.interaction.options, className: "active", onchange(e) { t._representation = e.target.getAttribute("data-type").toUpperCase(), t._recalc && t._updateOutput("swatch") } }) }; this._components = s } _bindEvents() { const { _root: t, options: e } = this, o = [r(t.interaction.clear, "click", () => this._clearColor()), r([t.interaction.cancel, t.preview.lastColor], "click", () => { this.setHSVA(...(this._lastColor || this._color).toHSVA(), !0), this._emit("cancel") }), r(t.interaction.save, "click", () => { !this.applyColor() && !e.showAlways && this.hide() }), r(t.interaction.result, ["keyup", "input"], t => { this.setColor(t.target.value, !0) && !this._initializingActive && (this._emit("change", this._color, "input", this), this._emit("changestop", "input", this)), t.stopImmediatePropagation() }), r(t.interaction.result, ["focus", "blur"], t => { this._recalc = "blur" === t.type, this._recalc && this._updateOutput(null) }), r([t.palette.palette, t.palette.picker, t.hue.slider, t.hue.picker, t.opacity.slider, t.opacity.picker], ["mousedown", "touchstart"], () => this._recalc = !0, { passive: !0 })]; if (!e.showAlways) { const n = e.closeWithKey; o.push(r(t.button, "click", () => this.isOpen() ? this.hide() : this.show()), r(document, "keyup", t => this.isOpen() && (t.key === n || t.code === n) && this.hide()), r(document, ["touchstart", "mousedown"], e => { this.isOpen() && !c(e).some(e => e === t.app || e === t.button) && this.hide() }, { capture: !0 })) } if (e.adjustableNumbers) { const e = { rgba: [255, 255, 255, 1], hsva: [360, 100, 100, 1], hsla: [360, 100, 100, 1], cmyk: [100, 100, 100, 100] }; u(t.interaction.result, (t, o, n) => { const i = e[this.getColorRepresentation().toLowerCase()]; if (i) { const e = i[n], r = t + (e >= 100 ? 1e3 * o : o); return r <= 0 ? 0 : Number((r < e ? r : e).toPrecision(3)) } return t }) } if (e.autoReposition && !e.inline) { let t = null; const n = this; o.push(r(window, ["scroll", "resize"], () => { n.isOpen() && (e.closeOnScroll && n.hide(), null === t ? (t = setTimeout(() => t = null, 100), requestAnimationFrame((function e() { n._rePositioningPicker(), null !== t && requestAnimationFrame(e) }))) : (clearTimeout(t), t = setTimeout(() => t = null, 100))) }, { capture: !0 })) } this._eventBindings = o } _rePositioningPicker() { const { options: t } = this; if (!t.inline) { if (!this._nanopop.update({ container: document.body.getBoundingClientRect(), position: t.position })) { const t = this._root.app, e = t.getBoundingClientRect(); t.style.top = (window.innerHeight - e.height) / 2 + "px", t.style.left = (window.innerWidth - e.width) / 2 + "px" } } } _updateOutput(t) { const { _root: e, _color: o, options: n } = this; if (e.interaction.type()) { const t = "to" + e.interaction.type().getAttribute("data-type"); e.interaction.result.value = "function" == typeof o[t] ? o[t]().toString(n.outputPrecision) : "" } !this._initializingActive && this._recalc && this._emit("change", o, t, this) } _clearColor(t = !1) { const { _root: e, options: o } = this; o.useAsButton || (e.button.style.color = "rgba(0, 0, 0, 0.15)"), e.button.classList.add("clear"), o.showAlways || this.hide(), this._lastColor = null, this._initializingActive || t || (this._emit("save", null), this._emit("clear")) } _parseLocalColor(t) { const { values: e, type: o, a: n } = A(t), { lockOpacity: i } = this.options, r = void 0 !== n && 1 !== n; return e && 3 === e.length && (e[3] = void 0), { values: !e || i && r ? null : e, type: o } } _t(t) { return this.options.i18n[t] || x.I18N_DEFAULTS[t] } _emit(t, ...e) { this._eventListener[t].forEach(t => t(...e, this)) } on(t, e) { return this._eventListener[t].push(e), this } off(t, e) { const o = this._eventListener[t] || [], n = o.indexOf(e); return ~n && o.splice(n, 1), this } addSwatch(t) { const { values: e } = this._parseLocalColor(t); if (e) { const { _swatchColors: t, _root: o } = this, n = C(...e), i = a(`<button type="button" style="--pcr-color: ${n.toRGBA().toString(0)}" aria-label="${this._t("btn:swatch")}"/>`); return o.swatches.appendChild(i), t.push({ el: i, color: n }), this._eventBindings.push(r(i, "click", () => { this.setHSVA(...n.toHSVA(), !0), this._emit("swatchselect", n), this._emit("change", n, "swatch", this) })), !0 } return !1 } removeSwatch(t) { const e = this._swatchColors[t]; if (e) { const { el: o } = e; return this._root.swatches.removeChild(o), this._swatchColors.splice(t, 1), !0 } return !1 } applyColor(t = !1) { const { preview: e, button: o } = this._root, n = this._color.toRGBA().toString(0); return e.lastColor.style.setProperty("--pcr-color", n), this.options.useAsButton || o.style.setProperty("--pcr-color", n), o.classList.remove("clear"), this._lastColor = this._color.clone(), this._initializingActive || t || this._emit("save", this._color), this } destroy() { cancelAnimationFrame(this._setupAnimationFrame), this._eventBindings.forEach(t => s(...t)), Object.keys(this._components).forEach(t => this._components[t].destroy()) } destroyAndRemove() { this.destroy(); const { root: t, app: e } = this._root; t.parentElement && t.parentElement.removeChild(t), e.parentElement.removeChild(e), Object.keys(this).forEach(t => this[t] = null) } hide() { return !!this.isOpen() && (this._root.app.classList.remove("visible"), this._emit("hide"), !0) } show() { return !this.options.disabled && !this.isOpen() && (this._root.app.classList.add("visible"), this._rePositioningPicker(), this._emit("show", this._color), this) } isOpen() { return this._root.app.classList.contains("visible") } setHSVA(t = 360, e = 0, o = 0, n = 1, i = !1) { const r = this._recalc; if (this._recalc = !1, t < 0 || t > 360 || e < 0 || e > 100 || o < 0 || o > 100 || n < 0 || n > 1) return !1; this._color = C(t, e, o, n); const { hue: s, opacity: a, palette: l } = this._components; return s.update(t / 360), a.update(n), l.update(e / 100, 1 - o / 100), i || this.applyColor(), r && this._updateOutput(), this._recalc = r, !0 } setColor(t, e = !1) { if (null === t) return this._clearColor(e), !0; const { values: o, type: n } = this._parseLocalColor(t); if (o) { const t = n.toUpperCase(), { options: i } = this._root.interaction, r = i.find(e => e.getAttribute("data-type") === t); if (r && !r.hidden) for (const t of i) t.classList[t === r ? "add" : "remove"]("active"); return !!this.setHSVA(...o, e) && this.setColorRepresentation(t) } return !1 } setColorRepresentation(t) { return t = t.toUpperCase(), !!this._root.interaction.options.find(e => e.getAttribute("data-type").startsWith(t) && !e.click()) } getColorRepresentation() { return this._representation } getColor() { return this._color } getSelectedColor() { return this._lastColor } getRoot() { return this._root } disable() { return this.hide(), this.options.disabled = !0, this._root.button.classList.add("disabled"), this } enable() { return this.options.disabled = !1, this._root.button.classList.remove("disabled"), this } } L(x, "utils", n), L(x, "version", "1.8.1"), L(x, "I18N_DEFAULTS", { "ui:dialog": "color picker dialog", "btn:toggle": "toggle color picker dialog", "btn:swatch": "color swatch", "btn:last-color": "use previous color", "btn:save": "Save", "btn:cancel": "Cancel", "btn:clear": "Clear", "aria:btn:save": "save and close", "aria:btn:cancel": "cancel and close", "aria:btn:clear": "clear and close", "aria:input": "color input field", "aria:palette": "color selection area", "aria:hue": "hue selection slider", "aria:opacity": "selection slider" }), L(x, "DEFAULT_OPTIONS", { appClass: null, theme: "classic", useAsButton: !1, padding: 8, disabled: !1, comparison: !0, closeOnScroll: !1, outputPrecision: 0, lockOpacity: !1, autoReposition: !0, container: "body", components: { interaction: {} }, i18n: {}, swatches: null, inline: !1, sliders: null, default: "#42445a", defaultRepresentation: null, position: "bottom-middle", adjustableNumbers: !0, showAlways: !1, closeWithKey: "Escape" }), L(x, "create", t => new x(t)); e.default = x
    }]).default
}));
//# sourceMappingURL=pickr.min.js.map

// #content color.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
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

// #content features/modal.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
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

// #content features/search.js
const search = {
    startFilterSearch: undefined,
    SearchFilter: class {
        constructor(inputOptions) {
            // get names and define name match func
            this.names = [];
            this.names = inputOptions.find(e => e.id == "inputSearchName").value.trim() != "" ? inputOptions.find(e => e.id == "inputSearchName").value.trim().split(",").map(p => p.trim()) : []
            const matchesNames = (players) => {
                return this.names.length == 0 || players.some(lobbyplayer =>
                    this.names.some(searchPlayer => searchPlayer.toLowerCase() == lobbyplayer.Name.toLowerCase()));
            };

            // get round and round modifier + match func
            this.targetRound = 0;
            this.targetRoundModifier = 0;
            let valRound = inputOptions.find(e => e.id == "inputSearchRound").value.trim();
            this.targetRound = parseInt(valRound);
            this.targetRoundModifier = valRound[valRound.indexOf(this.targetRound) + this.targetRound.toString().length];
            if (this.targetRoundModifier != "+" && this.targetRoundModifier != "-" && this.targetRoundModifier != undefined
                || isNaN(this.targetRound)) this.targetRoundModifier = "+";
            const matchesRound = (round) => {
                return isNaN(this.targetRound) ||
                    (this.targetRoundModifier == "+" ? round >= this.targetRound
                        : this.targetRoundModifier == "-" ? round <= this.targetRound
                            : round == this.targetRound);
            };

            // get score and score modifier + match func
            this.targetScore = 0;
            this.targetScoreModifier = 0;
            let valScore = inputOptions.find(e => e.id == "inputSearchScore").value.trim();
            this.targetScore = parseInt(valScore);
            this.targetScoreModifier = valScore[valScore.indexOf(this.targetScore) + this.targetScore.toString().length];
            if (this.targetScoreModifier != "+" && this.targetScoreModifier != "-" && this.targetScoreModifier != undefined
                || isNaN(this.targetScore)) this.targetScoreModifier = "+";
            const matchesScore = (players) => {
                let avg = ((ps) => { let avg = 0; ps.forEach(p => avg += p.Score / ps.length); return avg; })(players);
                return isNaN(this.targetScore)
                    || (this.targetScoreModifier == "-" ? avg < this.targetScoreModifier : avg >= this.targetScore);
            };

            // get count and count modifier + match func
            this.targetCount = 0;
            this.targetCountModifier = 0;
            let valCount = inputOptions.find(e => e.id == "inputSearchCount").value.trim();
            this.targetCount = parseInt(valCount);
            this.targetCountModifier = valCount[valCount.indexOf(this.targetCount) + this.targetCount.toString().length];
            if (this.targetCountModifier != "+" && this.targetCountModifier != "-" && this.targetCountModifier != undefined
                || isNaN(this.targetCount)) this.targetCountModifier = "+";
            const matchesCount = (players) => {
                return isNaN(this.targetCount)
                    || (this.targetCountModifier == "-" ? players.length <= this.targetCount : this.targetCountModifier == "+" ? players.length >= this.targetCount : players.length == this.targetCount);
            };

            // get ptr players checked + match func
            this.targetPalantirPresent = inputOptions.find(e => e.id == "inputSearchPalantir").checked;
            const matchesPalantir = (lobbyKey) => {
                return !this.targetPalantirPresent || sprites.playerSprites.some(sprite => sprite.LobbyKey == lobbyKey);
            };

            //function to check if all filters match - if private, dont check filters
            this.matchAll = (lobbyProperties) => {
                return lobbyProperties.Private || matchesNames(lobbyProperties.Players)
                    && matchesCount(lobbyProperties.Players)
                    && matchesScore(lobbyProperties.Players)
                    && matchesRound(lobbyProperties.Round)
                    && matchesPalantir(lobbyProperties.Key)
            }
        }
    },
    setup: () => {

        // get add filter button
        let addFilterBtn = QS("#addFilter");

        // create filter input elements
        let containerFilters = elemFromString(`<div 
            id="containerFilters" 
            style="display:grid; grid-template-columns: 2fr 3fr 2fr 3fr; width:100%; place-items: center"
        >
            <div style="grid-column-start: span 4; text-align:center">
                <details> 
                    <summary style="cursor:pointer; user-select:none"> <b>How lobby filters work</b> </summary>
                    With lobby filters, you can search for lobbys with customizable search criteria.<br>
                    Add names (separated with a comma), a specific round, average player score or lobby player count.<br>
                    You can also add a + or - after numbers to accept more or less of that value.<br>
                    When you enable "With Palantir Player" the search will stop at lobbies with Palantir users.<br>
                    When you click "Play", Typo will only stop at lobbies that fulfull one of your active filters.  <br>
                </details>
            </div>

            <h3>Search Names:</h3>
            <input id="inputSearchName" class="form-control" placeholder="Names seaparated by a comma: \'name\' or \'name, name1, name2\'" style="grid-column-start: span 3">

            <h3 style="">In Round:</h3>
            <input id="inputSearchRound" class="form-control" placeholder="\'1\' or \'2+\'" style="">

            <h3 style="">Avg Score:</h3>
            <input id="inputSearchScore" class="form-control" placeholder="\'500+\' or \'500-\'" style="">

            <h3 style="">Player Count:</h3>
            <input id="inputSearchCount" class="form-control" placeholder="\'4-\' or \'8\'" style="">
            <div class="checkbox"  style="grid-column-start: span 2"><label  style="display:flex;"><input type="checkbox" id="inputSearchPalantir"><div style="margin-left: .5em; user-select:none"> With Palantir Player</div></label></div>

            <div style="grid-column-start: span 4; display:grid; place-content:center"> <button class="flatUI green min air" id="addFilter" >✔ Add</button>  </div>
        </div>`)
        /* let filterNamesForm = elemFromString('<div style="display:flex; width: 100%; margin-bottom:.5em;"><h5>Search Names:</h5><input id="inputSearchName" class="form-control" placeholder="\'name\' or \'name, name1, name2\'" style="flex-grow: 2; width:unset; margin-left: .5em;"></div>');
        let filterDetailsForm = elemFromString('<div style="display:flex; width: 100%; margin-bottom:.5em;"><h5 style="flex:1;">In Round:</h5><input id="inputSearchRound" class="form-control" placeholder="\'1\' or \'2+\'" style="flex: 1;margin-left: .5em;"><h5 style="margin-left: .5em; flex:1;">Avg Score:</h5><input id="inputSearchScore" class="form-control" placeholder="\'500+\' or \'500-\'" style="flex: 1; margin-left: .5em;"></div>');
        let filterPlayersForm = elemFromString('<div style="display:flex; width: 100%;"><h5 style="flex:1;">Player Count:</h5><input id="inputSearchCount" class="form-control" placeholder="\'4-\' or \'8\'" style="flex: 1;margin-left: .5em;"><div class="checkbox" style="margin-left: .5em; flex:2"><label><input type="checkbox" id="inputSearchPalantir"><span>With Palantir Player</span></label></div><div class="btn btn-success" id="addFilter" style="height: fit-content;">✔ Add</div></div>');
        containerFilters.appendChild(filterNamesForm);
        containerFilters.appendChild(filterDetailsForm);
        containerFilters.appendChild(filterPlayersForm); */
        
        // gets the current settings
        const getFilterString = () => {
            let values = [];
            [...containerFilters.querySelectorAll("input")].forEach(elem => {
                values.push({ id: elem.id, checked: elem.checked, value: elem.value });
            });
            return JSON.stringify(values);
        };
        
        let currentModal = null;
        addFilterBtn.addEventListener("click", () => currentModal =  new Modal(containerFilters, () => {}, "Add a lobby search filter"));

        // function to add a filter
        const addFilter = (filterstring, active, id) => {
            let filter = new search.SearchFilter(JSON.parse(filterstring));
            let names = (filter.targetPalantirPresent ? [...filter.names, "Palantir users"] : filter.names).join(", ");
            let visual = [];
            if (names != "") visual.push("🔎 " + names);
            if (!isNaN(filter.targetRound)) visual.push("🔄 " + filter.targetRound + (filter.targetRoundModifier ? filter.targetRoundModifier : ""));
            if (!isNaN(filter.targetScore)) visual.push("📈 " + filter.targetScore + (filter.targetScoreModifier ? filter.targetScoreModifier : ""));
            if (!isNaN(filter.targetCount)) visual.push("👥 " + filter.targetCount + (filter.targetCountModifier ? filter.targetCountModifier : ""));

            // func to remove filter btn and filter
            let remove = () => {
                let added = JSON.parse(localStorage.addedFilters);
                added = added.filter(filter => filter.id != id);
                localStorage.addedFilters = JSON.stringify(added);
            }

            // if nothing was selected
            if (visual.join("") == "") {
                new Toast("No filters set.");
                remove();
                return;
            }

            // create button element
            let filterbutton = elemFromString('<button class="flatUI blue min air" style="margin: .5em">' + visual.join(" & ") + '</button>');

            // add btn before add filter btn
            addFilterBtn.insertAdjacentElement("beforebegin", filterbutton);

            // set filter activation
            if(!active) filterbutton.classList.add("filterDisabled");
            filterbutton.addEventListener("click", () => {
                filterbutton.classList.toggle("filterDisabled");
                let added = JSON.parse(localStorage.addedFilters);
                added.forEach(filter => { if (filter.id == id) filter.active = !filterbutton.classList.contains("filterDisabled") });
                localStorage.addedFilters = JSON.stringify(added);
            });

            filterbutton.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                remove();
                filterbutton.remove();
            });
        }

        // add filter when save is pressed
        containerFilters.querySelector("#addFilter").addEventListener("click", () => {
            let filterstring = getFilterString();
            let id = Date.now();
            localStorage.addedFilters = JSON.stringify([...JSON.parse(localStorage.addedFilters), { active: true, filter: filterstring, id: id }]);
            addFilter(filterstring, true, id);
            currentModal?.close()
        });

        // add saved filters
        JSON.parse(localStorage.addedFilters).forEach(filter => {
            addFilter(filter.filter, filter.active, filter.id);
        });

        // start search on play button
        QS(".button-play").addEventListener("click", (e) => {
            // if filters enabled
            if (JSON.parse(localStorage.addedFilters).some(filter => filter.active)) search.startFilterSearch();
        });
    },
    startFilterSearch: () => {
        // load and create filters
        let filters = [];
        let humanCriterias = [];
        JSON.parse(localStorage.addedFilters).forEach(filter => {
            if (filter.active) {
                let filterObj = new search.SearchFilter(JSON.parse(filter.filter));
                filters.push(filterObj);
                criteria = [];
                if (filterObj.names.length > 0 || filterObj.targetPalantirPresent) criteria.push("<b>Names:</b> " + (filterObj.targetPalantirPresent ? [...filterObj.names, "Palantir Users"] : filterObj.names).join(", "));
                if (!isNaN(filterObj.targetRound)) criteria.push("<b>Round:</b> " + filterObj.targetRound + (filterObj.targetRoundModifier ? filterObj.targetRoundModifier : ""));
                if (!isNaN(filterObj.targetScore)) criteria.push("<b>Avg Score:</b> " + filterObj.targetScore + (filterObj.targetScoreModifier ? filterObj.targetScoreModifier : ""));
                if (!isNaN(filterObj.targetCount)) criteria.push("<b>Players:</b> " + filterObj.targetCount + (filterObj.targetCountModifier ? filterObj.targetCountModifier : ""));
                if (criteria.length > 0) humanCriterias.push(criteria.join(" & "));
            }
        });
        // create search modal
        let searchParamsHuman = (humanCriterias.join("<br>or<br>") != "" ?
            "Search Criteria:<br>" + humanCriterias.join("<br>or<br>") : "<b>Whoops,</b> You didn't set any filters.");
        let modalCont = elemFromString("<div style='text-align:center'><details><summary style='cursor:pointer; user-select:none''><b>Lobby Search Information</b></summary>While this popup is opened, typo jumps through lobbies and searches for one that matches you filters.<br>Due to skribbl limitations, typo can only join once in two seconds.</details><h4>" + searchParamsHuman + "</h4><span id='skippedPlayers'>Skipped players:<br></span><br><span id='jumpsSearch'></span><br><h4>Click anywhere out to cancel</h4><div>");
        let modal = new Modal(modalCont, () => {
            if(!search.searchData.searching) return;
            search.searchData.searching = false;
            QS("#searchRules")?.remove();
            document.dispatchEvent(newCustomEvent("abortJoin"));
            leaveLobby();
        }, "Searching for filter match:", "40vw", "15em");

        let skippedPlayers = [];
        let jumps=0;

        search.setSearch(() => {
            
            // search rules
            if(!QS("#searchRules")) {
                let rules = document.body.appendChild(elemFromString`<style id="searchRules">
                    #home{ display:flex !important}
                    #game{ display:none !important}
                    #load{ display:none !important}
                </style>`);
            }
            modalCont.querySelector("#jumpsSearch").textContent = "Skipped lobbies: " + ++jumps;
            lobbies.lobbyProperties.Players.forEach(p => {
                if (skippedPlayers.indexOf(p.Name) < 0 && p.Name != socket.clientData.playerName) {
                    skippedPlayers.push(p.Name);
                    modalCont.querySelector("#skippedPlayers").innerHTML += " [" + p.Name + "] <wbr> ";
                }
            });
            let lobby = lobbies.lobbyProperties;
            return filters.length <= 0 || filters.some(filter => filter.matchAll(lobby));
        }, () => {
            leaveLobby(true);
        }, () => {
            search.searchData= {
                searching: false,
                check: undefined, proceed: undefined, ended: undefined
            };
            modal.close();
            QS("#searchRules")?.remove();
        });
    },
    searchData: {
        searching: false,
        check: undefined, proceed: undefined, ended: undefined
    },
	setSearch: (check, proceed, ended = () => { }) => {
		if (search.searchData.searching) return;
		search.searchData.searching = true;
		search.searchData.check = check;
		search.searchData.proceed = proceed;
		search.searchData.ended = ended;
	}
}

// #content features/sprites.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const sprites = {
    // Object which has necessary properties to handle sprite logic
    PlayerSpriteContainer: function (_lobbyKey, _lobbyPlayerID, _avatarContainer, _name) {
        this.lobbyKey = _lobbyKey;
        this.lobbyPlayerID = _lobbyPlayerID;
        this.name = _name;
        this.avatarContainer = _avatarContainer;
    },
    availableSprites: [], //list of all sprites
    playerSprites: [], //list of all player identifications which are online and have sprites
    lobbyPlayers: [], //list of the players in the players lobby
    getSpriteURL: (id) => { // get the gif url from a sprite id
        let url = "";
        sprites.availableSprites.forEach(s => { if (s.ID == id) url = s.URL; });
        return url;
    },
    isSpecial: (id) => { // checks if a sprite is special
        let special = false;
        sprites.availableSprites.forEach(s => { if (s.ID == id && s.Special) special = true; });
        return special;
    },
    getPlayerList: () => { //get the lobby player list and store in lobbyPlayers
        let players = [];
        let playerContainer = QS("#game-players");
        //let playerContainerLobby = QS("#containerLobbyPlayers");, ...playerContainerLobby.querySelectorAll(".lobbyPlayer")
        [...playerContainer.querySelectorAll(".player")].forEach(p => {
            let psc = new sprites.PlayerSpriteContainer(
                lobbies.lobbyProperties.Key,
                p.getAttribute("playerid"),
                p.querySelector(".avatar"),
                p.querySelector(".player-name").innerText.replace("(You)", "").trim()
            )
            players.push(psc);
        });
        sprites.lobbyPlayers = players;
    },
    updateSprites: () => { // compare lobbyplayers with onlinesprites and set sprite if matching

        // get shifts for this lobby
        let shifts = socket.data.publicData.onlineItems.filter(item => item.LobbyKey == socket.clientData.lobbyKey && item.ItemType == "shift");

        sprites.lobbyPlayers.forEach(player => {
            let playerSlots = [];
            sprites.playerSprites.forEach(sprite => {
                if (sprite.LobbyPlayerID.toString() == player.lobbyPlayerID && sprite.LobbyKey == player.lobbyKey) {
                    playerSlots.push({
                        sprite: sprite.Sprite,
                        slot: sprite.Slot,
                        shift: shifts.find(shift => shift.LobbyPlayerID == player.lobbyPlayerID && sprite.Slot == shift.Slot)
                    });
                }
            });

            if (playerSlots.length > 0) {
                player.avatarContainer.parentElement.parentElement.classList.toggle("typo", true);
                // check if existent slots are set to 0
                [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")].forEach(existentSlot => {
                    if (!playerSlots.some(slot => existentSlot.classList.contains("specialSlot" + slot.slot))) existentSlot.remove();
                });
                // make avatar invisible if special is inluded
                let state = playerSlots.some(slot => sprites.isSpecial(slot.sprite)) ? "none" : "";
                [...player.avatarContainer.querySelectorAll(".color, .eyes, .mouth")].forEach(a => a.style.display = state);
                // update slots
                playerSlots.forEach(slot => {
                    let spriteUrl = sprites.getSpriteURL(slot.sprite);
                    if (!player.avatarContainer.querySelector(".specialSlot" + slot.slot) // if slot layer isnt existent or has old url
                        || player.avatarContainer.querySelector(".specialSlot" + slot.slot).style.backgroundImage != "url(\"" + spriteUrl + "\")") {
                        if (player.avatarContainer.querySelector(".specialSlot" + slot.slot)) // remove slot layer
                            player.avatarContainer.querySelector(".specialSlot" + slot.slot).remove();
                        let spriteContainer = document.createElement("div"); // create new layer
                        spriteContainer.className = "specialSlot" + slot.slot;
                        spriteContainer.classList.add("special");
                        spriteContainer.classList.add("typoSpecialSlot");
                        spriteContainer.style.zIndex = slot.slot;
                        spriteContainer.style.backgroundImage = slot.shift ? "url(https://static.typo.rip/sprites/rainbow/modulate.php?url=" + spriteUrl + "&hue=" + slot.shift.ItemID + ")" : "url(" + spriteUrl + ")";
                        player.avatarContainer.appendChild(spriteContainer);
                        // set style depending on listing
                        if (spriteContainer.closest("#containerLobbyPlayers")) spriteContainer.style.backgroundSize = "contain";
                        else {
                            spriteContainer.parentElement.parentElement.parentElement.style.height = "56px";
                            spriteContainer.parentElement.parentElement.style.top = "3px";
                        }
                    }
                });
            }
            // else remove all existent slots
            else {
                [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")].forEach(existentSlot => existentSlot.remove());
                player.avatarContainer.parentElement.parentElement.classList.toggle("typo", false);
            }

        });
    },
    updateAwards: () => {
        const lobbyAwards = socket.data.publicData.onlineItems.filter(item => item.LobbyKey == socket.clientData.lobbyKey && item.ItemType == "award");

        [...QSA("#game-players .player-icons")].forEach(icons => {
            const playerId = Number(icons.closest(".player")?.getAttribute("playerid"));
            if (Number.isNaN(playerId)) return;
            let playerIcons = lobbyAwards.filter(a => a.LobbyPlayerID == playerId);

            [...icons.querySelectorAll(".award")].forEach(existingIcon => {
                const awardId = Number(existingIcon.getAttribute("awardId"));
                if (!playerIcons.some(icon => icon.Slot == awardId)) existingIcon.remove();
                else playerIcons = playerIcons.filter(icon => icon.Slot != awardId);
            });

            playerIcons.forEach(icon => {
                const award = awards.all.find(a => a.id == icon.Slot);
                icons.insertAdjacentHTML("beforeend", `<div class="icon typo award visible" awardId="${award.id}" style="background-image: url(${award.url})"></div>`);
            });
        });
    },
    updateScenes: () => {
        const playerlist = QS("#game-players");
        let scenesCSS = elemFromString("<style id='scenesRules'></style>");

        // scene shifts for this lobby
        let shifts = socket.data.publicData.onlineItems.filter(item => item.LobbyKey == socket.clientData.lobbyKey && item.ItemType == "sceneTheme");

        sprites.onlineScenes.forEach(scene => {
            if (scene.LobbyKey == socket.clientData.lobbyKey) {
                let url = sprites.availableScenes.find(av => av.ID == scene.Sprite).URL;
                const sceneShift = shifts.find(shift => shift.LobbyPlayerID == scene.LobbyPlayerID);
                if(sceneShift) {
                    url = `https://static.typo.rip/sprites/rainbow/modulate.php?url=${url}&hue=${sceneShift.ItemID}`;
                    const rotate = ((360/200) * sceneShift.ItemID - 180) * -1;
                    scenesCSS.innerHTML += `
                    #game-players div.player:not(.guessed)[playerid='${scene.LobbyPlayerID}'] .player-info {filter: hue-rotate(${rotate}deg) !important}`;
                }

                scenesCSS.innerHTML += `
                #game-players div.player[playerid='${scene.LobbyPlayerID}'] {
                    background-image: url(${url}) !important;
                    background-size: auto 100% !important;
                    background-position: center center !important;
                    background-repeat: no-repeat !important;
                }
                #game-players div.player[playerid='${scene.LobbyPlayerID}'] .player-background {opacity: 0}
                #game-players div.player.guessed[playerid='${scene.LobbyPlayerID}'] *:is(.player-rank, .player-score, .player-name) {color: ${sprites.availableScenes.find(av => av.ID == scene.Sprite).GuessedColor} !important}
                #game-players div.player[playerid='${scene.LobbyPlayerID}'] *:is(.player-rank, .player-score, .player-name) {color: ${sprites.availableScenes.find(av => av.ID == scene.Sprite).Color} !important}`;
            }
        });

        if (QS("#scenesRules")?.innerHTML === scenesCSS.innerHTML) return;

        QS("#scenesRules")?.remove();
        playerlist.insertAdjacentElement("afterbegin", scenesCSS);
    },
    updateEndboardSprites: () => { // show sprites on endboard
        let endboardAvatars = QSA(".overlay-content .result .rank-name");
        sprites.lobbyPlayers.forEach(player => {
            let avatarContainer = null;
            endboardAvatars.forEach(a => { if (a.innerText == player.name) avatarContainer = a.closest(".podests") ? a.parentElement.parentElement.querySelector(".avatar") : a.parentElement.querySelector(".avatar"); });
            if (avatarContainer != null) {
                // remove all existent special slots on avatar
                [...avatarContainer.parentElement.querySelectorAll(".typoSpecialSlot")].forEach(slot => slot.remove());
                // update background depending on avatar
                let state = player.avatarContainer.querySelector(".color").style.display;
                [...avatarContainer.parentElement.querySelectorAll(".color, .eyes, .mouth")].forEach(elem => elem.style.display = state);
                // add slots to avatar
                let slotsOnSidebar = [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")];
                slotsOnSidebar.forEach(slot => {
                    let slotElem = avatarContainer.querySelector(".special").cloneNode(true);
                    slotElem.style.backgroundSize = "cover";
                    slotElem.classList.add(".typoSpecialSlot");
                    slotElem.style.display = "";
                    slotElem.style.backgroundPosition = "";
                    slotElem.style.backgroundImage = slot.style.backgroundImage;
                    slotElem.style.zIndex = slot.style.zIndex;
                    avatarContainer.appendChild(slotElem);
                });
            }
        });
    },
    refreshCallback: async () => { // refresh all
        sprites.getSprites();
        sprites.getPlayerList();
        sprites.updateSprites();
        sprites.updateScenes();
        sprites.updateAwards();
    },
    getSprites: () => {
        sprites.availableSprites = socket.data.publicData.sprites;
        sprites.playerSprites = socket.data.publicData.onlineSprites;
        sprites.availableScenes = socket.data.publicData.scenes;
        sprites.onlineScenes = socket.data.publicData.onlineScenes;
    },
    getOwnSpriteUrlShifted: (id) => {
        let shifts = socket.data.user.rainbowSprites ? socket.data.user.rainbowSprites.split(",").map(s => s.split(":")) : [];
        let url = sprites.getSpriteURL(id);
        let shift = shifts.find(s => s[0] == id);
        if (shift) url = "https://static.typo.rip/sprites/rainbow/modulate.php?url=" + url + "&hue=" + shift[1];
        return url;
    },
    setLandingSprites: (authenticated = false) => {
        QSA(".avatar-customizer .spriteSlot").forEach(elem => elem.remove());
        QS(".avatar-customizer").style.backgroundImage = "";
        if (authenticated) {
            let ownsprites = socket.data.user.sprites.toString().split(",");
            let activeSprites = ownsprites.filter(s => s.includes("."));
            QSA(".avatar-customizer .color, .avatar-customizer .eyes, .avatar-customizer .mouth").forEach(n => {
                n.style.opacity = activeSprites.some(spt => sprites.isSpecial(spt.replaceAll(".", ""))) ? 0 : 1;
            });
            activeSprites.forEach(sprite => {
                let slot = sprite.split(".").length - 1;
                let id = sprite.replaceAll(".", "");
                let url = sprites.getOwnSpriteUrlShifted(id);
                let specialContainer = QS(".avatar-customizer .special");
                let clone = specialContainer.cloneNode(true);
                specialContainer.parentElement.appendChild(clone);
                clone.style = "background-image:url(" + url + "); background-size:contain; position: absolute; left: -33%; top: -33%; width: 166%;height: 166%;";
                clone.style.zIndex = slot;
                clone.classList.add("spriteSlot");
                clone.classList.remove("special");
            });

            let container = QS(".avatar-customizer");
            let scene = socket.data.user.scenes ? socket.data.user.scenes.toString().split(",").filter(s => s[0] == ".")[0] : undefined;
            if (scene != undefined) {
                const sceneID = scene.replace(".", "").split(":")[0];
                const sceneShift = scene.split(":")[1];
                console.log(sceneID, sceneShift);
                let url = socket.data.publicData.scenes.find(_scene => _scene.ID == sceneID).URL;
                if(sceneShift) url = "https://static.typo.rip/sprites/rainbow/modulate.php?url=" + url + "&hue=" + sceneShift;
                container.style.cssText = `    
                    background-repeat: no-repeat;
                    background-image: url(${url});
                    background-size: cover;
                    background-position: center;
                `;
            }
            else container.style.cssText = ``;
        }
        else {
            QSA(".avatar-customizer .color, .avatar-customizer .eyes, .avatar-customizer .mouth").forEach(n => {
                n.style.opacity = 1;
            });
        }
    },
    resetCabin: async (authorized = false) => {
        const cabin = QS("#cabinSlots");
        cabin.innerHTML = `
            <div id="loginRedir">
                <button class="flatUI air min blue">Log in with Palantir</button>
            </div>
            <div>Slot 1<p></p></div>
            <div>Slot 2<p></p></div>
            <div>Slot 3<p></p></div>
            <div>Slot 4<p></p></div>
            <div>Slot 5<p></p></div>
            <div>Slot 6<p></p></div>
            <div>Slot 7<p></p></div>
            <div>Slot 8<p></p></div>
            <div>Slot 9<p></p></div>`;

        if (!authorized) {
            cabin.classList.add("unauth");
        }
        else {
            // add sprite cabin stuff
            let user = await socket.getUser();
            const createSlot = (slot, unlocked = false, caption = false, background = false, id = 0) => {
                return elemFromString(`<div draggable="true" spriteid="${id}" slotid="${slot}" class="${unlocked ? "unlocked" : ""}" style="background-image:url(${background ?
                    sprites.getOwnSpriteUrlShifted(id) : ""})">
                    Slot ${slot}${caption ? "<p>" + (id > 0 ? "Selected #" + id : "Empty") + "</p>" : ""}</div>`);
            }
            const getCombo = () => {
                let slots = [...QSA("#cabinSlots > div:not(#loginRedir)")];
                slots = slots.map(slot => { return { slot: slots.indexOf(slot) + 1, sprite: slot.getAttribute("spriteid") }; });
                while (slots[slots.length - 1].sprite == 0) slots.pop();
                return slots.map(slot => ".".repeat(parseInt(slot.slot)) + slot.sprite)
                    .join(",");
            }
            cabin.classList.remove("unauth");
            const setSlotSprites = () => {
                // clean slots
                QSA("#cabinSlots > div:not(#loginRedir)").forEach(slot => slot.remove());
                // loop through player slots and check if sprite set on slot
                const activeSprites = user.user.sprites.toString().split(",")
                    .filter(spt => spt.includes("."))
                    .map(spt => {
                        return {
                            id: spt.replaceAll(".", ""),
                            slot: spt.split(".").length - 1
                        }
                    });
                for (let slotIndex = 1; slotIndex <= user.slots || slotIndex < 16; slotIndex++) {
                    const sprite = activeSprites.find(spt => spt.slot == slotIndex);
                    const id = sprite ? parseInt(sprite.id) : 0;
                    const background = id > 0;
                    const unlocked = slotIndex <= user.slots;
                    cabin.appendChild(createSlot(slotIndex, unlocked, unlocked, background, id));
                }
                // make grid draggable
                const drag = (e) => {
                    e.preventDefault();
                    // make preview elem
                    const preview = createSlot(0, true, false, false, 0);
                    preview.style.opacity = "0";
                    e.target.insertAdjacentElement("beforebegin", preview);
                    // lock element;
                    const bounds = e.target.getBoundingClientRect();
                    e.target.style.width = bounds.width + "px";
                    e.target.style.height = bounds.height + "px";
                    e.target.style.position = "fixed";
                    e.target.style.transition = "none";
                    e.target.style.transform = "translate(-50%, -50%)";
                    e.target.setAttribute("released", "false");
                    // move as first child to hover over all children
                    e.target.parentElement.insertAdjacentElement("afterbegin", e.target);
                    //listen for mouseup, follow mouse until then
                    let lastPrevX = 0;
                    const followMouse = (event) => {
                        e.target.style.top = event.pageY - document.body.scrollTop + "px";
                        e.target.style.left = event.pageX + "px";
                        let hoverDrop = QS("#cabinSlots > div:not(#loginRedir):hover");
                        if (hoverDrop != e.target) {
                            if (e.target.style.left < lastPrevX) hoverDrop.insertAdjacentElement("beforebegin", preview);
                            else hoverDrop.insertAdjacentElement("afterend", preview);
                            lastPrevX = e.target.style.left;
                        }
                    }
                    const reset = async () => {
                        document.removeEventListener("pointermove", followMouse);
                        e.target.style.position = "";
                        e.target.style.transition = "";
                        e.target.style.transform = "";
                        e.target.style.width = "";
                        e.target.style.height = "";
                        // move to dragged position
                        QS("#cabinSlots > div:not(#loginRedir):hover").insertAdjacentElement("afterend", e.target);
                        preview.remove();
                        setTimeout(() => {
                            e.target.setAttribute("released", "true");
                        }, 100);
                        let updatedmember = await socket.setSpriteCombo(getCombo());
                        user.user = updatedmember;
                        socket.data.user = updatedmember;
                        setSlotSprites();
                        sprites.setLandingSprites(true);

                    }
                    document.addEventListener("pointerup", reset, { once: true });
                    document.addEventListener("pointermove", followMouse);
                }

                QSA("#cabinSlots > div:not(#loginRedir)").forEach(slot => slot.addEventListener("dragstart", drag));
            }

            setSlotSprites();

            cabin.addEventListener("contextmenu", async (event) => {
                event.preventDefault();
                if (event.target.getAttribute("released") == "false") return;
                slotid = event.target.getAttribute("slotid");
                if (slotid && event.target.classList.contains("unlocked")) {
                    const slotNo = parseInt(slotid);
                    let updatedmember = await socket.setSpriteSlot(slotNo, 0);
                    socket.data.user = updatedmember;
                    user.user = updatedmember;
                    setSlotSprites();
                    sprites.setLandingSprites(true);
                }
            });

            cabin.addEventListener("click", event => {
                if (event.target.getAttribute("released") == "false") return;
                slotid = event.target.getAttribute("slotid");
                if (slotid) {
                    const slotNo = parseInt(slotid);
                    const spriteList = elemFromString(`<div style="width:100%; display:flex; flex-wrap:wrap; justify-content:center;"></div>`);
                    spriteList.insertAdjacentHTML("beforeend",
                        "<div class='spriteChoice' sprite='0' style='margin:.5em; height:6em; aspect-ratio:1; background-image:none'></div>");
                    user.user.sprites.toString().split(",").forEach(spt => {
                        const id = spt.replaceAll(".", "");
                        const active = spt.includes(".");
                        if (!active && id > 0) {
                            spriteList.insertAdjacentHTML("beforeend",
                                "<div class='spriteChoice' sprite='" + id + "' style='order: " + id + ";margin:.5em; height:6em; aspect-ratio:1; background-image:url("
                                + sprites.getOwnSpriteUrlShifted(id)
                                + ")'></div>");
                        }
                    });
                    const picker = new Modal(spriteList, () => { }, "Choose a sprite for slot " + slotNo);
                    spriteList.addEventListener("click", async event => {
                        const spt = event.target.getAttribute("sprite");
                        if (spt) {
                            picker.close();
                            let updatedmember = await socket.setSpriteSlot(slotNo, spt);
                            user.user = updatedmember;
                            socket.data.user = updatedmember;
                            setSlotSprites();
                            sprites.setLandingSprites(true);
                        }
                    })
                }
            });

        }

        QS("#rightPanelContent #loginRedir").addEventListener("click", login);
    },
    init: async () => {
        // make board behind playerlist so it doesnt hide portions of avatars
        const c = QS("#game-players").style.zIndex = "1";
        // polling for sprites, observer does not make sense since sprites take a few seconds to be activated
        setInterval(sprites.refreshCallback, 2000);
        let endboardObserver = new MutationObserver(() => { // mutation observer for game end result
            sprites.updateEndboardSprites();
            sprites.updateSprites();
        });
        endboardObserver.observe(QS(".overlay-content .result"), { childList: true, attributes: true });
        sprites.getSprites();
    }

};

// #content features/genericFunctions.js
// general util functions which have no dependencies

async function typoApiFetch(path, method = "GET", params = {}, body = undefined, userToken = undefined, parseResponse = true) {
    const searchParams = new URLSearchParams(params);

    const isFirefox = false; // chrome?.runtime?.getURL('').startsWith('moz-extension://') ?? false;
    const apiBase = isFirefox ? "https://tobeh.host/newapi" : "https://api.typo.rip";
    const url = apiBase + (path.startsWith("/") ? "" : "/") + path;

    const request = await fetch(url, {
        searchParams: searchParams,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken ? `Bearer ${userToken}` : undefined
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if(parseResponse) return await request.json();
    return request.text();
}

//Queryselector bindings
const QS = document.querySelector.bind(document);
const QSA = document.querySelectorAll.bind(document);

/**
 * Generate a string by a key, that is hashed by its own value. Can be used to identify a public group token (the hash)
 * @param {String} key The key that is hashed against itself
 * @returns A hash that can be used for match check
 */
const genMatchHash = key => {
    const sum = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const hashed = [...key].map(char => String.fromCharCode(char.charCodeAt(0) + sum));
    const newKey = hashed.join("");
    return newKey;
}

/**
 * Checks if the hash can be solved with a given key.
 * @param {*} hash the self-hash to test against
 * @param {*} key the key to solve the hash
 * @returns true if the solved hash equals the key.
 */
const solveMatchHash = (hash, key) => {
    const sum = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const unhashed = [...hash].map(char => String.fromCharCode(char.charCodeAt(0) - sum));
    const match = unhashed.join("") == key;
    return match;
}

const localDateToUtc = ms => new Date(new Date(ms).toISOString().replace("Z", "")).getTime();

// polyfill customevent
const newCustomEvent = (type, detail = {}) => {
    if (typeof (cloneInto) == "undefined") return new CustomEvent(type, detail);
    let eventDetail = cloneInto(detail, document.defaultView);
    return clonedEvent = new document.defaultView.CustomEvent(type, eventDetail);
}

// start login process
const login = () => {
    localStorage.removeItem("member");
    localStorage.removeItem("accessToken");
    const handler = async msg => {

        // check if right message
        if (!msg.data.accessToken) return;
        localStorage.accessToken = msg.data.accessToken;
        socket.sck.disconnect();
        document.addEventListener("palantirLoaded", () => {
            uiTweaks.updateAccountElements();
        }, { once: true });
        socket.init();
        window.removeEventListener("message", handler);
    };

    if (window.lastTypoLoginHandler) window.removeEventListener("message", window.lastTypoLoginHandler);
    window.lastTypoLoginHandler = handler;
    window.addEventListener("message", handler);
    window.open('https://www.typo.rip/auth', 'Log in to Palantir', 'height=650,width=500,right=0,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

const logout = () => {
    localStorage.removeItem("member");
    localStorage.removeItem("accessToken");
    socket.sck.disconnect();
    socket.authenticated = false;
    document.addEventListener("palantirLoaded", () => {
        uiTweaks.updateAccountElements();
    }, { once: true });
    socket.init();
}

// func to mark a message node with background color
const markMessage = (newNode) => {
    if (localStorage.markup != "true") return;
    let sender = newNode.firstChild.textContent.trim().slice(0, -1);
    if (sender == socket.clientData.playerName || sender != "" && localStorage.vip.split("/").includes(sender))
        newNode.style.background = (new Color({ h: Number(localStorage.markupcolor), s: 100, l: 90 })).hex + "AA";
}

//func to scroll to bottom of message container
const scrollMessages = (onlyIfScrolledDown = false) => {
    let box = document.querySelector(".chat-content");
    if (!onlyIfScrolledDown || Math.floor(box.scrollHeight - box.scrollTop) <= box.clientHeight + 60) {
        box.scrollTop = box.scrollHeight;
    }
}

const elemFromString = (html) => {
    let dummy = document.createElement("div");
    dummy.innerHTML = html;
    return dummy.firstChild;
}

const waitMs = async (timeMs) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), timeMs);
    });
};

const scaleDataURL = async (url, width, height) => {
    return new Promise((resolve, reject) => {
        let source = new Image();
        source.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(source, 0, 0, width, height);
            resolve(canvas.toDataURL());
        }
        source.src = url;
    });
}

const imageUrlToClipboard = async (dataUrl) => { // parts from: https://stackoverflow.com/questions/23182933/converting-an-image-dataurl-to-image
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    addChatMessage("", "Copied to clipboard");
}

// func to replace umlaute in a string
const replaceUmlaute = (str) => {
    // umlaute which have to be replaced
    const umlautMap = {
        '\u00dc': 'u',
        '\u00c4': 'a',
        '\u00d6': 'o',
        '\u00fc': 'u',
        '\u00e4': 'a',
        '\u00f6': 'o'
    }
    return str
        .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
            const big = umlautMap[a.slice(0, 1)];
            return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
        })
        .replace(new RegExp('[' + Object.keys(umlautMap).join('|') + ']', "g"),
            (a) => umlautMap[a]
        );
}

// get the current or last drawer as safe as possible
const getCurrentOrLastDrawer = () => {
    let drawer = "Unknown";
    if (QS(".avatar .drawing[style*=block]"))
        drawer = QS(".avatar .drawing[style*=block]").closest(".player").querySelector(".player-name").textContent.replace("(You)", "").trim();
    else {
        try {
            drawer = (new RegExp(">([^>]+?) is drawing now!<\/b>", "g")).exec(QS("#game-chat .content").innerHTML).pop();
        }
        catch { }
    }
    return drawer;
}

// check if the player is currently drawing
const isCurrentlyDrawing = () => {
    return QS(".avatar .drawing[style*=block]")?.closest(".player").querySelector(".player-name")?.textContent.includes("(You)") ?? false;
}

const getCurrentWordOrHint = () => {
    if (QS("#game-word .description").textContent.includes("DRAW")) {
        // get whole word
        return QS("#game-word .word").textContent;
    }
    else return [...document.querySelectorAll("#game-word .hints .container .hint")].map(elem => elem.textContent).join("");
}

// adds a color palette
const setColorPalette = (colorPalette) => {
    paletteContainer = elemFromString(`<div class="colors custom"></div>`);
    paletteContainer.style.width = colorPalette.rowCount * 24 + "px";
    let swatches = [...colorPalette.swatches];
    rowTop = 0;
    while (swatches.length > 0) {
        const rowElem = elemFromString("<div class='top' style='position:absolute'></div>");
        rowElem.style.top = rowTop + "px";
        rowTop += 24;
        swatches.splice(0, colorPalette.rowCount).forEach(swatch => {
            rowElem.appendChild(swatch.swatch);
        });
        paletteContainer.appendChild(rowElem);
    }
    paletteContainer.addEventListener("pointerdown", () => clearInterval(uiTweaks.randomInterval));
    if (QS("#game-toolbar .colors.custom")) {
        QS("#game-toolbar .colors.custom").replaceWith(paletteContainer);
    }
    else QS("#game-toolbar .colors").insertAdjacentElement("afterend", paletteContainer);
    QS("#game-toolbar .colors").style.display = "none";
}

const createColorPalette = (paletteObject) => {
    const palette = {
        rowCount: 1,
        name: paletteObject.name,
        colors: [
        ],
        swatches: [
        ],
        json: "",
        activate: () => {
            setColorPalette(palette);
        }
    };
    palette.rowCount = paletteObject && paletteObject.rowCount ? paletteObject.rowCount : 2;
    let dummyColorTester = elemFromString("<div style='display:none'></div>");
    document.body.appendChild(dummyColorTester);
    paletteObject?.colors?.forEach(color => {
        if (color.color) {
            dummyColorTester.style.backgroundColor = color.color;
            const col = new Color({ rgb: window.getComputedStyle(dummyColorTester).backgroundColor });
            palette.colors.push({ color: col.hex });
            const swatch = elemFromString(`<div class="color" style="background-color:${col.hex}"></div>`);
            const code = parseInt(col.hex.replace("#", ""), 16) + 10000;
            swatch.addEventListener("mousedown", (e) => {
                document.dispatchEvent(newCustomEvent("setColor", { detail: { code: code, secondary: e.button === 2 } }));
            });
            palette.swatches.push({ swatch: swatch });
        }
    });
    document.body.removeChild(dummyColorTester);
    palette.json = JSON.stringify({ rowCount: palette.rowCount, name: palette.name, colors: palette.colors });
    return palette;
}

const convertActionsArray = (actions) => {
    const commands = actions.flat();
    //return commands;
    commands.forEach(command => {
        switch (command[0]) {
            case 2:
                command[0] = 1;
            case 0:
                if (command[1] > 11) command[1] += 2; // if index > 11, skip new cyan color column
                if (command[1] > 21) command[1] += 2; // if index > 11, skip new skin tone color column
                /* command[1] = command[1] % 2 == 0 ? // if command is fill or brush
                    command[1] + (command[1] / 2) : // if color is even, add half of index
                    command[1] + ((command[1] + 1) / 2); // if odd, add half of index+1 */
                break;
            case 1:
                command = [command[0], 0, command[1], command[2], command[3], command[4], command[5]];
                break;
        }
    });
    return commands;
}

// leave lobby
const leaveLobby = async (next = false) => {
    return new Promise((resolve, reject) => {
        if (next) {
            let joined = false;
            setTimeout(() => { joined || reject(); }, 4000);
            document.addEventListener("leftLobby", () => {
                document.addEventListener("joinedLobby", () => {
                    joined = true;
                    resolve();
                }, { once: true });
                document.dispatchEvent(newCustomEvent("joinLobby"));
            }, { once: true });
        }
        document.dispatchEvent(newCustomEvent("leaveLobby"));
        if (!next && document.fullscreenElement) {
            document.exitFullscreen();
            resolve();
        }
    });
}
document.addEventListener("toast", (e) => new Toast(e.detail.text, 1000));

const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


// set default settings
const setDefaults = (override = false) => {
    if (!localStorage.member || override) localStorage.member = "";
    if (!localStorage.client || override) localStorage.client = Date.now();
    if (!localStorage.visualOptions || override) localStorage.visualOptions = "{}";
    //if (!localStorage.themes || override) localStorage.themes = `[{"name":"Original","options":{"urlLogo":"","urlBackground":"","containerImages":"","fontColor":"","fontColorButtons":"","fontStyle":"","containerBackgroundsCheck":false,"containerBackgrounds":"","inputBackgroundsCheck":false,"inputBackgrounds":"","containerOutlinesCheck":false,"containerOutlines":"","inputOutlinesCheck":false,"inputOutlines":"","hideFooter":false,"hideCaptcha":false,"hideMeta":false,"hideAvatarLogo":false,"hideInGameLogo":false,"hideAvatarSprites":false}},{"name":"Dark Discord","options":{"urlLogo":"","urlBackground":"https://cdn.discordapp.com/attachments/715996980849147968/814955491876012032/dcdark.png); background-size: 800px;(","containerImages":"","fontColor":"white","fontColorButtons":"white","fontStyle":"Karla:wght@400;600","containerBackgroundsCheck":true,"containerBackgrounds":"#2C2F3375","inputBackgroundsCheck":true,"inputBackgrounds":"#00000075","containerOutlinesCheck":true,"containerOutlines":"transparent !important; border-left: 4px solid #7289DA !important; ","inputOutlinesCheck":true,"inputOutlines":"transparent !important; border-left: 3px solid #363636 !important; ","hideFooter":true,"hideCaptcha":true,"hideMeta":true,"hideAvatarLogo":true,"hideInGameLogo":true,"hideAvatarSprites":false}},{"name":"Alpha","options":{"urlLogo":"https://imgur.com/k8e70AG.png","urlBackground":"https://i.imgur.com/UNZtzl6.jpg","containerImages":"","fontColor":"white","fontColorButtons":"white","fontStyle":"Mulish:wght@400;600","containerBackgroundsCheck":true,"containerBackgrounds":"#ffffff50","inputBackgroundsCheck":true,"inputBackgrounds":"#00000040","containerOutlinesCheck":true,"containerOutlines":"","inputOutlinesCheck":true,"inputOutlines":"","hideFooter":true,"hideCaptcha":true,"hideMeta":true,"hideAvatarLogo":true,"hideInGameLogo":true,"hideAvatarSprites":false}}]`;
    if (!localStorage.themesv2 || override) localStorage.themesv2 = "[]";
    if (!localStorage.controls || override) localStorage.controls = "true";
    if (!localStorage.restrictLobby || override) localStorage.restrictLobby = "";
    if (!localStorage.qualityScale || override) localStorage.qualityScale = "1";
    if (!localStorage.palantir || override) localStorage.palantir = "true";
    if (!localStorage.typoink || override) localStorage.typoink = "false";
    if (!localStorage.typotoolbar || override) localStorage.typotoolbar = "true";
    if (!localStorage.inkMode || override) localStorage.inkMode = "thickness";
    if (!localStorage.sens || override) localStorage.sens = 50;
    if (!localStorage.charbar || override) localStorage.charbar = "true";
    if (!localStorage.agent || override) localStorage.agent = "false";
    if (!localStorage.sizeslider || override) localStorage.sizeslider = "false";
    if (!localStorage.emojipicker || override) localStorage.emojipicker = "true";
    if (!localStorage.drops || override) localStorage.drops = "true";
    if (!localStorage.zoomdraw || override) localStorage.zoomdraw = "true";
    if (!localStorage.drops || override) localStorage.drops = "true";
    if (!localStorage.dropmsgs || override) localStorage.dropmsgs = "true";
    if (!localStorage.quickreact || override) localStorage.quickreact = "true";
    if (!localStorage.chatcommands || override) localStorage.chatcommands = "true";
    if (!localStorage.vip || override) localStorage.vip = "[]";
    if (!localStorage.awardfx) localStorage.awardfx = "true";
    if (!localStorage.markup || override) localStorage.markup = "false";
    if (!localStorage.markupcolor || override) localStorage.markupcolor = "254";
    if (!localStorage.randominterval || override) localStorage.randominterval = 50;
    if (!localStorage.typotools || override) localStorage.typotools = "true";
    if (!localStorage.addedFilters || override) localStorage.addedFilters = "[]";
    if (!localStorage.palette || override) localStorage.palette = "originalPalette";
    if (!localStorage.lobbyStream || override) localStorage.lobbyStream = "{}";
    if (!localStorage.customPalettes || override) localStorage.customPalettes = '[{"rowCount":13, "name":"sketchfulPalette", "colors":[{"color":"rgb(255, 255, 255)","index":100},{"color":"rgb(211, 209, 210)","index":101},{"color":"rgb(247, 15, 15)","index":102},{"color":"rgb(255, 114, 0)","index":103},{"color":"rgb(252, 231, 0)","index":104},{"color":"rgb(2, 203, 0)","index":105},{"color":"rgb(1, 254, 148)","index":106},{"color":"rgb(5, 176, 255)","index":107},{"color":"rgb(34, 30, 205)","index":108},{"color":"rgb(163, 0, 189)","index":109},{"color":"rgb(204, 127, 173)","index":110},{"color":"rgb(253, 173, 136)","index":111},{"color":"rgb(158, 84, 37)","index":112},{"color":"rgb(81, 79, 84)","index":113},{"color":"rgb(169, 167, 168)","index":114},{"color":"rgb(174, 11, 0)","index":115},{"color":"rgb(200, 71, 6)","index":116},{"color":"rgb(236, 158, 6)","index":117},{"color":"rgb(0, 118, 18)","index":118},{"color":"rgb(4, 157, 111)","index":119},{"color":"rgb(0, 87, 157)","index":120},{"color":"rgb(15, 11, 150)","index":121},{"color":"rgb(110, 0, 131)","index":122},{"color":"rgb(166, 86, 115)","index":123},{"color":"rgb(227, 138, 94)","index":124},{"color":"rgb(94, 50, 13)","index":125},{"color":"rgb(0, 0, 0)","index":126},{"color":"rgb(130, 124, 128)","index":127},{"color":"rgb(87, 6, 12)","index":128},{"color":"rgb(139, 37, 0)","index":129},{"color":"rgb(158, 102, 0)","index":130},{"color":"rgb(0, 63, 0)","index":131},{"color":"rgb(0, 118, 106)","index":132},{"color":"rgb(0, 59, 117)","index":133},{"color":"rgb(14, 1, 81)","index":134},{"color":"rgb(60, 3, 80)","index":135},{"color":"rgb(115, 49, 77)","index":136},{"color":"rgb(209, 117, 78)","index":137},{"color":"rgb(66, 30, 6)","index":138}]}]';
    if (!Number(localStorage.qualityScale) || Number(localStorage.qualityScale) < 1) localStorage.qualityScale = 1;
}
258;

const hints = [
    "Hold shift to draw a perfect straight line! Double-press shift to make it snap horizontally / vertically.",
    "Connect the Palantir Discord bot to easily join your friend's lobbies.",
    "Enable the ImageAgent to show template pictures when you're drawing.",
    "Use arrow up/down to recover the last chat input.",
    "Enable 'typo tools' and click the dice to get a rainbow brush.<br>Click any color to abort.",
    "Change the markup color for your chat messages with the slider in the popup tab 'advanced'.",
    "Toggle your discord bot visibility in the extension popup.",
    "Get more colors by adding a custom palette in the popup tab 'advanced'.<br>Only extension users see those colors.",
    "When creating a private lobby, you can set a description which can be seen in the discord bot.",
    "Click the letter icon to share the current image directly to any of your Discord servers.",
    "Click the 'manage' button below your avatar to disconnect from Discord servers.",
    "To save a practise drawing in Typo Cloud Gallery, click the floppy disc icon and select 'In Typo Cloud'.",
    "Use emojis in the chat! To send one, type :emoji-name:",
    "Use like-- or shame-- to quickly like or dislike without having to grab your mouse.",
    "Remove drawings from ImageTools by right-clicking them.",
    "SPAMGUESS!!!1! - oh wait, you didn't click the input field. <br>Click TAB to quickly select the chatbox.",
    "Create masterpieces with the Don't Clear challenge - the canvas won't be cleared after your turn.<br>This is fun on custom rounds!",
    "Get artsy with the monochrome challenge - you can only select between a pair of colors!",
    "If you're feeling pro, try the one shot challenge. You have only one try to guess.",
    "With the deaf guess challenge, you can't see other's guesses (or typos) in the chat.",
    "To practise word blank spamming, use the blind guess challenge!",
    "Press STRG+C to copy the current drawing to the clipboard.",
    "To set a custom font, go to <a href='https://fonts.google.com/'>Google Fonts</a>, select a font and copy the bold text in the input field in the visual options.",
    "Click the magnifier icon to use a color picker! All Typo users can see the colors.",
    "Precision Work? Use the zoom feature!<br> [STRG + Click] to zoom to point, any number to set zoom level and leave with [STRG + Click].",
    "If you like the extension, tell others about it or rate it on the chrome store! <3",
    "Quickly switch colors by pressing 's'",
    "The game feels slow & lags after a time in the same lobby?<br>Use the command 'clr--' to clear old chat & make the game fast again.",
    "Use the quickreact-menu to like, dislike & kick with your keyboard!<br>You can access it by klicking 'CTRL' in the chat box.",
    "Want to share a chat snippet on Discord?<br>Select the messages and click 'Copy chat selection for Discord' to create a nicely formatted chat history.",
    "In practise, you can also paste .png to the skribbl canvas! To do so, click 'Paste Image' in Image Tools.",
    "To draw without time limit, click the avatar on the landing page!",
    "Want to kick someone without grabbing your mouse? Type 'kick--' to kick the current drawer or 'kick [id]--' to kick a player by their id! View IDs by pressing AltGr.",
    "Enable Typo-Pressure in the settings popup to draw in a beautiful full-size-range!",
    "Use the keys 1-5 to quickly set your brush size.",
    "Disable Typo-Panels in the visual settings to get a more vanilla look.",
    "Type 'newvision--' to view an image over the canvas as template!",
    "Click this box to see a new hint 👀",
    "Click the blue T-Icon next to the address bar or in the extension tray of your browser to adjust how typo works.",
    "Click the eye-icon at the top left to change your skribbl look.",
    "In the theme editor, you can quickly create a color theme with color presets.",
    "Check out themes from other people in the 'Browse Themes' tab!",
    "Skribbl themes made before April 2023 are only partially supported anymore.<br>You cant share, edit or delete them.",
    "In the theme overview, click 'manage' and share to send a theme to someone else. The other person just eneds to enter the code in the 'Browse Themes' tab.",
    "Don't forget to save your themes! They will be lost after a reload.",
    "Click the name of a person in the chat to open their player menu.",
    "Click the floppy disc icon and use 'As GIF' to save an animation of the drawing progress."
];

const changelogRawHTML =
    `<div style="width: 100%">
<h2>April 2023 - bugfixes and new themes</h2>
Surprise, a new update!
<ul>
<li>NEW THEMES!! It's now much easier to create stunning color themes. For the fancy ones, there are also even more options to adjust skribbl to the last detail.</li>
<li>You can now browse for other's themes and use them on the fly. If you want to submit your theme, ask about it on Discord!</li>
<li>GIF downloading is fully working again - Show off!</li>
<li>Random colors are working again</li>
<li>Updated the skribbl source code - skribbl had some smaller updates meanwhile, too!</li>
</ul>
<hr>
<h2>Smol additional update</h2>
Typo pressure is back! Use it as before with customizable sensitivity instead skribbl's pressure.<br>
The keys 1-5 can now be used to quickly select a brush size. Vision overlay, waiting for free slots in lobbies and some general improvements & bugfixes have been added.<br>
Tool shortcuts are also now trigggered by key-down, not key-up to keep the pace!<br>
<h2>November - A year later... new skribbl update!</h2>
The first huge skribbl update is finally here, after being discarded a year earlier.<br>
Many typo features that were planned to be released in Oct 2021 got rolled out during 2022 on old skribbl - like brush lab, gamemodes and the sprite cabin. <br>
Additional to that, there has been put a loooot of work in compatibility. <br>
A few things that have changed:
<ul>
<li>New lobby join  board</li>
<li>New lobby filter access</li>
<li>Features like mute, undo, word count, pressure sensitivity, lobby creation chat have been removed from typo because skribbl has them built-in </li>
<li>Lobby streaming has been removed</li>
<li>Color pipette is not available yet</li>
</ul>
If you miss any features from the old typo, hit me up - i might have just forgotten to add it!<br>
<hr>
<h2>Aaaaand some August-fixes</h2>
<ul>
<li>Added a size slider for picking a precise drawing brush thickness</li>
<li>Added many new toggles in the extension popup</li>
<li>Reworked backend applications to make everything faster & smoother</li>
<li>Chat doesn't jump when scrolled up</li>
</ul>
<hr>
<h2>July's quality-of-life update</h2>
Some small & medium fixes, improvements and additions: <br>
<ul>
<li>Quickreact-menu: when the chat input is focused, you can press "CTRL" and choose from kick, like & dislike with the arrow keys</li>
<li>Formatted chat: when you select text from the chat history, you can click the popup to get a nicely formatted chat protocol in your clipboard for pasting on Discord</li>
<li>Practise drawing: the option "paste image" allows you to paste a png to the skribbl canvas. This only works in practise!<br>
Choose the image and click while having the 1 key pressed to paste the image on the click position, click twice while having the 2 pressed to draw the image between the range of the clicks or click with 3 pressed to fill the canvas with the image</li>
<li>Pressure drawing is much smoother now for many people</li>
<li>Relative pressure mode: the brushsize is depending on pressure, but in a range relative to the selected size</li>
<li>Chat clear: type "clr--" to delete all except the last 50 messsages.<br>This fixes lags when you've been in a lobby for a long time.</li>
<li>A rare color picking bug is vanished now!</li>
</ul>
<hr>
<h2>April privacy update</h2>
<hr>
You can now control which of your connected discord servers see your lobby invite link. <br>
If you're the lobby owner or topmost player with Palantir, a lock icon is shown next to the timer in-game. <br>
Click the lock to set the lobby privacy. This will overrule the setting of every other lobby member. <br>
The lock indicates your privacy setting (red - public, green - restricted). <br>
<hr>
<h2>March update #3 - the fixes</h2>
<hr>
<ul>
<li>Fixed the left-time-choosing bar, which was only visible once</li>
<li>Added thousands of new emojis from dynamic sources.</li>
<li>Gallery Cloud works now with pixelate thumbnails.<br>
This results in a much better loading time and better server stability.</li>
<li>Added a message declaring the winner of a finished game in the chat</li>
<li>Fixed the tab-to-focus-chat thing behaving weird</li>
<li>Fixed some rare sprite bugs</li>
<li>Reduced extension permissions to the bare minimum</li>
<li>Fixed pressing ESC to close popups instead clearing the canvas</li>
<li>... and the lobby search should be even faster now</li>
</ul>
<hr>
<h2>March update #2</h2>
<hr>
<h3>Merged S's <a href='https://github.com/sbarrack/skribbl-community-scripts'>community script</a> features.</h3>
This includes 3 new gamemodes to make skribbl more challenging for you as well as keybinds for colors, brush sizes and some UI improvements!<br>
Toggle both features in the extension popup. 
<br>Kudos to S & and all involved contributors!
<br><h3>Lobby filters</h3>
Lobby filters enable you to exactly set at which lobbies you want the search to stop.<br>
To see & activate filters, click "Toggle Lobby Filter". As soon as you set the filter properties, click add. <br>
When the filter panel is visible, you can check filters you'd like to apply and click "Play" to search with them.<br>
Player Names & Palantir Users combine with "OR", other properties with "AND" and multiple active filters also combine with "AND".
<br><h3>Quality-Of-Life stuff</h3>
More tooltips (thanks S), prettier "player guessed word" indicator on custom themes and a visualizer of the left time to choose a word.
<hr>
<h2>Epic march update #1</h2>
<hr>
<h3>The fastest lobby search engine ever.</h3>
The all-new lobbycrawler jumps right through lobbies without reloading skribbl.<br>
With fair internet, 100+ lobbies per minute are possible - comparison: Old typo was tested with 20 lobbies/min, "frienddl" with 31/min and "Friend Finder" with 21 lobbies/min.<br>
<br><h3>Typo Gallery Cloud</h3>
For players who connected typo with palantir, every drawing in every lobby will be saved at the Typo Cloud Gallery for two weeks.<br>
Relieve the amazing lobby from yesterday, re-draw the image from last round etc etc - access the cloud at the "T"-icon at the top-left side. <br>
<br><h3>Skribbl Themes & Visual Options</h3>
There have been some darkmodes around, but you could never style skribbl exactly the way as you liked. <br>
Play around with Colors, Fonts, Custom Backgrounds and lots more by clicking the Eye-Icon on the top-left side.<br>
You can choose between preset themes or create your own - there are pretty powerful theming options by CSS-Injections; to get to know more about all options message tobeh.<br>
<br><h3>.. Emojis!!</h3>
I *bet* you missed your discord custom emojis; and so did I. <br>
Type <code>:</code> and the emoji name in the chat input field to use an emoji, just as in discord.<br>
Other typo users will see the emoji, the others just the emoji name.<br>
<br><h3>Quick tablet mode access</h3>
Among the other controls, you can now quickly select the tablet mode by clicking the tablet icon.<br>
Remember the colors drawn with brightness or degree are only visible to typo users.<br>
To access the options even faster, use the shortcut "T".<br>
<br><h3>Sprite slots</h3>
Use multiple sprites on your avatar!<br>
For every 1000 drops you'll get an additional slot.<br>
Slots are like layers; slot 1 is under slot 2 etc.<br>
<br><h3>Draw-Over mode</h3>
Draw over the image of the others by activating "Don't Clear" in the popup. <br>
This only makes sense in custom rounds where everyone has activated this option from the start. <br>
Credits for the idea go to some cool DS members.<br>
<br><h3>Mute Players</h3>
Mute someone by clicking their name - this will still show that they sent messages, but makes the content invisible.<br>
<br><h3> Copy images on the fly</h3>
Click STRG+C to copy the current image. <br>
This is disabled when the chat input is focused or some text is selected.<br>
<br><h3>Fullscreen Mode</h3>
Click the Resize-Icon on the top-left side to enter a fullscreen mode with more space for drawing and chatting.<br>
<br><h3>Straight lines</h3>
Click somewhere on the canvas, press ALT and click where you want the line to end - voila!<br>
<br><h3>In case you missed: Canvas zoom</h3>
Old but gold: STRG+Click anywhere on the canvas to zoom there.<br>
Click any number key to set the zoom level. Leave with STRG+Click.<br>
<br><h3>Custom lobby chat</h3>
When in the idle mode of a custom lobby, the chat is now shown.<br>
As long as the lobby is idle, only typo users see the chat. As soon as the game starts, everyone sees the sent messages.<br>
<br><h3>Chat commands</h3>
Use <code>kick--</code> <code>like--</code> <code>shame--</code> to quickly kick, like or dislike.<br>
<br><h3>That damn chat focus thing..</h3>
Clicking "TAB" will auto-focus the chat input.<br>
<br><br><h3>And of course... all known bugs were fixed.<h3>
</div>`;

const privacyRawHTML = `<div style="width:100%"><h4><a href="https://www.typo.rip/privacy">A more detailed privacy statement is available on https://www.typo.rip/privacy</a></h4><br>
    <code><h4>Without connecting Palantir, Typo will collect and store NO data.</h4>
    <h4>Collected data is ONLY used for feature-related purposes.</h4>
    <h5>However, for Palantir-features like Sprites, Discord Lobbies and Typo Gallery Cloud, collecting data is inevitable.</h5></code>
<br><h4>When Palantir isn't connected:</h4>
Typo will fetch some necessary data from the servers, but will NOT send ANY data back.<br>
This data are the online sprites as well as the current sprite ressources.<br>
<br><h4>When Palantir is connected, but Discord Bot Status disabled:</h4>
Typo fetches additionally to the above data all active lobbies of your connected Discord servers. <br>
Typo will NOT send any data of your lobby.<br>
Anyway, Typo Gallery is active which will send every drawing, its author,name and draw commands to the server.<br>
This data is ONLY visible to you and its only purpose is the Typo Gallery Cloud feature.<br>
<br><h4>When Palantir is connected and Discord Bot Status enabled:</h4>
Additionally to the above, typo will fetch drops from the server and display them.<br>
Typo will send your current lobby (players, points, link etc) to the server so that it can be displayed in Discord and your sprite is visible to others.<br>
You will be able to collect bubbles and drops.<br>
<br><h4>Where data is stored:</h4>
All data is stored on a private server and is only used for the typo features.<br>
No-one except you and the typo dev will have insight in the typo data.<br>
If you want to know more about your stored data, contact the typo dev.
</div>`;

// #content features/visuals.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const COLORS = Object.freeze({
    "--COLOR_PANEL_BG": [226, 85, 32, 0.75],
    "--COLOR_PANEL_LO": [226, 90, 27, 0.75],
    "--COLOR_PANEL_BUTTON": [226, 67, 49],
    "--COLOR_PANEL_BUTTON_HOVER": [226, 73, 43],
    "--COLOR_PANEL_BUTTON_ACTIVE": [226, 72, 41],
    "--COLOR_PANEL_HI": [226, 80, 44],
    "--COLOR_PANEL_FOCUS": [32, 85, 56],
    "--COLOR_PANEL_BORDER": [232, 85, 11],
    "--COLOR_PANEL_BORDER_FOCUS": [207, 98, 66],
    "--COLOR_PANEL_TEXT": [0, 0, 94],
    "--COLOR_PANEL_TEXT_FOCUS": [0, 0, 100],
    "--COLOR_PANEL_TEXT_PLACEHOLDER": [0, 0, 61],
    "--COLOR_TOOL_BASE": [0, 0, 100],
    "--COLOR_TOOL_HOVER": [0, 0, 77],
    "--COLOR_TOOL_TEXT": [0, 0, 0],
    "--COLOR_TOOL_SIZE_BASE": [0, 0, 100],
    "--COLOR_TOOL_SIZE_HOVER": [0, 0, 77],
    "--COLOR_TOOL_ACTIVE": [271, 77, 66],
    "--COLOR_TOOL_SIZE_ACTIVE": [271, 77, 66],
    "--COLOR_INPUT_BG": [0, 0, 100],
    "--COLOR_INPUT_HOVER": [0, 0, 100],
    "--COLOR_INPUT_TEXT": [0, 0, 17],
    "--COLOR_INPUT_BORDER": [0, 0, 44],
    "--COLOR_INPUT_BORDER_FOCUS": [207, 98, 66],
    "--COLOR_PLAYER_TEXT_BASE": [0, 0, 0],
    "--COLOR_PLAYER_ME": [214, 100, 64],
    "--COLOR_PLAYER_ME_GUESSED": [216, 100, 35],
    "--COLOR_PLAYER_BG_BASE": [0, 0, 100],
    "--COLOR_PLAYER_BG_ALT": [0, 0, 93],
    "--COLOR_PLAYER_BG_GUESSED_BASE": [113, 68, 58],
    "--COLOR_PLAYER_BG_GUESSED_ALT": [113, 57, 50],
    "--COLOR_TOOL_TIP_BG": [226, 100, 64],
    "--COLOR_GAMEBAR_TEXT": [0, 0, 0],
    "--COLOR_GAMEBAR_ROUND_TEXT": [0, 0, 0],
    "--COLOR_GAMEBAR_WORD_DESCRIPTION": [0, 0, 21],
    "--COLOR_TEXT_CANVAS_TRANSPARENT": [0, 0, 25],
    "--COLOR_CHAT_TEXT_BASE": [0, 0, 0],
    "--COLOR_CHAT_TEXT_GUESSED": [103, 68, 48],
    "--COLOR_CHAT_TEXT_CLOSE": [54, 100, 44],
    "--COLOR_CHAT_TEXT_DRAWING": [216, 60, 52],
    "--COLOR_CHAT_TEXT_JOIN": [103, 68, 48],
    "--COLOR_CHAT_TEXT_LEAVE": [21, 91, 42],
    "--COLOR_CHAT_TEXT_OWNER": [32, 100, 63],
    "--COLOR_CHAT_TEXT_GUESSCHAT": [86, 47, 46],
    "--COLOR_CHAT_BG_BASE": [0, 0, 100],
    "--COLOR_CHAT_BG_ALT": [0, 0, 93],
    "--COLOR_CHAT_SCROLLBAR": [0, 0, 49],
    "--COLOR_CHAT_SCROLLBAR_THUMB": [0, 0, 78],
    "--COLOR_CHAT_BG_GUESSED_BASE": [105, 100, 94],
    "--COLOR_CHAT_BG_GUESSED_ALT": [104, 100, 87],
    "--COLOR_CHAT_INPUT_COUNT": [0, 0, 0],
    "--COLOR_BUTTON_DANGER_BG": [44, 81, 51],
    "--COLOR_BUTTON_SUBMIT_BG": [110, 75, 55],
    "--COLOR_BUTTON_NORMAL_BG": [208, 80, 54],
    "--COLOR_BUTTON_DANGER_TEXT": [0, 0, 100],
    "--COLOR_BUTTON_SUBMIT_TEXT": [0, 0, 100],
    "--COLOR_BUTTON_NORMAL_TEXT": [0, 0, 100]
});

const copyColors = () => JSON.parse(JSON.stringify(COLORS));

const toColorCode = value => value.length == 3
    ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
    : `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;

const getEmptyTheme = () => ({
    colors: copyColors(),
    images: {
        urlLogo: "",
        urlBackground: "",
        urlBackgroundGame: "",
        backgroundRepeat: true,
        containerImages: "",
        containerImages: "",
        backgroundTint: "transparent"
    },
    misc: {
        fontStyle: "",
        hideFooter: false,
        hideTypoInfo: false,
        hideTypoPanels: false,
        hideAvatarLogo: false,
        hideInGameLogo: false,
        hideAvatarSprites: false,
        useOldNav: false,
        themeCssUrl: "",
        themeCss: "",
        hideMeta: false,
        cssText: "",
        htmlText: ""
    },
    hooks: Object.keys(COLORS).map(k => ({ color: k, css: "" })).reduce((acc, { color, css }) => {
        acc[color] = css;
        return acc;
    }, {})
});

/* thanks chatgpt :^ */
const getSelectorsWithVariables = (cssText, colorVariables) => {
    // Parse the CSS text using a DOM parser
    const parser = new DOMParser();
    const css = parser.parseFromString(`<style>${cssText}</style>`, 'text/html').querySelector('style');

    // Get all CSS rules from the stylesheet
    const rules = css.sheet.cssRules;

    // Initialize an empty object to store selectors for each variable
    const variableSelectors = {};

    // Iterate through each color variable to initialize empty arrays for each one
    colorVariables.forEach((colorVariable) => {
        variableSelectors[colorVariable] = [];
    });

    // Iterate through each rule to find selectors with variables
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        // Check if the rule is a CSSStyleRule (i.e., a selector with style properties)
        if (rule instanceof CSSStyleRule) {

            // Iterate through each style property to find variables
            for (let j = 0; j < rule.style.length; j++) {
                const propertyName = rule.style[j];
                const propertyValue = rule.style.getPropertyValue(propertyName);

                // Check if the property value contains any of the color variables
                colorVariables.forEach((colorVariable) => {
                    if (propertyValue.includes(`var(${colorVariable}`)) {
                        variableSelectors[colorVariable].push(rule.selectorText);
                    }
                });
            }
        }
    }

    // Return an object with color variables as keys and an array of selectors where they are used as the value
    return variableSelectors;
}

let SKRIBBL_HOOKS = localStorage.cache_skribbl_hooks ? JSON.parse(localStorage.cache_skribbl_hooks) : {};
(async () => {
    const style = await (await fetch("/css/style.css")).text();
    SKRIBBL_HOOKS = getSelectorsWithVariables(style, Object.keys(COLORS));
    localStorage.cache_skribbl_hooks = JSON.stringify(SKRIBBL_HOOKS);
})()


const simpleThemeColors = (mainHsl, textHsl, useIngame = false, useInputs = false, invertInputText = true) => {
    const theme = copyColors();

    /* modify main elements */
    const mainHueBase = 226;
    const mainSatBase = 85;
    const mainLigBase = 32;
    const mainOpBase = 0.75;

    if (mainHsl) {
        const mainHue = mainHsl[0];
        const mainSat = mainHsl[1];
        const mainLig = mainHsl[2];
        const mains = [
            "--COLOR_PANEL_BG",
            "--COLOR_PANEL_LO",
            "--COLOR_PANEL_BUTTON",
            "--COLOR_PANEL_BUTTON_HOVER",
            "--COLOR_PANEL_BUTTON_ACTIVE",
            "--COLOR_PANEL_HI",
            "--COLOR_PANEL_FOCUS",
            "--COLOR_PANEL_BORDER",
            "--COLOR_TOOL_TIP_BG"
        ];
        mains.forEach(k => theme[k][0] = (theme[k][0] - mainHueBase + mainHue) % 360);
        mains.forEach(k => theme[k][1] = theme[k][1] * (mainSat / 100));
        mains.forEach(k => theme[k][2] = theme[k][2] * (mainLig / 100));
        theme["--COLOR_CHAT_SCROLLBAR"] = [...theme["--COLOR_PANEL_LO"]];
        theme["--COLOR_CHAT_SCROLLBAR_THUMB"] = [...theme["--COLOR_PANEL_HI"]];

        if (useIngame) {
            const themeSat = mainSatBase * (mainSat / 100);
            const themeLight = mainLigBase * (mainLig / 100);
            theme["--COLOR_CHAT_BG_BASE"] = [mainHue, themeSat, themeLight, mainOpBase];
            theme["--COLOR_CHAT_BG_ALT"] = [mainHue, themeSat, themeLight - 7, mainOpBase];
            theme["--COLOR_PLAYER_BG_BASE"] = [mainHue, themeSat, themeLight, mainOpBase];
            theme["--COLOR_PLAYER_BG_ALT"] = [mainHue, themeSat, themeLight - 7, mainOpBase];
        }

        if (useInputs) {
            theme["--COLOR_INPUT_BORDER"] = [mainHue, mainSatBase, 75 * (mainLigBase / 100), 0.4];
            theme["--COLOR_INPUT_BORDER_FOCUS"] = [mainHue, mainSatBase, 85 * (mainLigBase / 100), 0.4];
            theme["--COLOR_INPUT_BG"] = [mainHue, mainSatBase, 80 * (mainLigBase / 100), 0.3];
            theme["--COLOR_INPUT_HOVER"] = [mainHue, mainSatBase, 90 * (mainLigBase / 100), 0.3];
        }
    }

    /* modify text */
    if (textHsl) {
        const texts = [
            "--COLOR_GAMEBAR_TEXT",
            "--COLOR_GAMEBAR_ROUND_TEXT",
            "--COLOR_PLAYER_TEXT_BASE",
            "--COLOR_CHAT_TEXT_BASE",
            "--COLOR_INPUT_TEXT",
            "--COLOR_PANEL_TEXT"
        ];
        texts.forEach(k => theme[k] = [...textHsl]);
        theme["--COLOR_PANEL_TEXT_PLACEHOLDER"] = [textHsl[0], textHsl[1], textHsl[2] - 50];
        theme["--COLOR_GAMEBAR_WORD_DESCRIPTION"] = [textHsl[0], textHsl[1], textHsl[2], 0.7];
        if (invertInputText) theme["--COLOR_INPUT_TEXT"][2] = 100 - theme["--COLOR_INPUT_TEXT"][2];
    }
    return theme;
}

// inits the image options bar
// dependend on: genericfunctions.js
const visuals = {
    themes: [],
    form: undefined,
    getElem: undefined,
    shareTheme: async (theme) => {

        const response = await typoApiFetch("themes/share", "POST", {}, theme);
        return response.id;
    },
    refreshThemeBrowser: () => {
        (async () => {
            const merge = (a, b) => {
                for (let key in b) {
                    if (b.hasOwnProperty(key)) {
                        if (!a.hasOwnProperty(key)) {
                            a[key] = b[key];
                        } else if (typeof b[key] === 'object' && typeof a[key] === 'object') {
                            merge(a[key], b[key]);
                        }
                    }
                }
                return a;
            }

            const themes = await typoApiFetch("themes");

            /* update themes */

            for (let t of themes) {
                let added = visuals.themes.find(theme => theme.meta.id == t.id);
                if (added && added.meta.version && added.meta.version < t.version) {
                    let updated = await typoApiFetch("themes/" + t.id);

                    const defaults = getEmptyTheme();
                    const merged = merge(updated, defaults);
                    merged.meta.version = t.version;
                    merged.meta.id = t.id;
                    visuals.themes = [merged, ...visuals.themes.filter(theme => theme.meta.id != t.id)];
                    localStorage.themesv2 = JSON.stringify(visuals.themes);
                }
            }

            /* add list */

            const container = visuals.getElem("#themeBrowser");
            container.innerHTML = "";
            themes.forEach(t => {
                const added = visuals.themes.some(a => a.meta.id == t.id);
                const entry = elemFromString(`<div class="theme">
                    <div><b>${t.name}</b> by ${t.author}</div>
                    <div>${t.downloads} Downloads</div>
                    <button ${added ? "disabled" : ""} class="flatUI green min air downloadTheme">${!added ? "Download" : "Added"} </button>
                    <div>v${t.version}</div>
                </div>
                `);
                container.appendChild(entry);
                entry.querySelector(".downloadTheme").addEventListener("click", async () => {

                    const theme = await typoApiFetch("themes/" + t.id + "/use");

                    const defaults = getEmptyTheme();
                    const merged = merge(theme, defaults);
                    merged.meta.type = "onlineTheme";
                    merged.meta.version = t.version;
                    merged.meta.id = t.id;
                    visuals.applyOptions(merged);
                    localStorage.activeTheme = merged.meta.id;
                    localStorage.visualOptions = undefined;
                    visuals.saveTheme(merged, "");
                    new Toast("Theme has been imported!");
                    visuals.refreshThemeBrowser();
                });
            });
        })()
    },
    refreshThemeContainer: () => {
        const manage = visuals.getElem(".body .manage");
        manage.innerHTML = "";
        visuals.themes.forEach(theme => {
            const entry = elemFromString(`<div class="theme">
                <div><b>${theme.meta.name}</b> by ${theme.meta.author}</div>
                <div>${theme.meta.type == "theme" ? "Local Theme" : "Online Theme"}</div>
                <button class="flatUI green min air toggleTheme">${localStorage.activeTheme != undefined && localStorage.activeTheme == theme.meta.id ? "Disable" : "Use"}</button>
                <button ${theme.meta.id == 0 ? "disabled" : ""}  class="flatUI orange min air manageTheme"></button>

                <div style="grid-column: span all" class="manageSection">
                    <button class="flatUI orange min air deleteTheme">Delete</button>
                    <button class="flatUI blue min air editTheme" ${theme.meta.id == 0 || theme.meta.type != "theme" ? "disabled" : ""}>Edit</button>
                    <button class="flatUI blue min air shareTheme" ${theme.meta.id == 0 || theme.meta.type != "theme" ? "disabled" : ""}>Share</button>
                    <button class="flatUI blue min air renameTheme" ${theme.meta.id == 0 || theme.meta.type != "theme" ? "disabled" : ""}>Rename</button>
                </div>
            </div>
            `);
            manage.appendChild(entry);
            entry.querySelector(".toggleTheme").addEventListener("click", () => {
                if (Number(localStorage.activeTheme) !== theme.meta.id) visuals.applyOptions(theme);
                else {
                    visuals.applyOptions(visuals.themes.find(t => t.meta.id == 0));
                    localStorage.activeTheme = undefined;
                }
                localStorage.visualOptions = undefined;
                visuals.refreshThemeContainer();
            });
            entry.querySelector(".deleteTheme").addEventListener("click", () => {
                const result = confirm("Delete theme " + theme.meta.name + "?");
                if (!result) return;
                visuals.deleteTheme(theme.meta.id);
                visuals.applyOptions(visuals.themes.find(t => t.meta.id == 0));
            });
            entry.querySelector(".editTheme").addEventListener("click", () => {
                visuals.loadThemeToEditor(theme.meta.id, true);
            });
            entry.querySelector(".manageTheme").addEventListener("click", () => {
                entry.classList.toggle("manage");
            });
            entry.querySelector(".renameTheme").addEventListener("click", () => {
                const name = prompt("Enter the new name");
                if (name && name.length > 0) {
                    visuals.themes.forEach(t => {
                        if (t.meta.id == theme.meta.id) t.meta.name = name;
                    });
                    localStorage.themesv2 = JSON.stringify(visuals.themes);
                    visuals.refreshThemeContainer();
                }
            });
            entry.querySelector(".shareTheme").addEventListener("click", async () => {
                let url = await visuals.shareTheme(theme);
                new Toast("Share ID copied to clipboard! Use it in the 'Browse Themes' tab");
                navigator.clipboard.writeText(url);

            });
        });

        const oldThemes = JSON.parse(localStorage.themes ? localStorage.themes : "[]");
        oldThemes.forEach(theme => {
            const entry = elemFromString(`<div class="oldtheme">
            <div><b>${theme.name}</b></div>
            <div>Old Theme</div>
            <button class="flatUI green min air">Apply</button>
            <br>
            <br>
            `);
            manage.appendChild(entry);
            entry.querySelector(".green").addEventListener("click", () => {
                localStorage.visualOptions = JSON.stringify(theme.options);
                localStorage.activeTheme = undefined;
                visuals.applyOldOptions(theme.options);
                visuals.refreshThemeContainer();
            });
        });
    },
    mainPickers: { primary: undefined, text: undefined, tint: undefined },
    currentEditor: getEmptyTheme(),
    saveTheme: (theme, name) => {
        let creator = socket?.data?.user?.member?.UserName;
        if (!creator) creator = QS(".input-name").value;
        if (!creator) creator = "Unknown";
        if (!theme.meta) {
            theme.meta = {
                author: creator,
                created: Date.now(),
                type: "theme",
                id: Date.now(),
                name: name
            }
        }
        visuals.themes = visuals.themes.filter(t => t.meta.id != theme.meta.id);
        visuals.themes = [theme, ...visuals.themes];
        localStorage.themesv2 = JSON.stringify(visuals.themes.filter(t => t.meta.id > 0 || t.meta.type == "onlineTheme"));
        visuals.refreshThemeContainer();
        visuals.getElem(".menu .manage").click();
    },
    deleteTheme: (id) => {
        visuals.themes = visuals.themes.filter(t => t.meta.id != id);
        localStorage.themesv2 = JSON.stringify(visuals.themes);
        visuals.refreshThemeContainer();
    },
    loadThemeToEditor: (id, apply = true) => {
        let theme = visuals.themes.find(t => t.meta.id === id);
        if (!theme) theme = getEmptyTheme();
        theme = JSON.parse(JSON.stringify(theme));
        visuals.getElem(".menu .create").click();
        visuals.currentEditor = theme;
        visuals.getElem("#themeName").disabled = theme.meta?.id ? true : false;
        visuals.getElem(".themeColor").style.display = theme.meta?.id ? "none" : "grid";
        visuals.getElem(".textColor").style.display = theme.meta?.id ? "none" : "grid";
        visuals.getElem("#themeName").value = theme.meta?.name ? theme.meta.name : "";

        /* load normal input values */
        [...visuals.form.querySelectorAll(".imageSettings input, .proSettings input")].forEach(elem => {
            switch (elem.id) {
                case "urlLogo":
                    elem.value = theme.images.urlLogo;
                    break;
                case "urlBackground":
                    elem.value = theme.images.urlBackground;
                    break;
                case "urlBackgroundGame":
                    elem.value = theme.images.urlBackgroundGame;
                    break;
                case "containerImages":
                    elem.value = theme.images.containerImages;
                    break;
                case "fontStyle":
                    elem.value = theme.misc.fontStyle;
                    break;
                case "cssText":
                    elem.value = theme.misc.cssText;
                    break;
                case "htmlText":
                    elem.value = theme.misc.htmlText;
                    break;
                case "cssUrl":
                    elem.value = theme.misc.themeCssUrl;
                    break;
                case "hideFooter":
                    elem.checked = theme.misc.hideFooter;
                    break;
                case "hideTypoInfo":
                    elem.checked = theme.misc.hideTypoInfo;
                    break;
                case "hideTypoPanels":
                    elem.checked = theme.misc.hideTypoPanels;
                    break;
                case "hideAvatarLogo":
                    elem.checked = theme.misc.hideAvatarLogo;
                    break;
                case "hideInGameLogo":
                    elem.checked = theme.misc.hideInGameLogo;
                    break;
                case "hideAvatarSprites":
                    elem.checked = theme.misc.hideAvatarSprites;
                    break;
                case "hideMeta":
                    elem.checked = theme.misc.hideMeta;
                    break;
                case "backgroundRepeat":
                    elem.checked = theme.images.backgroundRepeat;
                    break;
                case "useOldNav":
                    elem.checked = theme.misc.useOldNav;
                    break;
            }
        });

        /* reset main pickers rgb(193,204,255)*/
        visuals.getElem("#primaryColorPicker").removeAttribute("data-color");
        visuals.getElem("#primaryColorPicker").style.backgroundColor = "blue";

        visuals.getElem("#textColorPicker").removeAttribute("data-color");
        visuals.getElem("#textColorPicker").style.backgroundColor = "blue";

        visuals.getElem("#backgroundTintPicker").removeAttribute("data-color");
        visuals.getElem("#backgroundTintPicker").style.backgroundColor = theme.images.backgroundTint != "transparent" ? theme.images.backgroundTint : "blue";

        visuals.getElem("#enableBackgroundTint").checked = theme.images.backgroundTint != "transparent";

        /* load color inits */
        visuals.form.querySelectorAll(".body .picker").forEach(p => {
            p.style.backgroundColor = toColorCode(theme.colors[p.id]);
            p.setAttribute("data-color", JSON.stringify(theme.colors[p.id]));
        });

        /* load hooks */
        [...visuals.form.querySelectorAll(".styleHookInput")].forEach(hook => {
            const id = hook.getAttribute("data-hook");
            hook.value = theme.hooks && theme.hooks[id] ? theme.hooks[id] : "";
        });

        if (apply) visuals.applyOptions(visuals.currentEditor);
    },
    html: `<div class="themesv2 manage">
        <div class="menu">
            <div class="manage">Select Theme</div>
            <div class="create">Theme Editor</div>
            <div class="add">Browse Themes</div>
        </div>

        <div class="body">
            <div class="manage">

            </div>
            
            <div class="create">
                
                <div class="themeName" style="display: grid; grid-template-columns: 1fr 3fr 2fr 1fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" for="themeName">Theme Name:</label>
                    <input placeholder="Name your theme" type="text" id="themeName" name="themeName" style="width: auto">
                    <button id="saveTheme" style="width: fit-content" class="flatUI blue min air">Save Theme</button>
                    <button id="resetTheme" style="width: fit-content" class="flatUI orange min air">Reset</button>
                </div>

                <div class="themeColor" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Primary Color:</label>
                    <div id="primaryColorPicker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%; background: blue;"></div>
                    <label class="checkbox"><input type="checkbox" class="" id="useThemeInputs"> <div>Use on Input fields</div></label>
                    <label class="checkbox"><input type="checkbox" class="" id="useThemeIngame"> <div>Use ingame</div></label>
                </div>

                <div class="textColor" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Text Color:</label>
                    <div id="textColorPicker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%; background: blue;"></div>
                    <label class="checkbox" style="grid-column: span 2"><input type="checkbox" class="" id="invertText"> <div>Invert text brightness in input fields</div></label>
                </div>

                <div class="backgroundTint" style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" >Background Color Tint:</label>
                    <div id="backgroundTintPicker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%; background: blue;"></div>
                    <label class="checkbox" style="grid-column: span 2"><input type="checkbox" class="" id="enableBackgroundTint"> <div>Tint background image with color</div></label>
                </div>

                <br><br>

                <details class="imageSettings">
                    <summary>Image Settings</summary>
                    <br>
                    <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 1em 3em;'>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Skribbl-Logo Image 
                            <input type='text' id='urlLogo' placeholder='https://link.here/image.gif'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Background-Image 
                            <input type='text' id='urlBackground' placeholder='https://link.here/image.gif'>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="backgroundRepeat"> 
                            <div>Repeat Background</div>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            In-Game Background Image
                            <input type='text' id='urlBackgroundGame' placeholder='https://link.here/image.gif'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Container Background
                            <input type='text' id='containerImages' placeholder='https://link.here/image.gif'>
                        </label>

                    </div>
                    <br>
                </details>

                <details class="colorPickers">
                    <summary>Advanced Color Settings</summary>
                    <br>
                    <div><b>Warning:</b> All colors will be reset if you change the Theme Primary Color.</div>
                    <div id="colorSwatchesTheme" style="display: grid; grid-gap: .5em 1em; grid-template-columns: 3fr 2fr; padding: 1em;">
                        ${Object.keys(COLORS).map(key => `<div>${key.replaceAll("-", "").replaceAll("_", " ")}</div><div class="picker" style="cursor:pointer; width: 2em; height: 2em; border-radius: 100%;background-color: ${toColorCode(COLORS[key])}" data-color="${JSON.stringify(COLORS[key])}" id=${key}></div>`).join("")}
                    </div>
                    <br>
                </details>

                <details class="proSettings">
                    <summary>Miscellaneous</summary>
                    <br>
                    <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 1em 3em;'>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            Use Google Font 
                            <input type='text' id='fontStyle' placeholder='Google Fonts import Link'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em;">
                            External CSS URL
                            <input type='text' id='cssUrl' placeholder='https://link.here/style.css'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em; grid-column: span 2">
                            Plain CSS Injection
                            <input type='text' id='cssText' placeholder='.logo-big { display: none !Important; }'>
                        </label>

                        <label style="display:flex; flex-direction: column; gap: .5em; grid-column: span 2">
                            Plain HTML Injection
                            <input type='text' id='htmlText' placeholder='<div>hello there</div>'>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideFooter"> 
                            <div>Hide footer</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideMeta"> 
                            <div>Hide About, News & How-To</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideTypoPanels"> 
                            <div>Hide Typo panels</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideTypoInfo"> 
                            <div>Hide Typo user stats</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideAvatarLogo"> 
                            <div>Hide avatars beyond logo</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideInGameLogo"> 
                            <div>Hide in-game logo</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="hideAvatarSprites"> 
                            <div>Hide sprites on home page</div>
                        </label>

                        <label class="checkbox">
                            <input type="checkbox" class="" id="useOldNav"> 
                            <div>Use the old lobby navigation</div>
                        </label>
                    </div>

                    <br>
                </details>

                <details class="skribblHooks">
                    <summary>Skribbl Style Hooks</summary>
                    <br>
                    <div>
                        Skribbl style hooks allow more advanced CSS styling without having to dig through the skribbl css classes.<br>
                        The CSS you write will be applied wherever the skribbl color variable is used.
                    </div>
                    <br>
                    <div style="display: grid; grid-gap: .5em 1em; grid-template-columns: 1fr 3fr; padding: 1em;">
                        ${Object.keys(COLORS).map(key => `<div>${key.replaceAll("-", "").replaceAll("_", " ")}</div><input class="styleHookInput" data-hook="${key}" id="styleHook${key}" type='text' id='cssUrl' placeholder='background: green; border: 2px solid red;'>`).join("")}
                    </div>
                    <br>
                </details>

            </div>
            
            <div class="add">

                <div class="themeUrlImport" style="display: grid; grid-template-columns: 1fr 3fr 1fr; align-items: center; gap: 1em;">
                    <label style="font-weight: bold" for="themeShareLink">Theme Share ID:</label>
                    <input placeholder="Ask a friend to share their theme" type="text" id="themeShareLink" name="themeShareLink" style="width: auto">
                    <button id="themeShareLinkSubmit" style="width: fit-content" class="flatUI blue min air">Load Theme</button>
                </div>
                <br>

                <div id="themeBrowser" style="display:flex; flex-direction:column; gap: .8em;">
                </div>

            </div>
        </div>    
    </div>
    `,
    init: () => {

        /* fill themes with missing values */
        const merge = (a, b) => {
            for (let key in b) {
                if (b.hasOwnProperty(key)) {
                    if (!a.hasOwnProperty(key)) {
                        a[key] = b[key];
                    } else if (typeof b[key] === 'object' && typeof a[key] === 'object') {
                        merge(a[key], b[key]);
                    }
                }
            }
            return a;
        }
        const local = JSON.parse(localStorage.themesv2 ? localStorage.themesv2 : "[]");
        local.forEach(t => {
            const defaults = getEmptyTheme();
            const merged = merge(t, defaults);
            visuals.themes.push(merged);
        });

        visuals.themes.push({ ...getEmptyTheme(), meta: { name: "Original Theme", author: "Mel", type: "theme", id: 0, created: 0 } });
        visuals.form = elemFromString(visuals.html);
        const elem = visuals.getElem = selector => visuals.form.querySelector(selector);
        const setContent = mode => {
            visuals.form.classList.toggle("add", mode == "add");
            visuals.form.classList.toggle("manage", mode == "manage");
            visuals.form.classList.toggle("create", mode == "create");
        };

        elem(".menu .add").addEventListener("click", () => setContent("add"));
        elem(".menu .manage").addEventListener("click", () => setContent("manage"));
        elem(".menu .create").addEventListener("click", () => setContent("create"));


        /* add lsiteners to other inputs */
        const inputChanged = elem => {
            switch (elem.id) {
                case "urlLogo":
                    visuals.currentEditor.images.urlLogo = elem.value;
                    break;
                case "urlBackground":
                    visuals.currentEditor.images.urlBackground = elem.value;
                    break;
                case "urlBackgroundGame":
                    visuals.currentEditor.images.urlBackgroundGame = elem.value;
                    break;
                case "containerImages":
                    visuals.currentEditor.images.containerImages = elem.value;
                    break;
                case "fontStyle":
                    const regex = /\?family=([^&]*)/;
                    const match = elem.value.match(regex);
                    visuals.currentEditor.misc.fontStyle = match ? match[1] : elem.value;
                    break;
                case "cssUrl":
                    visuals.currentEditor.misc.themeCssUrl = elem.value;
                    break;
                case "cssText":
                    visuals.currentEditor.misc.cssText = elem.value;
                    break;
                case "htmlText":
                    visuals.currentEditor.misc.htmlText = elem.value;
                    break;
                case "hideFooter":
                    visuals.currentEditor.misc.hideFooter = elem.checked;
                    break;
                case "hideTypoInfo":
                    visuals.currentEditor.misc.hideTypoInfo = elem.checked;
                    break;
                case "hideTypoPanels":
                    visuals.currentEditor.misc.hideTypoPanels = elem.checked;
                    break;
                case "hideAvatarLogo":
                    visuals.currentEditor.misc.hideAvatarLogo = elem.checked;
                    break;
                case "hideInGameLogo":
                    visuals.currentEditor.misc.hideInGameLogo = elem.checked;
                    break;
                case "hideAvatarSprites":
                    visuals.currentEditor.misc.hideAvatarSprites = elem.checked;
                    break;
                case "hideMeta":
                    visuals.currentEditor.misc.hideMeta = elem.checked;
                    break;
                case "backgroundRepeat":
                    visuals.currentEditor.images.backgroundRepeat = elem.checked;
                    break;
                case "useOldNav":
                    visuals.currentEditor.misc.useOldNav = elem.checked;
                    break;
            }
            visuals.applyOptions(visuals.currentEditor);
        }

        [...visuals.form.querySelectorAll(".imageSettings input, .proSettings input")].forEach(elem => {
            elem.addEventListener("input", () => { inputChanged(elem); });
        });

        /* setup pickers, ugh */
        const createPicker = (element, change, button = true, transparency = false, defaultCol = "rgb(193,204,255)") => {
            const pickr = Pickr.create({
                el: element,
                useAsButton: button,
                lockOpacity: !transparency,
                theme: 'nano',
                autoReposition: true,
                default: defaultCol,
                comparison: false,
                components: {
                    // Main components
                    preview: true,
                    hue: true,
                    opacity: transparency,
                    // Input / output Options
                    interaction: {
                        input: true,
                        save: true
                    }
                }
            });
            pickr.on("change", color => {
                change(color);
            });
            return pickr;
        }

        /* setup hooks */
        [...visuals.form.querySelectorAll(".styleHookInput")].forEach(hook => {
            const id = hook.getAttribute("data-hook");
            hook.addEventListener("input", () => {
                visuals.currentEditor.hooks[id] = hook.value;
                visuals.applyOptions(visuals.currentEditor);
            });
        });

        /* init detail pickers */
        const showPicker = (entry) => {
            const picker = createPicker(entry.elem, (c) => { setColor(c, entry.elem.id); }, true, true, toColorCode(visuals.currentEditor.colors[entry.id]));
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        };

        const pickers = [];
        [...visuals.form.querySelectorAll(".colorPickers .picker")].forEach(elem => {
            let entry = { id: elem.id, elem: elem };
            pickers.push(entry);
            elem.addEventListener("click", () => showPicker(entry))
        });

        const setColor = (color, id) => {
            visuals.currentEditor.colors[id] = color.toHSLA();
            updateColors();
            visuals.applyOptions(visuals.currentEditor);
        }

        const updateColors = () => {
            pickers.forEach(picker => {
                picker.elem.style.backgroundColor = toColorCode(visuals.currentEditor.colors[picker.id]);
                picker.elem.setAttribute("data-color", JSON.stringify(visuals.currentEditor.colors[picker.id]));
            });
        }

        /* create primary pickers */
        let primaryColor = undefined;
        let textColor = undefined;
        const updateSimple = () => {
            visuals.currentEditor.colors = simpleThemeColors(primaryColor, textColor,
                visuals.getElem("#useThemeIngame").checked,
                visuals.getElem("#useThemeInputs").checked,
                visuals.getElem("#invertText").checked
            );
            visuals.applyOptions(visuals.currentEditor);
            updateColors();
        }

        /* set primary color picker */
        visuals.getElem("#primaryColorPicker").addEventListener("click", (e) => {
            let color = JSON.parse(e.target.getAttribute("data-color"));
            const picker = createPicker(e.target, color => {
                primaryColor = color.toHSLA().slice(0, 3);
                e.target.setAttribute("data-color", JSON.stringify(primaryColor));
                e.target.style.backgroundColor = toColorCode(primaryColor);
                updateSimple();
            }, true, false, color ? toColorCode(color) : undefined);
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        });

        /* set text color picker */
        visuals.getElem("#textColorPicker").addEventListener("click", (e) => {
            let color = JSON.parse(e.target.getAttribute("data-color"));
            const picker = createPicker(e.target, color => {
                textColor = color.toHSLA().slice(0, 3);
                e.target.setAttribute("data-color", JSON.stringify(textColor));
                e.target.style.backgroundColor = toColorCode(textColor);
                updateSimple();
            }, true, false, color ? toColorCode(color) : undefined);
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        });

        /* set tint color picker */
        visuals.getElem("#backgroundTintPicker").addEventListener("click", (e) => {
            let color = JSON.parse(e.target.getAttribute("data-color"));
            const picker = createPicker(e.target, color => {
                tintColor = color.toHSLA();
                e.target.setAttribute("data-color", JSON.stringify(tintColor));
                e.target.style.backgroundColor = toColorCode(tintColor);
                visuals.currentEditor.images.backgroundTint = toColorCode(tintColor);
                visuals.getElem("#enableBackgroundTint").checked = true;
                visuals.applyOptions(visuals.currentEditor);
            }, true, false, color ? toColorCode(color) : undefined);
            picker.show();
            picker.on("hide", instance => instance.destroyAndRemove());
        });

        visuals.getElem("#useThemeIngame").addEventListener("input", () => updateSimple());
        visuals.getElem("#useThemeInputs").addEventListener("input", () => updateSimple());
        visuals.getElem("#invertText").addEventListener("input", () => updateSimple());
        visuals.getElem("#enableBackgroundTint").addEventListener("input", (event) => {
            let checked = event.target.checked;
            let current = visuals.getElem("#backgroundTintPicker").getAttribute("data-color");
            if (!checked || !current) visuals.currentEditor.images.backgroundTint = "transparent";
            else visuals.currentEditor.images.backgroundTint = toColorCode(JSON.parse(current));
            visuals.applyOptions(visuals.currentEditor);
        });

        visuals.refreshThemeContainer();

        /*  save handler */
        elem("#saveTheme").addEventListener("click", () => {
            const name = elem("#themeName").value;
            if (name == "") name = "New Theme";

            const theme = JSON.parse(JSON.stringify(visuals.currentEditor));
            visuals.loadThemeToEditor("", false);
            visuals.saveTheme(theme, name);
            primaryColor = undefined;
            textColor = undefined;
        });

        /*  reset handler */
        elem("#resetTheme").addEventListener("click", () => {
            localStorage.activeTheme = undefined;
            localStorage.activeOldTheme = undefined;
            visuals.loadThemeToEditor("", true);
            localStorage.activeTheme = undefined;
            visuals.refreshThemeContainer();
            primaryColor = undefined;
            textColor = undefined;
        });

        /*  import handler */
        elem("#themeShareLinkSubmit").addEventListener("click", async () => {
            elem("#themeShareLinkSubmit").disabled = true;
            elem("#themeShareLinkSubmit").innerText = "Loading...";
            try {
                let link = elem("#themeShareLink").value;
                let id = link.split("/").reverse()[0];
                let theme = await typoApiFetch("themes/" + id);

                const defaults = getEmptyTheme();
                const merged = merge(theme, defaults);
                visuals.applyOptions(merged);
                localStorage.activeTheme = merged.meta.id;
                localStorage.visualOptions = undefined;
                visuals.saveTheme(merged, "");
                new Toast("Theme has been imported!");
            }
            catch (e) {
                console.log(e);
                new Toast("Theme could not be loaded...");
            }
            elem("#themeShareLinkSubmit").disabled = false;
            elem("#themeShareLinkSubmit").innerText = "Load Theme";
        });

        /* add theme browser */
        visuals.refreshThemeBrowser();

    },
    show: () => {
        const onclose = () => {

        };
        new Modal(visuals.form, onclose, "Skribbl Themes");
    },
    loadActiveTheme: () => {
        let active = localStorage.activeTheme;
        let theme = visuals.themes.find(t => t.meta.id == active);
        if (theme && active != undefined) visuals.applyOptions(theme);
        else if (localStorage.visualOptions != undefined) {
            visuals.applyOldOptions(JSON.parse(localStorage.visualOptions));
        }
        visuals.refreshThemeContainer();
    },
    applyOldOptions: (options) => {

        /* remove old visual rules */
        QS("#visualRules")?.remove();
        QS(".fontImport")?.remove();
        QS("#injectionElems")?.remove();
        QS("#typoThemeBg")?.remove();
        QS("#typoThemeExternal")?.remove();
        QS("#typoThemeFont")?.remove();
        QS("#typo_theme_style")?.remove();
        [...QSA(".typo_theme_injection_element")].forEach(elem => elem.remove());

        let style = document.createElement("style");
        style.id = "visualRules";
        let urlBackground = options["urlBackground"] ? options["urlBackground"].trim() : "";
        if (urlBackground != "") style.innerHTML += "html:is([data-theme=dark], [data-theme='']) body {background: url(" + urlBackground + ")}";

        let urlBackgroundGame = options["urlBackgroundGame"] ? options["urlBackgroundGame"].trim() : "";
        if (urlBackgroundGame != "") {
            style.innerHTML += "#game:not([style='display: none;'])::after{position:fixed; content: ''; left:0; top:0; width:100%; height:100%;z-index:-1; background: url("
                + urlBackgroundGame + ")}";
            //style.innerHTML += "#screenLoading:not([style='display: none;'])::before{position:fixed; content: ''; left:0; top:0; bottom:0; right:0;z-index:1; background-image:inherit; background-repeat: inherit; background-position:inherit;} ";
        }

        let urlLogo = options["urlLogo"] ? options["urlLogo"].trim() : "";
        if (QS("div.logo-big img")) {
            QS("div.logo-big img").src = urlLogo != "" ? urlLogo : "img/logo.gif";
            style.innerHTML += `div.logo-big img {max-height:20vh}`;
        }
        if (QS("#game #game-logo img")) QS("#game #game-logo img").src = urlLogo != "" ? urlLogo : "img/logo.gif";

        if (options["containerBackgroundsCheck"] == true) {

            let val = options["containerBackgrounds"] ? options["containerBackgrounds"].trim() : "";
            style.innerHTML += ":root {--COLOR_PANEL_BUTTON: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += "#setting-bar .content, #emojiPrev, #imageAgent, #home .news ::-webkit-scrollbar, #home .news ::-webkit-scrollbar-thumb, .modalContainer, .toast, #modal .box, #home .panel, #home .bottom .footer {background-color: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += "#home .bottom svg {fill: " + (val != "" ? val : "transparent") + " !important}";
        }
        if (options["containerBackgroundsCheck"] == true && options["ingameContainerBackgroundsCheck"] !== false) {
            options["ingameContainerBackgrounds"] = options["containerBackgrounds"];
            options["ingameContainerBackgroundsCheck"] = true;
            try {
                QS("#ingameContainerBackgrounds").value = options["ingameContainerBackgrounds"];
                QS("#ingameContainerBackgroundsCheck").checked = true;
            } catch { }
        }
        if (options["ingameContainerBackgroundsCheck"] == true) {
            let val = options["ingameContainerBackgrounds"] ? options["ingameContainerBackgrounds"].trim() : "";
            style.innerHTML += "#game-bar, .clickable,  #game-room .settings, #game-room .players,   .tooltip .tooltip-content, #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, div#game-toolbar.typomod div.tools-container div.tools div.tool, #game-toolbar divdiv.preview div.graphic-container, #game-room .container-settings, #game-chat .container, #game-players .players-list .player, #game-players .players-list .player.odd {background-color: " + (val != "" ? val : "transparent") + " !important}";
            style.innerHTML += "#game-players .players-list .player.odd{background-image: linear-gradient(0, " + (val != "" ? val : "transparent") + ", " + (val != "" ? val : "transparent") + ");}";
            style.innerHTML += "#game-chat .chat-content {background:none}";
            style.innerHTML += ":root{ --COLOR_TOOL_TIP_BG: " + val + " !important; --COLOR_CHAT_BG_BASE: " + val + " !important; } ";
            style.innerHTML += "#game-players div.list div.player div.bubble div.arrow{border-right-color:" + val + "} #game-players div.list div.player div.bubble div.content{background-color:" + val + "}";
            style.innerHTML += "#game-chat .chat-content p:nth-child(even), #game-chat .chat-content p.guessed:nth-child(even) {background-color: #ffffff20;} #game-chat .chat-content p.guessed:nth-child(odd){background-color:transparent}";
        }

        if (options["containerOutlinesCheck"] == true) {
            let val = options["containerOutlines"] ? options["containerOutlines"].trim() : "";
            style.innerHTML += "#game-bar,  #game-room .settings, #game-room .players,   #imageAgent, #modal .box, #home .panel, .modalContainer, #game-chat, #game-players .players-list .player, #imageOptions {border-radius: 4px; border: 2px solid " + (val != "" ? val : "transparent") + " !important}";
        }

        if (options["containerImages"] && options["containerImages"].trim() != "") {
            style.innerHTML += "#game-bar, #game-room .settings, #game-room .players,  #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat, #game-players .players-list  {background-image: url(" + options["containerImages"].trim() + ") !important}";
            style.innerHTML += "#game-players .players-list {background:none !important}";
        }
        // font color
        let color = options["fontColor"] ? options["fontColor"] : "";
        if (color && color != "") {
            style.innerHTML += "#home .bottom .footer .notice, *:not(.chat-content *), .characters {color:" + color.trim() + " !important}";
            style.innerHTML += "input[type=checkbox].flatUI, #game-chat form input, input[type=text].flatUI, #home .bottom .footer .section-container .section{color:unset}"
        }
        // font color of everything in-game 
        if (!options["ingameFontColor"] && options["fontColor"]) {
            options["ingameFontColor"] = options["fontColor"];
            try {
                QS("#ingameFontColor").value = options["fontColor"];
            } catch { }
        }
        let ingamecolor = options["ingameFontColor"] ? options["ingameFontColor"] : "";
        if (ingamecolor && ingamecolor != "") {
            style.innerHTML += ":root{ --COLOR_CHAT_TEXT_BASE:" + ingamecolor.trim() + " !important}";
            style.innerHTML += "#game *:not(.chat-content *) {color:" + ingamecolor.trim() + "}";
            style.innerHTML += "div#game-toolbar.typomod div.tools-container div.tools div.tool div.key, #game-word .description, #game-round .round-max, #game-round span, #game-players .player-amount b:nth-child(4), #game-players .player-amount span {color:" + ingamecolor.trim() + "; filter: brightness(0.8);}";
        }
        // font color of buttons / inputs
        let colorBtns = options["fontColorButtons"] ? options["fontColorButtons"] : "";
        if (colorBtns && colorBtns != "") style.innerHTML += "select, input, button, textarea {color:" + colorBtns.trim() + "}";
        if (ingamecolor || color || colorBtns) style.innerHTML += "#game-clock{color:black !important}";
        let font = options["fontStyle"] ? options["fontStyle"] : "";
        if (font && font != "") {
            [...QSA(".fontImport")].forEach(s => s.remove());
            document.head.appendChild(elemFromString(
                '<div class="fontImport" ><link rel="preconnect" href="https://fonts.gstatic.com">'
                + '<link href="https://fonts.googleapis.com/css2?family=' + font.trim() + '&display=swap" rel="stylesheet"></div>'));
            style.innerHTML += "*{font-family:'" + font.trim().split(":")[0].replaceAll("+", " ") + "', sans-serif !important}";
        }
        // input backgrounds 
        if (options["inputBackgroundsCheck"] == true) {
            let val = options["inputBackgrounds"] ? options["inputBackgrounds"].trim() : "";
            style.innerHTML += "input[type=checkbox], input[type=checkbox].flatUI,#modal .container .box .content .container-rooms .room, button.flatUI.green,button.flatUI.orange, button.flatUI.blue, button.flatUI, input[type=text].flatUI, .link .input-container .link-overlay, input, textarea, button, select, #quickreact > span {background: " + (val != "" ? val : "transparent") + " !important; box-shadow:none !important;} ";
            style.innerHTML += "button:is(.flatUI, .flatUI.green, .flatUI.orange, .flatUI.blue):is(:hover, :active, :focus), input:is(:hover, :active, :focus), textarea:is(:hover, :active, :focus), button:is(:hover, :active, :focus), select:is(:hover, :active, :focus) {background: " + (val != "" ? val : "transparent") + " !important; opacity: 0.75}";
            style.innerHTML += ":is(#game-room .container-settings .group.customwords .checkbox, .report-menu) input[type=checkbox]:checked:after { content: '🞬'; height:100%; width: 100%; display: grid; place-content: center;}";
        }

        // outlines of inputs
        if (options["inputOutlinesCheck"] == true) {
            let val = options["inputOutlines"] ? options["inputOutlines"].trim() : "";
            style.innerHTML += ".link .input-container .link-overlay {display:none !important} input[type=checkbox]{border:none !important;} input, textarea, button, select {border: 2px solid " + (val != "" ? val : "transparent") + " !important; }";
        }
        if (options["hideFooter"] == true) {
            style.innerHTML += ".tos, .notice {display:none}";
        }
        if (options["hideTypoInfo"] == true) {
            style.innerHTML += "#typoUserInfo {display:none !important}";
        }
        if (options["hideDiscord"] == true) {
            style.innerHTML += "#home .socials {opacity:0}";
        }
        if (options["hideInGameLogo"] == true) {
            style.innerHTML += "#game #game-logo{display:none} #game{margin-top:2em}";
        }
        if (options["hideAvatarLogo"] == true) {
            style.innerHTML += "#home .logo-big .avatar-container {display:none }";
        }
        if (options["hideTypoPanels"] == true) {
            style.innerHTML += "#panelgrid .panel:is(:first-child, :last-child) {display:none } #panelgrid{grid-template-columns: 100% !important}";
        }
        if (options["hideAvatarSprites"] == true) {
            style.innerHTML += ".avatar-customizer .spriteSlot{display:none }";
            style.innerHTML += ".avatar-customizer {background-image: unset !important }";
            style.innerHTML += ".avatar-customizer .color, .avatar-customizer .mouth, .avatar-customizer .eyes {opacity: 1 !important}";
        }
        if (options["injection"] && options["injection"] != "") {
            if (QS("#injectionElems")) QS("#injectionElems").innerHTML = options["injection"];
            else document.body.append(elemFromString("<div id='injectionElems'>" + options["injection"] + "</div>"));
        }

        if (QS("#visualRules")) QS("#visualRules").innerHTML = style.innerHTML;
        else document.head.append(style);
    },
    applyOptions: (theme) => {

        if (theme.meta?.id !== undefined) {
            localStorage.activeTheme = theme.meta.id;
            localStorage.activeOldTheme = undefined;
        }

        const ingameBgWasActive = QS("#typoThemeBg")?.classList.contains("ingame") ?? false;

        /* remove old visual rules */
        QS("#visualRules")?.remove();
        QS(".fontImport")?.remove();
        QS("#injectionElems")?.remove();
        QS("#typoThemeBg")?.remove();
        QS("#typoThemeExternal")?.remove();
        QS("#typoThemeFont")?.remove();
        QS("#typo_theme_style")?.remove();
        [...QSA(".typo_theme_injection_element")].forEach(elem => elem.remove());

        /* append css */
        let css = Object.keys(theme.colors).map(key => {
            let value = theme.colors[key];
            let string = value.length == 3
                ? `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
                : `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;

            return `${key}: ${string};`;
        }).join("\n");
        const style = document.createElement("STYLE");
        style.id = "typo_theme_style";
        style.innerHTML = `
        :root {${css}}
        body {
            background: none;
        }
        #typoThemeBg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${theme.images.backgroundTint};
            z-index: -1;
            pointer-events: none;
            filter: brightness(${theme.images.backgroundTint != "transparent" ? 4 : 1});
        }
        #typoThemeBg::after {
            image-rendering: unset;
            content: "";
            position: absolute;
            inset: 0;
            background-position: center;
            background-image: url(${theme.images.urlBackground != "" ? theme.images.urlBackground : "/img/background.png"});
            background-repeat: ${theme.images.urlBackground == "" || theme.images.backgroundRepeat ? "repeat" : "no-repeat"};
            background-size: ${theme.images.urlBackground == "" ? "350px" : theme.images.backgroundRepeat ? "auto" : "cover"};
            mix-blend-mode: ${theme.images.backgroundTint == "transparent" ? "none" : "multiply"};
            filter: ${theme.images.backgroundTint == "transparent" ? "none" : "saturate(0%)"};
        }
        #typoThemeBg.ingame${theme.images.urlBackgroundGame != "" ? "" : ".disabled"}::after {
            background-image: url(${theme.images.urlBackgroundGame});
        }

        ${theme.misc.hideFooter ? ".tos, .notice {display:none}" : ""}

        ${theme.misc.hideTypoInfo ? "#typoUserInfo {display:none !important}" : ""}

        ${theme.misc.hideTypoPanels ? "#panelgrid .panel:is(:first-child, :last-child) {display:none } #panelgrid{grid-template-columns: 100% !important}" : ""}

        ${theme.misc.hideInGameLogo ? "#game #game-logo{display:none} #game{margin-top:2em}" : ""}

        ${theme.misc.hideMeta ? "#home > div.bottom {display:none !important}" : ""}

        ${theme.misc.hideAvatarSprites ? `
        .avatar-customizer .spriteSlot{display:none }
        .avatar-customizer {background-image: unset !important }
        .avatar-customizer .color, .avatar-customizer .mouth, .avatar-customizer .eyes {opacity: 1 !important}
        ` : ""}

        ${theme.misc.hideAvatarLogo ? "#home .logo-big .avatar-container {display:none }" : ""}

        ${theme.images.containerImages != "" ? `
        #game-bar, #game-room .settings, #game-room .players,  #imageAgent, #gamemodePopup, #optionsPopup, #downloadPopup, 
        #sharePopup, #typoUserInfo, #imageOptions, #game-room .container-settings, #game-chat 
        .chat-content, #game-players .players-list  {background-image: url(${theme.images.containerImages}) !important}
        #game-players .players-list .player {background:none !important}
        ` : ""}

        .flatUi.orange, .button-orange {
            background-color: var(--COLOR_BUTTON_DANGER_BG) !important;
            color: var(--COLOR_BUTTON_DANGER_TEXT) !important;
        }
        .flatUI.green, .button-play, #start-game {
            color: var(--COLOR_BUTTON_SUBMIT_TEXT) !important;
            background-color: var(--COLOR_BUTTON_SUBMIT_BG) !important;
        }
        .flatUI.blue, .button-create, .button-blue, #copy-invite {
            background-color: var(--COLOR_BUTTON_NORMAL_BG) !important;
            color: var(--COLOR_BUTTON_NORMAL_TEXT) !important;
        }

        :is(.flatUi.orange, .button-orange):is(:hover, :active, :focus) {
            background-color: var(--COLOR_BUTTON_DANGER_BG) !important;
            color: var(--COLOR_BUTTON_DANGER_TEXT) !important;
            opacity: 0.8;
        }
        :is(.flatUI.green, .button-play, #start-game):is(:hover, :active, :focus) {
            color: var(--COLOR_BUTTON_SUBMIT_TEXT) !important;
            background-color: var(--COLOR_BUTTON_SUBMIT_BG) !important;
            opacity: 0.8;
        }
        :is(.flatUI.blue, .button-create, .button-blue, #copy-invite):is(:hover, :active, :focus) {
            background-color: var(--COLOR_BUTTON_NORMAL_BG) !important;
            color: var(--COLOR_BUTTON_NORMAL_TEXT) !important;
            opacity: 0.8;
        }

        ${theme.misc.fontStyle != "" ? `*{font-family:'${theme.misc.fontStyle.trim().split(":")[0].replaceAll("+", " ")}', sans-serif !important}` : ""}

        ${theme.images.urlLogo != "" ? "div.logo-big img {max-height:20vh}" : ""}

        ${theme.misc.useOldNav ? ".lobbyNavIcon {display: none !important;} #legacy-next, #legacy-exit {display: block !important; }" : ""}

        ${Object.keys(theme.hooks ? theme.hooks : {}).filter(key => theme.hooks[key] != "").map(key => `${SKRIBBL_HOOKS[key].join(",")}{${theme.hooks[key]}}`).join("\n")}

        ::-webkit-scrollbar {
            width: 14px;
            border-radius: 7px;
            background-color: var(--COLOR_PANEL_LO); 
        }
        
        ::-webkit-scrollbar-thumb {
            border-radius: 7px;
            background-color: var(--COLOR_PANEL_HI)
        }

        #game-chat ::-webkit-scrollbar {
            width: 14px;
            border-radius: 7px;
            background-color: var(--COLOR_CHAT_SCROLLBAR); 
        }
        
        #game-chat ::-webkit-scrollbar-thumb {
            border-radius: 7px;
            background-color: var(--COLOR_CHAT_SCROLLBAR_THUMB); 
        }

        ${theme.misc.cssText}
        
        `;
        QS("#typo_theme_style")?.remove();
        document.body.append(style);

        /* add typo background */
        const bg = elemFromString(`<div id="typoThemeBg"></div>`);
        if(ingameBgWasActive) bg.classList.add("ingame");
        QS("#typoThemeBg")?.remove();
        document.body.appendChild(bg);

        /* use image url */
        let small = QS("div.logo-big img");
        let big = QS("#game #game-logo img");
        if (theme.images.urlLogo != "") {
            if (small) small.src = theme.images.urlLogo;
            if (big) big.src = theme.images.urlLogo;
        }
        else {
            if (small) small.src = "img/logo.gif";
            if (big) big.src = "img/logo.gif";
        }

        /* add font import */
        QS("#typoThemeExternal")?.remove();
        if (theme.misc.themeCssUrl != "") {
            const css = elemFromString(`<link id="typoThemeExternal" rel="stylesheet" href="${theme.misc.themeCssUrl}">`);
            document.head.appendChild(css);
        }

        /* add theme style import */
        QS("#typoThemeFont")?.remove();
        if (theme.misc.fontStyle != "") {
            const font = elemFromString(`<div id="typoThemeFont"><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=${theme.misc.fontStyle.trim()}&display=swap" rel="stylesheet"></div>`);
            document.head.appendChild(font);
        }

        /* add theme html injection */
        if (theme.misc.htmlText != "") {
            try {
                const inj = elemFromString(`<div>${theme.misc.htmlText}</div>`);
                [...inj.children].forEach(c => {
                    c.classList.add("typo_theme_injection_element");
                    document.body.append(c);
                });
            }
            catch { }
        }
    }
}

// #content errors.js
﻿let errors = "";

// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

document.addEventListener('keydown', async (event) => {
	if (event.ctrlKey && event.key === 'b') {
        let message = JSON.stringify({
            username: "Typo Bugtracer",
            avatar_url:
                'https://tobeh.host/Orthanc/images/letterred.png',
            embeds: [
                {
                    "title": "Error Report",
                    "description": (errors == "" ? "No errors caught." : errors)
                }
            ]
        });
        // send webhook
        await fetch("https://discord.com/api/webhooks/880181730231861309/ate4BsIJtkpAeFQwWt1qpMzVWtYJkcMWFUShDHhw2o7DlNw5x-7hCKn3Mu0sAadgi3vy", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: message
        });
        alert('Error report was sent.');
    }   
});

// #content features/socket.js
!function (t, e) { "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e() }("undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : Function("return this")(), (function () { return function (t) { var e = {}; function n(r) { if (e[r]) return e[r].exports; var o = e[r] = { i: r, l: !1, exports: {} }; return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports } return n.m = t, n.c = e, n.d = function (t, e, r) { n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r }) }, n.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, n.t = function (t, e) { if (1 & e && (t = n(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var r = Object.create(null); if (n.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var o in t) n.d(r, o, function (e) { return t[e] }.bind(null, o)); return r }, n.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return n.d(e, "a", e), e }, n.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, n.p = "", n(n.s = 18) }([function (t, e, n) { function r(t) { if (t) return function (t) { for (var e in r.prototype) t[e] = r.prototype[e]; return t }(t) } t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) { return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this }, r.prototype.once = function (t, e) { function n() { this.off(t, n), e.apply(this, arguments) } return n.fn = e, this.on(t, n), this }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) { if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this; var n, r = this._callbacks["$" + t]; if (!r) return this; if (1 == arguments.length) return delete this._callbacks["$" + t], this; for (var o = 0; o < r.length; o++)if ((n = r[o]) === e || n.fn === e) { r.splice(o, 1); break } return 0 === r.length && delete this._callbacks["$" + t], this }, r.prototype.emit = function (t) { this._callbacks = this._callbacks || {}; for (var e = new Array(arguments.length - 1), n = this._callbacks["$" + t], r = 1; r < arguments.length; r++)e[r - 1] = arguments[r]; if (n) { r = 0; for (var o = (n = n.slice(0)).length; r < o; ++r)n[r].apply(this, e) } return this }, r.prototype.listeners = function (t) { return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [] }, r.prototype.hasListeners = function (t) { return !!this.listeners(t).length } }, function (t, e, n) { var r = n(24), o = n(25), i = String.fromCharCode(30); t.exports = { protocol: 4, encodePacket: r, encodePayload: function (t, e) { var n = t.length, o = new Array(n), s = 0; t.forEach((function (t, c) { r(t, !1, (function (t) { o[c] = t, ++s === n && e(o.join(i)) })) })) }, decodePacket: o, decodePayload: function (t, e) { for (var n = t.split(i), r = [], s = 0; s < n.length; s++) { var c = o(n[s], e); if (r.push(c), "error" === c.type) break } return r } } }, function (t, e) { t.exports = "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this")() }, function (t, e, n) { var r = n(22), o = n(2); t.exports = function (t) { var e = t.xdomain, n = t.xscheme, i = t.enablesXDR; try { if ("undefined" != typeof XMLHttpRequest && (!e || r)) return new XMLHttpRequest } catch (t) { } try { if ("undefined" != typeof XDomainRequest && !n && i) return new XDomainRequest } catch (t) { } if (!e) try { return new (o[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP") } catch (t) { } } }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e) { return (i = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function s(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = a(t); if (e) { var o = a(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return c(this, n) } } function c(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function a(t) { return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var u = n(1), f = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && i(t, e) }(a, t); var e, n, r, c = s(a); function a(t) { var e; return function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, a), (e = c.call(this)).opts = t, e.query = t.query, e.readyState = "", e.socket = t.socket, e } return e = a, (n = [{ key: "onError", value: function (t, e) { var n = new Error(t); return n.type = "TransportError", n.description = e, this.emit("error", n), this } }, { key: "open", value: function () { return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this } }, { key: "close", value: function () { return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this } }, { key: "send", value: function (t) { if ("open" !== this.readyState) throw new Error("Transport not open"); this.write(t) } }, { key: "onOpen", value: function () { this.readyState = "open", this.writable = !0, this.emit("open") } }, { key: "onData", value: function (t) { var e = u.decodePacket(t, this.socket.binaryType); this.onPacket(e) } }, { key: "onPacket", value: function (t) { this.emit("packet", t) } }, { key: "onClose", value: function () { this.readyState = "closed", this.emit("close") } }]) && o(e.prototype, n), r && o(e, r), a }(n(0)); t.exports = f }, function (t, e) { e.encode = function (t) { var e = ""; for (var n in t) t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n])); return e }, e.decode = function (t) { for (var e = {}, n = t.split("&"), r = 0, o = n.length; r < o; r++) { var i = n[r].split("="); e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]) } return e } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e, n) { return (o = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = a(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function i(t, e) { return (i = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function s(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = a(t); if (e) { var o = a(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return c(this, n) } } function c(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function a(t) { return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } function u(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function f(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function p(t, e, n) { return e && f(t.prototype, e), n && f(t, n), t } Object.defineProperty(e, "__esModule", { value: !0 }), e.Decoder = e.Encoder = e.PacketType = e.protocol = void 0; var l, h = n(0), y = n(30), d = n(15); e.protocol = 5, function (t) { t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK" }(l = e.PacketType || (e.PacketType = {})); var v = function () { function t() { u(this, t) } return p(t, [{ key: "encode", value: function (t) { return t.type !== l.EVENT && t.type !== l.ACK || !d.hasBinary(t) ? [this.encodeAsString(t)] : (t.type = t.type === l.EVENT ? l.BINARY_EVENT : l.BINARY_ACK, this.encodeAsBinary(t)) } }, { key: "encodeAsString", value: function (t) { var e = "" + t.type; return t.type !== l.BINARY_EVENT && t.type !== l.BINARY_ACK || (e += t.attachments + "-"), t.nsp && "/" !== t.nsp && (e += t.nsp + ","), null != t.id && (e += t.id), null != t.data && (e += JSON.stringify(t.data)), e } }, { key: "encodeAsBinary", value: function (t) { var e = y.deconstructPacket(t), n = this.encodeAsString(e.packet), r = e.buffers; return r.unshift(n), r } }]), t }(); e.Encoder = v; var b = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && i(t, e) }(n, t); var e = s(n); function n() { return u(this, n), e.call(this) } return p(n, [{ key: "add", value: function (t) { var e; if ("string" == typeof t) (e = this.decodeString(t)).type === l.BINARY_EVENT || e.type === l.BINARY_ACK ? (this.reconstructor = new m(e), 0 === e.attachments && o(a(n.prototype), "emit", this).call(this, "decoded", e)) : o(a(n.prototype), "emit", this).call(this, "decoded", e); else { if (!d.isBinary(t) && !t.base64) throw new Error("Unknown type: " + t); if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet"); (e = this.reconstructor.takeBinaryData(t)) && (this.reconstructor = null, o(a(n.prototype), "emit", this).call(this, "decoded", e)) } } }, { key: "decodeString", value: function (t) { var e = 0, r = { type: Number(t.charAt(0)) }; if (void 0 === l[r.type]) throw new Error("unknown packet type " + r.type); if (r.type === l.BINARY_EVENT || r.type === l.BINARY_ACK) { for (var o = e + 1; "-" !== t.charAt(++e) && e != t.length;); var i = t.substring(o, e); if (i != Number(i) || "-" !== t.charAt(e)) throw new Error("Illegal attachments"); r.attachments = Number(i) } if ("/" === t.charAt(e + 1)) { for (var s = e + 1; ++e;) { if ("," === t.charAt(e)) break; if (e === t.length) break } r.nsp = t.substring(s, e) } else r.nsp = "/"; var c = t.charAt(e + 1); if ("" !== c && Number(c) == c) { for (var a = e + 1; ++e;) { var u = t.charAt(e); if (null == u || Number(u) != u) { --e; break } if (e === t.length) break } r.id = Number(t.substring(a, e + 1)) } if (t.charAt(++e)) { var f = function (t) { try { return JSON.parse(t) } catch (t) { return !1 } }(t.substr(e)); if (!n.isPayloadValid(r.type, f)) throw new Error("invalid payload"); r.data = f } return r } }, { key: "destroy", value: function () { this.reconstructor && this.reconstructor.finishedReconstruction() } }], [{ key: "isPayloadValid", value: function (t, e) { switch (t) { case l.CONNECT: return "object" === r(e); case l.DISCONNECT: return void 0 === e; case l.CONNECT_ERROR: return "string" == typeof e || "object" === r(e); case l.EVENT: case l.BINARY_EVENT: return Array.isArray(e) && "string" == typeof e[0]; case l.ACK: case l.BINARY_ACK: return Array.isArray(e) } } }]), n }(h); e.Decoder = b; var m = function () { function t(e) { u(this, t), this.packet = e, this.buffers = [], this.reconPack = e } return p(t, [{ key: "takeBinaryData", value: function (t) { if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) { var e = y.reconstructPacket(this.reconPack, this.buffers); return this.finishedReconstruction(), e } return null } }, { key: "finishedReconstruction", value: function () { this.reconPack = null, this.buffers = [] } }]), t }() }, function (t, e) { var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, r = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"]; t.exports = function (t) { var e = t, o = t.indexOf("["), i = t.indexOf("]"); -1 != o && -1 != i && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length)); for (var s, c, a = n.exec(t || ""), u = {}, f = 14; f--;)u[r[f]] = a[f] || ""; return -1 != o && -1 != i && (u.source = e, u.host = u.host.substring(1, u.host.length - 1).replace(/;/g, ":"), u.authority = u.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), u.ipv6uri = !0), u.pathNames = function (t, e) { var n = e.replace(/\/{2,9}/g, "/").split("/"); "/" != e.substr(0, 1) && 0 !== e.length || n.splice(0, 1); "/" == e.substr(e.length - 1, 1) && n.splice(n.length - 1, 1); return n }(0, u.path), u.queryKey = (s = u.query, c = {}, s.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, (function (t, e, n) { e && (c[e] = n) })), c), u } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e, n) { return (i = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = u(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function s(t, e) { return (s = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function c(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = u(t); if (e) { var o = u(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return a(this, n) } } function a(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function u(t) { return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.Manager = void 0; var f = n(20), p = n(14), l = n(0), h = n(6), y = n(16), d = n(17), v = n(31), b = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && s(t, e) }(b, t); var e, n, a, l = c(b); function b(t, e) { var n; !function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, b), (n = l.call(this)).nsps = {}, n.subs = [], n.connecting = [], t && "object" === r(t) && (e = t, t = void 0), (e = e || {}).path = e.path || "/socket.io", n.opts = e, n.reconnection(!1 !== e.reconnection), n.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), n.reconnectionDelay(e.reconnectionDelay || 1e3), n.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), n.randomizationFactor(e.randomizationFactor || .5), n.backoff = new v({ min: n.reconnectionDelay(), max: n.reconnectionDelayMax(), jitter: n.randomizationFactor() }), n.timeout(null == e.timeout ? 2e4 : e.timeout), n._readyState = "closed", n.uri = t; var o = e.parser || h; return n.encoder = new o.Encoder, n.decoder = new o.Decoder, n._autoConnect = !1 !== e.autoConnect, n._autoConnect && n.open(), n } return e = b, (n = [{ key: "reconnection", value: function (t) { return arguments.length ? (this._reconnection = !!t, this) : this._reconnection } }, { key: "reconnectionAttempts", value: function (t) { return void 0 === t ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this) } }, { key: "reconnectionDelay", value: function (t) { return void 0 === t ? this._reconnectionDelay : (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) } }, { key: "randomizationFactor", value: function (t) { return void 0 === t ? this._randomizationFactor : (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) } }, { key: "reconnectionDelayMax", value: function (t) { return void 0 === t ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) } }, { key: "timeout", value: function (t) { return arguments.length ? (this._timeout = t, this) : this._timeout } }, { key: "maybeReconnectOnOpen", value: function () { !this._reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect() } }, { key: "open", value: function (t) { var e = this; if (~this._readyState.indexOf("open")) return this; this.engine = f(this.uri, this.opts); var n = this.engine, r = this; this._readyState = "opening", this.skipReconnect = !1; var o = y.on(n, "open", (function () { r.onopen(), t && t() })), s = y.on(n, "error", (function (n) { r.cleanup(), r._readyState = "closed", i(u(b.prototype), "emit", e).call(e, "error", n), t ? t(n) : r.maybeReconnectOnOpen() })); if (!1 !== this._timeout) { var c = this._timeout; 0 === c && o.destroy(); var a = setTimeout((function () { o.destroy(), n.close(), n.emit("error", new Error("timeout")) }), c); this.subs.push({ destroy: function () { clearTimeout(a) } }) } return this.subs.push(o), this.subs.push(s), this } }, { key: "connect", value: function (t) { return this.open(t) } }, { key: "onopen", value: function () { this.cleanup(), this._readyState = "open", i(u(b.prototype), "emit", this).call(this, "open"); var t = this.engine; this.subs.push(y.on(t, "data", d(this, "ondata"))), this.subs.push(y.on(t, "ping", d(this, "onping"))), this.subs.push(y.on(t, "error", d(this, "onerror"))), this.subs.push(y.on(t, "close", d(this, "onclose"))), this.subs.push(y.on(this.decoder, "decoded", d(this, "ondecoded"))) } }, { key: "onping", value: function () { i(u(b.prototype), "emit", this).call(this, "ping") } }, { key: "ondata", value: function (t) { this.decoder.add(t) } }, { key: "ondecoded", value: function (t) { i(u(b.prototype), "emit", this).call(this, "packet", t) } }, { key: "onerror", value: function (t) { i(u(b.prototype), "emit", this).call(this, "error", t) } }, { key: "socket", value: function (t, e) { var n = this.nsps[t]; if (!n) { n = new p.Socket(this, t, e), this.nsps[t] = n; var r = this; n.on("connecting", o), this._autoConnect && o() } function o() { ~r.connecting.indexOf(n) || r.connecting.push(n) } return n } }, { key: "_destroy", value: function (t) { var e = this.connecting.indexOf(t); ~e && this.connecting.splice(e, 1), this.connecting.length || this._close() } }, { key: "_packet", value: function (t) { t.query && 0 === t.type && (t.nsp += "?" + t.query); for (var e = this.encoder.encode(t), n = 0; n < e.length; n++)this.engine.write(e[n], t.options) } }, { key: "cleanup", value: function () { for (var t = this.subs.length, e = 0; e < t; e++)this.subs.shift().destroy(); this.decoder.destroy() } }, { key: "_close", value: function () { this.skipReconnect = !0, this._reconnecting = !1, "opening" === this._readyState && this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.engine && this.engine.close() } }, { key: "disconnect", value: function () { return this._close() } }, { key: "onclose", value: function (t) { this.cleanup(), this.backoff.reset(), this._readyState = "closed", i(u(b.prototype), "emit", this).call(this, "close", t), this._reconnection && !this.skipReconnect && this.reconnect() } }, { key: "reconnect", value: function () { var t = this; if (this._reconnecting || this.skipReconnect) return this; var e = this; if (this.backoff.attempts >= this._reconnectionAttempts) this.backoff.reset(), i(u(b.prototype), "emit", this).call(this, "reconnect_failed"), this._reconnecting = !1; else { var n = this.backoff.duration(); this._reconnecting = !0; var r = setTimeout((function () { e.skipReconnect || (i(u(b.prototype), "emit", t).call(t, "reconnect_attempt", e.backoff.attempts), e.skipReconnect || e.open((function (n) { n ? (e._reconnecting = !1, e.reconnect(), i(u(b.prototype), "emit", t).call(t, "reconnect_error", n)) : e.onreconnect() }))) }), n); this.subs.push({ destroy: function () { clearTimeout(r) } }) } } }, { key: "onreconnect", value: function () { var t = this.backoff.attempts; this._reconnecting = !1, this.backoff.reset(), i(u(b.prototype), "emit", this).call(this, "reconnect", t) } }]) && o(e.prototype, n), a && o(e, a), b }(l); e.Manager = b }, function (t, e, n) { var r = n(3), o = n(23), i = n(27), s = n(28); e.polling = function (t) { var e = !1, n = !1, s = !1 !== t.jsonp; if ("undefined" != typeof location) { var c = "https:" === location.protocol, a = location.port; a || (a = c ? 443 : 80), e = t.hostname !== location.hostname || a !== t.port, n = t.secure !== c } if (t.xdomain = e, t.xscheme = n, "open" in new r(t) && !t.forceJSONP) return new o(t); if (!s) throw new Error("JSONP disabled"); return new i(t) }, e.websocket = s }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function i(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function s(t, e) { return (s = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function c(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = u(t); if (e) { var o = u(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return a(this, n) } } function a(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function u(t) { return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var f = n(4), p = n(5), l = n(1), h = n(12), y = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && s(t, e) }(u, t); var e, n, r, a = c(u); function u() { return o(this, u), a.apply(this, arguments) } return e = u, (n = [{ key: "doOpen", value: function () { this.poll() } }, { key: "pause", value: function (t) { var e = this; function n() { e.readyState = "paused", t() } if (this.readyState = "pausing", this.polling || !this.writable) { var r = 0; this.polling && (r++, this.once("pollComplete", (function () { --r || n() }))), this.writable || (r++, this.once("drain", (function () { --r || n() }))) } else n() } }, { key: "poll", value: function () { this.polling = !0, this.doPoll(), this.emit("poll") } }, { key: "onData", value: function (t) { var e = this; l.decodePayload(t, this.socket.binaryType).forEach((function (t, n, r) { if ("opening" === e.readyState && e.onOpen(), "close" === t.type) return e.onClose(), !1; e.onPacket(t) })), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState && this.poll()) } }, { key: "doClose", value: function () { var t = this; function e() { t.write([{ type: "close" }]) } "open" === this.readyState ? e() : this.once("open", e) } }, { key: "write", value: function (t) { var e = this; this.writable = !1, l.encodePayload(t, (function (t) { e.doWrite(t, (function () { e.writable = !0, e.emit("drain") })) })) } }, { key: "uri", value: function () { var t = this.query || {}, e = this.opts.secure ? "https" : "http", n = ""; return !1 !== this.opts.timestampRequests && (t[this.opts.timestampParam] = h()), this.supportsBinary || t.sid || (t.b64 = 1), t = p.encode(t), this.opts.port && ("https" === e && 443 !== Number(this.opts.port) || "http" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port), t.length && (t = "?" + t), e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + t } }, { key: "name", get: function () { return "polling" } }]) && i(e.prototype, n), r && i(e, r), u }(f); t.exports = y }, function (t, e) { var n = Object.create(null); n.open = "0", n.close = "1", n.ping = "2", n.pong = "3", n.message = "4", n.upgrade = "5", n.noop = "6"; var r = Object.create(null); Object.keys(n).forEach((function (t) { r[n[t]] = t })); t.exports = { PACKET_TYPES: n, PACKET_TYPES_REVERSE: r, ERROR_PACKET: { type: "error", data: "parser error" } } }, function (t, e, n) { "use strict"; var r, o = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), i = {}, s = 0, c = 0; function a(t) { var e = ""; do { e = o[t % 64] + e, t = Math.floor(t / 64) } while (t > 0); return e } function u() { var t = a(+new Date); return t !== r ? (s = 0, r = t) : t + "." + a(s++) } for (; c < 64; c++)i[o[c]] = c; u.encode = a, u.decode = function (t) { var e = 0; for (c = 0; c < t.length; c++)e = 64 * e + i[t.charAt(c)]; return e }, t.exports = u }, function (t, e) { t.exports.pick = function (t) { for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)n[r - 1] = arguments[r]; return n.reduce((function (e, n) { return e[n] = t[n], e }), {}) } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { var n; if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) { if (Array.isArray(t) || (n = function (t, e) { if (!t) return; if ("string" == typeof t) return i(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e) }(t)) || e && t && "number" == typeof t.length) { n && (t = n); var r = 0, o = function () { }; return { s: o, n: function () { return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] } }, e: function (t) { throw t }, f: o } } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") } var s, c = !0, a = !1; return { s: function () { n = t[Symbol.iterator]() }, n: function () { var t = n.next(); return c = t.done, t }, e: function (t) { a = !0, s = t }, f: function () { try { c || null == n.return || n.return() } finally { if (a) throw s } } } } function i(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r } function s(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function c(t, e, n) { return (c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = p(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function a(t, e) { return (a = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function u(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = p(t); if (e) { var o = p(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return f(this, n) } } function f(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function p(t) { return (p = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.Socket = void 0; var l = n(6), h = n(0), y = n(16), d = n(17), v = { connect: 1, connect_error: 1, disconnect: 1, disconnecting: 1, newListener: 1, removeListener: 1 }, b = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && a(t, e) }(f, t); var e, n, r, i = u(f); function f(t, e, n) { var r; return function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, f), (r = i.call(this)).ids = 0, r.acks = {}, r.receiveBuffer = [], r.sendBuffer = [], r.flags = {}, r.io = t, r.nsp = e, r.ids = 0, r.acks = {}, r.receiveBuffer = [], r.sendBuffer = [], r.connected = !1, r.disconnected = !0, r.flags = {}, n && n.auth && (r.auth = n.auth), r.io._autoConnect && r.open(), r } return e = f, (n = [{ key: "subEvents", value: function () { if (!this.subs) { var t = this.io; this.subs = [y.on(t, "open", d(this, "onopen")), y.on(t, "packet", d(this, "onpacket")), y.on(t, "close", d(this, "onclose"))] } } }, { key: "connect", value: function () { return this.connected || (this.subEvents(), this.io._reconnecting || this.io.open(), "open" === this.io._readyState && this.onopen()), this } }, { key: "open", value: function () { return this.connect() } }, { key: "send", value: function () { for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)e[n] = arguments[n]; return e.unshift("message"), this.emit.apply(this, e), this } }, { key: "emit", value: function (t) { if (v.hasOwnProperty(t)) throw new Error('"' + t + '" is a reserved event name'); for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)n[r - 1] = arguments[r]; n.unshift(t); var o = { type: l.PacketType.EVENT, data: n, options: {} }; o.options.compress = !1 !== this.flags.compress, "function" == typeof n[n.length - 1] && (this.acks[this.ids] = n.pop(), o.id = this.ids++); var i = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable, s = this.flags.volatile && (!i || !this.connected); return s || (this.connected ? this.packet(o) : this.sendBuffer.push(o)), this.flags = {}, this } }, { key: "packet", value: function (t) { t.nsp = this.nsp, this.io._packet(t) } }, { key: "onopen", value: function () { var t = this; "function" == typeof this.auth ? this.auth((function (e) { t.packet({ type: l.PacketType.CONNECT, data: e }) })) : this.packet({ type: l.PacketType.CONNECT, data: this.auth }) } }, { key: "onclose", value: function (t) { this.connected = !1, this.disconnected = !0, delete this.id, c(p(f.prototype), "emit", this).call(this, "disconnect", t) } }, { key: "onpacket", value: function (t) { if (t.nsp === this.nsp) switch (t.type) { case l.PacketType.CONNECT: var e = t.data.sid; this.onconnect(e); break; case l.PacketType.EVENT: case l.PacketType.BINARY_EVENT: this.onevent(t); break; case l.PacketType.ACK: case l.PacketType.BINARY_ACK: this.onack(t); break; case l.PacketType.DISCONNECT: this.ondisconnect(); break; case l.PacketType.CONNECT_ERROR: var n = new Error(t.data.message); n.data = t.data.data, c(p(f.prototype), "emit", this).call(this, "connect_error", n) } } }, { key: "onevent", value: function (t) { var e = t.data || []; null != t.id && e.push(this.ack(t.id)), this.connected ? this.emitEvent(e) : this.receiveBuffer.push(e) } }, { key: "emitEvent", value: function (t) { if (this._anyListeners && this._anyListeners.length) { var e, n = o(this._anyListeners.slice()); try { for (n.s(); !(e = n.n()).done;)e.value.apply(this, t) } catch (t) { n.e(t) } finally { n.f() } } c(p(f.prototype), "emit", this).apply(this, t) } }, { key: "ack", value: function (t) { var e = this, n = !1; return function () { if (!n) { n = !0; for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++)o[i] = arguments[i]; e.packet({ type: l.PacketType.ACK, id: t, data: o }) } } } }, { key: "onack", value: function (t) { var e = this.acks[t.id]; "function" == typeof e && (e.apply(this, t.data), delete this.acks[t.id]) } }, { key: "onconnect", value: function (t) { this.id = t, this.connected = !0, this.disconnected = !1, c(p(f.prototype), "emit", this).call(this, "connect"), this.emitBuffered() } }, { key: "emitBuffered", value: function () { for (var t = 0; t < this.receiveBuffer.length; t++)this.emitEvent(this.receiveBuffer[t]); this.receiveBuffer = []; for (var e = 0; e < this.sendBuffer.length; e++)this.packet(this.sendBuffer[e]); this.sendBuffer = [] } }, { key: "ondisconnect", value: function () { this.destroy(), this.onclose("io server disconnect") } }, { key: "destroy", value: function () { if (this.subs) { for (var t = 0; t < this.subs.length; t++)this.subs[t].destroy(); this.subs = null } this.io._destroy(this) } }, { key: "disconnect", value: function () { return this.connected && this.packet({ type: l.PacketType.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this } }, { key: "close", value: function () { return this.disconnect() } }, { key: "compress", value: function (t) { return this.flags.compress = t, this } }, { key: "onAny", value: function (t) { return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this } }, { key: "prependAny", value: function (t) { return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this } }, { key: "offAny", value: function (t) { if (!this._anyListeners) return this; if (t) { for (var e = this._anyListeners, n = 0; n < e.length; n++)if (t === e[n]) return e.splice(n, 1), this } else this._anyListeners = []; return this } }, { key: "listenersAny", value: function () { return this._anyListeners || [] } }, { key: "volatile", get: function () { return this.flags.volatile = !0, this } }]) && s(e.prototype, n), r && s(e, r), f }(h); e.Socket = b }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.hasBinary = e.isBinary = void 0; var o = "function" == typeof ArrayBuffer, i = Object.prototype.toString, s = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === i.call(Blob), c = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === i.call(File); function a(t) { return o && (t instanceof ArrayBuffer || function (t) { return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer }(t)) || s && t instanceof Blob || c && t instanceof File } e.isBinary = a, e.hasBinary = function t(e, n) { if (!e || "object" !== r(e)) return !1; if (Array.isArray(e)) { for (var o = 0, i = e.length; o < i; o++)if (t(e[o])) return !0; return !1 } if (a(e)) return !0; if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length) return t(e.toJSON(), !0); for (var s in e) if (Object.prototype.hasOwnProperty.call(e, s) && t(e[s])) return !0; return !1 } }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }), e.on = void 0, e.on = function (t, e, n) { return t.on(e, n), { destroy: function () { t.removeListener(e, n) } } } }, function (t, e) { var n = [].slice; t.exports = function (t, e) { if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function"); var r = n.call(arguments, 2); return function () { return e.apply(t, r.concat(n.call(arguments))) } } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.Socket = e.io = e.Manager = e.protocol = void 0; var o = n(19), i = n(8), s = n(14); Object.defineProperty(e, "Socket", { enumerable: !0, get: function () { return s.Socket } }), t.exports = e = a; var c = e.managers = {}; function a(t, e) { "object" === r(t) && (e = t, t = void 0), e = e || {}; var n, s = o.url(t), a = s.source, u = s.id, f = s.path, p = c[u] && f in c[u].nsps; return e.forceNew || e["force new connection"] || !1 === e.multiplex || p ? n = new i.Manager(a, e) : (c[u] || (c[u] = new i.Manager(a, e)), n = c[u]), s.query && !e.query && (e.query = s.query), n.socket(s.path, e) } e.io = a; var u = n(6); Object.defineProperty(e, "protocol", { enumerable: !0, get: function () { return u.protocol } }), e.connect = a; var f = n(8); Object.defineProperty(e, "Manager", { enumerable: !0, get: function () { return f.Manager } }) }, function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }), e.url = void 0; var r = n(7); e.url = function (t, e) { var n = t; e = e || "undefined" != typeof location && location, null == t && (t = e.protocol + "//" + e.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? e.protocol + t : e.host + t), /^(https?|wss?):\/\//.test(t) || (t = void 0 !== e ? e.protocol + "//" + t : "https://" + t), n = r(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/"; var o = -1 !== n.host.indexOf(":") ? "[" + n.host + "]" : n.host; return n.id = n.protocol + "://" + o + ":" + n.port, n.href = n.protocol + "://" + o + (e && e.port === n.port ? "" : ":" + n.port), n } }, function (t, e, n) { var r = n(21); t.exports = function (t, e) { return new r(t, e) }, t.exports.Socket = r, t.exports.protocol = r.protocol, t.exports.Transport = n(4), t.exports.transports = n(9), t.exports.parser = n(1) }, function (t, e, n) { function r() { return (r = Object.assign || function (t) { for (var e = 1; e < arguments.length; e++) { var n = arguments[e]; for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]) } return t }).apply(this, arguments) } function o(t) { return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function i(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function s(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function c(t, e) { return (c = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function a(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = f(t); if (e) { var o = f(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } function u(t, e) { return !e || "object" !== o(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function f(t) { return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var p = n(9), l = n(0), h = n(1), y = n(7), d = n(5), v = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && c(t, e) }(l, t); var e, n, u, f = a(l); function l(t) { var e, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i(this, l), e = f.call(this), t && "object" === o(t) && (n = t, t = null), t ? (t = y(t), n.hostname = t.host, n.secure = "https" === t.protocol || "wss" === t.protocol, n.port = t.port, t.query && (n.query = t.query)) : n.host && (n.hostname = y(n.host).host), e.secure = null != n.secure ? n.secure : "undefined" != typeof location && "https:" === location.protocol, n.hostname && !n.port && (n.port = e.secure ? "443" : "80"), e.hostname = n.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), e.port = n.port || ("undefined" != typeof location && location.port ? location.port : e.secure ? 443 : 80), e.transports = n.transports || ["polling", "websocket"], e.readyState = "", e.writeBuffer = [], e.prevBufferLen = 0, e.opts = r({ path: "/engine.io", agent: !1, upgrade: !0, jsonp: !0, timestampParam: "t", policyPort: 843, rememberUpgrade: !1, rejectUnauthorized: !0, perMessageDeflate: { threshold: 1024 }, transportOptions: {} }, n), e.opts.path = e.opts.path.replace(/\/$/, "") + "/", "string" == typeof e.opts.query && (e.opts.query = d.decode(e.opts.query)), e.id = null, e.upgrades = null, e.pingInterval = null, e.pingTimeout = null, e.pingTimeoutTimer = null, e.open(), e } return e = l, (n = [{ key: "createTransport", value: function (t) { var e = function (t) { var e = {}; for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]); return e }(this.opts.query); e.EIO = h.protocol, e.transport = t, this.id && (e.sid = this.id); var n = r({}, this.opts.transportOptions[t], this.opts, { query: e, socket: this, hostname: this.hostname, secure: this.secure, port: this.port }); return new p[t](n) } }, { key: "open", value: function () { var t; if (this.opts.rememberUpgrade && l.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) t = "websocket"; else { if (0 === this.transports.length) { var e = this; return void setTimeout((function () { e.emit("error", "No transports available") }), 0) } t = this.transports[0] } this.readyState = "opening"; try { t = this.createTransport(t) } catch (t) { return this.transports.shift(), void this.open() } t.open(), this.setTransport(t) } }, { key: "setTransport", value: function (t) { var e = this; this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", (function () { e.onDrain() })).on("packet", (function (t) { e.onPacket(t) })).on("error", (function (t) { e.onError(t) })).on("close", (function () { e.onClose("transport close") })) } }, { key: "probe", value: function (t) { var e = this.createTransport(t, { probe: 1 }), n = !1, r = this; function o() { if (r.onlyBinaryUpgrades) { var t = !this.supportsBinary && r.transport.supportsBinary; n = n || t } n || (e.send([{ type: "ping", data: "probe" }]), e.once("packet", (function (t) { if (!n) if ("pong" === t.type && "probe" === t.data) { if (r.upgrading = !0, r.emit("upgrading", e), !e) return; l.priorWebsocketSuccess = "websocket" === e.name, r.transport.pause((function () { n || "closed" !== r.readyState && (f(), r.setTransport(e), e.send([{ type: "upgrade" }]), r.emit("upgrade", e), e = null, r.upgrading = !1, r.flush()) })) } else { var o = new Error("probe error"); o.transport = e.name, r.emit("upgradeError", o) } }))) } function i() { n || (n = !0, f(), e.close(), e = null) } function s(t) { var n = new Error("probe error: " + t); n.transport = e.name, i(), r.emit("upgradeError", n) } function c() { s("transport closed") } function a() { s("socket closed") } function u(t) { e && t.name !== e.name && i() } function f() { e.removeListener("open", o), e.removeListener("error", s), e.removeListener("close", c), r.removeListener("close", a), r.removeListener("upgrading", u) } l.priorWebsocketSuccess = !1, e.once("open", o), e.once("error", s), e.once("close", c), this.once("close", a), this.once("upgrading", u), e.open() } }, { key: "onOpen", value: function () { if (this.readyState = "open", l.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.opts.upgrade && this.transport.pause) for (var t = 0, e = this.upgrades.length; t < e; t++)this.probe(this.upgrades[t]) } }, { key: "onPacket", value: function (t) { if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (this.emit("packet", t), this.emit("heartbeat"), t.type) { case "open": this.onHandshake(JSON.parse(t.data)); break; case "ping": this.resetPingTimeout(), this.sendPacket("pong"), this.emit("pong"); break; case "error": var e = new Error("server error"); e.code = t.data, this.onError(e); break; case "message": this.emit("data", t.data), this.emit("message", t.data) } } }, { key: "onHandshake", value: function (t) { this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && this.resetPingTimeout() } }, { key: "resetPingTimeout", value: function () { var t = this; clearTimeout(this.pingTimeoutTimer), this.pingTimeoutTimer = setTimeout((function () { t.onClose("ping timeout") }), this.pingInterval + this.pingTimeout) } }, { key: "onDrain", value: function () { this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush() } }, { key: "flush", value: function () { "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush")) } }, { key: "write", value: function (t, e, n) { return this.sendPacket("message", t, e, n), this } }, { key: "send", value: function (t, e, n) { return this.sendPacket("message", t, e, n), this } }, { key: "sendPacket", value: function (t, e, n, r) { if ("function" == typeof e && (r = e, e = void 0), "function" == typeof n && (r = n, n = null), "closing" !== this.readyState && "closed" !== this.readyState) { (n = n || {}).compress = !1 !== n.compress; var o = { type: t, data: e, options: n }; this.emit("packetCreate", o), this.writeBuffer.push(o), r && this.once("flush", r), this.flush() } } }, { key: "close", value: function () { var t = this; function e() { t.onClose("forced close"), t.transport.close() } function n() { t.removeListener("upgrade", n), t.removeListener("upgradeError", n), e() } function r() { t.once("upgrade", n), t.once("upgradeError", n) } return "opening" !== this.readyState && "open" !== this.readyState || (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", (function () { this.upgrading ? r() : e() })) : this.upgrading ? r() : e()), this } }, { key: "onError", value: function (t) { l.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t) } }, { key: "onClose", value: function (t, e) { "opening" !== this.readyState && "open" !== this.readyState && "closing" !== this.readyState || (clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e), this.writeBuffer = [], this.prevBufferLen = 0) } }, { key: "filterUpgrades", value: function (t) { for (var e = [], n = 0, r = t.length; n < r; n++)~this.transports.indexOf(t[n]) && e.push(t[n]); return e } }]) && s(e.prototype, n), u && s(e, u), l }(l); v.priorWebsocketSuccess = !1, v.protocol = h.protocol, t.exports = v }, function (t, e) { try { t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest } catch (e) { t.exports = !1 } }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o() { return (o = Object.assign || function (t) { for (var e = 1; e < arguments.length; e++) { var n = arguments[e]; for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]) } return t }).apply(this, arguments) } function i(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function s(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function c(t, e, n) { return e && s(t.prototype, e), n && s(t, n), t } function a(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && u(t, e) } function u(t, e) { return (u = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function f(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = l(t); if (e) { var o = l(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return p(this, n) } } function p(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function l(t) { return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var h = n(3), y = n(10), d = n(0), v = n(13).pick, b = n(2); function m() { } var g = null != new (n(3))({ xdomain: !1 }).responseType, k = function (t) { a(n, t); var e = f(n); function n(t) { var r; if (i(this, n), r = e.call(this, t), "undefined" != typeof location) { var o = "https:" === location.protocol, s = location.port; s || (s = o ? 443 : 80), r.xd = "undefined" != typeof location && t.hostname !== location.hostname || s !== t.port, r.xs = t.secure !== o } var c = t && t.forceBase64; return r.supportsBinary = g && !c, r } return c(n, [{ key: "request", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; return o(t, { supportsBinary: this.supportsBinary, xd: this.xd, xs: this.xs }, this.opts), new w(this.uri(), t) } }, { key: "doWrite", value: function (t, e) { var n = "string" != typeof t && void 0 !== t, r = this.request({ method: "POST", data: t, isBinary: n }), o = this; r.on("success", e), r.on("error", (function (t) { o.onError("xhr post error", t) })) } }, { key: "doPoll", value: function () { var t = this.request(), e = this; t.on("data", (function (t) { e.onData(t) })), t.on("error", (function (t) { e.onError("xhr poll error", t) })), this.pollXhr = t } }]), n }(y), w = function (t) { a(n, t); var e = f(n); function n(t, r) { var o; return i(this, n), (o = e.call(this)).opts = r, o.method = r.method || "GET", o.uri = t, o.async = !1 !== r.async, o.data = void 0 !== r.data ? r.data : null, o.isBinary = r.isBinary, o.supportsBinary = r.supportsBinary, o.create(), o } return c(n, [{ key: "create", value: function () { var t = v(this.opts, "agent", "enablesXDR", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized"); t.xdomain = !!this.opts.xd, t.xscheme = !!this.opts.xs; var e = this.xhr = new h(t), r = this; try { e.open(this.method, this.uri, this.async); try { if (this.opts.extraHeaders) for (var o in e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0), this.opts.extraHeaders) this.opts.extraHeaders.hasOwnProperty(o) && e.setRequestHeader(o, this.opts.extraHeaders[o]) } catch (t) { console.log(t) } if ("POST" === this.method) try { this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8") } catch (t) { } try { e.setRequestHeader("Accept", "*/*") } catch (t) { } "withCredentials" in e && (e.withCredentials = this.opts.withCredentials), this.opts.requestTimeout && (e.timeout = this.opts.requestTimeout), this.hasXDR() ? (e.onload = function () { r.onLoad() }, e.onerror = function () { r.onError(e.responseText) }) : e.onreadystatechange = function () { if (2 === e.readyState) try { var t = e.getResponseHeader("Content-Type"); (r.supportsBinary && "application/octet-stream" === t || "application/octet-stream; charset=UTF-8" === t) && (e.responseType = "arraybuffer") } catch (t) { } 4 === e.readyState && (200 === e.status || 1223 === e.status ? r.onLoad() : setTimeout((function () { r.onError("number" == typeof e.status ? e.status : 0) }), 0)) }, e.send(this.data) } catch (t) { return void setTimeout((function () { r.onError(t) }), 0) } "undefined" != typeof document && (this.index = n.requestsCount++, n.requests[this.index] = this) } }, { key: "onSuccess", value: function () { this.emit("success"), this.cleanup() } }, { key: "onData", value: function (t) { this.emit("data", t), this.onSuccess() } }, { key: "onError", value: function (t) { this.emit("error", t), this.cleanup(!0) } }, { key: "cleanup", value: function (t) { if (void 0 !== this.xhr && null !== this.xhr) { if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = m : this.xhr.onreadystatechange = m, t) try { this.xhr.abort() } catch (t) { } "undefined" != typeof document && delete n.requests[this.index], this.xhr = null } } }, { key: "onLoad", value: function () { var t = this.xhr.responseText; null !== t && this.onData(t) } }, { key: "hasXDR", value: function () { return "undefined" != typeof XDomainRequest && !this.xs && this.enablesXDR } }, { key: "abort", value: function () { this.cleanup() } }]), n }(d); if (w.requestsCount = 0, w.requests = {}, "undefined" != typeof document) if ("function" == typeof attachEvent) attachEvent("onunload", _); else if ("function" == typeof addEventListener) { addEventListener("onpagehide" in b ? "pagehide" : "unload", _, !1) } function _() { for (var t in w.requests) w.requests.hasOwnProperty(t) && w.requests[t].abort() } t.exports = k, t.exports.Request = w }, function (t, e, n) { var r = n(11).PACKET_TYPES, o = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob), i = "function" == typeof ArrayBuffer, s = function (t, e) { var n = new FileReader; return n.onload = function () { var t = n.result.split(",")[1]; e("b" + t) }, n.readAsDataURL(t) }; t.exports = function (t, e, n) { var c, a = t.type, u = t.data; return o && u instanceof Blob ? e ? n(u) : s(u, n) : i && (u instanceof ArrayBuffer || (c = u, "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(c) : c && c.buffer instanceof ArrayBuffer)) ? e ? n(u instanceof ArrayBuffer ? u : u.buffer) : s(new Blob([u]), n) : n(r[a] + (u || "")) } }, function (t, e, n) { var r, o = n(11), i = o.PACKET_TYPES_REVERSE, s = o.ERROR_PACKET; "function" == typeof ArrayBuffer && (r = n(26)); var c = function (t, e) { if (r) { var n = r.decode(t); return a(n, e) } return { base64: !0, data: t } }, a = function (t, e) { switch (e) { case "blob": return t instanceof ArrayBuffer ? new Blob([t]) : t; case "arraybuffer": default: return t } }; t.exports = function (t, e) { if ("string" != typeof t) return { type: "message", data: a(t, e) }; var n = t.charAt(0); return "b" === n ? { type: "message", data: c(t.substring(1), e) } : i[n] ? t.length > 1 ? { type: i[n], data: t.substring(1) } : { type: i[n] } : s } }, function (t, e) { !function () { "use strict"; for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = new Uint8Array(256), r = 0; r < t.length; r++)n[t.charCodeAt(r)] = r; e.encode = function (e) { var n, r = new Uint8Array(e), o = r.length, i = ""; for (n = 0; n < o; n += 3)i += t[r[n] >> 2], i += t[(3 & r[n]) << 4 | r[n + 1] >> 4], i += t[(15 & r[n + 1]) << 2 | r[n + 2] >> 6], i += t[63 & r[n + 2]]; return o % 3 == 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 == 1 && (i = i.substring(0, i.length - 2) + "=="), i }, e.decode = function (t) { var e, r, o, i, s, c = .75 * t.length, a = t.length, u = 0; "=" === t[t.length - 1] && (c--, "=" === t[t.length - 2] && c--); var f = new ArrayBuffer(c), p = new Uint8Array(f); for (e = 0; e < a; e += 4)r = n[t.charCodeAt(e)], o = n[t.charCodeAt(e + 1)], i = n[t.charCodeAt(e + 2)], s = n[t.charCodeAt(e + 3)], p[u++] = r << 2 | o >> 4, p[u++] = (15 & o) << 4 | i >> 2, p[u++] = (3 & i) << 6 | 63 & s; return f } }() }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e, n) { return (i = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = f(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function s(t, e) { return (s = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function c(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = f(t); if (e) { var o = f(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return a(this, n) } } function a(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? u(t) : e } function u(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function f(t) { return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var p, l = n(10), h = n(2), y = /\n/g, d = /\\n/g; function v() { } var b = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && s(t, e) }(l, t); var e, n, r, a = c(l); function l(t) { var e; !function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, l), (e = a.call(this, t)).query = e.query || {}, p || (p = h.___eio = h.___eio || []), e.index = p.length; var n = u(e); return p.push((function (t) { n.onData(t) })), e.query.j = e.index, "function" == typeof addEventListener && addEventListener("beforeunload", (function () { n.script && (n.script.onerror = v) }), !1), e } return e = l, (n = [{ key: "doClose", value: function () { this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i(f(l.prototype), "doClose", this).call(this) } }, { key: "doPoll", value: function () { var t = this, e = document.createElement("script"); this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) { t.onError("jsonp poll error", e) }; var n = document.getElementsByTagName("script")[0]; n ? n.parentNode.insertBefore(e, n) : (document.head || document.body).appendChild(e), this.script = e, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout((function () { var t = document.createElement("iframe"); document.body.appendChild(t), document.body.removeChild(t) }), 100) } }, { key: "doWrite", value: function (t, e) { var n, r = this; if (!this.form) { var o = document.createElement("form"), i = document.createElement("textarea"), s = this.iframeId = "eio_iframe_" + this.index; o.className = "socketio", o.style.position = "absolute", o.style.top = "-1000px", o.style.left = "-1000px", o.target = s, o.method = "POST", o.setAttribute("accept-charset", "utf-8"), i.name = "d", o.appendChild(i), document.body.appendChild(o), this.form = o, this.area = i } function c() { a(), e() } function a() { if (r.iframe) try { r.form.removeChild(r.iframe) } catch (t) { r.onError("jsonp polling iframe removal error", t) } try { var t = '<iframe src="javascript:0" name="' + r.iframeId + '">'; n = document.createElement(t) } catch (t) { (n = document.createElement("iframe")).name = r.iframeId, n.src = "javascript:0" } n.id = r.iframeId, r.form.appendChild(n), r.iframe = n } this.form.action = this.uri(), a(), t = t.replace(d, "\\\n"), this.area.value = t.replace(y, "\\n"); try { this.form.submit() } catch (t) { } this.iframe.attachEvent ? this.iframe.onreadystatechange = function () { "complete" === r.iframe.readyState && c() } : this.iframe.onload = c } }, { key: "supportsBinary", get: function () { return !1 } }]) && o(e.prototype, n), r && o(e, r), l }(l); t.exports = b }, function (t, e, n) { function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function o(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function i(t, e) { return (i = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function s(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = a(t); if (e) { var o = a(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return c(this, n) } } function c(t, e) { return !e || "object" !== r(e) && "function" != typeof e ? function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) : e } function a(t) { return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } var u = n(4), f = n(1), p = n(5), l = n(12), h = n(13).pick, y = n(29), d = y.WebSocket, v = y.usingBrowserWebSocket, b = y.defaultBinaryType, m = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(), g = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && i(t, e) }(a, t); var e, n, r, c = s(a); function a(t) { var e; return function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }(this, a), e = c.call(this, t), t && t.forceBase64 && (e.supportsBinary = !1), e.supportsBinary = !0, e } return e = a, (n = [{ key: "doOpen", value: function () { if (this.check()) { var t, e = this.uri(), n = this.opts.protocols; t = m ? h(this.opts, "localAddress") : h(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress"), this.opts.extraHeaders && (t.headers = this.opts.extraHeaders); try { this.ws = v && !m ? n ? new d(e, n) : new d(e) : new d(e, n, t) } catch (t) { return this.emit("error", t) } this.ws.binaryType = this.socket.binaryType || b, this.addEventListeners() } } }, { key: "addEventListeners", value: function () { var t = this; this.ws.onopen = function () { t.onOpen() }, this.ws.onclose = function () { t.onClose() }, this.ws.onmessage = function (e) { t.onData(e.data) }, this.ws.onerror = function (e) { t.onError("websocket error", e) } } }, { key: "write", value: function (t) { var e = this; this.writable = !1; for (var n = t.length, r = 0, o = n; r < o; r++)!function (t) { f.encodePacket(t, e.supportsBinary, (function (r) { var o = {}; v || (t.options && (o.compress = t.options.compress), e.opts.perMessageDeflate && ("string" == typeof r ? Buffer.byteLength(r) : r.length) < e.opts.perMessageDeflate.threshold && (o.compress = !1)); try { v ? e.ws.send(r) : e.ws.send(r, o) } catch (t) { } --n || (e.emit("flush"), setTimeout((function () { e.writable = !0, e.emit("drain") }), 0)) })) }(t[r]) } }, { key: "onClose", value: function () { u.prototype.onClose.call(this) } }, { key: "doClose", value: function () { void 0 !== this.ws && this.ws.close() } }, { key: "uri", value: function () { var t = this.query || {}, e = this.opts.secure ? "wss" : "ws", n = ""; return this.opts.port && ("wss" === e && 443 !== Number(this.opts.port) || "ws" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port), this.opts.timestampRequests && (t[this.opts.timestampParam] = l()), this.supportsBinary || (t.b64 = 1), (t = p.encode(t)).length && (t = "?" + t), e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + t } }, { key: "check", value: function () { return !(!d || "__initialize" in d && this.name === a.prototype.name) } }, { key: "name", get: function () { return "websocket" } }]) && o(e.prototype, n), r && o(e, r), a }(u); t.exports = g }, function (t, e, n) { var r = n(2); t.exports = { WebSocket: r.WebSocket || r.MozWebSocket, usingBrowserWebSocket: !0, defaultBinaryType: "arraybuffer" } }, function (t, e, n) { "use strict"; function r(t) { return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } Object.defineProperty(e, "__esModule", { value: !0 }), e.reconstructPacket = e.deconstructPacket = void 0; var o = n(15); e.deconstructPacket = function (t) { var e = [], n = t.data, i = t; return i.data = function t(e, n) { if (!e) return e; if (o.isBinary(e)) { var i = { _placeholder: !0, num: n.length }; return n.push(e), i } if (Array.isArray(e)) { for (var s = new Array(e.length), c = 0; c < e.length; c++)s[c] = t(e[c], n); return s } if ("object" === r(e) && !(e instanceof Date)) { var a = {}; for (var u in e) e.hasOwnProperty(u) && (a[u] = t(e[u], n)); return a } return e }(n, e), i.attachments = e.length, { packet: i, buffers: e } }, e.reconstructPacket = function (t, e) { return t.data = function t(e, n) { if (!e) return e; if (e && e._placeholder) return n[e.num]; if (Array.isArray(e)) for (var o = 0; o < e.length; o++)e[o] = t(e[o], n); else if ("object" === r(e)) for (var i in e) e.hasOwnProperty(i) && (e[i] = t(e[i], n)); return e }(t.data, e), t.attachments = void 0, t } }, function (t, e) { function n(t) { t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0 } t.exports = n, n.prototype.duration = function () { var t = this.ms * Math.pow(this.factor, this.attempts++); if (this.jitter) { var e = Math.random(), n = Math.floor(e * this.jitter * t); t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n } return 0 | Math.min(t, this.max) }, n.prototype.reset = function () { this.attempts = 0 }, n.prototype.setMin = function (t) { this.ms = t }, n.prototype.setMax = function (t) { this.max = t }, n.prototype.setJitter = function (t) { this.jitter = t } }]) }));

const socket = {
    clientData: {
        playerName: undefined,
        lobbyKey: undefined
    },
    data: {
        publicData: {},
        lobbyLinks: [],
        user: {}
    },
    sck: null,
    dropSocket: undefined,
    authenticated: false,
    emitEvent: (event, payload, listenResponse = false, responseTimeout = 2000) => {
        return new Promise((resolve, reject) => {
            let timeout = null;
            if (listenResponse) socket.sck.once(event + " response", (data) => {
                if (timeout) clearTimeout(timeout);
                resolve(data.payload);
            });
            try { socket.sck.emit(event, { event: event, payload: payload }); }
            catch { reject(new Error("Failed emitting event: " + event)); }
            if (!listenResponse) resolve(true);
            else timeout = setTimeout(() => { reject((new Error("Timed out")).stack) }, responseTimeout);
        });
    },
    init: async () => {
        // get balanced socket port
        let contact = io("https://main.ithil.typo.rip", {
            transports: ['websocket']
        });
        let worker = await new Promise((resolve, reject) => {
            setTimeout(() => !contact && reject("Cant connect to typo balancer"));
            contact.on("connect", () => {
                contact.on("balanced port", (data) => contact = undefined || resolve(data.alias));
                contact.emit("request port", { auth: "member", client: localStorage.client });
            });
        });
        socket.sck = io("https://" + worker + ".ithil.typo.rip", {
            transports: ['websocket']
        });
        const onConnect = async () => {
            if (socket.sck == null) return;
            console.log("Connected to Ithil socketio server '" + worker + "'");
            socket.sck.on("clear drop", (data) => {
                drops.clearDrop(data.payload);
            });
            socket.sck.on("specialdrop", (data) => {
                data.event = data.event + " response";
                drops.specialDrop(() => socket.emitEvent(data.event, data));
            });
            socket.sck.on("server message", (data) => {
                addChatMessage(data.payload.title, data.payload.message);
            });
            socket.sck.on("rank drop", (data) => {
                drops.rankDrop(data.payload);
            });
            socket.sck.on("public data", (data) => {
                socket.data.publicData = data.payload.publicData;
            });
            socket.sck.on("disconnect", (reason) => {
                // handle disconnect reasons different
                console.log("Disconnected with reason: " + reason);
                lobbies.joined = false;
                socket.dropSocket?.close();
                socket.dropSocket = undefined;

                // if probably tempoary disconnect (server crash/restart, internet) enable reconnect without new balanced port
                if (reason == "transport close" || reason == "ping timeout" || reason == "transport error") {
                    console.log("Trying to reconnect...");
                    socket.sck.removeAllListeners();

                    socket.sck.on("connect", onConnect);
                }
                // if either server or client disconnected on purpose, shutdown and remove listeners
                else {

                    // disable socketio-reconnects 
                    socket.sck.removeAllListeners();
                    socket.sck.io._reconnection = false;
                    socket.sck = null;
                }
            });
            socket.sck.on("online sprites", (data) => {
                socket.data.publicData.onlineSprites = data.payload.onlineSprites;
                socket.data.publicData.onlineScenes = data.payload.onlineScenes;
                socket.data.publicData.onlineItems = data.payload.onlineItems;

                /*// TODO REMOVE
                socket.data.publicData.onlineItems.push({
                    ItemType: "sceneTheme",
                    Slot: 1,
                    ItemID: 20,
                    LobbyKey: socket.clientData.lobbyKey,
                    LobbyPlayerID: 0,
                    Date: Date.now()
                });*/
            });
            socket.sck.on("drawingAwarded", data => {
                const lobbyKey = data.payload.lobbyKey;
                const lobbyPlayerId = data.payload.lobbyPlayerId;
                const fromLobbyPlayerId = data.payload.from;
                const awardId = data.payload.awardId;
                const awardInvId = data.payload.awardInventoryId;

                if (lobbies.lobbyProperties.Key == lobbyKey) {
                    awards.presentAward(awardId, awardInvId, fromLobbyPlayerId, lobbyPlayerId);
                }
            });
            let updateTimeout = null;
            socket.sck.on("active lobbies", (data) => {
                socket.data.lobbyLinks = socket.data.lobbyLinks.filter(link => link.guildId != data.payload.guild);
                data.payload.activeGuildLobbies.forEach(item => socket.data.lobbyLinks.push(item));
                let updateIn = updateTimeout = setTimeout(() => {
                    if (updateIn != updateTimeout) return; // if fast updates happen (each guild lobby is put separate) wait 100ms
                    lobbies.lobbyContainer = lobbies.setLobbyContainer();
                }, 200);
            });
            const accessToken = localStorage.accessToken;
            let loginstate = await socket.emitEvent("login", { accessToken: accessToken, client: localStorage.client }, true, 30000);
            if (loginstate.authorized == true) {
                socket.authenticated = true;
                socket.data.lobbyLinks = loginstate.lobbyLinks;
                socket.data.user = (await socket.emitEvent("get user", null, true)).user;
                localStorage.member = JSON.stringify(socket.data.user.member);
                document.dispatchEvent(newCustomEvent("palantirLoaded"));

                if (lobbies.inGame && !lobbies.joined && lobbies.userAllow) {
                    socket.joinLobby(lobbies.lobbyProperties.Key);
                    lobbies.joined = true;
                }
                if (lobbies.inGame && lobbies.userAllow) socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key);
            }
            else document.dispatchEvent(newCustomEvent("palantirLoaded"));
            lobbies.lobbyContainer = lobbies.setLobbyContainer();

            let documentIdle = null;
            let visibilitychangeDisconnect = () => {
                if (documentIdle) clearInterval(documentIdle);
                // if visibility changes to hidden disconnect after x seconds
                if (document.hidden) documentIdle = setTimeout(() => {
                    if (document.hidden && socket) {
                        socket.disconnect();
                        document.removeEventListener("visibilitychange", visibilitychangeDisconnect);
                        // reconnect when doc is visible again
                        document.addEventListener("visibilitychange", visibilitychangeConnect);
                    }
                }, 1000 * 60 * 5);
            };
            let visibilitychangeConnect = () => {
                // reconnect when doc is visible again 
                if (!document.hidden) {
                    document.removeEventListener("visibilitychange", visibilitychangeConnect);
                    socket.init();
                }
            }
            document.addEventListener('visibilitychange', visibilitychangeDisconnect);
        }
        socket.sck.on("connect", onConnect);
    },
    disconnect: () => socket.sck.close(),
    searchLobby: async (waiting = false) => {
        try {
            await socket.emitEvent("search lobby", { searchData: { userName: socket.clientData.playerName, waiting: waiting } });
        }
        catch (e) { console.log("Error setting search status:" + e.toString()); }
    },
    joinLobby: async (key) => {
        try {
            await socket.emitEvent("join lobby", { key: key }, true);
        }
        catch (e) { console.log("Error joining lobby status:" + e.toString()); }

        // connect to websocket drop server
        if (!socket.dropSocket) socket.dropSocket = new WebSocket("wss://drops.ithil.typo.rip");
        socket.dropSocket.addEventListener("message", (event) => {
            // parse received drop
            const dropdata = event.data.split(":"); // dropID:eventDropID:claimTicket
            const drop = {
                dropID: dropdata[0],
                eventDropID: dropdata[1],
                claimTicket: dropdata[2]
            }
            drops.newDrop(drop);
        });
    },
    setLobby: async (lobby, key, description = "") => {
        const thisSet = Date.now();
        window.lastLobbyFlush = thisSet;
        setTimeout(async () => {

            if (window.lastLobbyFlush === thisSet) {
                try {
                    let resp = (await socket.emitEvent("set lobby", { lobbyKey: key, lobby: lobby, description: description, restriction: localStorage.restrictLobby }, true));
                    let veriflobby = resp.lobbyData.lobby;
                    let owner = resp.owner;

                    drops.mode = resp.dropMode;
                    lobbies.lobbyProperties.Description = veriflobby.Description;
                    if (QS("#lobbyDesc")) QS("#lobbyDesc").value = veriflobby.Description;
                    if (QS("#restrictLobby")) QS("#restrictLobby").style.display = owner && lobbies.lobbyProperties.Private ? "" : "none";
                }
                catch (e) { console.log("Error setting lobby status:" + e.toString()); }
                // console.log("flushed lobby");
            }
            else {
                // console.log("skipped flush");
            }
        }, 1000);
    },
    leaveLobby: async () => {
        awards.toggleState(false);
        try {
            socket.dropSocket.close();
            socket.dropSocket = undefined;
            let response = await socket.emitEvent("leave lobby", { joined: lobbies.joined }, true);
            socket.data.lobbyLinks = response.lobbyLinks;
        }
        catch (e) { console.log("Error leaving playing status:" + e.toString()); }
    },
    claimDrop: async (drop, timeout = false, claimDetails = "") => {
        try {
            let response = await socket.emitEvent("claim drop", {
                dropID: drop.dropID,
                timedOut: timeout,
                claimTicket: drop.claimTicket,
                claimDetails: claimDetails
            }, false);
            return true;
        }
        catch (e) {
            console.log("Error claiming drop:" + e.toString());
            return { caught: false };
        }
    },
    setSpriteSlot: async (slot, sprite) => {
        let user = (await socket.emitEvent("set slot", { slot: slot, sprite: sprite }, true, 10000)).user;
        return user;
    },
    getUser: async () => {
        let user = (await socket.emitEvent("get user", {}, true, 10000));
        return user;
    },
    setSpriteCombo: async (combostring) => {
        let user = (await socket.emitEvent("set combo", { combostring: combostring }, true, 10000)).user;
        return user;
    }
}

// #content features/lobbies.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, socket.js
const lobbies = {
	userAllow: localStorage.palantir == "true",
	inGame: false,
	joined: false,
	lobbyContainer: null,
	searchData: { searching: false, check: null, proceed: null, ended: null },
	lobbyProperties: {
		Round: 1,
		Private: true,
		Link: "",
		Host: "skribbl.io",
		Language: "",
		Players: [],
		Key: "",
		Description: ""
	},
	getLobbyPlayers: () => {
		let players = [];
		[...QSA("#game-players .player")].forEach(player => {
			players.push({
				Name: player.querySelector(".player-name").textContent.replace("(You)", "").trim(),
				Score: player.querySelector(".player-score").textContent.replace("points", "").trim(),
				Drawing: (player.querySelector(".drawing").style.display != "none"),
				Sender: player.querySelector(".player-name").textContent.includes("(You)"),
				LobbyPlayerID: player.getAttribute("playerid")
			});
		});
		return players;
	},
	getTriggerElements: () => {
		return [QS("#game-round"), QS("#game-players"), [...QSA(".avatar .drawing")]].flat();
	},
	setLobbyContainer: () => {
		// get online players with lobby links
		let onlinePlayers = [];
		socket.data.lobbyLinks.forEach(
			invite => {
				if(!onlinePlayers.some(added => added.link === invite.link && added.username === invite.username)) onlinePlayers.push(invite);
			});
		let playerButtons = "";
		onlinePlayers.forEach(player => playerButtons += `<button data-typo-tooltip="${player.slotAvailable} slots" link="${player.link}" slotAvailable=${player.slotAvailable} class="flatUI green min air" style="margin: .5em">${player.username}</button>`);
		if (playerButtons == "") playerButtons = "<span>None of your friends are online :(</span>";
		let container = elemFromString("<div id='discordLobbies'></div>");
		if (socket.sck?.connected) {
			if (socket.authenticated) container.innerHTML = playerButtons;
			else {
				container.innerHTML = `<h3>No palantir account connected.</h3><br><button class="flatUI air min blue">Log in with Palantir</button>`;
				container.querySelector("button")?.addEventListener("click", login);
			}
		}
		else {
			container.innerHTML = "<bounceload></bounceload> Connecting to Typo server...";
		}
		/*document.dispatchEvent(new Event("addTypoTooltips"));*/
		container.addEventListener("click", e => {
			let link = e.target.getAttribute("link");
			let slotAvailable = e.target.getAttribute("slotAvailable");
			let name = e.target.innerText;
			if (link) {
				if (slotAvailable) document.dispatchEvent(newCustomEvent("joinLobby", { detail: link.split("?")[1] }));
				else {

					let modal = new Modal(elemFromString(`<div><img src="https://c.tenor.com/fAQuR0VNdDIAAAAC/cat-cute.gif"></div>`), () => {
						if (!search.searchData.searching) return;
						search.searchData.ended();
					}, "Waiting for a free slot to play with " + name, "40vw", "15em");

					search.setSearch(() => {
						if (!QS("[link=" + link + "]")) {
							search.searchData.ended();
							new Toast("The lobby has ended :(");
						}
						console.log(Number(QS("[link=" + link + "]").getAttribute("slotAvailable")));
						let success = Number(QS("[link=" + link + "]").getAttribute("slotAvailable")) < 1;
						if (success) document.dispatchEvent(newCustomEvent("joinLobby", { detail: link }));
						return success;
					}, async () => {
					}, () => {
						search.searchData = {
							searching: false,
							check: undefined, proceed: undefined, ended: undefined
						};
						modal.close();
					});

					let interval = setInterval(() => {
						if (!search.searchData.searching) clearInterval(interval);
						if (search.searchData.check()) {
							search.searchData.ended();
							clearInterval(interval);
						}
					}, 500);
				}
			}
			else new Toast("Lobby access is restricted.");
		});
		QS("#discordLobbies").replaceWith(container);
	},
	init: () => {
		lobbies.inGame = false; // as soon as player is in a lobby
		lobbies.joined = false; // as soon as socket has joined a lobby
		// send reports when lobby changes
		const lobbyObserver = new MutationObserver(async () => {
			if (lobbies.inGame) {
				lobbies.lobbyProperties.Players = lobbies.getLobbyPlayers();
				lobbies.lobbyProperties.Round = parseInt(QS("#game-round").textContent.trim()[6]);
				if (!lobbies.lobbyProperties.Round) lobbies.lobbyProperties.Round = 0;
				socket.clientData.lobbyKey = lobbies.lobbyProperties.Key;
				let description = QS(".icon.owner.visible") ? (QS("#lobbyDesc") && QS("#lobbyDesc").value ? QS("#lobbyDesc").value : '') : "";
				if (lobbies.joined && lobbies.userAllow) { // report lobby if joined
					await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key, description);
				}
			}
		});

		// init lobby container
		lobbies.lobbyContainer = lobbies.setLobbyContainer();
		// on lobby join
		document.addEventListener("lobbyConnected", async (e) => {

			lobbyObserver.disconnect();

			lobbyObserver.observe(QS("#game-round"), { characterData: true, childList: false, subtree: false, attributes: false });
			lobbyObserver.observe(QS("#game-players"), { characterData: true, childList: true, subtree: false, attributes: false });
			lobbyObserver.observe(QS("#game-word .description"), { characterData: false, childList: false, subtree: false, attributes: true });
			// lobbies.getTriggerElements().forEach(elem => lobbyObserver.observe(elem, { characterData: true, childList: true, subtree: true, attributes: true }));

			// fill in basic lobby props 
			lobbies.lobbyProperties.Language = QS("#home div.panel > div.container-name-lang > select option[value = '" + e.detail.settings[0] + "']").innerText;
			lobbies.lobbyProperties.Private = e.detail.owner >= 0 ? true : false;
			console.log(e.detail.id);
			lobbies.lobbyProperties.Link = window.location.origin + "?" + e.detail.id;

			// generate lobby key by hashed link
			lobbies.lobbyProperties.Key = genMatchHash(e.detail.id);
			lobbies.lobbyProperties.Round = e.detail.round + 1;

			// get own name
			sessionStorage.lastLoginName = socket.clientData.playerName = e.detail.users[e.detail.users.length - 1].name;
			lobbies.inGame = true;

			// get initialplayers for search check and report
			lobbies.lobbyProperties.Players = [];
			e.detail.users.forEach(p => {
				let add = {
					Name: p.name,
					Score: p.score,
					Drawing: false,
					LobbyPlayerID: p.id,
					Sender: false
				};
				if (add.Name == socket.clientData.playerName) add.Sender = true;
				lobbies.lobbyProperties.Players.push(add);
			});


			// check if lobby search is running and criteria is met
			if (search.searchData.searching) {
				if (search.searchData.check()) {
					search.searchData.ended();
					QS("#searchRules")?.remove();
				}
				else {
					search.searchData.proceed();
					return;
				}
			}

			// set as searching with timeout for report
			if (lobbies.userAllow && !lobbies.joined && socket.authenticated == true) {
				await socket.joinLobby(lobbies.lobbyProperties.Key);
				await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key);
				lobbies.joined = true;
			}
		});
		// on lobby leave / login show
		document.addEventListener("leftLobby", async () => {
			lobbies.inGame = false;
			if (QS("#restrictLobby")) QS("#restrictLobby").style.display = "none";
			if (lobbies.joined) {
				await socket.leaveLobby();
				lobbies.joined = false;
			}
		});
	}

}

// #content features/imageOptions.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// inits the image options bar
// dependend on: genericfunctions.js, capture.js, commands.js
let imageOptions = {
    optionsContainer: undefined,
    drawCommandsToGif: async (filename = "download", commands = null) => {
        // generate a gif of stored draw commands
        let workerJS = "";
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/b64.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/GIFEncoder.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/LZWEncoder.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/NeuQuant.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/skribblCanvas.js"))).text();
        workerJS += await (await fetch(chrome.runtime.getURL("gifCap/capture.js"))).text();
        let renderWorker = new Worker(URL.createObjectURL(new Blob([(workerJS)], { type: 'application/javascript' })));
        if (!commands) commands = captureCanvas.capturedCommands;

        let length = prompt("Enter the GIF duration in seconds", 4);
        length = Number(length);
        if (Number.isNaN(length) || length < 1 || length > 60) length = 4;

        renderWorker.postMessage({ 'filename': filename, 'capturedCommands': commands, "gifLength": length });

        // T H I C C progress bar 
        let progressBar = document.createElement("p");
        progressBar.style.color = "rgb(0, 0, 0)";
        progressBar.style.background = "rgb(247, 210, 140)";
        progressBar.innerText = String.fromCodePoint("0x2B1C").repeat(10) + " 0%";

        renderWorker.onerror = (err) => {
            progressBar.innerText = "Failed creating the GIF :(";
            console.log(err);
        };
        renderWorker.addEventListener('message', function (e) {
            if (e.data.download) {
                progressBar.innerText = String.fromCodePoint("0x1F7E9").repeat(10) + " Done!";
                let templink = document.createElement("a");
                templink.download = filename;
                templink.href = e.data.download;
                templink.click();
            }
            else if (e.data.progress) {
                let prog = Math.floor(e.data.progress * 10);
                let miss = 10 - prog;
                let bar = "";
                while (prog > 0) {
                    bar += String.fromCodePoint("0x1F7E9"); prog--;
                }
                while (miss > 0) {
                    bar += String.fromCodePoint("0x2B1C"); miss--;
                }
                progressBar.innerText = bar;
                let percent = Math.round(e.data.progress * 100)
                progressBar.innerText += " " + percent + "%";
            }
        }, false);
        //printCmdOutput("render");
        QS("#game-chat .chat-content").appendChild(progressBar);
    },
    initContainer: () => {
        // new imageoptions container on the right side
        let imgtools = elemFromString(`<div id="imageOptions"></div>`);
        QS("#game-wrapper").appendChild(imgtools);
        imageOptions.optionsContainer = imgtools;
    },
    downloadDataURL: async (url, name = "skribbl-unknown", scale = 1) => {
        let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer = getCurrentOrLastDrawer();
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);
        d.download = name;
        d.href = await scaleDataURL(url,
            document.querySelector("#game-canvas canvas").width * scale,
            document.querySelector("#game-canvas canvas").height * scale);
        d.dispatchEvent(e);
    },
    downloadImageURL: async (url, name = "skribbl-unknown", scale = 1) => {
        const blob = await (await fetch(url)).blob();
        const blobUrl = URL.createObjectURL(blob);
        let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer = getCurrentOrLastDrawer();
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);
        d.download = name;
        d.href = blobUrl;
        d.dispatchEvent(e);
    },
    initDownloadOptions: () => {
        // add DL button for gif
        const downloadOptions = elemFromString(`<img src="${chrome.runtime.getURL("res/floppy-drive.gif")}" id="downloadImg" style="cursor: pointer;"  data-typo-tooltip="Save Drawing" data-tooltipdir="N">`);
        // popup for sharing image
        const downloadPopup = elemFromString(`<div id="downloadPopup" tabIndex="-1" style="display:none">
    Save Image<br><br><label for="sendImageOnly">
        <input type="checkbox" id="dlQuality" class="flatUI small">
        <span>High quality</span>
    </label>
    <button class="flatUI blue" id="dlPng" >As PNG</button><br>
    <button class="flatUI blue" id="dlGif" >As GIF</button>
    <button class="flatUI green" id="saveCloud">In Typo Cloud</button>
</div>`);
        imageOptions.optionsContainer.appendChild(downloadOptions);
        downloadOptions.addEventListener("click", () => {
            downloadPopup.style.display = "";
            downloadPopup.focus();
        });
        imageOptions.optionsContainer.appendChild(downloadPopup);
        QS("#dlGif").addEventListener("click", () => {
            let e = document.createEvent("MouseEvents"), d = document.createElement("a"), drawer = getCurrentOrLastDrawer();
            e.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0, false, false, false,
                false, 0, null);
            d.download = "skribbl" + document.querySelector("#game-word .word").textContent + (drawer ? drawer : "");
            d.href = document.querySelector("#game-canvas canvas").toDataURL("image/png;base64");
            imageOptions.drawCommandsToGif(d.download);
            downloadPopup.style.display = "none";
        });
        QS("#dlPng").addEventListener("click", async () => {
            await imageOptions.downloadDataURL(
                document.querySelector("#game-canvas canvas").toDataURL("image/png;base64"),
                "skribbl-" + getCurrentWordOrHint() + "-by-" + getCurrentOrLastDrawer(),
                QS("#dlQuality").checked ? 3 : 1
            );
            downloadPopup.style.display = "none";
        });
        QS("#saveCloud").addEventListener("click", async () => {
            if (socket.authenticated) {
                let name = prompt("Enter a name");
                if (!name) name = "Practice";
                document.dispatchEvent(newCustomEvent("drawingFinished", { detail: name }));
                new Toast("Saved the drawing in the cloud.");
            }
            else {
                new Toast("Create a palantir account to save drawings in the cloud!");
            }
            downloadPopup.style.display = "none";
        });
        Array.from(downloadPopup.children).concat(downloadPopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!downloadPopup.contains(document.activeElement)) downloadPopup.style.display = "none" }, 20); }));
    },
    initImagePoster: () => {
        // popup for sharing image
        let sharePopup = elemFromString(`<div id="sharePopup" tabIndex="-1" style="display:none">
    Post @ Discord<br><br>
    <input type="text" class="flatUI" id="postNameInput" placeholder="Post Title"><br>
    <label for="sendImageOnly">
        <input type="checkbox" id="sendImageOnly" class="flatUI small">
        <span>Send only image</span>
    </label>
    <img id="shareImagePreview">
    <div id="shareButtons">
    </div>
</div>`);
        imageOptions.optionsContainer.appendChild(sharePopup);
        let buttonCont = QS("#shareButtons");

        // btn to open share popup
        let imageShareString;
        let imageShareStringDrawer;
        let shareButton = elemFromString(`<img src="${chrome.runtime.getURL("res/letter.gif")}" id="shareImg" style="cursor: pointer;"  data-typo-tooltip="Post Drawing" data-tooltipdir="N">`);
        shareButton.addEventListener("click", () => {
            if (!localStorage.hintShareImage) {
                alert("The shown image will be posted to one of the displayed Discord channels.\nClick with the left or right mouse button on the preview to navigate older images.");
                localStorage.hintShareImage = "true";
            }
            imageShareString = QS("#game-canvas canvas").toDataURL("image/png;base64");
            imageShareStringDrawer = getCurrentOrLastDrawer();
            QS("#shareImagePreview").src = imageShareString;
            QS("#shareImagePreview").setAttribute("imageIndex", -1);
            let word = getCurrentWordOrHint();
            QS("#postNameInput").value = word + " (" + word.length + ")";
            sharePopup.style.display = "";
            sharePopup.focus();
        });
        imageOptions.optionsContainer.appendChild(shareButton);

        // image preview
        let imagePreview = QS("#shareImagePreview");
        let navigateImagePreview = (direction) => {
            let currentIndex = Number(imagePreview.getAttribute("imageIndex"));
            let allDrawings = [...captureCanvas.capturedDrawings];
            allDrawings.push({
                drawing: document.querySelector("#game-canvas canvas").toDataURL("2d"),
                drawer: getCurrentOrLastDrawer(),
                word: getCurrentWordOrHint(),
                hint: "(" + getCurrentWordOrHint().length + ")"
            });
            if (currentIndex < 0) currentIndex = allDrawings.length - 1;
            currentIndex += direction;
            if (currentIndex >= 0 && currentIndex < allDrawings.length) {
                imagePreview.src = allDrawings[currentIndex].drawing;
                QS("#postNameInput").value = allDrawings[currentIndex].word + allDrawings[currentIndex].hint;
                imageShareString = allDrawings[currentIndex].drawing;
                imageShareStringDrawer = allDrawings[currentIndex].drawer;
                imagePreview.setAttribute("imageIndex", currentIndex);
            }
        };
        imagePreview.addEventListener("click", () => { navigateImagePreview(-1); });
        imagePreview.addEventListener("contextmenu", (e) => { e.preventDefault(); navigateImagePreview(1); });

        // get webhooks
        let webhooks = socket.data.user.webhooks;

        // add buttons to post image
        if (webhooks === undefined || webhooks.length <= 0) sharePopup.innerHTML += "ImagePoster lets you share images directly to discord. <br><br>You need to be logged in with palantir and in a server that uses ImagePost..";
        else {
            webhooks.forEach(async (w) => {
                // add share button for image
                let shareImg = document.createElement("button");
                let serverName = socket.data.user.member.Guilds.find(g => g.GuildID == w.ServerID).GuildName;
                shareImg.innerHTML = "[" + serverName + "] <br>" + w.Name;
                shareImg.classList.add("flatUI", "green", "air");
                shareImg.addEventListener("click", async () => {

                    // close popup first to avoid spamming
                    sharePopup.style.display = "none";
                    let title = QS("#postNameInput").value.replaceAll("_", " ⎽ ");
                    let loginName = socket.clientData.playerName ? socket.clientData.playerName : QS(".input-name").value;

                    // send to socket
                    /*await socket.emitEvent("post image", {
                        accessToken: localStorage.accessToken,
                        serverID: w.ServerID,
                        imageURI: imageShareString,
                        webhookName: w.Name,
                        postOptions: {
                            onlyImage: QS("#sendImageOnly").checked,
                            drawerName: imageShareStringDrawer,
                            posterName: loginName,
                            title: title
                        }
                    });*/
                    await typoApiFetch(`/guilds/${w.Token}/imagepost/${w.Name}`, "POST", undefined, {
                        title: title,
                        author: imageShareStringDrawer,
                        posterName: loginName,
                        onlyImage: QS("#sendImageOnly").checked,
                        imageBase64: imageShareString.split(",")[1].replace("==", "")
                    }, localStorage.accessToken, false);

                    new Toast("Posted image on Discord.", 2000);
                });
                sharePopup.appendChild(shareImg);
            });
        }
        Array.from(sharePopup.children).concat(sharePopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!sharePopup.contains(document.activeElement)) sharePopup.style.display = "none" }, 20); }));
    },
    initFullscreen: () => {
        // add fullscreen btn
        let fulls = elemFromString("<img data-typo-tooltip='Fullscreen' data-tooltipdir='N'  style='cursor:pointer;' src='" + chrome.runtime.getURL("/res/fullscreen.gif") + "'>");
        fulls.addEventListener("click", () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            else {
                if (QS("#game").style.display == "none") {
                    new Toast("Fullscreen mode is only available in-game.", 2000);
                    return;
                }
                document.documentElement.requestFullscreen();
                document.head.insertAdjacentHTML("beforeEnd", `<style id='fullscreenRules'>
                    @media(min-aspect-ratio: 2/1) {
                        div#game-canvas {
                            height: calc(100vh - 2*48px - 4*var(--BORDER_GAP));
                            width: calc((100vh - 2*48px - 4*var(--BORDER_GAP)) * 4/3);
                        }
                        
                        div#game {
                            position: fixed;
                            inset: 0;
                            margin: 0 !important;
                        }
                    }
                    
                    @media(max-aspect-ratio: 2/1) {
                        div#game-wrapper {
                          width: 100%;
                        }
                        
                        div#controls {
                            bottom: 9px;
                            top: unset !important;
                        }
                        
                        div#game-chat {
                            width: 100%;
                        }
                    }
                    
                    div#game-logo {
                        display: none;
                    }
                    
            </style>`);
            }
        });
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                QS("#fullscreenRules").remove();
            }
        });
        imageOptions.optionsContainer.appendChild(fulls);
    },
    initAll: () => {
        imageOptions.initContainer();
        imageOptions.initFullscreen();
        imageOptions.initDownloadOptions();
    }
}

// #content patcher.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const VERSION_ALLOWED = new Promise(async (resolve, reject) => {
    try {
        resolve(true);
        return;
        /*const allowedVersions = await(await fetch("https://api.allorigins.win/raw?url=https://pastebin.com/raw/VGVuuaP0&d=" + Date.now())).json();
        const js = await (await fetch("js/game.js")).text();
        const hash = cyrb53(js);
        console.log("Current skribbl.io version hash:", hash);
        const allowAllVersions = allowedVersions.includes("wildcard");
        if(allowAllVersions) console.log("Skribbl.io version wildcard active");
        resolve(allowedVersions.includes(hash) || allowAllVersions);*/
    }
    catch {
        resolve(false);
    }
});

(async () => {
    const allowed = await VERSION_ALLOWED;
    const currentAllowed = localStorage.typoCompatible;
    const nowAllowed = allowed ? "1" : "0";
    if(currentAllowed !== nowAllowed) {
        localStorage.typoCompatible = nowAllowed;
        location.reload();
    }
})();

if(localStorage.typoCompatible !== "1") throw new Error("Aborted patcher because typo not compatible with current skribbl version");

// hello there
console.log(`%c
        _             _   _       _       _   _                           
       | |           (_) | |     | |     | | | |     %cskribbl modded with%c
  ___  | | __  _ __   _  | |__   | |__   | | | |_   _   _   _ __     ___  
 / __| | |/ / | '__| | | | '_ \\  | '_ \\  | | | __| | | | | | '_ \\   / _ \\ 
 \\__ \\ |   <  | |    | | | |_) | | |_) | | | | |_  | |_| | | |_) | | (_) |
 |___/ |_|\\_\\ |_|    |_| |_.__/  |_.__/  |_|  \\__|  \\__, | | .__/   \\___/ 
                                                     __/ | | |            
                                                    |___/  |_|     %cby tobeh#7437 %c

        ➜ Typo & all its backend is open source: https://github.com/toobeeh/skribbltypo
        ➜ Join the community: https://discord.com/invite/pAapmUmWAM
        ➜ Find more infos at: https://www.typo.rip/
        ➜ Support development: https://patreon.com/skribbltypo
                                                                    
                                                    `, "color: lightblue", "color:#2596be; font-family:'Arial'; font-weight:bold; font-style:italic; letter-spacing:2em", "color: lightblue", "color:#2596be; font-family:'Arial'; font-weight:bold; font-style:italic; letter-spacing:2em", "color:#f39656")

// execute inits when both DOM and palantir are loaded
const waitForDocAndPalantir = async () => {
    let palantirReady = false;
    let DOMready = false;
    return new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            DOMready = true;
            if (palantirReady) resolve(true);
        });
        document.addEventListener("palantirLoaded", () => {
            palantirReady = true;
            if (DOMready) resolve(true);
        });
        setTimeout(() => { reject(false); }, 20000);
    });
}
// await DOM load and palantir connection
(async () => {
    if (await waitForDocAndPalantir()) {
        await sprites.init(); // init sprites
        drops.initDrops(); // init drops
        imageOptions.initImagePoster();
        document.dispatchEvent(new Event("addTypoTooltips"));
        uiTweaks.updateAccountElements(); // set account elements as cabin and landing sprites
        if (localStorage.restrictLobby == "" && socket.data.user.member) {
            QS("#restrictLobby").dispatchEvent(new Event("click"));
        }
    }
    else alert("Error connecting to Palantir :/");
})().catch(console.error);

visuals.init(); //init visual options popup
let currentNodes = document.getElementsByTagName("*");

// inject patched game.js and modify elements that are immediately after page load visible
let patchNode = async (node) => {
    if (localStorage.visualOptions && (node.tagName == "BODY" || node.tagName == "IMG")) { // head or image is loaded
        // load current options
        visuals.loadActiveTheme();
        // check if theme querystring is active
        let name = (new URLSearchParams(window.location.search)).get("themename");
        let theme = JSON.parse((new URLSearchParams(window.location.search)).get("theme"));
        if (name && theme) {
            window.history.pushState({}, document.title, "/");
            if (visuals.themes.some(t => JSON.stringify(t.options) == JSON.stringify(theme))) {
                visuals.applyOptions(theme);
                localStorage.visualOptions = JSON.stringify(theme);
                setTimeout(() => new Toast("🥳 Activated theme " + name), 200);
            }
            else {
                visuals.addTheme(name, theme);
                visuals.applyOptions(theme);
                localStorage.visualOptions = JSON.stringify(theme);
                setTimeout(() => new Toast("🥳 Imported theme " + name), 200);
            }
        }
    }
    if (node.tagName == "SCRIPT" && node.src.includes("game.js")) {
        // block game.js
        node.type = "javascript/blocked"; // block for chrome
        node.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true }); // block for firefox
        node.src = ""; /* to be sure */

        (async () => {
            const js = await (await fetch("js/game.js")).text();
            const hash = cyrb53(js);
            console.log("Game.js hash:", hash);

            localStorage.patchHash = hash;
            let patch = "gamePatch.js";
            /*if(hash === 8091272790029377) { // PATCH date 2024-10-02
                patch = `gamePatch-${hash}.js`;
            }
            else {
                patch = "gamePatch.js"
            }*/

            // insert patched script
            let script = document.createElement("script");
            script.src = chrome.runtime.getURL(patch);
            node.parentElement.appendChild(script);

        })();
        // add var to get access typo ressources in css
        document.head.appendChild(elemFromString(`<style>
           :root{--typobrush:url(${chrome.runtime.getURL("res/wand.gif")})}
        </style>`));
    }
    if (node.classList && node.classList.contains("button-play")) {
        node.insertAdjacentHTML("beforebegin", "<div id='typoUserInfo'><bounceload></bounceload> Connecting to Typo server...</div>");
    }
    if (node.parentElement?.classList.contains("panels") && node.tagName == "DIV" && node.classList.contains("panel") && !node.classList.contains("patched")) {
        const panelGrid = elemFromString("<div id='panelgrid'></div>");
        node.parentElement.insertBefore(panelGrid, node);
        node.classList.add("patched");
        const leftCard = elemFromString(`<div class='panel patched' > 
            <div style="display:flex;height:100%;flex-direction:column;justify-content:space-between;" id="leftPanelContent">
                <h2><span> Changelog</span><span>Typo News </span></h2>
                <span>Hello there ❤️✏️<br>Typo got a new look - enjoy the all-new icons!</span>
                <div class="panel" id="typoHints" style="cursor:pointer; width:unset; border:none !important; font-size:0.8em;"><b>BTW, did you know?</b>
                    <br><span>${hints[Math.floor(Math.random() * hints.length)]}</span>
                </div>
                <div style="display: grid; grid-template-columns: 50% 50%;">
                    <typosocial media="discord"><a target="_blank" href='https://discord.com/invite/pAapmUmWAM'>Typo Discord</a></typosocial>
                    <typosocial media="website"><a target="_blank"  href='https://www.typo.rip'>Typo Website</a></typosocial>
                    <typosocial media="patreon"><a target="_blank"  href='https://patreon.com/skribbltypo'>Typo Patreon</a></typosocial>
                    <typosocial media="github"><a target="_blank"  href='https://github.com/toobeeh/skribbltypo'>Typo GitHub</a></typosocial>
                </div>
            </div>
            </div>`);
        let popupChanges = elemFromString(changelogRawHTML);
        leftCard.querySelector("h2 span").addEventListener("click", () => {
            new Modal(popupChanges, () => { }, "Changelog");
            localStorage.lastChangelogview = chrome.runtime.getManifest().version;
        });

        leftCard.querySelector("#typoHints").addEventListener("click", (e) => {
            leftCard.querySelector("#typoHints span").innerHTML = hints[Math.floor(Math.random() * hints.length)];
        });

        const rightCard = elemFromString(`<div class='panel patched' >
            <div style="display:flex;height:100%;flex-direction:column;justify-content:space-between;" id="rightPanelContent" class="lobbies">
                <h2><span>Sprite Cabin </span><span> Lobbies</span></h2>
                <div id="lobbyBoard">
                    <div id="discordLobbies"></div>
                    <div id="lobbyFilters">
                        <button id="addFilter" class="flatUI blue min air" style="margin: .5em">Add Filter</button>
                    </div>
                </div>
                <div id="cabinSlots" class="unauth">
                    <div id="loginRedir"><button class="flatUI air min blue">Log in with Palantir</button></div>
                    <div>Slot 1<p></p></div>
                    <div>Slot 3<p></p></div>
                    <div>Slot 2<p></p></div>
                    <div>Slot 4<p></p></div>
                    <div>Slot 5<p></p></div>
                    <div>Slot 6<p></p></div>
                    <div>Slot 7<p></p></div>
                    <div>Slot 8<p></p></div>
                    <div>Slot 9<p></p></div>
                </div>
            </div>
            </div>`);
        panelGrid.appendChild(leftCard);
        panelGrid.appendChild(node);
        panelGrid.appendChild(rightCard);
        QS("#rightPanelContent #loginRedir").addEventListener("click", login);
        QS("#rightPanelContent h2").addEventListener("click", (event) => {
            event.target.closest("#rightPanelContent").classList.toggle("cabin");
            event.target.closest("#rightPanelContent").classList.toggle("lobbies");
        });

        // init socket
        setTimeout(async () => {
            lobbies.init();
            await socket.init();
        }, 0);
    }
}
let patcher = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        let nodes = [...mutation.addedNodes];
        nodes.push(...currentNodes);
        currentNodes = [];
        nodes.forEach(patchNode);
    })
});
patcher.observe(document.documentElement, { attributes: false, childList: true, subtree: true });




    /* disconnect patcher, not used */
    patcher.disconnect();

    /* get new document to re-run without original game js */
    let html = await (await fetch("./")).text();
    html = html.replaceAll("game.js", "game.jsx");
    const newDoc = document.createElement("html");
    newDoc.innerHTML = html;
    document.body = newDoc.querySelector("body");

    /* patch nodes manually */
    let nodes = document.querySelectorAll("*");
    for(const node of nodes){
        await patchNode(node);
    }

    /* bundle styles */
    document.body.insertAdjacentHTML("afterbegin", `<style>
        ﻿#game-chat {
    position: relative;
}

#game-bar #lobby-nav {
    position: absolute;
    bottom: 0;
    width: auto;
    height: 100%;
    right: 50px;
    font-size: 1rem;
    display: flex;
    gap: 1em;
    padding: 0.4rem;
    align-items: center;
}

.avatar-customizer .container {
    margin: 0 30px
}

#game {
    margin-bottom: 15px !important;
}

#panel-right,
#panel-left {
    display: none !important;
}

.filterDisabled {
    opacity: 0.5
}

:is(#rightPanelContent, #leftPanelContent) h2 span:first-child {
    user-select: none;
    float: right
}

:is(#rightPanelContent, #leftPanelContent) h2 span:last-child {
    user-select: none;
    float: left
}

#leftPanelContent h2 span:first-child {
    cursor: pointer;
    opacity: .5;
}

#rightPanelContent.lobbies h2 span:first-child {
    opacity: 0.5;
    cursor: pointer;
}

#rightPanelContent.lobbies h2 span:last-child {
    opacity: 1;
    pointer-events: none;
}

#rightPanelContent.lobbies #cabinSlots {
    display: none;
}

#rightPanelContent.cabin #lobbyBoard {
    display: none;
}

#rightPanelContent.lobbies #lobbyBoard {
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    gap: 1em;
    -ms-overflow-style: none;
    /* for Internet Explorer, Edge */
    scrollbar-width: none;
    /* for Firefox */
    overflow-y: scroll;
    height: 100%;
    align-content: flex-start;
}

#lobbyBoard::-webkit-scrollbar {
    display: none;
    /* for Chrome, Safari, and Opera */
}

#lobbyBoard #discordLobbies,
#lobbyBoard #lobbyFilters {
    dispaly: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

#rightPanelContent.cabin h2 span:last-child {
    opacity: 0.5;
    cursor: pointer;
}

#rightPanelContent.cabin h2 span:first-child {
    opacity: 1;
    pointer-events: none;
}

#typoUserInfo {
    padding: 1em;
    background: inherit;
    border-radius: 1em;
    font-weight: bold;
    margin: 1em;
    text-align: center;
    pointer-events: none;
    user-select: none
}

#typoUserInfo small {
    opacity: 0.6;
}

#typoUserInfo #ptrLogout,
#typoUserInfo #ptrManage {
    pointer-events: all;
    cursor: pointer;
    opacity: 0.8;
}

#loginRedir {
    z-index: -1;
    opacity: 0;
    position: absolute;
    inset: 0;
    display: flex;
    place-items: center;
    transition: opacity .25s;
}

#loginRedir button {
    color: inherit !important;
}

#cabinSlots.unauth:hover>div:not(#loginRedir) {
    opacity: 0.3;
}

#cabinSlots.unauth:hover #loginRedir {
    opacity: 1;
    z-index: 10;
}

#cabinSlots {
    -ms-overflow-style: none;
    /* for Internet Explorer, Edge */
    scrollbar-width: none;
    /* for Firefox */
    overflow-y: scroll;
    aspect-ratio: 1;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 1em;
    grid-row-gap: 1em;
    opacity: 1;
    transition: opacity 0.25s;
}

#cabinSlots::-webkit-scrollbar {
    display: none;
    /* for Chrome, Safari, and Opera */
}

#cabinSlots>div {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    place-items: center;
    place-content: center;
    border-radius: .5em;
    background-color: #00000014;
    user-select: none;
}

#cabinSlots>div:not(#loginRedir) {
    cursor: not-allowed;
    pointer-events: none;
}

#cabinSlots>div:not(#loginRedir) * {
    pointer-events: none;
}

#cabinSlots>div:not(#loginRedir)>p {
    font-size: 0.7em;
    color: inherit !important;
}

#cabinSlots>div:not(#loginRedir).unlocked,
.spriteChoice {
    background-color: #ffffff14;
    cursor: pointer;
    transform: scale(1);
    transition: all .2s;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    color: transparent;
    pointer-events: all;
    border-radius: .5em;
}

.spriteChoice:hover {
    transform: scale(0.95);
}

#cabinSlots>div:not(#loginRedir).unlocked:hover {
    transform: scale(0.95);
    color: unset;
    background-size: 0%;
}

#panelgrid {
    display: grid;
    grid-template-columns: repeat(3, 400px);
    grid-column-gap: 2em;
    color: var(--COLOR_PANEL_TEXT);
}

#panelgrid a {
    color: inherit;
}

#panelgrid>div:nth-child(1) {
    height: 90%;
    margin-top: 10%;
    width: 95%;
    margin-left: 5%;
}

#panelgrid>div:nth-child(3) {
    height: 90%;
    margin-top: 10%;
    width: 95%;
    margin-right: 5%;
}

#panelgrid .panel h2 {
    margin-top: 0;
}

typosocial {
    font-size: 0.9em;
    cursor: pointer;
    display: inline-block;
    border-radius: .5em;
    margin: .5em;
    color: white;
    line-height: 1em;
    background-size: 1.5em 1.5em;
    background-repeat: no-repeat;
    background-position: .2em center;
    transform: scale(1);
    transition: transform .2s;
    image-rendering: auto;
}

typosocial:hover {
    transform: scale(0.95);
}

typosocial a {
    padding: .8em;
    display: block;
    margin-left: 1.5em;
    text-decoration: none;
    color: white;
    font-weight: bold;
}

typosocial[media=discord] {
    background-color: #5865F2;
    background-image: url(https://i.imgur.com/fcmzSFM.png);
}

typosocial[media=website] {
    background-color: #7058f2;
    background-image: url(https://i.imgur.com/ASLeKqW.png);
}

typosocial[media=patreon] {
    background-color: #FF424D;
    background-image: url(https://i.imgur.com/ecCj7in.png);
}

typosocial[media=github] {
    background-color: black;
    background-image: url(https://i.imgur.com/zPvAfQY.png);
}

#home .news .head,
#game-room .container-settings .lobby-name {
    border-bottom-color: transparent !important
}

#game-board #game-canvas canvas {
    image-rendering: pixelated;
}

#randomColor,
#colPicker {
    width: 100%;
    height: 100%;
}

div#game-chat div.container form {
    display: flex;
    flex-direction: row;
}

div#game-chat div.container form input {
    width: auto;
    flex-grow: 2;
}

.avatar .special.typoSpecialSlot {
    background-size: cover;
}

input[type=radio] {
    height: unset;
    width: unset;
}

.emojiwrapper {
    background-color: rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
    border-radius: 0.3em;
    padding: 0.1em;
    margin: .2em;
}

.emojipreview {
    position: relative;
    bottom: -0.25em;
    display: inline-block;
    height: 1em;
    background-size: contain;
    background-repeat: no-repeat;
    width: 1em;
    image-rendering: auto;
}

.flatUI,
input[type=checkbox].flatUI {
    border: none;
    color: black;
    font-size: small;
    width: 100%;
    margin: .5em 0;
    border-radius: 8px;
    background: #e2e2e2 !important;
    padding: .5em;
    /*box-shadow: #00000091 0px 2px 2px 0px;*/
}

input[type=checkbox].flatUI:focus {
    border-bottom: 0px
}

input[type=checkbox].flatUI:checked::before {
    opacity: 0
}

.flatUI:hover,
.flatUI:focus,
.flatUI:active {
    background: #d4d4d4 !important;
}

.flatUI.orange {
    background: #ffbf1f !important;
    color: white;
}

.flatUI.orange:hover,
.flatUI.orange:focus,
.flatUI.orange:active {
    background: #e8b83e !important;
}

.flatUI.green {
    background: #0ac200 !important;
    color: white;
}

.flatUI.green:hover,
.flatUI.green:focus,
.flatUI.green:active {
    background: #079100 !important;
}

.flatUI.blue {
    background: #51a1eb !important;
    color: white;
}

.flatUI.blue:hover,
.flatUI.blue:focus,
.flatUI.blue:active {
    background: #3d93e2 !important;
}

.flatUI.min {
    width: auto;
    display: inline-block;
}

.flatUI.air {
    padding: .7em 1em;
}

input.flatUI,
input.flatUI:focus {
    border: none;
    border-bottom: 2px solid black;
    border-radius: 4px;
}

label input[type=checkbox].flatUI {
    float: left;
    width: 2em;
    height: 2em;
    margin: 0 0 0.2em 0;
    cursor: pointer;
    position: relative;
}

label input[type=checkbox].flatUI.small {
    font-size: .7em;
}

label input[type=checkbox].flatUI.small+span {
    font-size: .8em;
}

span.small {
    font-size: .8em;
}

label input[type=checkbox].flatUI+span {
    height: 2em;
    display: inline-block;
    margin: .2em 0;
    margin-left: .5em;
    cursor: pointer;
    width: calc(100% - 3em);
}

label input[type="checkbox"].flatUI:checked:after {
    content: "🞬";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 1.5em;
}

#sharePopup,
#optionsPopup,
#downloadPopup,
#gamemodePopup {
    position: absolute;
    background-color: var(--COLOR_PANEL_BG);
    color: var(--COLOR_PANEL_TEXT);
    backdrop-filter: blur(4px);
    overflow: hidden;
    z-index: 20;
    width: 90%;
    outline: none;
    border-radius: 0.5em;
    box-shadow: black 1px 1px 9px -2px;
    min-height: 15%;
    padding: 1em;
    bottom: 3em;
}

#emojiPrev {
    background-color: var(--COLOR_PANEL_BG);
    backdrop-filter: blur(4px);
    box-shadow: black 1px 1px 9px -2px;
}

#game-players.room #imageOptions {
    display: none;
}

#shareImagePreview {
    width: 100%;
    padding: 1.5em 0;
}

#imageOptions {
    position:relative;
    grid-area: 4 / 3 / 4 / 3;
    height: 48px;
    background-color: var(--COLOR_CHAT_BG_BASE);
    width: 100%;
    border-radius: 3px;
    display: flex;
    padding: .4em 0px;
    justify-content: space-evenly;
}

#imageOptions img {
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
    cursor: pointer;
    transform: translate(0);
    transition: transform 0.1s ease-in-out;
}

#imageOptions img:hover {
    transform: translate(0, -3px);
}

#charbar {
    border-radius: 4px;
    margin: 0px 0.2em;
    padding: 0px 0.5em;
    display: grid;
    place-items: center;
}

.button-blue {
    font-size: 1em;
    padding: .4em .6em;
    background-color: #2c8de7;
    text-shadow: 1px 1px 0 #0000007a;
    transition: background-color .1s;
    border-radius: 3px;
    font-weight: 700;
    margin-left: 1em;
    margin-right: 1em;
}

.button-blue:hover {
    background-color: #1671c5;
}

.button-orange {
    font-size: 1em;
    padding: .4em .6em;
    background-color: #e7b21f;
    text-shadow: 1px 1px 0 #0000007a;
    transition: background-color .1s;
    border-radius: 3px;
    font-weight: 700;
    margin-left: 1em;
    margin-right: 1em;
}

.button-orange:hover {
    background-color: rgb(217 167 26);
}

/* Accessibility */
#containerFreespace {
    background: none;
}

.tooltip.show {
    opacity: 1;
}

.tooltip .tooltip-inner,
.tooltip .arrow {
    color: #eee !important;
    background-color: rgba(0, 0, 0, 0.9);
}

.tooltip .tooltip-inner {
    border: 1px solid #222;
}

div hr {
    border-top-width: 4px;
}

div#currentWord {
    text-align: right;
}

#wordSize {
    flex: 1 1 auto;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 3px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Character counter */
#boxChatInput {
    display: flex;
}

#formChat {
    width: 100%;
}

/* Keybinds */
.keybindMenu>div {
    display: flex;
    margin-bottom: 10px;
}

.keybindMenu>h4,
.keybindMenu>h5,
.keybindMenu>p {
    text-align: center;
}

.keybindMenu p {
    font-size: 12px;
}

.keybindMenu h5 {
    font-size: 16px;
}

.keybindMenu h5.plus {
    margin-left: 10px;
    font-weight: bold;
}

.keybindMenu label {
    vertical-align: middle;
    align-self: center;
    margin-bottom: 0;
}

.keybindMenu>div>label:nth-child(n + 2) {
    margin-left: 10px;
}

.keybindMenu .form-control {
    margin-left: 10px;
    width: auto;
}

/* Gamemodes */
.gamemodeMenu {
    display: flex;
    margin-top: 10px;
}

.gamemodeMenu label {
    align-self: center;
}

.gamemodeMenu select {
    margin-left: 10px;
}

.gamemodeDeaf .message {
    display: none !important;
}

.gamemodeDeaf #boxMessages {
    opacity: 0;
}

#imageCloud {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-left: 18%;
    max-height: 100%;
    overflow-y: auto;
}

#imageCloudSidebar {
    position: absolute;
    left: 0;
    padding: 1em;
    top: 0;
    bottom: 0;
    width: 18%;
    background: rgb(115 169 251 / 12%);
    border-radius: 1em;
    overflow: hidden;
}

#imageCloudSidebar h4 {
    margin-bottom: .5em;
}

#imageCloud>div {
    width: 30%;
    margin: 0.5em;
    position: relative;
    z-index:100;
}
#imageCloud>div:hover {
    z-index: 200;
}

#imageCloud>div>img {
    width: 100%;
    height: auto;
    transition: opacity 0.25s ease 0s;
    box-shadow: rgb(0 0 0 / 15%) 1px 1px 9px 1px;
    opacity: 1;
}

#imageCloud>div>div {
    transition: opacity 0.25s ease 0s;
    opacity: 0;
    position: absolute;
    inset: 0px;
    display: flex;
    place-items: center;
    justify-content: space-around;
    z-index: 500;
    background: rgba(0, 0, 0, 0.5);
    flex-direction: column;
}

#imageCloud > div:hover > div {
    opacity: 1;
}

#imageCloud>div>div>div {
    display: flex;
    flex-wrap: wrap;
    align-content: space-evenly;
    justify-content: space-evenly;
    height: 100%;
    width: 100%;
    gap: 1em;
}

#imageCloud>div>img.skeletonImage {
    opacity: 0.4;
}

#imageCloud>div.skeletonDiv {
    animation-name: skeleton;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in;
}

@keyframes skeleton {
    from {
        background-color: #fafafa;
    }

    to {
        background-color: #969595;
    }
}

#modal .modal-container,
#modal .modal-container .modal-title,
#modal .modal-container .modal-content {
    color: var(--COLOR_PANEL_TEXT) !important;
}

.modalContainer {
    padding: 1em;
    /*background-color: white;*/
    background-color: var(--COLOR_PANEL_BG);
    backdrop-filter: blur(4px);
    /* backdrop-filter: blur(4px); */
    color: var(--COLOR_PANEL_TEXT);
    border-radius: 1em;
    box-shadow: black 1px 1px 9px -2px;
    z-index: 60;
    display: flex;
    flex-direction: column;
    transform: translate(0, -20vh);
    opacity: 0;
    transition: transform .1s, opacity .1s;
    max-height: 85vh;
    overflow: hidden;
    position: fixed;
}

.modalBlur {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: black;
    opacity: 0;
    z-index: 59;
    transition: opacity .1s;
}

.modalContainer #modalClose {
    position: absolute;
    right: .5rem;
    top: 0;
    font-size: 2em;
    opacity: .5;
    cursor: pointer;
}

.modalContainer #modalClose:hover {
    opacity: .9;
}

#imageAgent {
    border-radius: var(--BORDER_RADIUS);
    width: 100%;
    background-color: var(--COLOR_CHAT_BG_BASE);
    padding: .2em;
    margin-bottom: var(--BORDER_GAP);
    display: flex;
    flex-direction: column;
    gap: .2em;
    align-items: center;
}

#imageAgent>div>img:not([src]) {
    display: none;
}

#imageAgent>*:not(img) {
    width: 90%;
    display: flex;
    justify-content: space-evenly;
}

#imageAgent>div>img {
    max-height: 20vh;
    max-width: 90%;
}

#brushmagicSettings .mode {
    margin: 2em 0;
}

#brushmagicSettings .mode .options:not(:empty) {
    margin-top: 1em;
}

.tool[data-tooltip='Switcher'] {
    display: none;
}

.tool[data-tooltip='Lab'] .icon {
    background-image: var(--typobrush) !important;
}

#game-room .container #game-chat.room {
    display: flex;
    margin-right: 16px;
    border-radius: 3px;
    margin-bottom: 0;
    --COLOR_CHAT_BG_ALT: #ffffff10;
}

#game-room .container #game-chat .container {
    background-color: var(--COLOR_PANEL_BG);
    margin: 0;
}

#typotoolbar .icon {
    background-size: 80% !important;
}

#panelgrid>div:nth-child(2)>div.avatar-customizer>div.container {
    cursor: pointer;
    transition: 0.2s all
}

#panelgrid>div:nth-child(2)>div.avatar-customizer>div.container:hover {
    transform: scale(95%)
}


@keyframes bounceload {
    from {
        transform: scale(0.5)
    }

    to {
        transform: translateX(-40%) scale(1.5)
    }
}

bounceload {
    display: inline-block;
    height: 1.5em;
    aspect-ratio: 1;
    background-image: url(/img/size.gif);
    background-size: 1em;
    background-repeat: no-repeat;
    background-position: center;
    transform: scale(1.5);
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
    animation: bounceload .5s infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
    transform-origin: center;
    margin-right: .5em;
    margin-left: .5em;
    margin-bottom: -.4em;
}

#game-canvas .room .game-room-group.customwords {
    height: calc(28% - var(--BORDER_GAP) * 4) !important;
}

/* .player-avatar-container > .player { height: 54px !important}
.player-avatar-container > .player-avatar-container { top: 3px !important; right: 3px !important;}
.player-avatar-container > .player-info{width: 90% !important;}

.player-score {margin-top:.5em !important} */

#home>.bottom {
    margin-top: 2em;
}

.visionFrame {
    position: fixed;
    width: 50vw;
    height: 50vh;
    top: 25vh;
    display: grid;
    left: 25vw;
    grid-template-columns: 4px auto 4px;
    grid-template-rows: 4em auto 4px;
    z-index: 2000;
    pointer-events: none;
    cursor: grab;
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .25));
    min-height: 10em;
    min-width: 10em;
    border: none;
}

.visionContent {
    grid-row-start: 2;
    grid-column-start: 2;
    opacity: .5;
    pointer-events: all;
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: unset;
    width: 100%;
    height: 100%;
}

.visionFrame.ghost .visionContent {
    pointer-events: none;
}

.visionFrame:not(.iframe) iframe.visionContent {
    display: none;
}

.visionFrame.iframe div.visionContent {
    display: none;
}

.visionBorder {
    pointer-events: all;
    background: var(--COLOR_PANEL_BG);
}

.visionBorder.rightResize {
    cursor: e-resize;
    grid-column-start: 3;
    background: var(--COLOR_PANEL_BG);
}

.visionBorder.bottomResize {
    cursor: s-resize;
    grid-column-start: 2;
    grid-row-start: 3;
    background: var(--COLOR_PANEL_BG);
}

.visionBorder.allResize {
    cursor: nwse-resize;
    grid-column-start: 3;
    grid-row-start: 3;
}

.visionHead {
    background: var(--COLOR_PANEL_BG) !important;
    position: relative;
    grid-row-start: 1;
    grid-column-start: 1;
    grid-column-end: 4;
    pointer-events: all;
    background: black;
    padding: 0.5em;
    border-radius: .5em .5em 0em 0em;
}

.visionControl {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    font-size: 1.5em;
    cursor: pointer;
    color: white;
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .25));
}

.visionHead input:is([type=text], [type=range]) {
    width: 50%;
}

:root {
    --PLAYERS_PER_PAGE: 8 !important;
}

#imageOptions>img {
    height: 100%;
}

#game #game-players .player.typo {
    height: 60px !important;
    display: flex;
    flex-direction: column;
}

#game #game-players .player.typo .player-avatar-container {
    place-items: center;
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    bottom: 0;
    display: grid;
}

#game #game-players .player.typo .player-avatar-container .avatar {
    position: absolute;
    width: 48px;
    height: 48px;
}

#game #game-players .player.typo .player-info {
    position: unset;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr 1fr;
    width: calc(100% - 48px - 3px);
    gap: 4px;
    z-index: 1;
}

#game #game-players .player.typo .player-info .player-name {
    position: unset;
    grid-column: 2;
    grid-row: 1;
    align-self: end;
    white-space: nowrap;
    overflow: hidden;
}

#game #game-players .player.typo .player-info .player-rank {
    position: unset;
    grid-row: 1/-1;
}

#game #game-players .player.typo .player-info .player-score {
    position: unset;
    grid-column: 2;
    align-self: start;
}

#game #game-players .player.typo .player-icons {
    position: absolute;
    padding-left: 4px;
}

#game #game-players .player.typo .player-icons .icon {
    height: 18px;
    width: 18px
}


#game-rate {
    z-index: 10 !important;
}

.themesv2 {
    width: 100%;
    padding: .5em;
}

.themesv2 .menu {
    margin: 1em;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 3em;
    justify-items: center;
    margin-bottom: 2em;
}

.themesv2 .menu div {
    cursor: pointer;
    font-size: 1.2em;
    opacity: .5;
    font-weight: bold;
    user-select: none;
}

.themesv2.manage .menu div.manage {
    opacity: 1;
}

.themesv2.create .menu div.create {
    opacity: 1;
}

.themesv2.add .menu div.add {
    opacity: 1;
}

.themesv2 .body>div {
    display: none;
}

.themesv2.manage .body>div.manage {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.themesv2.add .body>div.add {
    display: block;
}

.themesv2.create .body>div.create {
    display: flex;
    flex-direction: column;
    gap: .8em;
}

.themesv2.create .body>div.create>div {
    display: flex;
    flex-direction: row;
    gap: 1em;
}

.themesv2 label.checkbox {
    display: flex;
    align-items: center;
    gap: .5em;
    cursor: pointer;
    user-select: none;
    ;
}

.themesv2 details {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.themesv2 summary {
    cursor: pointer;
    font-weight: bold;
    user-select: none;

}

.themesv2 :is(.theme, .oldtheme) {
    display: grid;
    grid-template-columns: 3fr 2fr 1fr 1fr;
    gap: .5em 1em;
    background-color: var(--COLOR_PANEL_BUTTON);
    padding: .5em;
    padding-left: 1em;
    border-radius: 1em;
    align-items: center;
}

.themesv2 .theme .manageSection {
    display: none;
}

.themesv2 .theme .manageTheme:after {
    content: "Manage";
}

.themesv2 .theme.manage .manageTheme:after {
    content: "Done";
}

.themesv2 .theme.manage .manageSection {
    display: flex;
    flex-direction: row;
    gap: 1em;
}

#themeName[disabled] {
    cursor: forbidden;
}

.lobbyNavIcon {
    position: relative;
    width: 42px;
    height: 42px;
    cursor: pointer;
    background-size: contain;
    transition: scale .1s ease-in-out;
}

.lobbyNavIcon:hover {
    scale: 1.1;
}

.lobbyNavIcon.next {
    filter: drop-shadow(3px -3px 0 rgba(0, 0, 0, .3)) drop-shadow(rgba(0, 0, 0, 0.3) 3px 3px 0px) sepia(1) saturate(5) brightness(0.7) hue-rotate(56deg);
    rotate: 90deg;
}

.lobbyNavIcon.exit {
    filter: drop-shadow(-3px 3px 0 rgba(0, 0, 0, .3)) sepia(1) saturate(5) brightness(0.8) hue-rotate(324deg);
    rotate: -90deg;
}

#awardsAnchor{
    position: absolute;
    top: 55px;
    right: 5px;
}

#awardsAnchor .icon {
    height: 48px;
    width: 48px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    opacity: .7;
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
}
#awardsAnchor .icon:hover {
    opacity: 1;
}

#awardsAnchor:focus #awardsInventory {
    background: var(--COLOR_CHAT_BG_BASE);
    padding: 1em;
    top: 50px;
    right: 1em;
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: center;
    border-radius: .5em;
    border-top-right-radius: 0;
}

#awardsAnchor:focus #awardsInventory:after {
    position: absolute;
    content: '';
    top: -.8em;
    right: 0;
    width: 0;
    height: 0;
    border-left: .8em solid transparent;
    border-right: .8em solid transparent;
    border-bottom: .8em solid var(--COLOR_CHAT_BG_BASE);
}

#awardsAnchor .grid {
    display:grid;
    grid-gap: 1em;
    place-items: center;
    direction: rtl;
    grid-auto-flow: column;
    grid-template-rows: repeat(6, auto);
}

#awardsAnchor .grid .award, .awardChatIcon {
    height: 36px;
    width: 36px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    position: relative;
}

#awardsAnchor:not(:focus) #awardsInventory {
    display:none;
}

#awardPresentation {
    position: absolute;
    background-position: center;
    inset: 0;
    background-repeat: no-repeat;
    pointer-events: none;
}

body > div.pcr-app.visible > div.pcr-interaction:after {
    content: "Only typo users can see custom colors!";
    font-size: .8em;
    padding-top: .5em;
    opacity: 0.8;
    font-weight: 500;
}

/* OLD COMPATIBILITY*/
.colors.color-tools {
    margin-left: var(--BORDER_GAP);
}

/* OLD COMPATIBILITY*/
.colors.color-tools .color {
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;
    background-color: var(--COLOR_TOOL_BASE);
}

.color-tools:not(.colors) {
    border-radius: var(--BORDER_RADIUS);
    height: var(--UNIT);
    width: calc(var(--UNIT) / 2);
    overflow: hidden;
}

.color-tools .color {
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;
    background-color: var(--COLOR_TOOL_BASE);
    width: calc(var(--UNIT) / 2);
    height: calc(var(--UNIT) / 2);
    cursor:pointer;

}

.color-tools .bottom .color {
    border-top: 1px solid lightgray;
}

.color-tools .top .color {
    border-bottom: 1px solid lightgray;
}
.color-tools .color:hover:after{
    border: none !important;
}
.color-tools .color:hover {
    background-color: var(--COLOR_TOOL_HOVER);
}

[data-tooltip=Pipette] {
    display: none !important;
}

#game-toolbar:has(.toolbar-group-tools [data-tooltip=Pipette].selected) #color-canvas-picker {
    background-color: var(--COLOR_TOOL_ACTIVE);
}


/*! Pickr 1.8.1 MIT | https://github.com/Simonwep/pickr */

.pickr {
    position: relative;
    overflow: visible;
    transform: translateY(0)
}

    .pickr * {
        box-sizing: border-box;
        outline: none;
        border: none;
        -webkit-appearance: none
    }

    .pickr .pcr-button {
        position: relative;
        height: 2em;
        width: 2em;
        padding: .5em;
        cursor: pointer;
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
        border-radius: .15em;
        background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" stroke="%2342445A" stroke-width="5px" stroke-linecap="round"><path d="M45,45L5,5"></path><path d="M45,5L5,45"></path></svg>') no-repeat 50%;
        background-size: 0;
        transition: all .3s
    }

        .pickr .pcr-button:before {
            background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
            background-size: .5em;
            z-index: -1;
            z-index: auto
        }

        .pickr .pcr-button:after, .pickr .pcr-button:before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: .15em
        }

        .pickr .pcr-button:after {
            transition: background .3s;
            background: var(--pcr-color)
        }

        .pickr .pcr-button.clear {
            background-size: 70%
        }

            .pickr .pcr-button.clear:before {
                opacity: 0
            }

            .pickr .pcr-button.clear:focus {
                box-shadow: 0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px var(--pcr-color)
            }

        .pickr .pcr-button.disabled {
            cursor: not-allowed
        }

    .pcr-app *, .pickr * {
        box-sizing: border-box;
        outline: none;
        border: none;
        -webkit-appearance: none
    }

    .pcr-app button.pcr-active, .pcr-app button:focus, .pcr-app input.pcr-active, .pcr-app input:focus, .pickr button.pcr-active, .pickr button:focus, .pickr input.pcr-active, .pickr input:focus {
        box-shadow: 0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px var(--pcr-color)
    }

    .pcr-app .pcr-palette, .pcr-app .pcr-slider, .pickr .pcr-palette, .pickr .pcr-slider {
        transition: box-shadow .3s
    }

        .pcr-app .pcr-palette:focus, .pcr-app .pcr-slider:focus, .pickr .pcr-palette:focus, .pickr .pcr-slider:focus {
            box-shadow: 0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px rgba(0,0,0,.25)
        }

.pcr-app {
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 10000;
    border-radius: .1em;
    background: #fff;
    opacity: 0;
    visibility: hidden;
    transition: opacity .3s,visibility 0s .3s;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
    box-shadow: 0 .15em 1.5em 0 rgba(0,0,0,.1),0 0 1em 0 rgba(0,0,0,.03);
    left: 0;
    top: 0
}

    .pcr-app.visible {
        transition: opacity .3s;
        visibility: visible;
        opacity: 1
    }

    .pcr-app .pcr-swatches {
        display: flex;
        flex-wrap: wrap;
        margin-top: .75em
    }

        .pcr-app .pcr-swatches.pcr-last {
            margin: 0
        }

@supports (display:grid) {
    .pcr-app .pcr-swatches {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(auto-fit,1.75em)
    }
}

.pcr-app .pcr-swatches > button {
    font-size: 1em;
    position: relative;
    width: calc(1.75em - 5px);
    height: calc(1.75em - 5px);
    border-radius: .15em;
    cursor: pointer;
    margin: 2.5px;
    flex-shrink: 0;
    justify-self: center;
    transition: all .15s;
    overflow: hidden;
    background: transparent;
    z-index: 1
}

    .pcr-app .pcr-swatches > button:before {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
        background-size: 6px;
        border-radius: .15em;
        z-index: -1
    }

    .pcr-app .pcr-swatches > button:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--pcr-color);
        border: 1px solid rgba(0,0,0,.05);
        border-radius: .15em;
        box-sizing: border-box
    }

    .pcr-app .pcr-swatches > button:hover {
        filter: brightness(1.05)
    }

    .pcr-app .pcr-swatches > button:not(.pcr-active) {
        box-shadow: none
    }

.pcr-app .pcr-interaction {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 -.2em
}

    .pcr-app .pcr-interaction > * {
        margin: 0 .2em
    }

    .pcr-app .pcr-interaction input {
        letter-spacing: .07em;
        font-size: .75em;
        text-align: center;
        cursor: pointer;
        color: #75797e;
        background: #f1f3f4;
        border-radius: .15em;
        transition: all .15s;
        padding: .45em .5em;
        margin-top: .75em
    }

        .pcr-app .pcr-interaction input:hover {
            filter: brightness(.975)
        }

        .pcr-app .pcr-interaction input:focus {
            box-shadow: 0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px rgba(66,133,244,.75)
        }

    .pcr-app .pcr-interaction .pcr-result {
        color: #75797e;
        text-align: left;
        flex: 1 1 8em;
        min-width: 8em;
        transition: all .2s;
        border-radius: .15em;
        background: #f1f3f4;
        cursor: text
    }

        .pcr-app .pcr-interaction .pcr-result::-moz-selection {
            background: #4285f4;
            color: #fff
        }

        .pcr-app .pcr-interaction .pcr-result::selection {
            background: #4285f4;
            color: #fff
        }

    .pcr-app .pcr-interaction .pcr-type.active {
        color: #fff;
        background: #4285f4
    }

    .pcr-app .pcr-interaction .pcr-cancel, .pcr-app .pcr-interaction .pcr-clear, .pcr-app .pcr-interaction .pcr-save {
        width: auto;
        color: #fff
    }

        .pcr-app .pcr-interaction .pcr-cancel:hover, .pcr-app .pcr-interaction .pcr-clear:hover, .pcr-app .pcr-interaction .pcr-save:hover {
            filter: brightness(.925)
        }

    .pcr-app .pcr-interaction .pcr-save {
        background: #4285f4
    }

    .pcr-app .pcr-interaction .pcr-cancel, .pcr-app .pcr-interaction .pcr-clear {
        background: #f44250
    }

        .pcr-app .pcr-interaction .pcr-cancel:focus, .pcr-app .pcr-interaction .pcr-clear:focus {
            box-shadow: 0 0 0 1px hsla(0,0%,100%,.85),0 0 0 3px rgba(244,66,80,.75)
        }

.pcr-app .pcr-selection .pcr-picker {
    position: absolute;
    height: 18px;
    width: 18px;
    border: 2px solid #fff;
    border-radius: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
}

.pcr-app .pcr-selection .pcr-color-chooser, .pcr-app .pcr-selection .pcr-color-opacity, .pcr-app .pcr-selection .pcr-color-palette {
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: flex;
    flex-direction: column;
    cursor: grab;
    cursor: -webkit-grab
}

    .pcr-app .pcr-selection .pcr-color-chooser:active, .pcr-app .pcr-selection .pcr-color-opacity:active, .pcr-app .pcr-selection .pcr-color-palette:active {
        cursor: grabbing;
        cursor: -webkit-grabbing
    }

.pcr-app[data-theme=nano] {
    width: 14.25em;
    max-width: 95vw
}

    .pcr-app[data-theme=nano] .pcr-swatches {
        margin-top: .6em;
        padding: 0 .6em
    }

    .pcr-app[data-theme=nano] .pcr-interaction {
        padding: 0 .6em .6em
    }

    .pcr-app[data-theme=nano] .pcr-selection {
        display: grid;
        grid-gap: .6em;
        grid-template-columns: 1fr 4fr;
        grid-template-rows: 5fr auto auto;
        align-items: center;
        height: 10.5em;
        width: 100%;
        align-self: flex-start
    }

        .pcr-app[data-theme=nano] .pcr-selection .pcr-color-preview {
            grid-area: 2/1/4/1;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-left: .6em
        }

            .pcr-app[data-theme=nano] .pcr-selection .pcr-color-preview .pcr-last-color {
                display: none
            }

            .pcr-app[data-theme=nano] .pcr-selection .pcr-color-preview .pcr-current-color {
                position: relative;
                background: var(--pcr-color);
                width: 2em;
                height: 2em;
                border-radius: 50em;
                overflow: hidden
            }

                .pcr-app[data-theme=nano] .pcr-selection .pcr-color-preview .pcr-current-color:before {
                    position: absolute;
                    content: "";
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
                    background-size: .5em;
                    border-radius: .15em;
                    z-index: -1
                }

        .pcr-app[data-theme=nano] .pcr-selection .pcr-color-palette {
            grid-area: 1/1/2/3;
            width: 100%;
            height: 100%;
            z-index: 1
        }

            .pcr-app[data-theme=nano] .pcr-selection .pcr-color-palette .pcr-palette {
                border-radius: .15em;
                width: 100%;
                height: 100%
            }

                .pcr-app[data-theme=nano] .pcr-selection .pcr-color-palette .pcr-palette:before {
                    position: absolute;
                    content: "";
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
                    background-size: .5em;
                    border-radius: .15em;
                    z-index: -1
                }

        .pcr-app[data-theme=nano] .pcr-selection .pcr-color-chooser {
            grid-area: 2/2/2/2
        }

        .pcr-app[data-theme=nano] .pcr-selection .pcr-color-opacity {
            grid-area: 3/2/3/2
        }

        .pcr-app[data-theme=nano] .pcr-selection .pcr-color-chooser, .pcr-app[data-theme=nano] .pcr-selection .pcr-color-opacity {
            height: .5em;
            margin: 0 .6em
        }

            .pcr-app[data-theme=nano] .pcr-selection .pcr-color-chooser .pcr-picker, .pcr-app[data-theme=nano] .pcr-selection .pcr-color-opacity .pcr-picker {
                top: 50%;
                transform: translateY(-50%)
            }

            .pcr-app[data-theme=nano] .pcr-selection .pcr-color-chooser .pcr-slider, .pcr-app[data-theme=nano] .pcr-selection .pcr-color-opacity .pcr-slider {
                flex-grow: 1;
                border-radius: 50em
            }

            .pcr-app[data-theme=nano] .pcr-selection .pcr-color-chooser .pcr-slider {
                background: linear-gradient(90deg,red,#ff0,#0f0,#0ff,#00f,#f0f,red)
            }

            .pcr-app[data-theme=nano] .pcr-selection .pcr-color-opacity .pcr-slider {
                background: linear-gradient(90deg,transparent,#000),url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
                background-size: 100%,.25em
            }


 
        .adsbygoogle, .ad-2 {display:none !important}
    </style>`);

    /* add touch prevention and select prevention */
    if(navigator.platform.match(/iPad/i) || navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)){
        document.body.style.touchAction = "none";
        document.body.userSelect = "none";
    }

    /* dispatch fake load events */
    window.dispatchEvent(new Event("load"));
    document.dispatchEvent(new Event("DOMContentLoaded"));

    /* init popup polyfill */
    const popupHTML = `﻿<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="popup.css">
    <script src="jquery.js"></script>
    <style id="sliderThumbColorStyle"></style>
</head>

<body>
    <div class="flexcol">
        <h1>Typo Dashboard</h1>
        <div class="tabSelection flexrow skribbl">
            <div class="tabTitle tabActive skribbl" id="tabDashboard">Feature - Toggles</div>
            <div style="display:none" class="tabTitle" id="tabDiscord">Discord / Palantir</div>
            <div class="tabTitle skribbl" id="tabAdvanced">Advanced</div>
        </div>
        <div class="tabContent skribbl">

            <div id="mainSettings" class="skribbl">
                <br />
                <br />
                <div class="flexcol">
                    <div class="flexrow flexrowMenu">
                        <button type="button" id="agent">ImageAgent</button>
                        <button type="button" id="markup">Markup</button>
                    </div>
                    <div class="flexrow flexrowMenu">
                        <button type="button" id="drops">Drops</button>
                        <button type="button" id="controls">Controls</button>
                    </div>
                    <div class="flexrow flexrowMenu">
                        <button type="button" id="typoink">Typo Pressure</button>
                        <button type="button" id="awardfx">Award FX</button>
                    </div>
                    <div class="flexrow flexrowMenu">
                        <!--<button type="button" id="backbutton">Back-Button</button>-->
                        <button type="button" id="charbar">Char Count</button>
                        <button type="button" id="emojipicker">Emojis</button>
                    </div>
                    <div class="flexrow flexrowMenu">
                        <button type="button" id="zoomdraw">Zoom Draw</button>
                        <button type="button" id="dropmsgs">Drop Statistics</button>
                        <!--<button type="button" id="sizeslider">Size Slider</button>-->
                    </div>
                    <div class="flexrow flexrowMenu">
                        <button type="button" id="typotools">Typo Tools</button>
                        <button type="button" id="chatcommands">Chat Commands</button>
                    </div>
                    <div class="flexrow flexrowMenu">
                        <button type="button" id="quickreact">Quickreact by CTRL</button>
                        <button type="button" id="palantir">Discord Status</button>
                    </div>
                </div>
                <br />
                <br />
            </div>

            <div id="advancedSettings" class="skribbl">
                <br />
                <br />
                <div class="flexcol">

                    <div class="label">Tablet sensitivity </div>
                    <div class="sliderBox" id="sens">
                        <span class="sliderBar"><span class="sliderFill"></span></span>
                        <input type="range" class="slider" min="0" max="100" />
                    </div>

                   <!-- <div class="label">Random interval </div>
                    <div class="sliderBox" id="randominterval">
                        <span class="sliderBar"><span class="sliderFill"></span></span>
                        <input type="range" class="slider" min="10" max="500" />
                    </div>-->

                    <div class="label">Markup color </div>
                    <div class="sliderBox" id="markupcolor">
                        <span class="sliderBar"><span class="sliderFill"></span></span>
                        <input type="range" class="slider" min="0" max="357" />
                    </div>

                    <div style="display:none" class="label">Tablet sensitivity </div>
                    <div style="display:none" class="sliderBox" id="sensitivity">
                        <span class="sliderBar"><span class="sliderFill"></span></span>
                        <input type="range" class="slider" min="0" max="100" />
                    </div>

                    <div>
                        <div class="label">Color palettes</div>
                        <div class="flexrow flexrowMenu skribbl" style="flex-wrap:wrap; place-content:center;"
                            id="palettes">
                            <button type="button" id="palette_originalPalette">Original Palette</button>
                            <!-- <button type="button" id="palette_oldSkribbl">Old Skribbl</button> -->
                        </div>
                        <div class="flexrow flexrowMenu">
                            <input type="text" autocomplete="off" style="width:12ex; flex-basis:unset" id="paletteJSON"
                                placeholder="{ ... }" />
                            <button type="button" class="active" id="enterJSON">Add palette JSON</button>
                        </div>
                    </div>
                </div>
                <br />
                <br />
            </div>
        </div>
        <br />

        <hr class="skribbl" />

        <div id="footer" class="flexcol">
            <div class="flexrow flexrowMenu">
                <button type="button" class="active" id="help">How-To</button>
                <button id="dc">
                    <div id="credits">
                        tobeh#7437
                    </div>
                </button>
            </div>
        </div>
        <script src="popup.js"></script>
</body>

</html>`;
    const popupDoc = document.createElement("html");

    /* parse doc and add new base uri + polyfill for tabs api */
    popupDoc.innerHTML = popupHTML;
    popupDoc.querySelector("head").insertAdjacentHTML("afterbegin",
        '<base href="https://rawcdn.githack.com/toobeeh/skribbltypo/master/popup/" />'
    );
    popupDoc.querySelector("head").insertAdjacentHTML("afterbegin",
        `<script>
            window.chrome = {
                runtime: {
                    onMessage: {
                        addListener: (callback) => {
                            window.addEventListener("message", msg => callback(msg.data, {tab:{id:0}}));
                        }
                    }
                },
                tabs: {
                    query: (a,b) => {
                        b([
                            {id: "0", url: "https://skribbl.io/"}
                        ]);
                    },
                    sendMessage: (id, msg) => {
                        window.parent.postMessage(msg, "*");
                    }
                }
            }
        </script>`
    );

    /* create show popup function */
    window.openTypoPopup = () => {
        window.typoPopupOpened = true;
        const frame = document.createElement("iframe");
        frame.style.border = "none";
        frame.style.height = "100vh";
        frame.style.width = "min(25em, 90vw)";
        frame.srcdoc = popupDoc.innerHTML;
        document.querySelector("#typoPopupPolyfill").append(frame);
    
        /* apply message polyfill */
        chrome.runtime.sendMessage = (msg) => {
            frame.contentWindow.postMessage(msg);
        }

        window.closeTypoPopup = () => {
            window.typoPopupOpened = false;
            frame.remove();
        }
    }

    /* create popup toggle  */
    document.body.insertAdjacentHTML("afterbegin", `
    
        <div style="position:fixed; right:0; top:0; display:flex; flex-direction:row; z-index:10000" id="typoPopupPolyfill">
            <div onclick="window.typoPopupOpened === true ? window.closeTypoPopup() : window.openTypoPopup()" style="cursor:pointer; border-bottom-left-radius: 0.5em; height: 2.5em; aspect-ratio: 1; background-color:#9daff0a3; background-image: url('https://rawcdn.githack.com/toobeeh/skribbltypo/d416e4f61888b48a9650e74cf716559904e2fcbf/res/icon/128CircleFit.png'); background-size: contain;">
            </div>
        <div>
    
    `);
    

    /* bundle post dom exec */
    // #content features/commands.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

/*
 * Extends service.js contentscript
  Command detection:
  - commands are registered in the commands array
  - consist of actions
  - performCommand finds a suitable comamnd & executes the ommands actions with applied parameters / arguemnts

    heheheh now this is finally hot reworked code and not a fucking mess anymore
*/

const commands = [
    {
        command: "charbar",
        options: {
            type: "toggle",
            description: "Sets the charbar visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.charbar = "true";
            },
            actionDisable: () => {
                localStorage.charbar = "false";
            },
            actionAfter: (args) => {
                setTimeout(() => QS("#game-chat form input").dispatchEvent(new Event("keyup")), 500);
            },
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " char count.";
            }
        }
    }, {
        command: "awardfx",
        options: {
            type: "toggle",
            description: "Sets the award animation.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.awardfx = "true";
            },
            actionDisable: () => {
                localStorage.awardfx = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " award anmation.";
            }
        }
    }, {
        command: "controls",
        options: {
            type: "toggle",
            description: "Sets the controls visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.controls = "true";
                QS("#controls").style.display = "flex";
            },
            actionDisable: () => {
                localStorage.controls = "false";
                QS("#controls").style.display = "none";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " controls.";
            }
        }
    }, {
        command: "palantir",
        options: {
            type: "toggle",
            description: "Sets the palantir visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.palantir = "true";
                lobbies.userAllow = true;
                if (lobbies.inGame && !lobbies.joined && socket.authenticated == true) {
                    socket.joinLobby(lobbies.lobbyProperties.Key);
                    lobbies.joined = true;
                }
                if (lobbies.inGame && lobbies.joined == true) socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key);
            },
            actionDisable: () => {
                localStorage.palantir = "false";
                lobbies.userAllow = false;
                if (lobbies.joined) socket.leaveLobby();
                lobbies.joined = false;
            },
            actionAfter: null,
            response: (state) => {
                return "You're now " + (state ? "visible" : "invisible") + " on Palantir.";
            }
        }
    }, {
        command: "typotoolbar",
        options: {
            type: "toggle",
            description: "Sets the toolbar style.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.typotoolbar = "true";
                QS("#game-toolbar").classList.add("typomod");
            },
            actionDisable: () => {
                localStorage.typotoolbar = "false";
                QS("#game-toolbar").classList.remove("typomod");
            },
            actionAfter: null,
            response: (state) => {
                return "The toolbar style is now " + (state ? "typo-modded" : "original") + ".";
            }
        }
    }, {
        command: "clr",
        options: {
            type: "action",
            description: "Deletes all but the last 50 messages.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                let elems = [...QSA("#game-chat .chat-content > *")];
                if (elems.length > 50) elems = elems.slice(0, -50);
                elems.forEach(elem => elem.remove());
            },
            response: (args) => {
                return "Removed all but the last 50 messages.";
            }
        }
    }, {
        command: "chatcommands",
        options: {
            type: "toggle",
            description: "Sets the chat command detection feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.chatcommands = "true";
            },
            actionDisable: () => {
                localStorage.chatcommands = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " chat commands.";
            }
        }
    }, {
        command: "experimental",
        options: {
            type: "toggle",
            description: "Sets the experimental features.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.experimental = "true";
            },
            actionDisable: () => {
                localStorage.experimental = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " experimental features.";
            }
        }
    }, {
        command: "emojipicker",
        options: {
            type: "toggle",
            description: "Sets the emoji picker visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.emojipicker = "true";
            },
            actionDisable: () => {
                localStorage.emojipicker = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " the emoji picker.";
            }
        }
    }, {
        command: "drops",
        options: {
            type: "toggle",
            description: "Sets the drop visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.drops = "true";
            },
            actionDisable: () => {
                localStorage.drops = "false";
            },
            actionAfter: null,
            response: (state) => {
                return "Drops " + (!state ? "won't show anymore" : "will be visible") + " on the canvas.";
            }
        }
    }, {
        command: "dropmsgs",
        options: {
            type: "toggle",
            description: "Sets visibility of the drop message of others.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.dropmsgs = "true";
            },
            actionDisable: () => {
                localStorage.dropmsgs = "false";
            },
            actionAfter: null,
            response: (state) => {
                return "Drop messages of others " + (!state ? "won't show anymore" : "will be visible") + " in the chat.";
            }
        }
    }, {
        command: "zoomdraw",
        options: {
            type: "toggle",
            description: "Sets the zoom draw feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.zoomdraw = "true";
            },
            actionDisable: () => {
                localStorage.zoomdraw = "false";
                uiTweaks.resetZoom();
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " canvas zoom (STRG+Click).";
            }
        }
    }, {
        command: "like",
        options: {
            type: "action",
            description: "Executes a like.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                QS("#game-rate .like").dispatchEvent(new Event("click"));
            },
            response: (args) => {
                return "You liked " + getCurrentOrLastDrawer() + "s drawing.";
            }
        }
    }, {
        command: "shame",
        options: {
            type: "action",
            description: "Executes a dislike.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                QS("#game-rate .dislike").dispatchEvent(new Event("click"));
            },
            response: (args) => {
                return "You disliked " + getCurrentOrLastDrawer() + "s drawing.";
            }
        }
    }, {
        command: "typotools",
        options: {
            type: "toggle",
            description: "Shows or hides the typo tools.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.typotools = "true";
                /* QS("#randomColor").style.display = "";
                QS("#colPicker").style.display = ""; */
                QS("#typotoolbar").style.display = "";
            },
            actionDisable: () => {
                localStorage.typotools = "false";
                /* QS("#randomColor").style.display = "none";
                QS("#colPicker").style.display = "none"; */
                QS("#typotoolbar").style.display = "none";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " random color & color picker tools.";
            }
        }
    }, {
        command: "agent",
        options: {
            type: "toggle",
            description: "Sets the agent feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.agent = "true";
                QS("#imageAgent").style.display = "";
            },
            actionDisable: () => {
                localStorage.agent = "false";
                QS("#imageAgent").style.display = "none";
            },
            actionAfter: (state) => {
                scrollMessages();
            },
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " image agent.";
            }
        }
    }, {
        command: "typoink",
        options: {
            type: "toggle",
            description: "Enables typo's ink drawing instead built-in.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.typoink = "true";
            },
            actionDisable: () => {
                localStorage.typoink = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " typo inkmodes.";
            }
        }
    }, {
        command: "quickreact",
        options: {
            type: "toggle",
            description: "Sets the quickreact feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.quickreact = "true";
            },
            actionDisable: () => {
                localStorage.quickreact = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " quick reaction menu.";
            }
        }
    }, {
        command: "markup",
        options: {
            type: "toggle",
            description: "Sets the markup feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.markup = "true";
            },
            actionDisable: () => {
                localStorage.markup = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " chat markup.";
            }
        }
    }, {
        command: "setmember",
        options: {
            type: "action",
            description: "Sets the logged in member. Argument: member json",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                localStorage.member = args;
            },
            response: (args) => {
                return "Logged in!";
            }
        }
    }, {
        command: "kick",
        options: {
            type: "action",
            description: "Kicks a player. Press AltGr to view player IDs. Argument: player ID",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
            },
            response: (args) => {
                let kickPlayer = QS("div[playerid='" + args + "']");
                if (!kickPlayer) kickPlayer = QS(".player .drawing[style*='block'").closest(".player");
                if (kickPlayer) document.dispatchEvent(newCustomEvent("socketEmit", { detail: { id: 5, data: parseInt(kickPlayer.getAttribute("playerid")) } }));
                return kickPlayer ? "Executed kick for " + kickPlayer.querySelector(".player-name").textContent.replace("(You)", "").trim() : "No-one to kick :(";
            }
        }
    }, {
        command: "randominterval",
        options: {
            type: "action",
            description: "Sets the random interval. Argument: interval in ms",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                localStorage.randominterval = args;
            },
            response: (args) => {
                return "The random color brush interval is now " + args + "ms.";
            }
        }
    }, {
        command: "markupcolor",
        options: {
            type: "action",
            description: "Sets the markup color. Argument: degree component of HSL",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                localStorage.markupcolor = args;
            },
            response: (args) => {
                const color = new Color({ h: Number(args), s: 100, l: 90 });
                return "The highlight color for your messages is now " + color.hex + ".";
            }
        }
    }, {
        command: "sens",
        options: {
            type: "action",
            description: "Sets the pressure sensitivity. Argument: sensitivity",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                localStorage.sens = args;
            },
            response: (args) => {
                return "Tablet pressure sensitivity is now at " + args + "%.";
            }
        }
    }, {
        command: "login",
        options: {
            type: "action",
            description: "Logs in with a given palantir access token. Argument: token (empty to log out)",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                if (!args || args.length == 0) localStorage.removeItem("accessToken");
                else localStorage.setItem("accessToken", args);
            },
            response: (args) => {
                window.location.reload();
                return "Reloading...";
            }
        }
    }, {
        command: "usepalette",
        options: {
            type: "action",
            description: "Uses a palette. Argument: palette name",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                if (uiTweaks.palettes.some(palette => palette.name == args)) localStorage.palette = args;
                uiTweaks.palettes.find(palette => palette.name == args)?.activate();
            },
            response: (args) => {
                return localStorage.palette == args ? "Activated custom palette " + args + "." : "Custom palette not found :(";
            }
        }
    }, {
        command: "addpalette",
        options: {
            type: "action",
            description: "Adds a palette. Argument: palette json",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                uiTweaks.palettes.push(createColorPalette(JSON.parse(args)));
                let palettesSave = [];
                uiTweaks.palettes.forEach(palette => {
                    if (palette.json) palettesSave.push(JSON.parse(palette.json));
                });
                localStorage.customPalettes = JSON.stringify(palettesSave);
            },
            response: (args) => {
                return "Added custom palette:" + JSON.parse(args).name;
            }
        }
    }, {
        command: "rempalette",
        options: {
            type: "action",
            description: "Removes a palette. Argument: palette name",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                uiTweaks.palettes = uiTweaks.palettes.filter(palette => palette.name != args);
                let palettesSave = [];
                uiTweaks.palettes.forEach(palette => {
                    if (palette.json) palettesSave.push(JSON.parse(palette.json));
                });
                localStorage.customPalettes = JSON.stringify(palettesSave);
            },
            response: (args) => {
                return "Removed palette(s) with name:" + args;
            }
        }
    }, {
        command: "help",
        options: {
            type: "action",
            description: "Shows some help about chat commands.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: () => {
                let help = "<div style='padding:.5em;'><h4>Overview of commands</h4><small><b>Types of commands:</b><br>Toggle - use with 'enable' / 'disable' + command name.<br>Action - execute with command name + arguments.<br><br>";
                help += "<h4>Commands:</h4>";
                commands.forEach(cmd => {
                    help += `<b>${cmd.command} (${cmd.options.type}):</b> ${cmd.options.description}<br><br>`;
                });
                help += "</small></div>";
                QS("#game-chat .chat-content").appendChild(elemFromString(help));
            },
            response: (args) => {
                return "";
            }
        }
    }, {
        command: "resettypo",
        options: {
            type: "action",
            description: "Resets everything to the defaults.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: () => {
                setDefaults(true);
                window.location.reload();
            },
            response: (args) => {
                return "";
            }
        }
    }, {
        command: "reconnect",
        options: {
            type: "action",
            description: "Reconnects to the typo server.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: () => {
                socket.disconnect();
                setTimeout(() => socket.init(), 2000);
            },
            response: (args) => {
                return "Reconnection initiated.";
            }
        }
    }, {
        command: "newvision",
        options: {
            type: "action",
            description: "Open a new image overlay.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: () => {
                new Vision();
            },
            response: (args) => {
                return "Overlay opened.";
            }
        }
    }
];

const performCommand = (command) => {
    // get raw command
    command = command.replace("--", "").trim();
    let toggle = null;
    // check if command is toggle
    if (command.startsWith("enable")) toggle = true;
    else if (command.startsWith("disable")) toggle = false;
    command = command.replace("enable", "").replace("disable", "").trim();
    // extract args
    const args = command.includes(" ") ? command.substr(command.indexOf(" ")).trim() : "";
    command = command.replace(args, "").trim();
    match = false;
    // find matching command
    commands.forEach(cmd => {
        if (cmd.command.startsWith(command) && command.includes(cmd.command) && !match) {
            match = true;
            // execute command actions
            if (cmd.options.actionBefore) cmd.options.actionBefore(args);
            if (cmd.options.type == "toggle") if (toggle == true) cmd.options.actionEnable();
            else cmd.options.actionDisable();
            if (cmd.options.actionAfter) cmd.options.actionAfter(args);
            const response = cmd.options.response(cmd.options.type == "toggle" ? toggle : args);
            // print output
            QS("#game-chat .chat-content").appendChild(
                elemFromString(`<p><b style="color: var(--COLOR_CHAT_TEXT_DRAWING);">Command: ${cmd.command}</b><br><span style="color var(--COLOR_CHAT_TEXT_DRAWING);">${response}</span></p>`));
        }
    });
    if (!match) {
        // print error - no matching command 
        QS("#game-chat .chat-content").appendChild(
            elemFromString(`<p><b style="color: var(--COLOR_CHAT_TEXT_DRAWING);">Command failed: ${command}</b><br><span style="color: var(--COLOR_CHAT_TEXT_DRAWING);">Not found :(</span></p>`));
    }
    scrollMessages();
}

const addChatMessage = (title, content) => {
    let box = document.querySelector(".chat-content");
    let scroll = Math.floor(box.scrollHeight - box.scrollTop) <= box.clientHeight + 30;
    box.appendChild(
        elemFromString(`<p>${title != "" ? `<b style="color: var(--COLOR_CHAT_TEXT_DRAWING);">${title}</b><br>` : ""}<span style="color: var(--COLOR_CHAT_TEXT_DRAWING);">${content}</span></p>`));
    if (scroll) scrollMessages();
}

// #content features/uiTweaks.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// adds all smaller ui improvements to skribbl
// depends on: capture.js, generalFunctions.js, emojis.js
const uiTweaks = {
    palettes: [],
    initGameNavigation: () => {
        // Create next button
        let btNext = elemFromString(`<button id="legacy-next" style="display: none;" class="button-blue">Next Lobby</button>`);
        btNext.addEventListener("click", () => {
            leaveLobby(true)
        });

        let iconNext = elemFromString(`<div data-typo-tooltip='Next Lobby' data-tooltipdir='N' class="lobbyNavIcon next" style="
                background-image: url(${chrome.runtime.getURL("res/arrow.gif")}); 
            "></div>`);
        iconNext.addEventListener("click", () => {
            leaveLobby(true);
        });

        // Create exit button
        let btExit = elemFromString(`<button id="legacy-exit" style="display: none;" class="button-orange">Exit Lobby</button>`);
        btExit.addEventListener("click", () => {
            leaveLobby(false);
        });

        let iconExit = elemFromString(`<div data-typo-tooltip='Leave Lobby' data-tooltipdir='N'  class="lobbyNavIcon exit" style="
                background-image: url(${chrome.runtime.getURL("res/arrow.gif")}); 
            "></div>`);
        iconExit.addEventListener("click", () => {
            leaveLobby(false);
        });

        // create container for buttons
        let lobbyControls = elemFromString(`<div id="lobby-nav"></div>`);
        lobbyControls.appendChild(btExit);
        lobbyControls.appendChild(btNext);
        lobbyControls.appendChild(iconExit);
        lobbyControls.appendChild(iconNext);
        QS("#game-bar").appendChild(lobbyControls);
    },
    initWordHint: () => {
        // Add wordcount under input
        const input = QS("#game-chat form input");
        const hints = QS("#game-word .hints .container");
        const characters = QS("#game-chat .characters");

        /* let charbar = (input.insertAdjacentHTML("afterend", "<span id='charbar' style='color:black' ></span>"), QS("#charbar"));
        charbar.insertAdjacentHTML("afterend", "<style id='charcountRules'></style>"); */

        input.parentElement.insertAdjacentHTML("afterEnd", "<div id=\"emojiPrev\"\ style='z-index: 10; display:none; padding: .5em;box-shadow: black 1px 1px 9px -2px;position: absolute;bottom: 2.5em;background: white;border-radius: 0.5em;'></div>");

        let refreshCharBar = () => {
            // recognize command and call interpreter
            if (input.value.includes("--") && localStorage.chatcommands == "true") {
                performCommand(input.value);
                input.value = "";
            }
            /* QS("#charcountRules").innerHTML = localStorage.charbar == "true" ? ".word-length{display:block !important}" : "#charbar { display: none !important }";
            if (hints.querySelector(".word-length") && hints.querySelector(".word-length").parentElement.style.display != "none") { // show charbar only if guessing
                let word = hints.textContent.replace(hints.querySelector(".word-length").innerText, "");
                charbar.textContent = word.length - input.value.length;
                if (input.value.length > word.length
                    || !replaceUmlaute(input.value).toLowerCase().match(new RegExp(word.substr(0, input.value.length).toLowerCase().replaceAll("_", "[\\w\\d]")))) {
                    charbar.style.background = "#ff5c33";
                }
                else charbar.style.background = "#BAFFAA";
            }
            else {
                charbar.innerText = " - ";
                charbar.style.background = "#BAFFAA";
            } */
            if (localStorage.charbar != "true") {
                characters.style.cssText = "display:none";
            }
            else if (hints.querySelector(".word-length") && hints.querySelector(".word-length").parentElement.style.display != "none") {
                let word = hints.textContent.replace(hints.querySelector(".word-length").innerText, "");
                if (input.value.length > word.length
                    || !replaceUmlaute(input.value).toLowerCase().match(new RegExp(replaceUmlaute(word.substr(0, input.value.length).toLowerCase().replaceAll("_", "[\\w\\d]"))))) {
                    characters.style.cssText = "color: red; transform: scale(120%)";
                }
                else characters.style.cssText = "";
            }
            else {
                characters.style.cssText = "";
            }
        }
        refreshCharBar();
        // Add event listener to keyup and process to hints
        input.addEventListener("keyup", refreshCharBar);
        // Add event listener to word mutations
        (new MutationObserver(refreshCharBar)).observe(QS("#game-word"), { attributes: true, childList: true, subtree: true, characterData: true });
    },
    initCanvasZoom: () => {
        // init precise drawing mode
        let canvasGame = QS("#game-canvas canvas");
        let zoomActive = false;
        let changeZoom;
        uiTweaks.resetZoom = () => {
            // reset zoom
            canvasGame.setAttribute("data-zoom", 1);
            canvasGame.parentElement.style.height = "";
            canvasGame.parentElement.style.width = "";
            //canvasGame.parentElement.style.boxShadow = "";
            canvasGame.style.width = "";
            canvasGame.style.height = "";
            canvasGame.style.top = "";
            canvasGame.style.left = "";
            document.removeEventListener("keydown", changeZoom);
            [...QSA(".zoomNote")].forEach(n => n.remove());
            zoomActive = false;
            // document.querySelector(".size-picker .slider").dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
        }
        let toggleZoom = (event, skipctrl = false) => {
            if (!isCurrentlyDrawing()) return;

            if ((event.ctrlKey || skipctrl) && localStorage.zoomdraw == "true") {

                if (document.fullscreenElement) {
                    new Toast("Zoom is not available while using fullscreen mode.", 2000);
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                if (skipctrl || !zoomActive && !QS("#game-toolbar").classList.contains("hidden")) {
                    zoomActive = true;
                    const zoom = Number(sessionStorage.zoom) > 1 ? Number(sessionStorage.zoom) : 3;
                    // refresh brush cursor
                    canvasGame.setAttribute("data-zoom", zoom);
                    //document.querySelector(".size-picker .slider").dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
                    // get current height and set to parent
                    let bRect = canvasGame.getBoundingClientRect();
                    canvasGame.style.height = /* bRect.height + */ `calc(600px * ${zoom})`;
                    canvasGame.style.width = /* bRect.width + */ `calc(800px * ${zoom})`;
                    canvasGame.parentElement.style.height = /* bRect.height + */ `calc(600px * ${1})`;
                    canvasGame.parentElement.style.width = /* bRect.width + */ `calc(800px * ${1})`;
                    if (!QS(".zoomNote")) {
                        QS("#game-word .description").insertAdjacentHTML("beforeend", "<span class='zoomNote'> (ZOOM MODE ACTIVE)</span>");
                    }
                    //canvasGame.parentElement.style.boxShadow = "black 0px 0px 25px 5px";
                    // zoom canvas
                    canvasGame.style.width = (zoom * 100) + "%";
                    // get position offset
                    canvasGame.style.position = "relative";
                    canvasGame.style.top = "-" + ((event.offsetY * zoom) - (600 / 2)) + "px";
                    canvasGame.style.left = "-" + ((event.offsetX * zoom) - (800 / 2)) + "px";
                    changeZoom = (e) => {
                        if (Number(e.key) > 1 && Number(e.key) <= 9) {
                            sessionStorage.zoom = e.key;
                            toggleZoom(event, true);
                            //toggleZoom(event);
                        }
                    }
                    document.addEventListener("keydown", changeZoom);

                    // undo brush action glitch
                    //document.addEventListener("pointerup", () => setTimeout(() => QS("[data-tooltip=Undo]").click(), 100), { once: true });
                }
                else {
                    uiTweaks.resetZoom();
                }
            }
        }
        document.addEventListener("pointerdown", toggleZoom);
        document.addEventListener("logCanvasClear", (e) => { uiTweaks.resetZoom(); });

        // disable pointer events when ctrl pressed
        document.addEventListener("keydown", (e) => canvasGame.style.pointerEvents = e.ctrlKey ? "none" : "");
        document.addEventListener("keyup", (e) => canvasGame.style.pointerEvents = e.ctrlKey ? "none" : "");
    },
    initColorPalettes: () => {
        // add color palettes
        palettes = JSON.parse(localStorage.customPalettes).forEach(palette => {
            uiTweaks.palettes.push(createColorPalette(palette));
        });
        // add small skribbl palette
        const smallSkribbl = `{"name":"oldSkribbl", "rowCount": 11, "colors":[{"color":"rgb(255, 255, 255)"},{"color":"rgb(210, 210, 210)"},{"color":"rgb(239, 19, 11)"},{"color":"rgb(255, 113, 0)"},{"color":"rgb(255, 228, 0)"},{"color":"rgb(0, 204, 0)"},{"color":"rgb(0, 178, 255)"},{"color":"rgb(35, 31, 211)"},{"color":"rgb(163, 0, 186)"},{"color":"rgb(211, 124, 170)"},{"color":"rgb(160, 82, 45)"},{"color":"rgb(0, 0, 0)"},{"color":"rgb(80, 80, 80)"},{"color":"rgb(86, 8, 6)"},{"color":"rgb(137, 39, 0)"},{"color":"rgb(163, 103, 0)"},{"color":"rgb(0, 61, 3)"},{"color":"rgb(0, 59, 120)"},{"color":"rgb(8, 3, 82)"},{"color":"rgb(65, 0, 81)"},{"color":"rgb(118, 48, 75)"},{"color":"rgb(72, 28, 0)"}]}`;
        const smallPalette = createColorPalette(JSON.parse(smallSkribbl));
        smallPalette.json = null;
        uiTweaks.palettes.push(smallPalette);
        uiTweaks.palettes.push({
            name: "originalPalette", activate: () => {
                [...QSA("#game-toolbar .colors.custom")].forEach(p => p.remove());
                QS("#game-toolbar .colors").style.display = "";
            }
        });
        uiTweaks.palettes.find(palette => palette.name == localStorage.palette)?.activate();
    },
    initLobbyDescriptionForm: () => {
        // add Description form 
        let customwords = QS(".group-customwords, .game-room-group.customwords");
        const input = elemFromString(`<div class="group-customwords game-room-group" style="min-height:3rem">
<div class="game-room-name">Palantir Description</div>
<textarea id="lobbyDesc" maxlength="200" spellcheck="false" placeholder="Add a description that will show up in the Palantir bot"></textarea>
</div>`);
        customwords.insertAdjacentElement("beforebegin", input);
    },
    initLobbyChat: () => {
        return; // not needed anymore
        const chat = QS("#game-chat");
        const settings = QS("#game-room .settings");
        const board = QS("#game-board");

        let roomObserver = new MutationObserver(function (mutations) {
            if (chat.classList.contains("room")) {
                if (settings.parentElement != chat.parentElement) settings.insertAdjacentElement("afterend", chat);
            }
            else {
                if (board.parentElement != chat.parentElement) board.insertAdjacentElement("afterend", chat);
            }
        });
        roomObserver.observe(chat, { attributes: true, childList: false });

    },
    initMarkMessages: () => {

        QS(".chat-content").addEventListener("click", e => {
            let id = e.target.closest("[playerid]")?.getAttribute("playerid");
            if (id) {
                const clickedName = e.target.closest("b");
                if (clickedName) {
                    let player = QS("#game-players .player[playerid='" + id + "']");
                    player.click();
                }
            }
        });

        const addPlayerPopup = (node) => {
            let attr = node.getAttribute("playerid");
            if (attr) {
                node.querySelector("b").style.cursor = "pointer";
                if (localStorage.experimental != "true") return;
                let clone = document.querySelector("#game-players .player[playerid='" + attr + "'] .player-avatar-container").cloneNode(true);
                clone.style.height = "1em";
                clone.style.width = "1em";
                clone.style.display = "inline-block";
                clone.style.marginRight = ".4em";
                clone.style.marginLeft = ".4em";
                clone.style.transform = "translateY(15%)";
                node.querySelector("b").insertAdjacentElement("beforebegin", clone)
            }
        }

        // Observer for chat mutations and emoji replacement
        let chatObserver = new MutationObserver(function (mutations) {
            mutations.forEach(mutation => mutation.addedNodes.forEach(markMessage));
            mutations.forEach(mutation => mutation.addedNodes.forEach(emojis.replaceEmojiContent));
            mutations.forEach(mutation => mutation.addedNodes.forEach(addPlayerPopup));
        });
        chatObserver.observe(QS(".chat-content"), { attributes: false, childList: true });
    },
    initSideControls: () => {
        //init new controls div
        document.body.appendChild(elemFromString("<div id='controls'></div>"));
        QS("#controls").style.cssText = "z-index: 50;position: fixed;display: flex; flex-direction:column; left: 9px; top: 9px";
        QS("#controls").style.display = localStorage.controls == "true" ? "flex" : "none";

        // add typro
        let typroCloud = elemFromString("<div data-typo-tooltip='Typo Cloud' data-tooltipdir='E'  style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/cloud.gif")
            + ") center no-repeat;'></div>");
        typroCloud.addEventListener("click", typro.show);
        QS("#controls").append(typroCloud);

        // add appearance options
        let visualsButton = elemFromString("<div data-typo-tooltip='Themes' data-tooltipdir='E' style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
            + chrome.runtime.getURL("/res/themes.gif")
            + ") center no-repeat;'></div>");
        visualsButton.addEventListener("click", visuals.show);
        QS("#controls").append(visualsButton);

        // add brush tools
        //let brushmagicButton = elemFromString("<div style='height:48px;width:48px;cursor:pointer; background-size:contain; background: url("
        //    + chrome.runtime.getURL("/res/brush.gif")
        //    + ") center no-repeat;'></div>");
        //brushmagicButton.addEventListener("click", brushtools.showSettings);
        //QS("#controls").append(brushmagicButton);
    },
    initDefaultKeybinds: () => {
        const chatInput = QS('#game-chat form input');
        let lastColorSwitch = 0;
        document.addEventListener('keydown', e => {
            if (!document.activeElement.matches("#game-chat form input")) {
                // Focus chat
                if (e.key === 'Tab' && !(e.altKey || e.ctrlKey || e.shiftKey)) {
                    e.preventDefault();
                    chatInput.focus();
                    return;
                }

                // size shortcuts
                else {
                    let sizes = [...QSA(".container .size")];
                    let ind = Number(e.key);
                    if (ind > 0 && ind < 6) sizes[ind - 1].click();
                }
            }
            else if (document.activeElement.matches("#game-chat form input") && e.key === 'Tab' && !(e.altKey || e.ctrlKey || e.shiftKey)) e.preventDefault();

            if (e.key === 'AltGraph' && !(e.altKey || e.ctrlKey || e.shiftKey)) {// Show player IDs
                let removeIDs = (event) => {
                    if (event.key == "AltGraph") {
                        document.removeEventListener("keyup", removeIDs);
                        QSA("#game-players .player").forEach(player => {
                            player.querySelector(".player-icons span")?.remove();
                        });
                    }
                }
                document.addEventListener("keyup", removeIDs);
                QSA("#game-players .player").forEach(player => {
                    if (!player.querySelector(".player-icons span")) player.querySelector(".player-icons").insertAdjacentHTML("afterbegin", "<span style='color:inherit'>#" + player.getAttribute("playerid") + " </span>");
                });
                return;
            }
        });
        // Switch colors
        document.addEventListener("toggleColor", () => {
            if (Date.now() - lastColorSwitch < 50) return;
            lastColorSwitch = Date.now();
            const prim = parseInt(new Color({ rgb: QS("#color-preview-primary").style.fill }).hex.replace("#", ""), 16) + 10000;
            const sec = parseInt(new Color({ rgb: QS("#color-preview-secondary").style.fill }).hex.replace("#", ""), 16) + 10000;
            document.dispatchEvent(newCustomEvent("setColor", { detail: { code: sec, secondary: false } }));
            document.dispatchEvent(newCustomEvent("setColor", { detail: { code: prim, secondary: true } }));
        });
    },
    initLobbyRestriction: () => {
        let controls = QS("#controls");
        let restrict = elemFromString("<div id='restrictLobby' data-tooltipdir='E' data-typo-tooltip='Lobby Privacy' style='z-index:50;display:none;flex: 0 0 auto;cursor:pointer; user-select: none; width:48px; height:48px; background: center no-repeat'></div>");
        controls.append(restrict);
        let updateIcon = () => {
            if (localStorage.restrictLobby == "unrestricted") restrict.style.backgroundImage = "url(" + chrome.runtime.getURL("res/lock-unrestricted.gif") + ")";
            else restrict.style.backgroundImage = "url(" + chrome.runtime.getURL("res/lock-restricted.gif") + ")";
        }
        updateIcon();
        restrict.addEventListener("click", () => {
            let servers = "";
            socket.data.user.member.Guilds.forEach(guild => servers += "<option value='" + guild.GuildID + "'>" + guild.GuildName + "</option>");
            let modal = new Modal(elemFromString(`<div id="selectrestriction"><h4>Choose in which Discord Servers Palantir is allowed to share the lobby invite link.<br>Your preference is used when you're the owner of a private lobby.<br>You can change it anytime in-game.</h4><br>
                        <input type="radio" id="unrestricted" name="restriction" value="unrestricted" checked>
                        <label for="unrestricted"> No Restrictions</label><br> 
                        <input type="radio" id="restrictserver" name="restriction" value="server">
                        <label for="restrictserver"> Allow a single server: </label> <select>
                        ${servers}
                        </select><br> 
                        <input type="radio" id="restricted" name="restriction" value="restricted">
                        <label for="restricted"> Allow no one to see the invite</label></div>`), async () => {
                localStorage.restrictLobby = QS("#selectrestriction input[name=restriction]:checked").value;
                if (localStorage.restrictLobby == "server") localStorage.restrictLobby = QS("#selectrestriction select").value;
                updateIcon();
                if (lobbies.joined && lobbies.userAllow) { // report lobby if joined
                    let description = lobbies.lobbyProperties.Private ? (QS("#lobbyDesc") && QS("#lobbyDesc").value ? QS("#lobbyDesc").value : '') : "";
                    await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key, description);
                }
            }, "Lobby Privacy");
            if (localStorage.restrictLobby == "restricted") modal.content.querySelector("#restricted").setAttribute("checked", "checked");
            else if (localStorage.restrictLobby == "unrestricted") modal.content.querySelector("#unrestricted").setAttribute("checked", "checked");
            else if (localStorage.restrictLobby != "") {
                modal.content.querySelector("#restrictserver").setAttribute("checked", "checked");
                modal.content.querySelector("select").value = localStorage.restrictLobby;
            }
        });
    },
    initQuickReact: () => {
        let react = elemFromString(`<div tabindex="0" id="quickreact" style="
        display: flex;
        place-content: space-evenly;
        width: 100%;
        border-radius: .5em;
        margin-right: .5em;
        margin-top: .5em;
        cursor: not-allowed;
        user-select: none;
        display:none;
        outline: none;
    ">
    <style>
        #quickreact > span {
            background: var(--COLOR_PANEL_BG);
            color: var(--COLOR_GAMEBAR_TEXT);
            border-radius: .5em;
            padding: .5em;
            font-weight: 600;
        }
    </style>
    <span>⬅️Close</span><span>⬆️Like</span><span>⬇️Shame</span><span>➡️Kick</span></div>`);
        QS("#game-chat").appendChild(react);
        let chatinput = QS("#game-chat form input");
        chatinput.addEventListener("keyup", (e) => {
            if (localStorage.quickreact == "true" && e.which == 17 && chatinput.value == "" && react.style.display == "none") {
                react.style.display = "flex";
                react.focus();
            }
        });
        react.addEventListener("focusout", () => react.style.display = "none");
        react.addEventListener("keyup", (e) => {
            e.bubbles = false;
            e.preventDefault();
            if (e.which == 38) { // up
                performCommand("like");
            }
            else if (e.which == 39) { // right
                performCommand("kick");
            }
            else if (e.which == 40) { // down
                performCommand("shame");
            }
            chatinput.focus();
        });
        react.addEventListener("keydown", (e) => e.preventDefault());
    },
    initSelectionFormatter: () => {
        let popup = elemFromString(`<div id="copyFormatted" style="
    position: absolute;
    width: calc(90% - 8px);
    left: 5%;
    background: white;
    border-radius: .5em;
    padding: .5em;
    color: black !important;
    font-weight: 600;
    top:0;
    text-align: center;
    cursor: pointer;
    user-select:none;
    box-shadow: black 0px 2px 7px;
">Copy chat selection for Discord</div>`);
        popup.style.display = "none";
        const chatbox = QS("#game-chat > .chat-content");
        popup.addEventListener("pointerdown", () => {
            let chat = document.getSelection().toString();
            chat = chat.replace(/(\n)(?=.*? guessed the word!)/g, "+ ")
                .replace(/(\n)(?=.*? joined.)/g, "+ ")
                .replace(/(\n)(?=The word was)/g, "+ ")
                .replace(/(\n)(?=.*? is drawing now!)/g, "+ ")
                .replace(/(\n)(?=.*? left.)/g, "- ")
                .replace(/(\n)(?=.*? is voting to kick.)/g, "- ")
                .replace(/(\n)(?=.*? was kicked.)/g, "- ")
                .replace(/(\n)(?=Whoops.*? caught the drop before you.)/g, "--- ")
                .replace(/(\n)(?=Yeee.*? and caught the drop!)/g, "--- ")
                .replaceAll("\n\n", "\n");
            document.getSelection().removeAllRanges();
            new Toast("Copied chat to clipboard!", 1000);
            navigator.clipboard.writeText("```diff\n" + chat + "\n```");
        });
        document.addEventListener("selectionchange", () => {
            const selection = document.getSelection();
            if (selection.toString() != "" && chatbox.contains(selection.anchorNode) && selection.anchorNode.localName != "form") popup.style.display = "";
            else setTimeout(() => popup.style.display = "none", 20);
        });
        QS("#game-chat").appendChild(popup);
    },
    initClipboardCopy: () => {
        document.addEventListener("keydown", async (e) => {
            if (!(e.which == 67 && e.ctrlKey) || QS("#game").style.display == "none" || document.getSelection().type == "Range") return;
            let canvas = QS("#game-canvas canvas");
            let scaled = await scaleDataURL(canvas.toDataURL(), canvas.width * localStorage.qualityScale, canvas.height * localStorage.qualityScale);
            await dataURLtoClipboard(scaled);
            new Toast("Copied image to clipboard.", 1500);
        });
    },
    initChatRecall: () => {
        const input = QS("#game-chat form input");
        let history = [];
        let lookup = [];
        // Add event listener to keyup and process to hints
        input.addEventListener("keydown", (event) => {
            if (event.code == "Enter") {
                history = history.concat(lookup.splice(0).reverse());
                history.push(input.value);
            }
        });
        input.addEventListener("keyup", (event) => {
            if (event.code == "ArrowUp") {
                let prev = history.pop();
                if (prev) {
                    lookup.push(prev);
                    input.value = prev;
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }
            else if (event.code == "ArrowDown") {
                let next = lookup.pop();
                if (next) {
                    history.push(next);
                    input.value = next;
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }
        });
    },
    initChooseCountdown: () => {
        const overlay = QS(".overlay");
        let lastWinnerMsg = "";
        QS(".overlay").insertAdjacentHTML("beforeBegin",
            "<style>.overlay::after {content: '';position: absolute;top: 0;left: 0;width: 100%;}.overlay.countdown::after{background: lightgreen;height: .5em;transition: width 15s linear;width: 0;}</style>");
        const overlayObserver = new MutationObserver(() => {
            //if (QS(".overlay-content .result.show")?.innerText.includes("is the winner!")) {
            //    let winnerMsg = QS(".rank-name").innerText + " won the game with a score of " + QS(".rank-score").innerText + "!";
            //    if (winnerMsg != lastWinnerMsg) addChatMessage(winnerMsg, "");
            //    lastWinnerMsg = winnerMsg;
            //}
            if (QS(".overlay-content .text.show")?.innerText.includes("Choose a word")) {
                overlay.classList.add("countdown");
            }
            else overlay.classList.remove("countdown");
        });
        overlayObserver.observe(QS(".overlay-content"), { subtree: true, attributes: true, characterData: true });
    },
    initStraightLines: () => {
        // Credits for basic idea of canvas preview to https://greasyfork.org/en/scripts/410108-skribbl-line-tool/code
        // preview canvas
        const preview = {
            canvas: elemFromString(`<canvas style="position:absolute; cursor:crosshair; touch-action:none; inset: 0; z-index:10; opacity:0.5" width="800" height="600"></canvas>`),
            context: () => preview.canvas.getContext("2d"),
            gameCanvas: QS("#game canvas"),
            use: () => {
                preview.clear();
                preview.gameCanvas.insertAdjacentElement("afterend", preview.canvas);
                preview.gameCanvas.style.pointerEvents = "none";

                if (!QS(".slNote")) {
                    QS("#game-word .description").insertAdjacentHTML("beforeend", "<span class='slNote'> (STRAIGHT MODE ACTIVE)</span>");
                }
            },
            stop: () => {
                preview.canvas.remove();
                preview.gameCanvas.style.pointerEvents = "";
                QS(".slNote")?.remove();
            },
            clear: () => preview.context().clearRect(0, 0, 800, 600),
            line: (x, y, x1, y1, color = "black", size = 5) => {
                preview.clear();
                const ctx = preview.context();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x1, y1);
                ctx.strokeStyle = color;
                ctx.lineWidth = size;
                ctx.stroke();
            }
        };
        const chatInput = QS("#game-chat form input");
        let straight = false;
        let lastPress = 0;
        let snap = false;
        let pointerdown = false;
        let lastDown = [null, null];
        let lastDownClient = [null, null];
        let lastDirectClient = [null, null];
        const pointerEvent = (type, id, x, y, pressure = 0.5) => {
            return new PointerEvent(type, {
                bubbles: true,
                clientX: x,
                clientY: y,
                button: 0,
                pressure: pressure,
                pointerType: "mouse",
                pointerId: id
            });
        }
        // get pos when scaled
        const getRealCoordinates = (x, y) => {
            const { width, height } = preview.canvas.getBoundingClientRect();
            x = (800 / width) * x;
            y = (600 / height) * y;
            return [x, y];
        }
        // listen for shift down
        document.addEventListener("keydown", (event) => {
            if (document.activeElement == chatInput || !isCurrentlyDrawing()) return;
            let state = straight;
            straight = straight || event.which === 16;
            if (straight && !state) preview.use();
            if (straight && !state && Date.now() - lastPress < 300) snap = true;
            if (straight && !state && event.which === 16) {
                lastPress = Date.now();
            }
        });
        document.addEventListener("keyup", (event) => {
            let state = straight;
            straight = straight && event.which !== 16;
            snap = straight && snap;
            if (!straight/*  && !pointerdown */) preview.stop();
            if (!straight) lastDirectClient = [null, null];
        });
        // get snap end coordinates
        const snapDestination = (x, y, x1, y1) => {
            let dx = Math.abs(x - x1);
            let dy = Math.abs(y - y1);
            return dx > dy ? [x1, y] : [x, y1];
        }
        // listen for pointer events
        preview.canvas.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
            pointerdown = true;
            if (straight) {
                lastDownClient = [event.clientX, event.clientY];
                lastDown = getRealCoordinates(event.offsetX, event.offsetY);
            }
        });
        document.addEventListener("pointerup", (event) => {
            pointerdown = false;
            // check for event target to filter out generated events that are used for actual drawing
            if (straight && event.target !== preview.gameCanvas) {
                event.preventDefault();
                event.stopPropagation();
                preview.clear();
                lastDown = [null, null];
                let dest = [event.clientX, event.clientY];
                if (snap) dest = snapDestination(lastDownClient[0], lastDownClient[1], event.clientX, event.clientY);
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerdown", event.pointerId, lastDownClient[0], lastDownClient[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointermove", event.pointerId, dest[0], dest[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerup", event.pointerId, dest[0], dest[1]));
            }
        });
        document.addEventListener("pointermove", (event) => {
            // update preview only if cursor moved on preview
            if (straight && event.target == preview.canvas) {
                event.preventDefault();
                event.stopPropagation();
                const col = QS("#color-preview-primary").style.fill;
                const size = [4, 14, 30, 40][[...QSA(".size")].findIndex(size => size.classList.contains("selected"))]
                if (lastDown[0]) {
                    let real = getRealCoordinates(event.offsetX, event.offsetY);
                    if (!snap) preview.line(lastDown[0], lastDown[1], real[0], real[1], col, size);
                    else {
                        let dest = snapDestination(lastDown[0], lastDown[1], real[0], real[1]);
                        preview.line(lastDown[0], lastDown[1], dest[0], dest[1], col, size);
                    }
                }
            }
        });
        preview.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            if (straight && lastDirectClient[0] != null) {
                let dest = [event.clientX, event.clientY];
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerdown", event.pointerId, lastDirectClient[0], lastDirectClient[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointermove", event.pointerId, dest[0], dest[1]));
                preview.gameCanvas.dispatchEvent(pointerEvent("pointerup", event.pointerId, dest[0], dest[1]));
            }
            lastDirectClient = [event.clientX, event.clientY];
        })
    },
    initPenPointer: () => {
        const canvas = QS("#game-canvas canvas");
        const pointerRule = elemFromString("<style></style>");
        canvas.insertAdjacentElement("beforebegin", pointerRule);
        const smallBlackPointerCss = `cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAMxJREFUWEftkrENAjEQBPczO6CJS6CBpwtCQhqwa3gCiF0FIT1ADg1Ack3A58jSR4hwA7/YK2A1mpsOM7luJpwQKPtTMiqjbAPsPTUqo2wD7D01KqNsA+w9Ndq60RWAfoK8AXiygJmvXwLYm9miwrn7C8ARwIMBywTdmdm2lLIJIbxzzld3PwM4NQsaYxxTSpdWQWufw9frD6xOma+vH66drqdX31l91j02KCPHnxsCZauVURllG2DvqVEZZRtg76lRGWUbYO+p0b81+gHeNSQrN2iaOgAAAABJRU5ErkJggg==") 21 21, default`;
        canvas.addEventListener("pointerenter", (event) => {
            if (event.pointerType == "pen" && localStorage.pressure === "1")
                pointerRule.innerHTML = "#game-canvas canvas{" + smallBlackPointerCss + " !important}";
        });
        canvas.addEventListener("pointerleave", () => {
            pointerRule.innerHTML = "";
        });
    },
    updateAccountElements: () => {
        const loggedIn = socket.authenticated;
        if (loggedIn) {
            QS("#typoUserInfo").style.cssText = "";
            QS("#typoUserInfo").innerHTML = "<div style='display:flex; justify-content:space-between; width:100%;'><small>Connected: "
                + socket.data.user.member.UserName + "</small><small id='ptrManage'>Manage</small><small id='ptrLogout'>Logout</small></div><br>";
            QS("#typoUserInfo").innerHTML += "<div style='display:flex; justify-content:space-between; width:100%;'><span>🔮 Bubbles: "
                + socket.data.user.bubbles + "</span><span>💧 Drops: " + socket.data.user.drops + "</span></div>";
            if (localStorage.experimental == "true") QS("#typoUserInfo").insertAdjacentHTML("beforeend",
                "<br>Typo v" + chrome.runtime.getManifest().version + " connected@ " + socket.sck.io.uri);
            QS("#typoUserInfo #ptrManage").addEventListener("click", () => window.open("https://typo.rip#u"));
            QS("#typoUserInfo #ptrLogout").addEventListener("click", logout);

            sprites.setLandingSprites(true);
            sprites.resetCabin(true);
        }
        else {
            const userinfo = QS("#typoUserInfo")
            userinfo.innerText = "No palantir account connected.";
            userinfo.style.cssText = "opacity:1; transition: opacity 0.5s";
            setTimeout(() => { userinfo.style.opacity = "0"; }, 3000);
            setTimeout(() => { userinfo.style.display = "none" }, 3500);

            sprites.setLandingSprites(false);
            sprites.resetCabin(false);
        }
    },
    initColorTools: () => {
        QS(".toolbar-group-tools").insertAdjacentElement("afterbegin", elemFromString(`<div class="color-tools">
        <div class="top">
          <div class="color" id="color-canvas-picker" data-tooltipdir='N' data-typo-tooltip="Select a color from the canvas" style="background-image: url(${chrome.runtime.getURL("res/crosshair.gif")});"></div>
        </div>
        <div class="bottom">
          <div class="color" id="color-free-picker" data-tooltipdir='S' data-typo-tooltip="Open the color picker" style="background-image: url(${chrome.runtime.getURL("res/inspect.gif")});"></div>
        </div>
        </div>`
        ));


        // color picker
        const picker = QS("#color-free-picker");
        const pickr = Pickr.create({
            el: picker,
            useAsButton: true,
            theme: 'nano',
            components: {
                // Main components
                preview: true,
                hue: true,
                // Input / output Options
                interaction: {
                    input: true,
                }
            }
        });
        let dontDispatch = false;
        pickr.on("change", color => {
            colcode = parseInt(color.toHEXA().toString().replace("#", ""), 16) + 10000;
            if (!dontDispatch) document.dispatchEvent(newCustomEvent("setColor", { detail: { code: colcode } }));
            dontDispatch = false;
        });
        document.querySelector(".colors").addEventListener("click", () => {
            dontDispatch = true;
            pickr.setColor(QS("#color-preview-primary").style.fill);
        });
        document.addEventListener("setColor", (detail) => {
            dontDispatch = true;
            pickr.setColor(QS("#color-preview-primary").style.fill);
        });

        // pipette
        // activate skribbl tool on pipette btn click
        QS("#color-canvas-picker").addEventListener("click", () => {
            QS("[data-tooltip=Pipette]").click();
        });

        if(QS(".toolbar-group-tools [data-tooltip=Pipette]")){
            // update cursor when pipette changed activity
            new MutationObserver((e) => {
                if(e.some(r => r.type == "attributes" && r.attributeName == "class")) {
                    if(QS(".toolbar-group-tools [data-tooltip=Pipette]").classList.contains("selected")) {
                        QS("#game-canvas canvas").style.cursor = `url(${chrome.runtime.getURL("res/pipette_cur.png")}) 7 38, default`;
                    }
                }
            }).observe(QS(".toolbar-group-tools [data-tooltip=Pipette]"), { attributes: true, childList: false });
        }
        else {
            document.addEventListener("skribblInitialized", () => {
                // update cursor when pipette changed activity
                new MutationObserver((e) => {
                    if(e.some(r => r.type == "attributes" && r.attributeName == "class")) {
                        if(QS(".toolbar-group-tools [data-tooltip=Pipette]").classList.contains("selected")) {
                            QS("#game-canvas canvas").style.cursor = `url(${chrome.runtime.getURL("res/pipette_cur.png")}) 7 38, default`;
                        }
                    }
                }).observe(QS(".toolbar-group-tools [data-tooltip=Pipette]"), { attributes: true, childList: false });
            });
        }


        QS("#game-canvas canvas").addEventListener("click", (e) => {
            if(!document.querySelector(".toolbar-group-tools [data-tooltip=Pipette].selected")) return;

            const b = e.target.getBoundingClientRect();
            const scale = e.target.width / parseFloat(b.width);
            const x = (e.clientX - b.left) * scale;
            const y = (e.clientY - b.top) * scale;
            const rgba = e.target.getContext("2d").getImageData(x,y,1,1).data;
            const color = new Color({r: rgba[0], g:rgba[1], b:rgba[2]}).hex.replace("#", "");

            document.dispatchEvent(newCustomEvent("setColor", { detail: { code: parseInt(color, 16) + 10000 } }));
        });
    },
    initAll: () => {
        // clear ads for space 
        //document.querySelectorAll(".adsbygoogle").forEach(a => a.style.display = "none");
        //document.querySelectorAll('a[href*="tower"]').forEach(function (ad) { ad.remove(); });
        // mel i love you i would never do this
        uiTweaks.initGameNavigation();
        uiTweaks.initColorTools();
        uiTweaks.initWordHint();
        uiTweaks.initClipboardCopy();
        uiTweaks.initCanvasZoom();
        uiTweaks.initColorPalettes();
        uiTweaks.initLobbyDescriptionForm();
        uiTweaks.initMarkMessages();
        uiTweaks.initQuickReact();
        uiTweaks.initSelectionFormatter();
        uiTweaks.initSideControls();
        uiTweaks.initLobbyRestriction();
        uiTweaks.initDefaultKeybinds();
        uiTweaks.initChatRecall();
        uiTweaks.initChooseCountdown();
        uiTweaks.initStraightLines();
        uiTweaks.initPenPointer();

        document.dispatchEvent(new Event("addTypoTooltips"));

        QS("#game-chat > form > input[type=text]").setAttribute("maxlength", 300);

        const GAME = QS("#game");
        var gameObserver = new MutationObserver(() => {
            QS("#typoThemeBg")?.classList.toggle("ingame", GAME.style.display != "none");
        });
        gameObserver.observe(GAME, { attributes: true, childList: false });

        // random easteregg
        if (Math.random() < 0.1) QS("#game-chat form input").placeholder = "Typo your guess here...";
    }
}

// #content features/drops.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// handles drops collecting and initialization
// depends on: generalFunctions.js, commands.js
let drops = {
    eventDrops: [],
    mode: "normal",
    currentDrop: null,
    dropContainer: null,
    waitForClear: false,
    specialDrop: (callback) => {
        let html = `<div id="specialdrop">
        <style>
            @keyframes rotate {
                0% {transform:rotate(-45deg) ;}
                100% {transform:rotate(45deg) ;}
            }
            
            @keyframes wiggle {
                0% {transform:rotateZ(0deg) rotateY(-2deg);}
                50% {transform:rotateZ(-2deg) rotateY(0deg);}
                100% {transform:rotateZ(0deg) rotateY(-2deg);}
            }
        </style>

        <div style="
            position: fixed;
            left: 50vw;
            top: 50vh;
            z-index: 1000;
            animation: wiggle 0.7s;
            animation-iteration-count: infinite;
        "><div style="
            cursor:pointer;
            width: 10em;
            aspect-ratio: 2;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url(https://i.imgur.com/a0jNtCf.png);
            animation: rotate 6s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            transform-origin: 0 200vh;
        "></div></div>
        `;
        document.body.insertAdjacentHTML("afterbegin", html);
        setTimeout(() => {
            QS("#specialdrop").remove();
        }, 5000);
        hits = 0;
        msgs = [
            "Baby, hit me one more time",
            "Ouch?! x.x",
            "Bro just stop it",
            ":-( *sad santa noises*",
            ">:( no presents for you"
        ];
        QS("#specialdrop").addEventListener("pointerdown", () => {
            hits++;
            addChatMessage("Santa:", msgs[msgs.length * Math.random() | 0]);
            if (hits == 4) callback();
        });
    },
    newDrop: (drop) => {
        if (localStorage.drops == "false" || sessionStorage.inStream == "true" || !lobbies.joined) return;
        drops.currentDrop = drop;
        let dropElem = drops.dropContainer;
        if (drop.eventDropID == 0 || drops.mode === "league") dropElem.style.backgroundImage = 'url("https://static.typo.rip/drops/drop.gif")';
        else dropElem.style.backgroundImage = 'url("' + drops.eventDrops.find(e => e.EventDropID == drop.eventDropID).URL + '")';
        dropElem.style.display = "block";
        dropElem.style.left = Math.round(5 + Math.random() * 90) + "%";
        dropElem.style.filter = drops.mode === "normal" ? "" : "hue-rotate(100deg) saturate(1.5)";
        //hide drop after 1.95s and emit timeout
        setTimeout(async () => {
            if (drops.currentDrop && !drops.claimedDrop) {
                addChatMessage("Whoops...", "The drop timed out :o");
                drops.currentDrop = null;
                drops.claimedDrop = false;
                dropElem.style.display = "none";
            }

        }, 1950);
    },
    clearDrop: (result) => {
        if (localStorage.drops == "false" || sessionStorage.inStream == "true") return;
        let dropElem = drops.dropContainer;
        let winner = result.caughtPlayer;
        let weight = Math.round(Number(result.leagueWeight));
        if (weight > 30) {
            if (result.claimTicket == drops.currentDrop.claimTicket) {
                addChatMessage("Nice one!", "You caught a " + weight + "% rated drop.");
                drops.caughtLeagueDrop = true;
            }
            else {
                if (localStorage.dropmsgs == "true") addChatMessage("", winner + " claimed a " + weight + "% rated drop.");
            }
        }
        else {
            if (result.claimTicket == drops.currentDrop.claimTicket) {
                addChatMessage("Yeee!", "You caught the final drop!");
                drops.selfCaught = true;
            }
            else if (!drops.claimedDrop && !drops.caughtLeagueDrop) addChatMessage("Whoops..", winner + " caught the final drop :(");
            else addChatMessage("", winner + " caught the final drop.");
            drops.currentDrop = null;
            dropElem.style.display = "none";
        }
    },
    rankDrop: (data) => {
        if (localStorage.drops == "false") return;
        const ranks = data.ranks;
        const text = ranks.map(r => "- " + r).join("<br>");
        drops.currentDrop = null;
        drops.claimedDrop = false;
        drops.caughtLeagueDrop = false;
        drops.dropContainer.style.display = "none";
        if (localStorage.dropmsgs == "true") {
            addChatMessage("Last drop claim ranking:", text);
        }
    },
    initDropContainer: () => {
        // add drop button
        let dropContainer = document.createElement("div");
        drops.dropContainer = dropContainer;
        dropContainer.style.width = "48px";
        dropContainer.setAttribute("fuck-you", "are you really trying to auto-click drops? come on...");
        dropContainer.style.height = "48px";
        dropContainer.style.left = "8px";
        dropContainer.style.bottom = "8px";
        dropContainer.style.position = "absolute";
        dropContainer.style.backgroundSize = "contain";
        dropContainer.style.cursor = "pointer";
        dropContainer.style.display = "none";
        dropContainer.style.backgroundImage = "url('https://static.typo.rip/drops/drop.gif')";
        dropContainer.addEventListener("pointerdown", async (event) => {
            if (!event.isTrusted) {
                // send webhook
                await fetch("https://discord.com/api/webhooks/917505895867482183/mhR2tsguCLDG8O-jmiSPo_YEtIUTIxA9Oq00jV6IdZi9VjP4p4Ntm1b8WvmGbSQk4kOI", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "fuck you",
                        embeds: [
                            {
                                "title": socket.data.user.member.UserLogin + socket.data.user.member.UserName
                            }
                        ]
                    })
                });
                return;
            }
            if (dropContainer.style.display == "none") return;
            dropContainer.style.display = "none";
            drops.claimedDrop = true;
            let result = await socket.claimDrop(drops.currentDrop);
        });
        document.querySelector("#game-canvas").appendChild(dropContainer);
    },
    initDrops: async () => {
        drops.initDropContainer();
        drops.eventDrops = socket.data.publicData.drops;
    }
}

// #content features/capture.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// captures drawings and actions on canvas
// depends on: genericfunctions.js
const captureCanvas = {
    capturedCommands: [],
    capturedDrawings: [],
    abortDrawingProcess: false,
    drawOnCanvas: async (commands) => {
        // function to draw selected draw commands separated in actions
        captureCanvas.abortDrawingProcess = false;
        //QS("#abortDrawing").style.display = "block";
        QS("#game-canvas canvas").style.pointerEvents = "none";
        //if (QS("#clearCanvasBeforePaste").checked) QS(".tools .tool div.icon[style*='clear.gif']").dispatchEvent(newCustomEvent("click"));
        for (dc of commands) {
            if (captureCanvas.abortDrawingProcess === true || QS("#game-toolbar.hidden")) {
                QS("#game-canvas canvas").style.pointerEvents = "";
                return;
            }
            if (dc.length == 1 && dc[0] == 3) QS(".toolbar-group-actions .tool div.icon[style*='clear.gif']").dispatchEvent(newCustomEvent("click"));
            else document.dispatchEvent(newCustomEvent("performDrawCommand", { detail: dc }));
            captureCanvas.capturedCommands.push(dc);
            await waitMs(3);
        }
        QS("#game-canvas canvas").style.pointerEvents = "";
    },
    initListeners: () => {
        // capture drawings
        document.addEventListener("logDrawCommand", e => {
            captureCanvas.capturedCommands.push(e.detail);
        });
        // capture redos
        document.addEventListener("logRedo", e => {
            captureCanvas.capturedCommands = e.detail;
        });
        // clear captured comamnds on canvasclear
        document.addEventListener("logCanvasClear", () => {
            captureCanvas.capturedCommands = [[3]];
        });
        // puts the image data in array to be displayable in the image share popup
        document.addEventListener("drawingFinished", async (data) => {
            captureCanvas.capturedDrawings.push({
                drawing: QS("#game-canvas canvas").toDataURL("2d"),
                drawer: getCurrentOrLastDrawer(),
                word: data.detail,
                hint: "(" + data.detail.length + ")"
            });

            try {

                const response = await typoApiFetch(`/cloud/${socket.data.user.member.UserLogin}`, "POST", undefined, {
                    name: data.detail,
                    author: getCurrentOrLastDrawer(),
                    inPrivate: lobbies.lobbyProperties.Private,
                    language: lobbies.lobbyProperties.Language,
                    isOwn: getCurrentOrLastDrawer() == socket.clientData.playerName,
                    commands: captureCanvas.capturedCommands,
                    imageBase64: QS("#game-canvas canvas").toDataURL().replace("data:image/png;base64,", "")
                }, localStorage.accessToken, true);

                if(awards.cloudAwardLink !== undefined && response.id !== undefined){
                    await typoApiFetch(`/cloud/${socket.data.user.member.UserLogin}/${response.id}/award/${awards.cloudAwardLink}`, "PATCH", undefined, undefined, localStorage.accessToken, false);
                    console.log("Awarded drawing with id " + response.id + " with award id " + awards.cloudAwardLink);
                }

                /*await socket.emitEvent("store drawing", {
                    meta: {
                        name: data.detail,
                        author: getCurrentOrLastDrawer(),
                        own: getCurrentOrLastDrawer() == socket.clientData.playerName,
                        language: lobbies.lobbyProperties.Language,
                        private: lobbies.lobbyProperties.Private,
                        thumbnail: await scaleDataURL(QS("#game-canvas canvas").toDataURL("2d"), QS("#game-canvas canvas").width / 10, QS("#game-canvas canvas").height / 10)
                    },
                    linkAwardId: awards.cloudAwardLink,
                    commands: captureCanvas.capturedCommands,
                    uri: QS("#game-canvas canvas").toDataURL()
                }, true, 5000);*/
            }
            catch { }
            awards.cloudAwardLink = undefined;
        });
    }
}

/*
    Draw Report message format:
        Draw:   ["drawCommands", [C1], [C2], ..., [C8]]
        Clear:  ["clearCanvas"]

    Draw command format:
        Brush:  [m, c, s, x1, y1, x2, y2]
        Fill:   [m, c, x1, y1]
        Erase:  [m, s, x1, y1, x2, y2]
        Clear:  [m] (Only custom logged)

    Parameter values:
        Mode    m: 0 (Brush), 1 (Erase), 2 (Fill), 3 (Clear - Only custom report to content script, originally sent as "clearCanvas" report message)
        Color   c: 0-22 (Column-wise skribbl colors, left to right)
        Vector  x: 0-800
        Vector  y: 0-600

xt: get color of index
*/

// #content features/cloud.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, socket.js
let typro = {
    thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAYAAADxJz2MAAAKXElEQVR4Xu1aeXRU5RW/M5lJZiaZCQoeNIIWK1XR4gGtAlXCUk5dDq0eWg4UiqFAwbJYhUIOiJzoSSpSl7IolLZApUqxqchmFAm2VLa2UmzFUiwgyKKEJTPJ7Hmv53cn3/S9mXlv3uRNhtgz31/JvG+53++7+70WWZZlyo82I2DJA9hm7HhhHkBz+OUBNIlfHsCcAygHAxTd/g4V9LqZrD2uSzpfbm6myMbXydZvQMrvZgnuaOsz1oHSyU/Jd/cd5Kx+hgpHj026T/P4sRTZtIFcS5an/N7RADBLT8YAenvfQNKpk5oAXexSwjSlAjD8yssUXPRT/u58sobswx8wS/8lX58RgLLPR409rtIEyNunF0knjlPhqDHkWroifjmItX/aZGr521/4t+I1r1BgwTyyfqkHWdwe/s02eAjZBw0lstkuOSiZEJARgP7HplP4N6tSAhjdu5uavz+KKBSMiffYh3gewAvMm03S4X+T/bujKDDrEU36nFXVVDRV+3smF8vV3IwAFByWSkTBYeF1vyXbwEFU8ofNcfqhE+XPP2OObPnnB+Sf+QgBKOUA+OG1a2KivegFKho/MVf3N32OYQAhcqEVy6jkjTep6f5hKh0HowEAwW2lh46RpXOXOGEXyzqTY+Zscsycw79Bf1rLrlYRLkQc+1iv70mePftNXyxXGxgDMBwm//QpFN39HpVsfpu8fW9WARh+dS1/B3AAUAxwLIZn/0FD98l0fspNo1EK//53rGPlcw1UevQ0WdxuzfNlv5/khrPx79ZrrjVEq5hkCMDozj8yQCUb63idFoAQXYjwpQRQOv4J0yeGs3ohFU2eqglK4Cc/ptCqX8a/d2poyj6A4LDQyuVUsv51wospAZTPn2PjAT3mef9DUr4gOKpo/CQqmvGoIaKywYHCaMV1ahoAhdslCCx57Q2yDR5qiF5MSsuB0Fm+QQPIUfk4FVVMILmxkZp/WEHWyzuT82c/J/nCeQYUhxb/YjVZLrtMxYGevfuJCovSEiR0rPWqMsMir7UpR0O166nl0L+Ybj0RTgQwncgnnpkewI8Pk2/oXWxFheMrdB44Tjp9KsmoKEW4cMw4csyqTAugsOIFvW4h95/2pJ2frQnwbQML5vJ2zqoaXbBTnZkWQOgIORBQOcZKAMF9iIkBsO3O/qozjIqkdPQIW3GogUxFKFtAtnUfXQCjO7ZT8+QfUPHL61TgRLZsIv/0yWQrH8Jxb2LkkakREQ8C/w9+4Bdp6ALoG9iPitfVJvttwQD5p02hyIZaZnnowsIRI5PuDQ6EK+GoqtF0joWOhTGC/wc/MJsj8tabFKicmXLLgt63UvGaV00dpwkglLp07IjmAfHI487+VLJlmyYRcKRtt3+No4+Cr96qinUBXmTrJgpUzspa9kb67AxRKMR+IKRDOdiYWK1E4QjJAX/8E3Q76GMHP8NYPK0O1EIGbkJ0zy6Vbkw1N/jsQorWv8P6DURaLu8cn8bO7vlzmjo0U9YAYIGq+SQdO8oqJzFfCU/B4nSRdPIEtRz4O2+P8FOMtsTibQYwk8spjUTiOqS9rNd9OckAZbK/7PVSeO1qCi6sJuuNN1FRxUTDCV3oX2Us3i6OdCaX0ZoLTpObkr38TEOnVPtDF0MnF9dupILre6picSO0I3phL2DXn/kh9VRS4n454UAjlzAzR+g6Mwla/6PTOCNk7dadPPsOENnthkj6vwDQ0E3TTIpse4v8D08gkiRyvbCM7N960NC2SQDCOkV31McXw0rqDWRgEvN7hk7ugJO0Muq695cazsrNkyoIip6HLJPs88bXIPbVG9bu15iOXTsKlnCrUPPRCgxS0ZlWhC9e2YnTQXpcBkuGkapK1x7g5Po8XQ7U641BFOH7xsC0HJbTC4XDFFz8HFmv7pazB2szgGza39upD2AkQsFli8natWtOLiSdOU1N9wwhx5x5OTkvnQTpirCRbEq6Qns6AjL9Dp+tefQIci1ZQQV9b8t0edbnmwcQF5o4LnahG25MWTRSUR2N8hxYb0txseoTfqdolCwlJaqQTzlJpOxz3fmAQKDpe98hd90OFc1ZATD4TA05axZRtH4b+Wc/pkp/hWvXx+LSbt35YC0ARF0ZhGI+8osWj4cib9epQj2s5wTvkhVkv+e+rHMUOyIXLvC+IruOpDFqQq7nlqhKFjxHz4gYEWEU2qP79nCzUbDmKULzkXADkE/kYlRdvSaASCjAwovsDv7Gb47Hq0j66EPCAygTtjgv9OuV5Fq6nApu6d0uAEbqtnJs7Vr8EkuCCBXdu/6afQC51UOS+CLF62Ppo8D8SuYQ/6QK9imVZU0kY5sfGh1PX+GR0CcDALEeNRFkucF9qG1QSwvvKUQ2MG8OlyH5YnVbYpzS5Qp+BNuAu1ICihgXj4KWksSadKoFyow7YnX8j6wSYmRr1yuNiTBECcUkOMq6+b6EZiJW8uNGM4dwq0dCXdg/42FCk5EABA9QcPsdnF5yv7uLdaAoS+KyrpWrVTUXsZ6Bc7u5twa6U1nUEm6VrXwwNY8ZSS3/OBC/tOeDQ2Qp7UTBZ5+m0PIXicIhfcdZkii0+ldkcTpTWn1NERYilS69g6oWuAaA2AYNYR2nByDmQ7cIHZbYzaWs66JoJcAUgIv54FDnU0+T/d77k8qqALDlo4MUfm0d5xsh6rK3kaMtMIRj9lxWLSL5gNYTVO+4plNYGI/KoDrA7U0jH6SiSVPaD0D7AyOY4ywOpyEAofwBYHhDLaFoBQPDD3B3edzIoDkJTUqN13ZVibAAsOhHM8gxdz6fKUQOgBSvWsv/o6EJKgAtJfbh36bQssWcPIXlB6DWnl/h/REscGGsW3fW1ZbSUgo+uYDPdDxRRfLZs0mNBEoZNs+Bib0vxz+hYHUVAyI1xA4XoSB6amBthZHx9utD0seHuZ6C+Xh9WECkp+wjRvJlARiAYavc+r9SJwrLLvJ5kBgBKFSPrU9frksLicLf1rIyBhahp5LjUX7Fw/n630YOdIpVTCDp0xNtA9CoeQMoejpSNGSK/ZQJS85+nD6lG2tfvMLNl3I9v5S3iIv880tjLXQtLdz0BCMBneh5/yAX/tGL6N65j0M+jHjd+aZebNUjWzfH6s+hEPmGlf9PR7aqDaEy0vmdaZMJRoHUmgcdFHgiVrhmzlE0XuLSGHqJCiQ67fcNJ/uwb6oAxP/4HbpN7AM/DXoYXA83yDF1RjwxKgAsPfE5i2ho5UtseKAX5TNneG+4YELvdhgAzT5A4vrEVgzxXehModMSIxWoDunIf2JiqyjkYz1Ax4i+W68LoK3/1ymyY7uqRNvuHNgeAIoypEqZt4aGHKkMK4+1orRybSoalDUahI7Mga01G2XzlBBh+J0WpPmhJhT9i184ALP9IIn7waeEXhdN8MrCP+YmJpDzABp4EYg/d+B6vexBKHV2HkADALJ+3LubAUxUC3kADQKoNS0PYB5AkwiYXJ7nwDyAJhEwuTzPgXkATSJgcnmeA/MAmkTA5PI8B+YBNImAyeV5DswDaBIBk8v/Czc+TafY1uVKAAAAAElFTkSuQmCC",
    queryID: 0,
    queryPage: 0,
    setDrawings: async (drawings, contentDrawings) => {
        contentDrawings.innerHTML = "";
        let currentQuery = typro.queryID;
        let batches = [];
        while (drawings.length > 0) batches.push(drawings.splice(0, 40));
        for (const drawingBatch of batches) {
            for (const drawing of drawingBatch) {
                if (currentQuery != typro.queryID) return;
                let container = document.createElement("div");
                container.id = drawing.id;

                loadFailed = false;
                let meta = {
                    "author": "-",
                    "language": "-",
                    "name": "Image Not Found",
                    "own": false,
                    "private": false,
                    "date": "Sun Sep 15 2024 23:03:20 GMT+0000 (Coordinated Universal Time)"
                };
                try {
                    meta = await (await fetch(drawing.metaUrl)).json();
                }
                catch (e) {
                    loadFailed = true;
                }

                container.classList.add(JSON.stringify(meta.name).replaceAll(" ", "_"));
                container.classList.add(JSON.stringify(meta.author).replaceAll(" ", "_"));
                let date = (new Date(meta.date)).toISOString().split("T")[0];
                container.classList.add(date);
                if (meta.own == true) container.classList.add("own");

                let thumb = document.createElement("img");
                thumb.style.backgroundImage = "url(" + typro.thumbnail + ")";
                thumb.style.backgroundSize = "cover";
                thumb.src = loadFailed? typro.thumbnail : drawing.imageUrl;
                let overlay = elemFromString(`<div></div>`);
                overlay.appendChild(elemFromString("<h3>" + meta.name + " by " + meta.author + "</h3>"));
                overlay.appendChild(elemFromString("<h3>" + new Date(meta.date).toLocaleString() + "</h3>"));
                let options = elemFromString("<div ></div>");
                overlay.appendChild(options);

                let imgtools = elemFromString("<button class='flatUI blue min air'>Add to ImageTools</button>");
                imgtools.addEventListener("click", async () => {
                    new Toast("Loading...");
                    let commands = await (await fetch(drawing.commandsUrl)).json()
                    imageTools.addPasteCommandsButton(commands, meta.name);
                    new Toast("Added drawing to ImageTools. You can paste it now!");
                });
                options.appendChild(imgtools);

                let imgpost = elemFromString("<button class='flatUI blue min air'>Add to ImagePost</button>");
                imgpost.addEventListener("click", async () => {
                    new Toast("Loading...");
                    const blob = await (await fetch(drawing.imageUrl)).blob();
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function() {
                        const base64data = reader.result;
                        captureCanvas.capturedDrawings.push({
                            drawing: base64data,
                            drawer: meta.author,
                            word: meta.name,
                            hint: " (" + meta.name.length + ")"
                        });
                        new Toast("Added drawing to ImagePost history. Click left on the post image to select it!");
                    }
                });
                options.appendChild(imgpost);

                let clipboard = elemFromString("<button class='flatUI blue min air'>Copy to Clipboard</button>");
                clipboard.addEventListener("click", async () => {
                    new Toast("Loading...");
                    await imageUrlToClipboard(drawing.imageUrl);
                    new Toast("Copied the image to your clipboard. Share it! :3");
                });
                options.appendChild(clipboard);

                let link = elemFromString("<button class='flatUI blue min air'>Copy Link</button>");
                link.addEventListener("click", async () => {
                    drawing.image
                    await navigator.clipboard.writeText(drawing.imageUrl);
                    new Toast("Copied the image link to your clipboard. Share it! :3");
                });
                options.appendChild(link);

                let savepng = elemFromString("<button class='flatUI green min air'>Save PNG</button>");
                savepng.addEventListener("click", async () => {
                    new Toast("Loading...");
                    imageOptions.downloadImageURL(drawing.imageUrl, "skribblCloud-" + meta.name + "-by-" + meta.author);
                    new Toast("Started the image download.");
                });
                options.appendChild(savepng);

                let savegif = elemFromString("<button class='flatUI green min air'>Save GIF</button>");
                savegif.addEventListener("click", async () => {
                    new Toast("Loading...");
                    let commands = await (await fetch(drawing.commandsUrl)).json();
                    imageOptions.drawCommandsToGif(meta.name, commands);
                    new Toast("Started rendering the GIF. It's pronounced JIF, not GIF!!!");
                });
                options.appendChild(savegif);

                let remove = elemFromString("<button class='flatUI orange min air'>Delete</button>");
                let removeConfirm = false;
                remove.addEventListener("click", async () => {
                    if (!removeConfirm) { remove.innerHTML = "Really?"; removeConfirm = true; return; }

                    await typoApiFetch(`/cloud/${socket.data.user.member.UserLogin}/${drawing.id}`, "DELETE", undefined, undefined, localStorage.accessToken, false);

                    new Toast("Deleted drawing from the cloud.");
                    container.remove();
                });
                options.appendChild(remove);

                container.appendChild(thumb);
                container.appendChild(overlay);

                /*let triggers = [overlay, [...overlay.querySelectorAll("*")]].flat();
                triggers.forEach(trigger => trigger.addEventListener("pointermove", async () => {
                    // load detailed drawing
                    thumb.style.opacity = "0.2";
                    overlay.style.opacity = "1";
                }));
                let hide = () => {
                    thumb.style.opacity = "1";
                    overlay.style.opacity = "0";
                    overlay.removeEventListener("pointerleave", hide);
                }
                overlay.addEventListener("pointerleave", hide);*/
                contentDrawings.appendChild(container);
            }
            await new Promise((resolve, reject) => {
                let onscroll = () => {
                    if (Math.floor(contentDrawings.scrollHeight - contentDrawings.scrollTop)
                        <= contentDrawings.clientHeight + 2 * QS("#imageCloud > div").getBoundingClientRect().height) {
                        contentDrawings.removeEventListener("scroll", onscroll);
                        setTimeout(() => resolve(true), 50);
                    }
                }
                contentDrawings.addEventListener("scroll", onscroll);
            });
        }
    },
    show: async () => {
        let drawings = [];
        let contentDrawings = document.createElement("div");
        contentDrawings.id = "imageCloud";

        let modalContent = document.createElement("div");
        modalContent.style.width = "100%";
        modalContent.style.position = "relative";
        modalContent.appendChild(contentDrawings);

        let sidebar = elemFromString("<div id='imageCloudSidebar'><h3 style='text-align:center;'>Filter Drawings</h3></div>");
        let query = {
            authorQuery: undefined,
            titleQuery: undefined,
            createdBeforeQuery: undefined,
            createdAfterQuery: undefined,
            isOwnQuery: undefined,
            createdInPrivateLobbyQuery: undefined
        }
        const getSkeletons = () => {
            contentDrawings.innerHTML = `<div class="skeletonDiv"><image class="skeletonImage" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAYAAADxJz2MAAAAAXNSR0IArs4c6QAAAudJREFUeF7tmumq4kAQhfu64C6KiqLi+7+Gr+IPRVx/uK/DyZDhjsxIUqdakpkqEEVyKt1fqrurK/01Ho+fzkxM4MsAitkFQgPI8TOAJD8DaABZAqTe5kADSBIg5RaBBpAkQMotAg0gSYCUWwQaQJIAKbcINIAkAVKeigh8PB4On/l87u73+9suZzIZ12g0XLlcdvjt2xIPEOC2263b7XaxWJRKJYdPtVqNpYt7ceIBLpdLdzgc4vbr1/X1ej2ISF+WaIAYsufzme67T4heAWK+ej5/vnI5nU7uer3+BiOfz7tisRj8h/nq+5y1Wq3cfr+n4YUOms2mq9Vqav5CR94AInI2m427XC6RGo25CkMNEAEeAAFdy7LZrOv1eg7fmuYFIOABwO12i9VWrJztdjuY86APozeWkzcXh/61/MGPOkBEz2w2C9IOieVyuSAKo0Zu3HuMRqO4krfXqwPEPAeASbXhcKiaH6oDXK/XsXO2T8LWXkzUAU4mk0/yiH0vJNedTie27m+C/w4g5th+v28ApQQSDxALyGvCLO2sD12lUnGtVkvNtfoQPh6PbrFYqDVQ29FgMFBNptUBInmeTqfa/Vbzl9g8MNz34htFgKRauIC87r2l7aUjEDsObPpRr0vy3PcKCHvvQqHgMCcyRgNk63VM4zW0bKmLAqhVr9MAIfWB6ky323VIbyQmBoiKC1ZbadFA0lhfGia1EQH0Ua/zBSeK348D9FWvi9JZH9d8HCBWXRQ8/xUzgOSTNIBpA4jtGoawxitHsu+0HDsS1AeRVEtMtArjRtqvHSWN19Cw5S0xwKSX7qPARRKN6gxjYoAoWyEK05pIY8hi6LIHkMQA8dSQD2IvnDYDPBRVpdu37/2lAMIRFhSAxAmqNBjKWVqlLPSXBvgnaChr4VgGSlzapwskDwknEnyd0PICUNLJtGoMIPnkDKABJAmQcotAA0gSIOUWgQaQJEDKLQINIEmAlFsEkgB/AJLI18R7H33eAAAAAElFTkSuQmCC
'><div></div></div></div>`.repeat(20);
        }
        let applyFilter = async () => {
            typro.queryPage = 0;
            let queryID = typro.queryID = Date.now();
            setTimeout(async () => {
                if (queryID != typro.queryID) return;
                getSkeletons();
                //drawings = await socket.getStoredDrawings(query);
                drawings = await typoApiFetch(`/cloud/${socket.data.user.member.UserLogin}/search`, "POST", {}, {
                    page: 0,
                    pageSize: 100,
                    ... query
                }, localStorage.accessToken);
                if (drawings && drawings.length > 0) await typro.setDrawings(drawings, contentDrawings);
                else contentDrawings.innerHTML = "<br><br><h3>Typo Gallery Cloud stores all drawings from your skribbl sessions automatically.<br> Rewatch images, post on discord or re-draw them in skribbl whenever you want!<br><br>By default, images are stored for two weeks<br> Subscribe on patreon to store images forever! </h3>";
            }, 500);
        }

        // own filter
        let filterOwn = elemFromString("<label><input type='checkbox' class='flatUI'><span>Only your drawings</span></label>");
        filterOwn.querySelector("input").addEventListener("input", async () => {
            query.isOwnQuery = filterOwn.querySelector("input").checked ? true : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterOwn);

        // private filter
        let filterPrivate = elemFromString("<label><input type='checkbox' class='flatUI'><span>Only in private lobbies</span></label>");
        filterPrivate.querySelector("input").addEventListener("input", async () => {
            query.createdInPrivateLobbyQuery = filterPrivate.querySelector("input").checked ? true : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterPrivate);

        // artist filter
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Artist</h4>"));
        let filterAuthor = elemFromString("<input type='text' class='flatUI' placeholder='tobeh'>");
        filterAuthor.addEventListener("input", async () => {
            query.authorQuery = filterAuthor.value.trim() != "" ? filterAuthor.value.trim() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterAuthor);

        // title filter
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Title</h4>"));
        let filterName = elemFromString("<input type='text' class='flatUI' placeholder='Sonic'>");
        filterName.addEventListener("input", async () => {
            query.titleQuery = filterName.value.trim() != "" ? filterName.value.trim() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterName);

        // date filter before
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Images before date</h4>"));
        let filterDateBefore = elemFromString("<input type='datetime-local' class='flatUI' placeholder='Jan 15 2020'>");
        filterDateBefore.addEventListener("input", async () => {
           query.createdBeforeQuery = filterDateBefore.valueAsNumber?.toString() != "" ? localDateToUtc(filterDateBefore.valueAsNumber).toString() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterDateBefore);

        // date filter after
        sidebar.appendChild(elemFromString("<h4 style='text-align:center;'>Images after date</h4>"));
        let filterDateAfter = elemFromString("<input type='datetime-local' class='flatUI' placeholder='Jan 15 2020'>");
        filterDateAfter.addEventListener("input", async () => {
            query.createdAfterQuery = filterDateAfter.valueAsNumber?.toString() != "" ? localDateToUtc(filterDateAfter.valueAsNumber).toString() : undefined;
            await applyFilter();
        });
        sidebar.appendChild(filterDateAfter);

        modalContent.appendChild(sidebar);
        let modal = new Modal(modalContent, () => { }, "Typo Cloud Gallery", "90vw", "90vh");
        getSkeletons();

        await applyFilter();
    }
}

// #content features/imageTools.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// creates a dialogue to save and re-draw drawings on the skribbl canvas
// depends on: capture.js, generalFunctions.js
let imageTools = {
    optionsPopup: null,
    initImageOptionsButton: () => {
        // add image options button
        const toolsIcon = elemFromString(`<img src="${chrome.runtime.getURL("res/dna_white.gif")}" id="imgTools" style="cursor: pointer;" data-typo-tooltip="Image Laboratory" data-tooltipdir="N">`);
        imageOptions.optionsContainer.appendChild(toolsIcon);

        toolsIcon.addEventListener("click", () => {
            imageTools.optionsPopup.style.display = "";
            if (!localStorage.imageTools) {
                alert("'Image Laboratory' allow you to save drawings so they can be re-drawn in skribbl.\nUse the blue button to copy an image on fly or download and open images with the orange buttons.\nWhen you're drawing, you can paste them by clicking the green buttons.\nDO NOT TRY TO ANNOY OTHERS WITH THIS.");
                localStorage.imageTools = "READ IT";
            }
            imageTools.optionsPopup.focus();
            [...document.querySelectorAll("#itoolsButtons button")].forEach(p => {
                if (QS("#game-toolbar.hidden")) {
                    p.classList.remove("green");
                    p.classList.remove("orange");
                    p.style.pointerEvents = "none";
                }
                else {
                    p.classList.add("green");
                    p.classList.remove("orange");
                    p.style.pointerEvents = "";
                }
            });
        });
    },
    initImageOptionsPopup: () => {
        // add image options popup
        let optionsPopup = elemFromString(`<div id="optionsPopup" tabIndex="-1" style="display:none">
Image Laboratory
    <button class="flatUI blue air" id="itoolsTempSave">Save current</button>
    <button class="flatUI orange air" id="itoolsDownload">Download current</button>
    <button class="flatUI orange air" id="itoolsLoad">Load file(s)</button>
    <button class="flatUI orange air" id="itoolsPasteImage">Paste image</button>
    <div id="itoolsButtons"></div>
    <button class="flatUI blue air" id="itoolsAbort">Abort</button>
    <label for="itoolsClearBefore">
        <input type="checkbox" id="itoolsClearBefore" class="flatUI small">
        <span>Clear before paste</span>
    </label>
</div>`);
        imageTools.optionsPopup = optionsPopup;
        imageOptions.optionsContainer.appendChild(optionsPopup);
        // func to add paste btn
        const addPasteCommandsButton = (commands, name) => {
            // if old actions format
            if (commands[0][0][0]) commands = convertActionsArray(commands);
            const btn = elemFromString(`<button class="flatUI orange green" id="itoolsDownload">📋${name}</button>`); 
            optionsPopup.querySelector("#itoolsButtons").appendChild(btn);
            btn.addEventListener("click", () => {
                if (QS("#itoolsClearBefore").checked)
                    QS("div.icon[style*='/img/clear.gif']").parentElement.dispatchEvent(new Event("click"));
                captureCanvas.drawOnCanvas(commands);
            });
            let removeToggle = 0;
            btn.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (removeToggle) {
                    optionsPopup.focus();
                    btn.remove();
                }
                else {
                    btn.innerText = "Repeat to remove";
                    removeToggle = setTimeout(() => {
                        removeToggle = null;
                        btn.innerText = "📋" + name;
                    }, 2000);
                }
            });
        }
        imageTools.addPasteCommandsButton = addPasteCommandsButton;
        // add temp save listener
        QS("#itoolsTempSave").addEventListener("click", () => {
            const commands = captureCanvas.capturedCommands;
            const name = getCurrentOrLastDrawer() + getCurrentWordOrHint();
            addPasteCommandsButton(commands, name);
        });
        // add skd save listener
        QS("#itoolsDownload").addEventListener("click", () => {
            const commands = captureCanvas.capturedCommands;
            const content = JSON.stringify(commands);
            const name = getCurrentOrLastDrawer() + getCurrentWordOrHint();
            let dl = document.createElement('a');
            dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            dl.setAttribute('download', name + ".skd");
            dl.style.display = 'none';
            document.body.appendChild(dl);
            dl.click();
            document.body.removeChild(dl);
            addPasteCommandsButton(commands, name);
        });
        // add load skd listener
        QS("#itoolsLoad").addEventListener("click", () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = ".skd";
            fileInput.multiple = "multiple"
            fileInput.onchange = e => {
                for (var file_counter = 0; file_counter < e.target.files.length; file_counter++) {
                    let file = e.target.files[file_counter];
                    let reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = readerEvent => {
                        actions = JSON.parse(readerEvent.target.result);
                        addPasteCommandsButton(actions, file.name);
                    }

                }
            }
            fileInput.click();
        });
        // add abort listener
        QS("#itoolsAbort").addEventListener("click", () => {
            captureCanvas.abortDrawingProcess = true;
        });

        // EXPERIMENTAL
        QS("#itoolsPasteImage").addEventListener("click", () => {
            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = ".png";
            fileInput.onchange = e => {
                let dummyimg = new Image();
                dummyimg.onload = () => {
                    let canvas = QS("#game-canvas canvas");
                    let pressedKeys = [];
                    let trackPress = (e) => e.type == "keydown" ? pressedKeys.push(e.key) : pressedKeys = pressedKeys.filter(k => k != e.key);
                    canvas.addEventListener("pointerdown", (e) => {
                        if (pressedKeys.some(k => k == "1")) {
                            canvas.getContext("2d").drawImage(dummyimg, e.layerX, e.layerY);
                            stoptrack();
                        }
                        else if (pressedKeys.some(k => k == "2")) {
                            let firstClick = { x: e.layerX, y: e.layerY };
                            canvas.addEventListener("pointerdown", (e) => {
                                let aspect = dummyimg.width / dummyimg.height;
                                let clickwidth = e.layerX - firstClick.x;
                                let clickheight = e.layerY - firstClick.y;
                                let clickaspect = clickwidth / clickheight;
                                if (clickaspect > aspect) clickwidth = clickheight * aspect;
                                else clickheight = clickwidth * 1 / aspect;
                                canvas.getContext("2d").drawImage(dummyimg, firstClick.x, firstClick.y, clickwidth, clickheight);
                                stoptrack();
                            }, { once: true });
                        }
                        else if (pressedKeys.some(k => k == "3")) {
                            canvas.getContext("2d").drawImage(dummyimg, 0, 0, canvas.width, canvas.height);
                            stoptrack();
                        }
                        else {
                            canvas.getContext("2d").drawImage(dummyimg, 0, 0);
                            stoptrack();
                        }
                    }, { once: true });
                    document.addEventListener("keydown", trackPress);
                    document.addEventListener("keyup", trackPress);
                    let stoptrack = () => {
                        document.removeEventListener("keydown", trackPress);
                        document.removeEventListener("keyup", trackPress);
                    }
                    new Toast("Click the canvas to paste now. Options:<br>[1] pressed: draw on click position<br>[2] pressed: draw on area between two clicks<br>[3] pressed: draw on full canvas");
                }
                dummyimg.src = URL.createObjectURL(e.target.files[0]);
            }
            fileInput.click();
        });
        // -----------

        Array.from(optionsPopup.children).concat(optionsPopup).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!optionsPopup.contains(document.activeElement)) optionsPopup.style.display = "none" }, 20); }));
    },
    initAll: () => {
        imageTools.initImageOptionsButton();
        imageTools.initImageOptionsPopup();
    }
}


// #content features/emojis.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// adds emoji replacement
const emojis = {
    emojis: [],
    init: async () => {
        // load emojis in worker to avoid blocking ui
        let workerJS = await (await fetch(chrome.runtime.getURL("features/emojiLoadWorker.js"))).text();
        let loadWorker = new Worker(URL.createObjectURL(new Blob([(workerJS)], { type: 'application/javascript' })));
        setTimeout(() => {
            loadWorker.addEventListener('message', message => {
                emojis.emojis = message.data;
                console.log("added " + message.data.length + " emojis");
            });
        }, 1000); // firefox seems to have problems to immediately initialize the worker
        QS("#emojiPrev").style.maxHeight = "80%";
        QS("#emojiPrev").style.overflowY = "auto";
        // show emoji preview on chat type
        const input = QS("#game-chat form input");
        input.closest("form").addEventListener("submit", () => {
            QS("#emojiPrev").style.display = "none";
        });
        input.addEventListener("input", (e) => {
            let val = input.value;
            let lastsplit = val.indexOf(":") >= 0 ? val.split(":").pop() : "";
            if (lastsplit == "" || e.key == "Enter" || localStorage.emojipicker == "false") {
                QS("#emojiPrev").style.display = "none";
            }
            else {
                let setEmojis = (limit) => {
                    QS("#emojiPrev").style.display = "";
                    let content = "";
                    let search = emojis.search(lastsplit).splice(0, limit);
                    if (!search.length || search.length <= 0) {
                        QS("#emojiPrev").style.display = "none";
                        return;
                    }
                    search.forEach(
                        emoji => content +=
                            "<span class='emojiwrapper'>" +
                            emoji.name + " <span class='emojipreview' style='background-image: url( " + emoji.url + ");'></span>" +
                            "</span>"
                    );
                    if (limit < 100 && search.length == limit) content += "<br><span style='color:black' id='loadingHintEmojis'>Loading more...</span>";
                    QS("#emojiPrev").innerHTML = content;
                    [...QSA("#emojiPrev > span:not(#loadingHintEmojis)")].forEach(emoji => emoji.addEventListener("click", () => {
                        input.value = input.value.replace(":" + lastsplit, ":" + emoji.textContent.trim() + ":");
                        input.dispatchEvent(newCustomEvent("input"));
                        input.focus();
                    }));
                }
                setEmojis(50);
                setTimeout(() => { if (input.value == val) setEmojis(500); }, 2000);
            }
        });
    },
    get: (name) => emojis.emojis.find(emoji => emoji.name == name),
    search: (name) => emojis.emojis.filter(emoji => emoji.name.indexOf(name) >= 0).sort((a, b) => a.name.length - b.name.length),
    replaceEmojiContent: (node) => {
        const matches = node.innerHTML.matchAll(new RegExp(":([A-Za-z0-9\-\_]+):", "g"));
        for (const match of matches) {
            let id = Math.floor(Math.random() * 1000);
            let emoji = emojis.get(match[1]);
            if (emoji) node.innerHTML = node.innerHTML.replace(match[0],
                "<style> .emoji-" + emoji.name + id + ":hover:after {color:white; word-break:none;font-weight:500; letter-spacing:.05em; content:'։" + emoji.name + "։'; position: absolute; right:2.5em;background: #333333e0; padding: .5em; border-radius: .2em;}" +
                ".emoji-" + emoji.name + id + ":hover:before {content: '';border-style: solid;border-width: .5em 0 .5em .5em;border-color: transparent transparent transparent #333333e0;position: absolute;right: 2em;top: .5em;}</style>" +
                "<span class='emoji-" + emoji.name + id + "' style='position:relative; z-index:1; bottom: -0.5em; display: inline-block;height: 2em;background-size: contain;background-repeat:no-repeat;width:2em;image-rendering: auto;background-image: url( " + emoji.url + ");'></span>");
            let emojiSpan = node.querySelector("span > span").getBoundingClientRect();
            let span = node.getBoundingClientRect();
            if (emojiSpan.left - span.left < span.right - emojiSpan.right) {
                let style = node.querySelector("style");
                style.innerHTML = ".emoji-" + emoji.name + id + ":hover:after {width:fit-content; color:white; word-break:none;font-weight:500; letter-spacing:.05em; content:'։" + emoji.name + "։'; position: absolute; left:2.5em;background: #333333e0; padding: .5em; border-radius: .2em;}" +
                    ".emoji-" + emoji.name + id + ":hover:before {content: '';border-style: solid;border-width: .5em .5em .5em 0;border-color: transparent #333333e0 transparent transparent; position: absolute;left: 2em; top: .5em;}";
            }

        }
        // if scrolled very down, scroll to view full emoji height
        if (matches.length > 0 && Math.floor(node.parentElement.scrollHeight - node.parentElement.scrollTop) <= node.parentElement.clientHeight + 30) {
            scrollMessages();
        }
    }
};

// #content features/agent.js
﻿// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Object which contains image agent functions and initialisation
let imageAgent = {// func to set the image in the agentdiv
    imageIndex: 0,
    searchImages: [],
    agent: undefined,
    setAgentSource: async (searchCriteria, exclusive = false) => {
        let word = getCurrentWordOrHint();
        let search = (exclusive ? "" : word + "+") + searchCriteria;
        search = replaceUmlaute(search);
        imageAgent.agent.src = chrome.runtime.getURL("res/load.gif");

        let param = encodeURIComponent(search);
        const server = "https://agent.typo.rip/"

        let resp = await fetch(server + param);
        results = await resp.json();
        imageAgent.searchImages = (results).slice(2);
        imageAgent.imageIndex = 0;

        if (!imageAgent.searchImages[0]) { imageAgent.agent.alt = "Error: No results found :("; imageAgent.agent.src = ""; return; }
        imageAgent.getNextAgentImage();
    },
    getNextAgentImage: () => {
        if (imageAgent.imageIndex >= imageAgent.searchImages.length) imageAgent.imageIndex = 0;
        imageAgent.agent.src = imageAgent.searchImages[imageAgent.imageIndex];
        scrollMessages();
        imageAgent.imageIndex++;
    },
    updateImageAgent: () => {
        // func to set imageagentbuttons visible if drawing or opposite
        let word = getCurrentWordOrHint();
        // if player isnt drawing
        if (word.includes("_") || word == "" || localStorage.agent == "false"
            || !QS(".avatar .drawing[style*=block]")?.closest(".player").querySelector(".player-name")?.textContent?.endsWith("(You)")) {
            imageAgent.agent.src = "";
            QS("#imageAgent").style.display = "none";
            scrollMessages(true);
        }
        else {
            QS("#imageAgent").style.display = "";
            scrollMessages();
        }
    },
    initImageAgent: () => {
        let agentElem = elemFromString(`<div id="imageAgent">
<div>
<button class="flatUI blue min air">Flag</button>
<button class="flatUI blue min air">Logo</button>
<button class="flatUI blue min air">Map</button>
<button class="flatUI blue min air">Word</button>
</div>
<input type="text" placeholder="Search text with 'enter'">
<div><img></div>

</div>`);

        [...agentElem.querySelectorAll("button")].forEach((btn) => {
            btn.addEventListener("click", () => imageAgent.setAgentSource(btn.innerText));
        });
        agentElem.querySelector("input").addEventListener("keydown", (event) => {
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') imageAgent.setAgentSource(agentElem.querySelector("input").value, true);
            event.stopPropagation();
        });
        imageAgent.agent = agentElem.querySelector("img");
        imageAgent.agent.addEventListener("click", imageAgent.getNextAgentImage);
        QS("#game-chat").insertAdjacentElement("afterbegin", agentElem);
        let agentObserver = new MutationObserver(() => {
            imageAgent.updateImageAgent();
        });
        agentObserver.observe(QS("#game-word"), { attributes: true, subtree: true, childList: true });
    }
}

// #content features/gamemode.js
const gamemodes = {
    modes: [
        {
            name: "Blind Guess",
            options: {
                description: "The canvas is hidden - you don't see what people draw!",
                init: () => {
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-canvas canvas").style.opacity = 1;
                },
                observeSelector: "#game-players",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update opacity based on self drawing or not
                    QS("#game-canvas canvas").style.opacity = QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ? 1 : 0;
                }
            }
        },{
            name: "Drunk Vision",
            options: {
                description: "The canvas is blurred - you can only vaguely see what people draw!",
                init: () => {
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-canvas canvas").style.filter = "";
                },
                observeSelector: "#game-players",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update filter based on self drawing or not
                    QS("#game-canvas canvas").style.filter = QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ? "" : "blur(20px)";
                }
            }
        }, {
            name: "Deaf Guess",
            options: {
                description: "Every chat input is blurred and you can't see hints.",
                init: () => {
                    // add mod stylesheed
                    QS("#game-chat .chat-content ").appendChild(elemFromString(`<style id="gamemodeDeafRules"></style>`));
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-chat .chat-content style#gamemodeDeafRules")?.remove()
                },
                observeSelector: "#game-players",
                observeOptions: {
                    attributes: true,
                    subtree: true
                },
                observeAction: () => {
                    // update message blur based on self drawing / guessed or not
                    QS("#game-chat .chat-content style#gamemodeDeafRules").innerHTML =
                        (QS(".player-name.me").closest(".player.guessed")) || QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ?
                            "" : "#game-chat .chat-content > p > span:not(:empty) {filter: grayscale(1) blur(4px) opacity(0.8);} #game-word {opacity:0} .player .player-bubble {display:none !important} .characters{color:black !important}";
                }
            }
        }, {
            name: "One Shot",
            options: {
                description: "You have only one try to guess the word!",
                init: () => {
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-chat form input").disabled = false;
                },
                observeSelector: "#game-chat .chat-content",
                observeOptions: {
                    childList: true
                },
                observeAction: () => {
                    const someoneDrawing = QS(".drawing[style*=block]") ? true : false;
                    const selfDrawing = QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ? true : false;
                    const selfGuessed = QS(".player-name.me").closest(".player.guessed");
                    if (selfDrawing || selfGuessed || !someoneDrawing) {
                        // everything fine, you can type
                        QS("#game-chat form input").disabled = false;
                    }
                    else {
                        let chat = QS("#game-chat .chat-content").innerHTML;
                        // if someone else is drawing
                        let lastDrawingIndex = chat.lastIndexOf("is drawing now!</b>");
                        if (lastDrawingIndex < 0) lastDrawingIndex = 0;
                        chat = chat.substr(lastDrawingIndex);
                        const selfName = QS(".player-name.me").innerText.replace("(You)", "").trim();
                        let regHasGuessed = new RegExp("is drawing now!</b>[\\s\\S]*(?:>" + selfName + ": </b>)", "g");
                        let regIsRevealed = new RegExp(/is drawing now!<\/b >[\s\S]*;\\">The word was/g);
                        if (regHasGuessed.test(chat) && !regIsRevealed.test(chat)) {
                            // you guessed already & word is not revealed!
                            QS("#game-chat form input").disabled = true;
                        }
                        else {
                            // you guessed, but word was revealed. u lost anyway :)
                            QS("#game-chat form input").disabled = false;
                        }
                    }
                }
            }
        }, {
            name: "Don't Clear",
            options: {
                description: "The canvas won't clear - you draw over the previous images!",
                init: () => {
                    QS(".toolbar-group-actions").style.cssText = "pointer-events:none;opacity:.5;";
                    this.restoreCanvas = (event) => {
                        const img = new Image;
                        img.onload = () => QS("#game-canvas canvas").getContext("2d").drawImage(img, 0, 0);
                        img.src = event.detail;
                        img.crossOrigin = "anonymous"
                    }
                    document.addEventListener("logCanvasClear", this.restoreCanvas);
                },
                initWithAction: false,
                destroy: () => {
                    QS(".toolbar-group-actions").style.cssText = "";
                    document.removeEventListener("logCanvasClear", this.restoreCanvas);
                },
                observeSelector: "#game-canvas canvas",
                observeOptions: {
                    childList: true
                },
                observeAction: () => {

                }
            }
        }, {
            name: "Monochrome",
            options: {
                description: "You can only choose between shades of a random color.",
                init: () => {
                    QS("#game-toolbar").appendChild(elemFromString(`<style id="gamemodeMonochromeRules"></style>`));
                    //brushtools.groups.color.brightness.disable();
                    //brushtools.groups.color.rainbow.disable();
                    brushtools.groups.color.rainbowcircle.disable()
                },
                initWithAction: true,
                destroy: () => {
                    QS("#game-toolbar style#gamemodeMonochromeRules")?.remove()
                    QS("#randomColor")?.setAttribute("data-monochrome", "");
                },
                observeSelector: "#game-toolbar",
                observeOptions: {
                    attributes: true
                },
                observeAction: () => {
                    const itemWidth = getComputedStyle(QS("#game-toolbar > div.colors:not(.color-tools):not([style*=none]) > div > div")).width;
                    const itemCount = QS("#game-toolbar > div.colors:not(.color-tools):not([style*=none]) > div").children.length;
                    const randomIndex = Math.round(Math.random() * (itemCount - 1)) + 1;
                    QS("#game-canvas").setAttribute("data-monochrome", randomIndex);
                    QS("#game-toolbar style#gamemodeMonochromeRules").innerHTML =
                        QS(".player-name.me").closest(".player").querySelector(".drawing[style*=block]") ?
                            `#game-toolbar > div.colors:not(.color-tools) > div > div.color:not(:nth-child(${randomIndex}))
                            {display:none;}
                         #colPicker{display:none;}
                         #game-toolbar > div.colors:not(.color-tools) > div > div.color:nth-child(${randomIndex}) {width:calc(${itemCount} * ${itemWidth});}` : "";
                }
            }
        }
    ],
    modesPopout: null,
    setup: () => {
        // add gamemodes button
        const modesButton = elemFromString(`<img src="${chrome.runtime.getURL("res/noChallenge.gif")}" id="gameModes" style="cursor: pointer;"  data-typo-tooltip="Challenges" data-tooltipdir="N">`);
        // add gamemode options popup
        const modesPopout = elemFromString(`<div id="gamemodePopup" tabIndex="-1" style="display:none">
Challenges
<br><br>
    <div>
    </div>
</div>`);
        gamemodes.modesPopout = modesPopout;
        imageOptions.optionsContainer.appendChild(modesPopout);
        imageOptions.optionsContainer.appendChild(modesButton);
        // init popupevents
        modesButton.addEventListener("click", () => {
            modesPopout.style.display = "";
            modesPopout.focus();
        });
        Array.from(modesPopout.children).concat(modesPopout).forEach((c) => c.addEventListener("focusout", () => { setTimeout(() => { if (!modesPopout.contains(document.activeElement)) modesPopout.style.display = "none" }, 20); }));
        // init mode toggles
        gamemodes.modes.forEach(mode => {
            const modeObserver = new MutationObserver(mode.options.observeAction);
            const modeToggle = elemFromString(`<div><label for="mode_toggle${mode.name}">
                                                    <input type="checkbox" id="mode_toggle${mode.name}" class="flatUI small">
                                                    <span>${mode.name}</span>
                                                </label><span class="small">${mode.options.description}</span><br><br></div>`);
            modeToggle.addEventListener("change", (e) => {
                if (e.target.checked === true) {
                    modesButton.src = chrome.runtime.getURL("res/challenge.gif");
                    mode.options.init();
                    if (mode.options.initWithAction) mode.options.observeAction();
                    modeObserver.observe(QS(mode.options.observeSelector), mode.options.observeOptions);
                }
                else {
                    if (!modesPopout.querySelector("input:checked")) modesButton.src = chrome.runtime.getURL("res/noChallenge.gif");
                    mode.options.destroy();
                    modeObserver.disconnect();
                }
            });
            modesPopout.querySelector("div").insertAdjacentElement("beforeend", modeToggle);
        });
    }
};


// #content features/brushtools.js
const stateFromLocalstorage = (modeName, defaultState, stateOverride = undefined) => {
    let keyname = "brushmagic_" + modeName;

    if (stateOverride === false || stateOverride != undefined) {
        localStorage.setItem(keyname, JSON.stringify(stateOverride));
        return stateOverride;
    }
    else if (!localStorage.getItem(keyname)) {
        localStorage.setItem(keyname, JSON.stringify(defaultState));
        return defaultState;
    }
    else return JSON.parse(localStorage.getItem(keyname));
}

const brushtools = {
    groups: {
        color: {
            rainbowcircle: {
                name: "Rainbow Cycle",
                description: "Cycles through bright rainbow colors.",
                enabled: stateFromLocalstorage("color.rainbowcircle", false),
                options: {
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.color)) {
                        mode.disable();
                    }
                    brushtools.groups.color.rainbowcircle.lastSwitch = 0;
                    brushtools.groups.color.rainbowcircle.lastIndex = 0;
                    brushtools.groups.color.rainbowcircle.direction = 1;
                    brushtools.groups.color.rainbowcircle.enabled = stateFromLocalstorage("color.rainbowcircle", undefined, true);
                    gamemodes.modes.find(mode => mode.name == "Monochrome").options.destroy();
                },
                disable: () => {
                    brushtools.groups.color.rainbowcircle.enabled = stateFromLocalstorage("color.rainbowcircle", undefined, false);
                },
                pointermoveCallback: (event) => {
                    const colors = ["ef130b", "ff7100", "ffe400", "00cc00", "00ff91", "00b2ff", "231fd3", "a300ba", "d37caa"];
                    if (event.pressure > 0) {
                        const interval = parseInt(localStorage.randominterval)
                        if (Date.now() - brushtools.groups.color.rainbowcircle.lastSwitch > interval) {
                            brushtools.groups.color.rainbowcircle.lastSwitch = Date.now();
                            let index = brushtools.groups.color.rainbowcircle.lastIndex;
                            if (brushtools.groups.color.rainbowcircle.direction > 0) {
                                if (++index >= colors.length) {
                                    brushtools.groups.color.rainbowcircle.direction *= -1;
                                    index = colors.length - 1;
                                }
                            }
                            else {
                                if (--index < 0) {
                                    brushtools.groups.color.rainbowcircle.direction *= -1;
                                    index = 1;
                                }
                            }
                            brushtools.groups.color.rainbowcircle.lastIndex = index;
                            document.dispatchEvent(newCustomEvent("setColor", { detail: { code: parseInt(colors[index], 16) + 10000 } }));
                        }
                    }
                }
            },
            rainbowstroke: {
                name: "Rainbow Strokes",
                description: "Each stroke is made in a different rainbow color.",
                enabled: stateFromLocalstorage("color.rainbowstroke", false),
                options: {
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.color)) {
                        mode.disable();
                    }
                    brushtools.groups.color.rainbowstroke.lastSwitch = 0;
                    brushtools.groups.color.rainbowstroke.lastIndex = 0;
                    brushtools.groups.color.rainbowstroke.direction = 1;
                    brushtools.groups.color.rainbowstroke.enabled = stateFromLocalstorage("color.rainbowstroke", undefined, true);
                    gamemodes.modes.find(mode => mode.name == "Monochrome").options.destroy();
                },
                disable: () => {
                    brushtools.groups.color.rainbowstroke.enabled = stateFromLocalstorage("color.rainbowstroke", undefined, false);
                },
                pointerupCallback: (event) => {
                    const colors = ["ef130b", "ff7100", "ffe400", "00cc00", "00ff91", "00b2ff", "231fd3", "a300ba", "d37caa"];
                    let index = brushtools.groups.color.rainbowstroke.lastIndex;
                    if (brushtools.groups.color.rainbowstroke.direction > 0) {
                        if (++index >= colors.length) {
                            brushtools.groups.color.rainbowstroke.direction *= -1;
                            index = colors.length - 1;
                        }
                    }
                    else {
                        if (--index < 0) {
                            brushtools.groups.color.rainbowstroke.direction *= -1;
                            index = 1;
                        }
                    }
                    brushtools.groups.color.rainbowstroke.lastIndex = index;
                    document.dispatchEvent(newCustomEvent("setColor", { detail: { code: parseInt(colors[index], 16) + 10000 } }));
                }
            },
            randomColor: {
                name: "Random Colors",
                description: "The color changes randomly while drawing.",
                enabled: stateFromLocalstorage("color.randomcolor", false),
                options: {
                    interval: {
                        val: stateFromLocalstorage("color.randomcolor", 50),
                        type: "num",
                        save: value => {
                            stateFromLocalstorage("color.randomcolor", undefined, Math.max(10,value));
                            if(brushtools.groups.color.randomColor.enabled) {
                                brushtools.groups.color.randomColor.disable();
                                brushtools.groups.color.randomColor.enable();
                            }
                        }
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.color)) {
                        mode.disable();
                    }
                    brushtools.groups.color.randomColor.enabled = stateFromLocalstorage("color.randomcolor", undefined, true);

                    let nthChild = QS("#game-canvas").getAttribute("data-monochrome");
                    let items = [
                        ...QSA(".colors:not([style*=display]) .color" + (nthChild ? ":nth-child(" + nthChild + ")" : ""))
                    ].filter(item =>
                      item.style.backgroundColor != "rgb(255, 255, 255)" && item.style.backgroundColor != "rgb(0, 0, 0)"
                    );

                    brushtools.groups.color.randomColor.interval = setInterval(() => {
                        items[Math.floor(Math.random() * items.length)]?.dispatchEvent(new PointerEvent("pointerdown", { button: 0, altKey: false }));
                    }, brushtools.groups.color.randomColor.options.interval.val);
                    QS(".colors:not(.custom)").addEventListener("pointerdown", brushtools.groups.color.randomColor.disable, {once: true});
                },
                disable: () => {
                    clearInterval(brushtools.groups.color.randomColor.interval);
                    QS(".colors:not(.custom)").removeEventListener("pointerdown", brushtools.groups.color.randomColor.disable);
                    brushtools.groups.color.randomColor.enabled = stateFromLocalstorage("color.randomcolor", undefined, false);
                }
            }
        },
        mirror: {
            mandala: {
                name: "Mandala",
                description: "The brush is mirrored on either the X-axis, Y-axis or both.",
                enabled: stateFromLocalstorage("mirror.mandala", false),
                options: {
                    axis: {
                        val: stateFromLocalstorage("mirror.mandala.options.axis", "X"),
                        type: ["X", "XY", "Y"],
                        save: value => stateFromLocalstorage("mirror.mandala.options.axis", undefined, value)
                    },
                    mirrorpoint: {
                        val: stateFromLocalstorage("mirror.mandala.options.mirrorpoint", "Center"),
                        type: ["Center", "Click"],
                        save: value => stateFromLocalstorage("mirror.mandala.options.mirrorpoint", undefined, value)
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.mirror.mandala.enabled = stateFromLocalstorage("mirror.mandala", undefined, true);
                },
                disable: () => {
                    brushtools.groups.mirror.mandala.enabled = stateFromLocalstorage("mirror.mandala", undefined, false);
                },
                pointermoveCallback: (event) => {

                    event.preventDefault();
                    event.stopPropagation();
                    if (event.pressure > 0 && !event.ctrlKey) {

                        if (event.type == "pointerdown") {
                            brushtools.groups.mirror.mandala.lastDownPos = [event.offsetX, event.offsetY];
                        }

                        const mirror = brushtools.groups.mirror.mandala.options.axis.val;
                        const point = brushtools.groups.mirror.mandala.options.mirrorpoint.val;
                        const lastDown = brushtools.groups.mirror.mandala.lastDownPos;
                        let clone = new PointerEvent("pointermove", event)
                        clone = Object.defineProperty(clone, "button", { value: 0 });
                        const canvasRect = brushtools.canvas.getBoundingClientRect();
                        const sculptX = point == "Center" ? canvasRect.width - event.offsetX : lastDown[0] - ((lastDown[0] - event.offsetX) * -1);
                        const sculptY = point == "Center" ? canvasRect.height - event.offsetY : lastDown[1] - ((lastDown[1] - event.offsetY) * -1);
                        if (mirror.indexOf("X") >= 0) clone = Object.defineProperty(clone, "clientX", { value: canvasRect.left + sculptX });
                        if (mirror.indexOf("Y") >= 0) clone = Object.defineProperty(clone, "clientY", { value: canvasRect.top + sculptY });

                        let lastEvent = brushtools.groups.mirror.mandala.lastEvent;
                        let lastClone = brushtools.groups.mirror.mandala.lastClone;

                        brushtools.line(lastEvent ? lastEvent : event, event, event.pressure);
                        brushtools.line(lastClone ? lastClone : clone, clone, event.pressure);

                        brushtools.groups.mirror.mandala.lastEvent = event;
                        brushtools.groups.mirror.mandala.lastClone = clone;
                    }
                    else {
                        brushtools.groups.mirror.mandala.lastEvent = null;
                        brushtools.groups.mirror.mandala.lastClone = null;
                    }
                }
            },
            sculpt: {
                name: "Sculpt",
                description: "Creates sculptures mirrored on either the X-axis, Y-axis or both.",
                enabled: stateFromLocalstorage("mirror.sculpt", false),
                options: {
                    axis: {
                        val: stateFromLocalstorage("mirror.sculpt.options.axis", "X"),
                        type: ["X", "XY", "Y"],
                        save: value => stateFromLocalstorage("mirror.sculpt.options.axis", undefined, value)
                    },
                    mirrorpoint: {
                        val: stateFromLocalstorage("mirror.sculpt.options.mirrorpoint", "Center"),
                        type: ["Center", "Click"],
                        save: value => stateFromLocalstorage("mirror.sculpt.options.mirrorpoint", undefined, value)
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.mirror.sculpt.enabled = stateFromLocalstorage("mirror.sculpt", undefined, true);
                },
                disable: () => {
                    brushtools.groups.mirror.sculpt.enabled = stateFromLocalstorage("mirror.sculpt", undefined, false);
                },
                pointermoveCallback: (event) => {

                    event.preventDefault();
                    event.stopPropagation();
                    if (event.pressure > 0 && !event.ctrlKey) {
                        if (event.type == "pointerdown") {
                            brushtools.groups.mirror.sculpt.lastDownPos = [event.offsetX, event.offsetY];
                        }
                        const mirror = brushtools.groups.mirror.sculpt.options.axis.val;
                        const point = brushtools.groups.mirror.sculpt.options.mirrorpoint.val;
                        const lastDown = brushtools.groups.mirror.sculpt.lastDownPos;

                        let clone = new PointerEvent("pointermove", event)
                        const canvasRect = brushtools.canvas.getBoundingClientRect();
                        const sculptX = point == "Center" ? canvasRect.width - event.offsetX : lastDown[0] - ((lastDown[0] - event.offsetX) * -1);
                        const sculptY = point == "Center" ? canvasRect.height - event.offsetY : lastDown[1] - ((lastDown[1] - event.offsetY) * -1);
                        if (mirror.indexOf("X") >= 0) clone = Object.defineProperty(clone, "clientX", { value: canvasRect.left + sculptX });
                        if (mirror.indexOf("Y") >= 0) clone = Object.defineProperty(clone, "clientY", { value: canvasRect.top + sculptY });

                        brushtools.line(event, clone);
                    }
                }
            }
        },
        stroke: {
            dash: {
                name: "Dash",
                description: "Draw dashed lines.",
                enabled: stateFromLocalstorage("stroke.dash", false),
                options: {
                    interval: {
                        val: stateFromLocalstorage("stroke.dash.options.interval", 10),
                        type: "num",
                        save: value => stateFromLocalstorage("stroke.dash.options.interval", undefined, value)
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.stroke.dash.enabled = stateFromLocalstorage("stroke.dash", undefined, true);
                },
                disable: () => {
                    brushtools.groups.stroke.dash.enabled = stateFromLocalstorage("stroke.dash", undefined, false);
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (!brushtools.groups.stroke.dash.wait) {
                            brushtools.groups.stroke.dash.wait = true;
                            let clone = new PointerEvent("pointerdown", event);
                            clone = Object.defineProperty(clone, "button", { value: 0 });
                            brushtools.canvas.dispatchEvent(new PointerEvent("pointerdown", clone));
                            brushtools.canvas.dispatchEvent(new PointerEvent("pointerup", clone));
                            setTimeout(() => {
                                brushtools.groups.stroke.dash.wait = false;
                            }, brushtools.groups.stroke.dash.options.interval.val);
                        }
                        else {
                            let clone = new PointerEvent("pointermove", event);
                            clone = Object.defineProperty(clone, "pressure", { value: 0 });
                            brushtools.canvas.dispatchEvent(new PointerEvent("pointermove", clone));
                        }
                    }
                }
            },
            tilt: {
                name: "Tilt",
                description: "Draw tilted lines.",
                enabled: stateFromLocalstorage("stroke.tilt", false),
                options: {
                    density: {
                        val: stateFromLocalstorage("stroke.tilt.options.density", 5),
                        type: "num",
                        save: value => stateFromLocalstorage("stroke.tilt.options.density", undefined, value)
                    },
                    tilt: {
                        val: stateFromLocalstorage("stroke.tilt.options.tilt", 5),
                        type: "num",
                        save: value => stateFromLocalstorage("stroke.tilt.options.tilt", undefined, value)
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.stroke.tilt.enabled = stateFromLocalstorage("stroke.tilt", undefined, true);
                },
                disable: () => {
                    brushtools.groups.stroke.tilt.enabled = stateFromLocalstorage("stroke.tilt", undefined, false);
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        const density = brushtools.groups.stroke.tilt.options.density.val;
                        const tilt = brushtools.groups.stroke.tilt.options.tilt.val;
                        for (let i = 1; i < density; i++) {
                            const offset = event.pressure * tilt;
                            let clone = new PointerEvent("pointermove", event)
                            clone = Object.defineProperty(clone, "clientX", { value: event.clientX - offset - i });
                            clone = Object.defineProperty(clone, "clientY", { value: event.clientY - offset - i });
                            brushtools.canvas.dispatchEvent(new PointerEvent("pointermove", clone));
                        }
                    }
                }
            },
            noise: {
                name: "Noise",
                description: "Draw distorted lines. If you're using a pen, the size is affected by pressure.",
                enabled: stateFromLocalstorage("stroke.noise", false),
                options: {
                    size: {
                        val: stateFromLocalstorage("stroke.noise.options.size", 10),
                        type: "num",
                        save: value => stateFromLocalstorage("stroke.noise.options.size", undefined, value)
                    },
                    direction: {
                        val: stateFromLocalstorage("stroke.noise.options.direction", "top"),
                        type: ["top", "bottom", "left", "right", "vertical", "horizontal", "all"],
                        save: value => stateFromLocalstorage("stroke.noise.options.direction", undefined, value)
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.stroke.noise.enabled = stateFromLocalstorage("stroke.noise", undefined, true);
                },
                disable: () => {
                    brushtools.groups.stroke.noise.enabled = stateFromLocalstorage("stroke.noise", undefined, false);
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        const density = 4;
                        const direction = brushtools.groups.stroke.noise.options.direction.val;
                        const size = brushtools.groups.stroke.noise.options.size.val * 10;
                        const amount = density;
                        const offset = event.pressure * size;

                        for (let i = 1; i < amount; i++) {
                            let vertical = Math.random() * offset * 2 - offset;
                            let horizontal = Math.random() * offset * 2 - offset;

                            switch (direction) {
                                case "top":
                                    vertical = -Math.abs(vertical);
                                    horizontal = horizontal * 0.6;
                                    break;
                                case "bottom":
                                    vertical = Math.abs(vertical);
                                    horizontal = horizontal * 0.6;
                                    break;
                                case "left":
                                    horizontal = -Math.abs(horizontal);
                                    vertical = vertical * 0.6;
                                    break;
                                case "right":
                                    horizontal = Math.abs(horizontal);
                                    vertical = vertical * 0.6;
                                    break;
                                case "vertical":
                                    horizontal = horizontal * 0.3;
                                    break;
                                case "horizontal":
                                    vertical = vertical * 0.3;
                                    break;
                            }

                            let clone = new PointerEvent("pointermove", event);
                            clone = Object.defineProperty(clone, "clientX", { value: event.clientX + horizontal });
                            clone = Object.defineProperty(clone, "clientY", { value: event.clientY + vertical });
                            brushtools.canvas.dispatchEvent(new PointerEvent("pointermove", clone));
                            brushtools.canvas.dispatchEvent(new PointerEvent("pointermove", event));
                        }
                    }
                }
            }
        },
        grid: {
            grid: {
                name: "Grid Lines",
                description: "Enabling this will draw a grid on the canvas, with selected properties and the current brush size and color.",
                enabled: stateFromLocalstorage("grid.gridlines", false),
                options: {
                    columns: {
                        val: stateFromLocalstorage("grid.gridlines.options.cols", 16),
                        type: "num",
                        save: value => stateFromLocalstorage("grid.gridlines.options.cols", undefined, value)
                    },
                    rows: {
                        val: stateFromLocalstorage("grid.gridlines.options.rows", 12),
                        type: "num",
                        save: value => stateFromLocalstorage("grid.gridlines.options.rows", undefined, value)
                    },
                },
                enable: () => {

                    QS("div[data-tooltip=Brush]")?.click();
                    const bypass = document.body.dataset.bypassFps;
                    document.body.dataset.bypassFps = "true";

                    const rows = brushtools.groups.grid.grid.options.rows.val;
                    const cols = brushtools.groups.grid.grid.options.columns.val;
                    const canvasRect = brushtools.canvas.getBoundingClientRect();

                    const colWidth = canvasRect.width / cols;
                    const rowWidth = canvasRect.height / rows;

                    const eventAtPos = (x, y) => {
                        let event = new PointerEvent("pointermove");
                        event = Object.defineProperty(event, "pointerType", { value: "mouse" });
                        event = Object.defineProperty(event, "pointerId", { value: 1 });
                        event = Object.defineProperty(event, "clientX", { value: canvasRect.left + x });
                        event = Object.defineProperty(event, "clientY", { value: canvasRect.top + y });
                        return event;
                    }

                    for (let row = 1; row < rows; row++) {
                        const from = eventAtPos(0, row * rowWidth);
                        const to = eventAtPos(canvasRect.width, row * rowWidth);
                        brushtools.line(from, to);
                    }

                    for (let col = 1; col < cols; col++) {
                        const from = eventAtPos(col * colWidth, 0);
                        const to = eventAtPos(col * colWidth, canvasRect.height);
                        brushtools.line(from, to);
                    }

                    brushtools.modal.close();
                    document.body.dataset.bypassFps = bypass;
                },
                disable: () => {
                    /* nothing to do */
                }
            },
        },
    },
    line: (eventFrom, eventTo) => {
        //let down = Object.defineProperty(eventFrom, "pressure", { value: pressure });
        let down = Object.defineProperty(eventFrom, "button", { value: 0 });

        //let up = Object.defineProperty(eventTo, "pressure", { value: pressure });
        let up = Object.defineProperty(eventTo, "button", { value: 0 });

        brushtools.canvas.dispatchEvent(new PointerEvent("pointerdown", down));
        brushtools.canvas.dispatchEvent(new PointerEvent("pointermove", up));
        brushtools.canvas.dispatchEvent(new PointerEvent("pointerup", up));
    },
    currentDown: false,
    canvas: null,
    getColorsHue: () => [...QSA("#game-toolbar > div.picker > div> div.colors:not([style*=none]) > div > div > div")]
        .map(col => new Color({ rgb: col.style.backgroundColor }))
        .map(col => [col.hsl[0], col.hsl[2], col])
        .sort((a, b) => a[0] - b[0]),
    getColorsWeighted: () => [...QSA("#game-toolbar > div.picker > div> div.colors:not([style*=none]) > div > div > div")]
        .map(col => new Color({ rgb: col.style.backgroundColor }))
        .map(col => [Math.sqrt(0.5 * col.hsl[0] * col.hsl[0] + 0.5 * col.hsl[1] * col.hsl[1] + col.hsl[2] * col.hsl[2]), col])
        .sort((a, b) => a[0] - b[0]),
    colorGroups: [
        ['rgb(255, 255, 255)', 'rgb(210, 210, 210)', 'rgb(168, 168, 168)', 'rgb(126, 126, 126)', 'rgb(80, 80, 80)', 'rgb(0, 0, 0)'],
        ['rgb(239, 19, 11)', 'rgb(183, 6, 0)', 'rgb(86, 8, 6)'],
        ['rgb(255, 113, 0)', 'rgb(206, 67, 12)', 'rgb(137, 39, 0)'],
        ['rgb(255, 228, 0)', 'rgb(232, 162, 0)', 'rgb(163, 103, 0)'],
        ['rgb(0, 255, 145)', 'rgb(0, 158, 114)', 'rgb(0, 120, 93)', 'rgb(0, 204, 0)', 'rgb(0, 114, 21)', 'rgb(0, 61, 3)'],
        ['rgb(0, 178, 255)', 'rgb(0, 86, 158)', 'rgb(0, 59, 120)', 'rgb(35, 31, 211)', 'rgb(18, 11, 145)', 'rgb(8, 3, 82)'],
        ['rgb(211, 124, 170)', 'rgb(167, 85, 116)', 'rgb(118, 48, 75)', 'rgb(163, 0, 186)', 'rgb(108, 0, 135)', 'rgb(65, 0, 81)'],
        ['rgb(255, 172, 142)', 'rgb(226, 139, 93)', 'rgb(204, 119, 77)', 'rgb(160, 82, 45)', 'rgb(99, 48, 13)', 'rgb(72, 28, 0)']
    ],
    enable: (modename, state) => {
        for (let [name, group] of Object.entries(brushtools.groups)) {
            for (let [name, mode] of Object.entries(group)) {
                if (mode.name == modename) {
                    if (state) mode.enable();
                    else mode.disable();
                }
            }
        }
    },
    modal: null,
    showSettings: null,
    setup: () => {
        brushtools.canvas = QS("#game-canvas canvas");
        brushtools.canvas.addEventListener("pointerdown", (event) => {
            if (!event.isTrusted) return;
            brushtools.currentDown = true;
            document.body.dataset.bypassFps = Object.values(brushtools.groups).some(group => Object.values(group).some(mode => mode.enabled)).toString();
            for (let [name, group] of Object.entries(brushtools.groups)) {
                for (let [name, mode] of Object.entries(group)) {
                    if (mode.enabled && mode.pointermoveCallback) mode.pointermoveCallback(event);
                }
            }
        });
        brushtools.canvas.addEventListener("pointerup", (event) => {
            if (!event.isTrusted) return;
            brushtools.currentDown = false;
            document.body.dataset.bypassFps = Object.values(brushtools.groups).some(group => Object.values(group).some(mode => mode.enabled)).toString();
            for (let [name, group] of Object.entries(brushtools.groups)) {
                for (let [name, mode] of Object.entries(group)) {
                    if (mode.enabled && mode.pointerupCallback) mode.pointerupCallback(event);
                }
            }
        });
        brushtools.canvas.addEventListener("pointermove", (event) => {
            if (!event.isTrusted) return;
            document.body.dataset.bypassFps = Object.values(brushtools.groups).some(group => Object.values(group).some(mode => mode.enabled)).toString();
            for (let [name, group] of Object.entries(brushtools.groups)) {
                for (let [name, mode] of Object.entries(group)) {
                    if (mode.enabled && mode.pointermoveCallback) mode.pointermoveCallback(event);
                }
            }
        });

        const settingsContent = elemFromString(`<div id="brushmagicSettings" style="
                display: grid;
                grid-column-gap:2em;
                width: 100%;
                grid-template-columns: 1fr 1fr 1fr 1fr;"></div>`);

        const updateStates = () => {
            for (let [name, group] of Object.entries(brushtools.groups)) {
                for (let [name, mode] of Object.entries(group)) {
                    const toggle = settingsContent.querySelector("input#brushmagicToggle" + name);
                    if (toggle) toggle.checked = mode.enabled;
                }
            }
        }

        for (let [name, group] of Object.entries(brushtools.groups)) {
            const groupContainer = elemFromString(`<div><h3 style="text-transform: capitalize">${name} tools:</h3></div>`);
            for (let [name, mode] of Object.entries(group)) {

                /* if already enabled,call setup */
                if (mode.enabled) mode.enable();

                const modeDetails = elemFromString(`<div class="mode">
                <label>
                    <input id="brushmagicToggle${name}" type="checkbox" class="flatUI"></input>
                    <span>${mode.name}</span>
                </label>
                <span style="font-style:italic">${mode.description}</span>
                </div>`);
                modeDetails.querySelector("input").addEventListener("input", (event) => {
                    if (event.target.checked) mode.enable();
                    else mode.disable();
                    updateStates();
                });
                const modeOptions = elemFromString(`<div class="options"></div>`);
                for (let [name, option] of Object.entries(mode.options)) {
                    if (option.type == "num") {
                        const optionElem = elemFromString(`<label>Set ${name}:<input type="number" value="${option.val}"></label>`);
                        modeOptions.appendChild(optionElem);
                        optionElem.querySelector("input").addEventListener("input", event => {
                            option.val = parseInt(event.target.value);
                            if (option.save) option.save(option.val);
                        });
                    }
                    else if (typeof (option) == "object") {
                        const optionElem = elemFromString(`<label>Set ${name}:<select value="${option.val}">${option.type.map(opt => "<option value=" + opt + " " + (option.val == opt ? "selected" : "") + ">" + opt + "</option>").join("")}</select></label>`);
                        modeOptions.appendChild(optionElem);
                        optionElem.querySelector("select").addEventListener("input", event => {
                            option.val = event.target.value;
                            if (option.save) option.save(option.val);
                        });
                    }

                }
                modeDetails.appendChild(modeOptions);
                groupContainer.appendChild(modeDetails);
            }
            settingsContent.appendChild(groupContainer);
        }

        brushtools.showSettings = () => {
            updateStates();
            if (!brushtools.modal) brushtools.modal = new Modal(settingsContent, () => { brushtools.modal = null; }, "Brush Laboratory");
            else {
                brushtools.modal.close();
                brushtools.modal = null;
            }
        }

        document.addEventListener("openBrushLab", brushtools.showSettings);
    }
};


// #content features/vision.js
﻿class Vision {
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

// #content features/awards.js
// handles the award feature
// depends on: genericfunctions.js, socket.js
const awards = {
    state: null,
    ui: null,
    inventory: [],
    cloudAwardLink: undefined,
    all: [],
    toggleState: async to => {

        // check if valid rewardee and show ui
        if (to) {
            const lobbyRewardees = socket.data.publicData.onlineItems.filter(item => item.ItemType === "rewardee" && item.LobbyKey === lobbies.lobbyProperties.Key);
            const drawer = lobbies.lobbyProperties.Players.find(p => p.Drawing === true);
            if (drawer === undefined || drawer.Sender) {
                awards.toggleState(false);
                return;
            }
            const rewardee = lobbyRewardees.find(r => r.LobbyPlayerID === Number(drawer.LobbyPlayerID));
            if (rewardee !== undefined) {
                // check if user has awards to give
                const result = await socket.emitEvent("get awards", undefined, true);
                if (result.awards.length > 0) {
                    awards.inventory = result.awards;
                    awards.state = true;
                    awards.ui.style.display = "";

                    awards.openPicker = () => {

                        // build clickable icons
                        awards.ui.querySelector(".grid").innerHTML = awards.inventory.map(a => {
                            const award = awards.all.find(f => f.id == a[0]);
                            return `<div class="award" data-id="${a[1][0]}" data-award="${a[0]}" style="background-image:url(${award.url})"></div>`;
                        }).join("");

                        // add eventlisteners
                        [...awards.ui.querySelectorAll(".grid .award")].forEach(a => a.addEventListener("click", async () => {
                            const awardId = Number(a.getAttribute("data-award"));
                            const id = Number(a.getAttribute("data-id"));
                            awards.ui.blur();
                            awards.toggleState(false);
                            await socket.emitEvent("give award", { lobbyPlayerId: rewardee.LobbyPlayerID, awardInventoryId: id }, true);
                        }));
                        awards.ui.focus();
                    };
                }
                else {
                    awards.toggleState(false);
                    return;
                }
            }
            else {
                awards.toggleState(false);
                return;
            }
        }

        // if awards not activated, hide ui
        else {
            awards.awardee = undefined;
            awards.state = false;
            awards.ui.style.display = "none";
            awards.inventory = [];
            awards.openPicker = undefined;
        }
    },
    openPicker: undefined,
    presentAward: (id, invId, from, to) => {
        const award = awards.all.find(a => a.id == id);
        if (award === undefined) return;

        const isAwardee = lobbies.lobbyProperties.Players.find(p => p.Sender === true && p.LobbyPlayerID == to);
        const getIdname = id => document.querySelector(`[playerid='${id}'] .player-name`).textContent.replace("(You)", "").trim();

        if (localStorage.awardfx == "true") {
            const object = elemFromString(`<div id="awardPresentation" style="background-image: url(${award.url})"></div>`);
            QS("#game-canvas").appendChild(object);
            const animation = object.animate([
                {
                    opacity: 0,
                    backgroundSize: "100%"
                },
                {
                    opacity: 1,
                    backgroundSize: "30px"
                },
                {
                    opacity: 1,
                    backgroundSize: "48px"
                },
                {
                    opacity: 1,
                    backgroundSize: "48px"
                },
                {
                    opacity: 0,
                    backgroundSize: "48px"
                },
            ], {
                duration: 3000,
                easing: "ease-out"
            });
            animation.onfinish = () => object.remove();
        }

        let msg;
        if (isAwardee) {
            awards.cloudAwardLink = invId;
            msg = getIdname(from) + " awarded your drawing with a '" + award.name + "'!";
        }
        else msg = getIdname(from) + " awarded the drawing of " + getIdname(to) + " with a '" + award.name + "'!";

        QS(".chat-content").appendChild(elemFromString(`<div style='display:flex; color: var(--COLOR_CHAT_TEXT_DRAWING); background-color: inherit'><div class="awardChatIcon" style="display: grid; place-content: center; width:3em; margin-left:1em; background-image:url(${award.url})"></div> <p style="flex-grow:1; padding-left: 1em;background-color: inherit"> ${msg} </div> </div>`));
        scrollMessages(true);
    },
    setup: async () => {

        let enabler = new MutationObserver((mutations) => {
            console.log(QS("#game-rate").style.display);
            if (QS("#game-rate").style.display !== "none") awards.toggleState(true);
        });
        enabler.observe(QS("#game-rate"), { attributes: true, attributeFilter: ['style'] });

        // hide controls
        document.addEventListener("drawingFinished", async (data) => {
            awards.toggleState(false);
        });
        document.addEventListener("lobbyConnected", () => {
            awards.toggleState(false);
            awards.toggleState(true);
        });

        awards.ui = elemFromString(`<div tabindex="0" id="awardsAnchor" data-typo-tooltip='Award this special drawing' data-tooltipdir='W'>
            <div class="icon"></div>
            <div id="awardsInventory">
                <h2 style="display:none">Award Inventory</h2>
                <div class="grid"></div>
            </div>
        </div>     
        `);
        awards.ui.querySelector(".icon").style.backgroundImage = "url(" + chrome.runtime.getURL("res/award.gif") + ")";
        awards.ui.querySelector(".icon").addEventListener("click", () => awards.openPicker?.());
        QS("#game-canvas").appendChild(awards.ui);

        // await waitMs(5000);
        // awards.inventory = (await socket.emitEvent("get awards", undefined, true)).awards;

        // workaround to using without permission temporarily - depends on cloudflare worker
        awards.all = await typoApiFetch("awards");
        awards.toggleState(false);
    }
}

// #content content.js
﻿/*
 *

░██████╗██╗░░██╗██████╗░██╗██████╗░██████╗░██╗░░░░░  ████████╗██╗░░░██╗██████╗░░█████╗░
██╔════╝██║░██╔╝██╔══██╗██║██╔══██╗██╔══██╗██║░░░░░  ╚══██╔══╝╚██╗░██╔╝██╔══██╗██╔══██╗
╚█████╗░█████═╝░██████╔╝██║██████╦╝██████╦╝██║░░░░░  ░░░██║░░░░╚████╔╝░██████╔╝██║░░██║
░╚═══██╗██╔═██╗░██╔══██╗██║██╔══██╗██╔══██╗██║░░░░░  ░░░██║░░░░░╚██╔╝░░██╔═══╝░██║░░██║
██████╔╝██║░╚██╗██║░░██║██║██████╦╝██████╦╝███████╗  ░░░██║░░░░░░██║░░░██║░░░░░╚█████╔╝
╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝╚═════╝░╚═════╝░╚══════╝  ░░░╚═╝░░░░░░╚═╝░░░╚═╝░░░░░░╚════╝░
 * 
 * 
 * So this is... finally reworked code?! :O
 * Right!! Almost everything is split into easy-to-understand procedural initialized modules, capsulated and called here in service.js.
 */
// Comment section: Todo list .. close this section in your IDE
{
    /*
     * Todo and bugs:
     *  ----fix conflict with image poster (container freespace) 
     *  ----fix lobby id check -> as soon as lobby connected
     *  ----fix lobby status when search is still active (slow connection)
     *  ----fix lobby search not triggering sometimes on first lobby
     *  ----lobby buttons take several clicks sometimes
     *  ----keydown changes tools when other players draw
     *  ----mysterious drawing over next persons' canvas sometimes
     *  ----still that audio thing
     *  ----holy not working
     *  ----lobby search stops if lobby is tempoarly down
     *  ----private lobby settings not set
     *  ----gif progress bar is not consistent
     *  ----gif drawing speed could be tweaked
     *  ----image tools height gets too high
     *  ----fetch for imageagent
     *  image agent doesnt close if very lately opened and loading during word choose
     * 
     * Feature requests:
     * ----implement gif saving
     * ----maybe bigger color palette
     * ----lobby description
     * ----tab style popup
     * ----custom sprites+
     * ----ff port :(
     * ----zoom to canvas for accurate drawing
     * ----abort image tools drawing process
     * ----image agent error state message
     * ----finish dark mode # wont: way too lazy
     * ----recall older drawings to share
     */
}

// Important things go first
'use strict'; // Show no weaknesses
// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

if(localStorage.typoCompatible !== "1") {
    new Toast("Typo is not compatible with the current version of Skribbl.io. An update wil follow soon!", 2000);
    throw new Error("Aborted content because typo not compatible with current skribbl version");
}

patcher.disconnect(); // stop patcher observing
setDefaults(false); // Set default settings

// communication with popup.js
chrome.runtime.onMessage.addListener(message => {
    if (message == "getSettings") chrome.runtime.sendMessage({ settings: JSON.stringify(localStorage) });
    else performCommand(message + "--");
});

// initialize modules
captureCanvas.initListeners(); // init capturing draw ommands and drawings
imageOptions.initAll(); // init image options from imageOptions.js
imageTools.initAll(); // init image tools from imageTools.js
gamemodes.setup();
brushtools.setup();
awards.setup();
//pressure.initEvents(); // init pressure
document.dispatchEvent(new Event("addTypoTooltips"));
uiTweaks.initAll(); // init various ui tweaks as navigation buttons, wordhint, backbutton, random color dice.. from uiTweaks.js
search.setup();
setTimeout(async () => await emojis.init(), 0); // init emojis
// sprites, visuals and drops are initialized in patcher.js as soon as DOM and palantir loaded

document.addEventListener("skribblInitialized", () => {
    imageAgent.initImageAgent(); // init image agent from agent.js
});

// thats a rickroll! :)))
//QS("a[href='https://twitter.com/ticedev']").href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";




};

/* run setup */
execTypo();
