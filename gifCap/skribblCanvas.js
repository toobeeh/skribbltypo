var Z = function (t) { // t-> canvas
    this.canvas = t, this.canvasCtx = this.canvas[0].getContext("2d"), this.canvasCtx.mozImageSmoothingEnabled = !1, this.canvasCtx.webkitImageSmoothingEnabled = !1, this.canvasCtx.msImageSmoothingEnabled = !1, this.canvasCtx.imageSmoothingEnabled = !1, this.mouseposPrev = {
        x: 0,
        y: 0
    }, this.mousepos = {
        x: 0,
        y: 0
    }, this.drawCommands = [], this.drawCommandsReceived = [], this.brush = new Q;
    var e = this;
    setInterval(function () {
        e.drawCommandsReceived.length > 0 && e.performDrawCommand(e.drawCommandsReceived.shift())
    }, 3), this.clear()
};
Z.prototype.updateMousePosition = function (t, e, n) {
    var o = this.canvas[0].getBoundingClientRect(),
        r = this.canvas[0].width,
        s = this.canvas[0].height,
        i = o.width,
        a = o.height,
        c = (t - o.left) / i,
        u = (e - o.top) / a;
    n ? (this.mouseposPrev.x = this.mousepos.x = Math.floor(c * r), this.mouseposPrev.y = this.mousepos.y = Math.floor(u * s)) : (this.mouseposPrev.x = this.mousepos.x, this.mouseposPrev.y = this.mousepos.y, this.mousepos.x = Math.floor(c * r), this.mousepos.y = Math.floor(u * s))
}, Z.prototype.addDrawCommandReceived = function (t) {
    this.drawCommandsReceived.push(t)
}, Z.prototype.addDrawCommand = function (t) {
    this.drawCommands.push(t)
}, Z.prototype.createDrawCommandLine = function (t, e, n, o, r, s) {
    return [0, t, e, n, o, r, s]
}, Z.prototype.createDrawCommandErase = function (t, e, n, o, r) {
    return [1, t, e, n, o, r]
}, Z.prototype.createDrawCommandFill = function (t, e, n) {
    return [2, t, e, n]
    }, Z.prototype.performDrawCommand = function (t) {
    //console.log(t);
    switch (t[0]) {
        case 0:
            var e = Math.floor(t[2]);
            e < this.brush.thicknessMin && (e = this.brush.thicknessMin), e > this.brush.thicknessMax && (e = this.brush.thicknessMax);
            var n = Math.floor(Math.ceil(e / 2)),
                o = i(Math.floor(t[3]), -n, this.canvas[0].width + n),
                r = i(Math.floor(t[4]), -n, this.canvas[0].height + n),
                s = i(Math.floor(t[5]), -n, this.canvas[0].width + n),
                c = i(Math.floor(t[6]), -n, this.canvas[0].height + n),
                u = a(this.brush.getColor(t[1]));
            this.plotLine(o, r, s, c, e, u.r, u.g, u.b);
            break;
        case 1:
            var e = Math.floor(t[1]);
            e < this.brush.thicknessMin && (e = this.brush.thicknessMin), e > this.brush.thicknessMax && (e = this.brush.thicknessMax);
            var n = Math.floor(Math.ceil(e / 2)),
                o = i(Math.floor(t[2]), -n, this.canvas[0].width + n),
                r = i(Math.floor(t[3]), -n, this.canvas[0].height + n),
                s = i(Math.floor(t[4]), -n, this.canvas[0].width + n),
                c = i(Math.floor(t[5]), -n, this.canvas[0].height + n);
            this.plotLine(o, r, s, c, e, 255, 255, 255);
            break;
        case 2:
            var u = a(this.brush.getColor(t[1])),
                h = i(Math.floor(t[2]), 0, this.canvas[0].width),
                l = i(Math.floor(t[3]), 0, this.canvas[0].height);
            this.floodFill(h, l, u.r, u.g, u.b)
    }
}, Z.prototype.getImageData = function (t, e, n, o) {
    var r = Math.min(t, n),
        s = Math.min(e, o),
        i = Math.abs(t - n),
        a = Math.abs(e - o);
    return this.canvasCtx.getImageData(r, s, i, a)
}, Z.prototype.setPixel = function (t, e, n, o, r) {
    e >= 0 && e < t.data.length && (t.data[e] = n, t.data[e + 1] = o, t.data[e + 2] = r, t.data[e + 3] = 255)
}, Z.prototype.getPixel = function (t, e, n) {
    var o = 4 * (n * t.width + e);
    return o >= 0 && o < t.data.length ? [t.data[o], t.data[o + 1], t.data[o + 2]] : [0, 0, 0]
}, Z.prototype.floodFill = function (t, e, n, o, r) {
    var s = this.canvasCtx.getImageData(0, 0, this.canvas[0].width, this.canvas[0].height),
        i = [
            [t, e]
        ],
        a = this.getPixel(s, t, e);
    if (n != a[0] || o != a[1] || r != a[2]) {
        for (var c = function (t) {
            var e = s.data[t],
                i = s.data[t + 1],
                c = s.data[t + 2];
            if (e == n && i == o && c == r) return !1;
            var u = Math.abs(e - a[0]),
                h = Math.abs(i - a[1]),
                l = Math.abs(c - a[2]);
            return u < 1 && h < 1 && l < 1
        }, u = s.height, h = s.width; i.length;) {
            var l, p, f, d, y, m;
            for (l = i.pop(), p = l[0], f = l[1], d = 4 * (f * h + p); f-- >= 0 && c(d);) d -= 4 * h;
            for (d += 4 * h, ++f, y = !1, m = !1; f++ < u - 1 && c(d);) this.setPixel(s, d, n, o, r), p > 0 && (c(d - 4) ? y || (i.push([p - 1, f]), y = !0) : y && (y = !1)), p < h - 1 && (c(d + 4) ? m || (i.push([p + 1, f]), m = !0) : m && (m = !1)), d += 4 * h
        }
        this.canvasCtx.putImageData(s, 0, 0)
    }
}, Z.prototype.plotLineOld = function (t, e, n, o, r, s) {
    this.canvasCtx.fillStyle = this.canvasCtx.strokeStyle = this.brush.getColor(s), this.canvasCtx.lineWidth = r, this.canvasCtx.lineJoin = this.canvasCtx.lineCap = "round", this.canvasCtx.beginPath(), this.canvasCtx.moveTo(t, e), this.canvasCtx.lineTo(n, o), this.canvasCtx.closePath(), this.canvasCtx.stroke()
}, Z.prototype.plotLine = function (t, e, n, o, r, s, i, a) {
    var c = Math.floor(r / 2),
        u = c * c,
        h = Math.min(t, n) - c,
        l = Math.min(e, o) - c,
        p = Math.max(t, n) + c,
        f = Math.max(e, o) + c;
    t -= h, e -= l, n -= h, o -= l;
    var d = this.canvasCtx.getImageData(h, l, p - h, f - l),
        y = function (t, e) {
            for (var n = -c; n <= c; n++)
                for (var o = -c; o <= c; o++)
                    if (n * n + o * o < u) {
                        var r = 4 * ((e + o) * d.width + t + n);
                        r >= 0 && r < d.data.length && (d.data[r] = s, d.data[r + 1] = i, d.data[r + 2] = a, d.data[r + 3] = 255)
                    }
        };
    if (t == n && e == o) y(t, e);
    else {
        y(t, e), y(n, o);
        var m = Math.abs(n - t),
            g = Math.abs(o - e),
            v = t < n ? 1 : -1,
            b = e < o ? 1 : -1,
            w = m - g;
        for (Math.floor(Math.max(0, c - 10) / 5); t != n || e != o;) {
            var k = w << 1;
            k > -g && (w -= g, t += v), k < m && (w += m, e += b), y(t, e)
        }
    }
    this.canvasCtx.putImageData(d, h, l)
}, Z.prototype.clear = function () {
    this.drawCommands = [], this.drawCommandsReceived = [], this.canvasCtx.fillStyle = "#FFF", this.canvasCtx.fillRect(0, 0, this.canvas[0].width, this.canvas[0].height)
}, Z.prototype.setDrawing = function (t) {
   
};
var Q = function () {
    this.down = !1, this.tool = "pen", this.toolUsed = !1, this.colorIndex = 0, this.thickness = 0, this.thicknessMin = 4, this.thicknessMax = 40, this.brushCanvas = new OffscreenCanvas(this.thicknessMax,this.thicknessMax), this.brushCanvasCtx = this.brushCanvas.getContext("2d"), this.setTool("pen"), this.setThickness(12), this.setColor(1)
};
Q.prototype.hide = function () {
   
}, Q.prototype.show = function () {
    
}, Q.prototype.setDown = function (t) {
    
}, Q.prototype.setTool = function (t) {
    //this.tool = t, $(".containerTools .tool").removeClass("toolActive"), $(".containerTools .tool[data-tool='" + t + "']").addClass("toolActive"), this.updateBrushCursor()
}, Q.prototype.setColor = function (t) {
    //this.colorIndex = t, $(".colorPreview").css("background-color", this.getColor(t)), this.updateBrushCursor()
    }, Q.prototype.getColor = function (t) {
    if (t > 10000) {
        t = t - 10000;
        t = t.toString(16);
        return "#" + t;
    }
    let color = "#FFF";
    
    color = [[255, 255, 255],
    [80, 80, 80],
    [0, 0, 0],
    [210, 210, 210],
    [168, 168, 168],
    [126, 126, 126],
    [239, 19, 11],
    [183, 6, 0],
    [86, 8, 6],
    [255, 113, 0],
    [206, 67, 12],
    [137, 39, 0],
    [255, 228, 0],
    [232, 162, 0],
    [163, 103, 0],
    [0, 204, 0],
    [0, 114, 21],
    [0, 61, 3],
    [0, 255, 145],
    [0, 158, 114],
    [0, 120, 93],
    [0, 178, 255],
    [0, 86, 158],
    [0, 59, 120],
    [35, 31, 211],
    [18, 11, 145],
    [8, 3, 82],
    [163, 0, 186],
    [108, 0, 135],
    [65, 0, 81],
    [211, 124, 170],
    [167, 85, 116],
    [118, 48, 75],
    [255, 172, 142],
    [226, 139, 93],
    [204, 119, 77],
    [160, 82, 45],
    [99, 48, 13],
        [72, 28, 0]][t];
    color = rgbToHex(color);
    return color;
}, setBrushSize = Q.prototype.setThickness = function (t) {
    this.thickness = t, this.thickness < this.thicknessMin && (this.thickness = this.thicknessMin), this.thickness > this.thicknessMax && (this.thickness = this.thicknessMax), this.updateBrushCursor()
}, Q.prototype.updateBrushCursor = function () {
    };
function i(t, e, n) {
    return t < e ? e : t > n ? n : t
}

function a(t) {
    if (t[0] == "#") return hexToRgb(t.substr(1));
    var e = t.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return {
        r: parseInt(e[1]),
        g: parseInt(e[2]),
        b: parseInt(e[3])
    }
}
function hexToRgb(hex) {
    var arrBuff = new ArrayBuffer(4);
    var vw = new DataView(arrBuff);
    vw.setUint32(0, parseInt(hex, 16), false);
    var arrByte = new Uint8Array(arrBuff);

    return { r: arrByte[1], g: arrByte[2], b: arrByte[3] };
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}