!(function (t) {
        function e(r) {
                if (i[r]) return i[r].exports;
                var s = (i[r] = { exports: {}, id: r, loaded: !1 });
                return (
                        t[r].call(s.exports, s, s.exports, e),
                        (s.loaded = !0),
                        s.exports
                );
        }
        var i = {};
        return (e.m = t), (e.c = i), (e.p = ""), e(0);
})([
        function (t, e, i) {
                var r, s;
                (r = i(1)),
                        (s = function (t) {
                                var e, i, s, o;
                                return (
                                        (e = new r(t.width, t.height)),
                                        0 === t.index
                                                ? e.writeHeader()
                                                : (e.firstFrame = !1),
                                        e.setTransparent(t.transparent),
                                        e.setRepeat(t.repeat),
                                        e.setDelay(t.delay),
                                        e.setQuality(t.quality),
                                        e.setDither(t.dither),
                                        e.setGlobalPalette(t.globalPalette),
                                        e.addFrame(t.data),
                                        t.last && e.finish(),
                                        t.globalPalette === !0 &&
                                                (t.globalPalette =
                                                        e.getGlobalPalette()),
                                        (s = e.stream()),
                                        (t.data = s.pages),
                                        (t.cursor = s.cursor),
                                        (t.pageSize = s.constructor.pageSize),
                                        t.canTransfer
                                                ? ((o = (function () {
                                                          var e, r, s, o;
                                                          for (
                                                                  s = t.data,
                                                                          o =
                                                                                  [],
                                                                          e = 0,
                                                                          r =
                                                                                  s.length;
                                                                  e < r;
                                                                  e++
                                                          )
                                                                  (i = s[e]),
                                                                          o.push(
                                                                                  i.buffer
                                                                          );
                                                          return o;
                                                  })()),
                                                  self.postMessage(t, o))
                                                : self.postMessage(t)
                                );
                        }),
                        (self.onmessage = function (t) {
                                return s(t.data);
                        });
        },
        function (t, e, i) {
                function r() {
                        (this.page = -1), (this.pages = []), this.newPage();
                }
                function s(t, e) {
                        (this.width = ~~t),
                                (this.height = ~~e),
                                (this.transparent = null),
                                (this.transIndex = 0),
                                (this.repeat = -1),
                                (this.delay = 0),
                                (this.image = null),
                                (this.pixels = null),
                                (this.indexedPixels = null),
                                (this.colorDepth = null),
                                (this.colorTab = null),
                                (this.neuQuant = null),
                                (this.usedEntry = new Array()),
                                (this.palSize = 7),
                                (this.dispose = -1),
                                (this.firstFrame = !0),
                                (this.sample = 10),
                                (this.dither = !1),
                                (this.globalPalette = !1),
                                (this.out = new r());
                }
                var o = i(2),
                        n = i(3);
                (r.pageSize = 4096), (r.charMap = {});
                for (var a = 0; a < 256; a++)
                        r.charMap[a] = String.fromCharCode(a);
                (r.prototype.newPage = function () {
                        (this.pages[++this.page] = new Uint8Array(r.pageSize)),
                                (this.cursor = 0);
                }),
                        (r.prototype.getData = function () {
                                for (
                                        var t = "", e = 0;
                                        e < this.pages.length;
                                        e++
                                )
                                        for (var i = 0; i < r.pageSize; i++)
                                                t +=
                                                        r.charMap[
                                                                this.pages[e][i]
                                                        ];
                                return t;
                        }),
                        (r.prototype.writeByte = function (t) {
                                this.cursor >= r.pageSize && this.newPage(),
                                        (this.pages[this.page][this.cursor++] =
                                                t);
                        }),
                        (r.prototype.writeUTFBytes = function (t) {
                                for (var e = t.length, i = 0; i < e; i++)
                                        this.writeByte(t.charCodeAt(i));
                        }),
                        (r.prototype.writeBytes = function (t, e, i) {
                                for (
                                        var r = i || t.length, s = e || 0;
                                        s < r;
                                        s++
                                )
                                        this.writeByte(t[s]);
                        }),
                        (s.prototype.setDelay = function (t) {
                                this.delay = Math.round(t / 10);
                        }),
                        (s.prototype.setFrameRate = function (t) {
                                this.delay = Math.round(100 / t);
                        }),
                        (s.prototype.setDispose = function (t) {
                                t >= 0 && (this.dispose = t);
                        }),
                        (s.prototype.setRepeat = function (t) {
                                this.repeat = t;
                        }),
                        (s.prototype.setTransparent = function (t) {
                                this.transparent = t;
                        }),
                        (s.prototype.addFrame = function (t) {
                                (this.image = t),
                                        (this.colorTab =
                                                this.globalPalette &&
                                                this.globalPalette.slice
                                                        ? this.globalPalette
                                                        : null),
                                        this.getImagePixels(),
                                        this.analyzePixels(),
                                        this.globalPalette === !0 &&
                                                (this.globalPalette =
                                                        this.colorTab),
                                        this.firstFrame &&
                                                (this.writeLSD(),
                                                this.writePalette(),
                                                this.repeat >= 0 &&
                                                        this.writeNetscapeExt()),
                                        this.writeGraphicCtrlExt(),
                                        this.writeImageDesc(),
                                        this.firstFrame ||
                                                this.globalPalette ||
                                                this.writePalette(),
                                        this.writePixels(),
                                        (this.firstFrame = !1);
                        }),
                        (s.prototype.finish = function () {
                                this.out.writeByte(59);
                        }),
                        (s.prototype.setQuality = function (t) {
                                t < 1 && (t = 1), (this.sample = t);
                        }),
                        (s.prototype.setDither = function (t) {
                                t === !0 && (t = "FloydSteinberg"),
                                        (this.dither = t);
                        }),
                        (s.prototype.setGlobalPalette = function (t) {
                                this.globalPalette = t;
                        }),
                        (s.prototype.getGlobalPalette = function () {
                                return (
                                        (this.globalPalette &&
                                                this.globalPalette.slice &&
                                                this.globalPalette.slice(0)) ||
                                        this.globalPalette
                                );
                        }),
                        (s.prototype.writeHeader = function () {
                                this.out.writeUTFBytes("GIF89a");
                        }),
                        (s.prototype.analyzePixels = function () {
                                this.colorTab ||
                                        ((this.neuQuant = new o(
                                                this.pixels,
                                                this.sample
                                        )),
                                        this.neuQuant.buildColormap(),
                                        (this.colorTab =
                                                this.neuQuant.getColormap())),
                                        this.dither
                                                ? this.ditherPixels(
                                                          this.dither.replace(
                                                                  "-serpentine",
                                                                  ""
                                                          ),
                                                          null !==
                                                                  this.dither.match(
                                                                          /-serpentine/
                                                                  )
                                                  )
                                                : this.indexPixels(),
                                        (this.pixels = null),
                                        (this.colorDepth = 8),
                                        (this.palSize = 7),
                                        null !== this.transparent &&
                                                (this.transIndex =
                                                        this.findClosest(
                                                                this
                                                                        .transparent,
                                                                !0
                                                        ));
                        }),
                        (s.prototype.indexPixels = function () {
                                var t = this.pixels.length / 3;
                                this.indexedPixels = new Uint8Array(t);
                                for (var e = 0, i = 0; i < t; i++) {
                                        var r = this.findClosestRGB(
                                                255 & this.pixels[e++],
                                                255 & this.pixels[e++],
                                                255 & this.pixels[e++]
                                        );
                                        (this.usedEntry[r] = !0),
                                                (this.indexedPixels[i] = r);
                                }
                        }),
                        (s.prototype.ditherPixels = function (t, e) {
                                var i = {
                                        FalseFloydSteinberg: [
                                                [3 / 8, 1, 0],
                                                [3 / 8, 0, 1],
                                                [0.25, 1, 1],
                                        ],
                                        FloydSteinberg: [
                                                [7 / 16, 1, 0],
                                                [3 / 16, -1, 1],
                                                [5 / 16, 0, 1],
                                                [1 / 16, 1, 1],
                                        ],
                                        Stucki: [
                                                [8 / 42, 1, 0],
                                                [4 / 42, 2, 0],
                                                [2 / 42, -2, 1],
                                                [4 / 42, -1, 1],
                                                [8 / 42, 0, 1],
                                                [4 / 42, 1, 1],
                                                [2 / 42, 2, 1],
                                                [1 / 42, -2, 2],
                                                [2 / 42, -1, 2],
                                                [4 / 42, 0, 2],
                                                [2 / 42, 1, 2],
                                                [1 / 42, 2, 2],
                                        ],
                                        Atkinson: [
                                                [1 / 8, 1, 0],
                                                [1 / 8, 2, 0],
                                                [1 / 8, -1, 1],
                                                [1 / 8, 0, 1],
                                                [1 / 8, 1, 1],
                                                [1 / 8, 0, 2],
                                        ],
                                };
                                if (!t || !i[t])
                                        throw "Unknown dithering kernel: " + t;
                                var r = i[t],
                                        s = 0,
                                        o = this.height,
                                        n = this.width,
                                        a = this.pixels,
                                        h = e ? -1 : 1;
                                this.indexedPixels = new Uint8Array(
                                        this.pixels.length / 3
                                );
                                for (var l = 0; l < o; l++) {
                                        e && (h *= -1);
                                        for (
                                                var u = 1 == h ? 0 : n - 1,
                                                        p = 1 == h ? n : 0;
                                                u !== p;
                                                u += h
                                        ) {
                                                s = l * n + u;
                                                var f = 3 * s,
                                                        c = a[f],
                                                        y = a[f + 1],
                                                        w = a[f + 2];
                                                (f = this.findClosestRGB(
                                                        c,
                                                        y,
                                                        w
                                                )),
                                                        (this.usedEntry[f] =
                                                                !0),
                                                        (this.indexedPixels[s] =
                                                                f),
                                                        (f *= 3);
                                                for (
                                                        var d =
                                                                        this
                                                                                .colorTab[
                                                                                f
                                                                        ],
                                                                g =
                                                                        this
                                                                                .colorTab[
                                                                                f +
                                                                                        1
                                                                        ],
                                                                x =
                                                                        this
                                                                                .colorTab[
                                                                                f +
                                                                                        2
                                                                        ],
                                                                b = c - d,
                                                                v = y - g,
                                                                P = w - x,
                                                                m =
                                                                        1 == h
                                                                                ? 0
                                                                                : r.length -
                                                                                  1,
                                                                B =
                                                                        1 == h
                                                                                ? r.length
                                                                                : 0;
                                                        m !== B;
                                                        m += h
                                                ) {
                                                        var S = r[m][1],
                                                                T = r[m][2];
                                                        if (
                                                                S + u >= 0 &&
                                                                S + u < n &&
                                                                T + l >= 0 &&
                                                                T + l < o
                                                        ) {
                                                                var M = r[m][0];
                                                                (f =
                                                                        s +
                                                                        S +
                                                                        T * n),
                                                                        (f *= 3),
                                                                        (a[f] =
                                                                                Math.max(
                                                                                        0,
                                                                                        Math.min(
                                                                                                255,
                                                                                                a[
                                                                                                        f
                                                                                                ] +
                                                                                                        b *
                                                                                                                M
                                                                                        )
                                                                                )),
                                                                        (a[
                                                                                f +
                                                                                        1
                                                                        ] =
                                                                                Math.max(
                                                                                        0,
                                                                                        Math.min(
                                                                                                255,
                                                                                                a[
                                                                                                        f +
                                                                                                                1
                                                                                                ] +
                                                                                                        v *
                                                                                                                M
                                                                                        )
                                                                                )),
                                                                        (a[
                                                                                f +
                                                                                        2
                                                                        ] =
                                                                                Math.max(
                                                                                        0,
                                                                                        Math.min(
                                                                                                255,
                                                                                                a[
                                                                                                        f +
                                                                                                                2
                                                                                                ] +
                                                                                                        P *
                                                                                                                M
                                                                                        )
                                                                                ));
                                                        }
                                                }
                                        }
                                }
                        }),
                        (s.prototype.findClosest = function (t, e) {
                                return this.findClosestRGB(
                                        (16711680 & t) >> 16,
                                        (65280 & t) >> 8,
                                        255 & t,
                                        e
                                );
                        }),
                        (s.prototype.findClosestRGB = function (t, e, i, r) {
                                if (null === this.colorTab) return -1;
                                if (this.neuQuant && !r)
                                        return this.neuQuant.lookupRGB(t, e, i);
                                for (
                                        var s = 0,
                                                o = 16777216,
                                                n = this.colorTab.length,
                                                a = 0,
                                                h = 0;
                                        a < n;
                                        h++
                                ) {
                                        var l = t - (255 & this.colorTab[a++]),
                                                u =
                                                        e -
                                                        (255 &
                                                                this.colorTab[
                                                                        a++
                                                                ]),
                                                p =
                                                        i -
                                                        (255 &
                                                                this.colorTab[
                                                                        a++
                                                                ]),
                                                f = l * l + u * u + p * p;
                                        (!r || this.usedEntry[h]) &&
                                                f < o &&
                                                ((o = f), (s = h));
                                }
                                return s;
                        }),
                        (s.prototype.getImagePixels = function () {
                                var t = this.width,
                                        e = this.height;
                                this.pixels = new Uint8Array(t * e * 3);
                                for (
                                        var i = this.image, r = 0, s = 0, o = 0;
                                        o < e;
                                        o++
                                )
                                        for (var n = 0; n < t; n++)
                                                (this.pixels[s++] = i[r++]),
                                                        (this.pixels[s++] =
                                                                i[r++]),
                                                        (this.pixels[s++] =
                                                                i[r++]),
                                                        r++;
                        }),
                        (s.prototype.writeGraphicCtrlExt = function () {
                                this.out.writeByte(33),
                                        this.out.writeByte(249),
                                        this.out.writeByte(4);
                                var t, e;
                                null === this.transparent
                                        ? ((t = 0), (e = 0))
                                        : ((t = 1), (e = 2)),
                                        this.dispose >= 0 && (e = 7 & dispose),
                                        (e <<= 2),
                                        this.out.writeByte(0 | e | 0 | t),
                                        this.writeShort(this.delay),
                                        this.out.writeByte(this.transIndex),
                                        this.out.writeByte(0);
                        }),
                        (s.prototype.writeImageDesc = function () {
                                this.out.writeByte(44),
                                        this.writeShort(0),
                                        this.writeShort(0),
                                        this.writeShort(this.width),
                                        this.writeShort(this.height),
                                        this.firstFrame || this.globalPalette
                                                ? this.out.writeByte(0)
                                                : this.out.writeByte(
                                                          128 | this.palSize
                                                  );
                        }),
                        (s.prototype.writeLSD = function () {
                                this.writeShort(this.width),
                                        this.writeShort(this.height),
                                        this.out.writeByte(240 | this.palSize),
                                        this.out.writeByte(0),
                                        this.out.writeByte(0);
                        }),
                        (s.prototype.writeNetscapeExt = function () {
                                this.out.writeByte(33),
                                        this.out.writeByte(255),
                                        this.out.writeByte(11),
                                        this.out.writeUTFBytes("NETSCAPE2.0"),
                                        this.out.writeByte(3),
                                        this.out.writeByte(1),
                                        this.writeShort(this.repeat),
                                        this.out.writeByte(0);
                        }),
                        (s.prototype.writePalette = function () {
                                this.out.writeBytes(this.colorTab);
                                for (
                                        var t = 768 - this.colorTab.length,
                                                e = 0;
                                        e < t;
                                        e++
                                )
                                        this.out.writeByte(0);
                        }),
                        (s.prototype.writeShort = function (t) {
                                this.out.writeByte(255 & t),
                                        this.out.writeByte((t >> 8) & 255);
                        }),
                        (s.prototype.writePixels = function () {
                                var t = new n(
                                        this.width,
                                        this.height,
                                        this.indexedPixels,
                                        this.colorDepth
                                );
                                t.encode(this.out);
                        }),
                        (s.prototype.stream = function () {
                                return this.out;
                        }),
                        (t.exports = s);
        },
        function (t, e) {
                function i(t, e) {
                        function i() {
                                (z = []),
                                        (E = new Int32Array(256)),
                                        (R = new Int32Array(s)),
                                        (U = new Int32Array(s)),
                                        (Q = new Int32Array(s >> 3));
                                var t, e;
                                for (t = 0; t < s; t++)
                                        (e = (t << (n + 8)) / s),
                                                (z[t] = new Float64Array([
                                                        e,
                                                        e,
                                                        e,
                                                        0,
                                                ])),
                                                (U[t] = h / s),
                                                (R[t] = 0);
                        }
                        function c() {
                                for (var t = 0; t < s; t++)
                                        (z[t][0] >>= n),
                                                (z[t][1] >>= n),
                                                (z[t][2] >>= n),
                                                (z[t][3] = t);
                        }
                        function w(t, e, i, r, s) {
                                (z[e][0] -= (t * (z[e][0] - i)) / b),
                                        (z[e][1] -= (t * (z[e][1] - r)) / b),
                                        (z[e][2] -= (t * (z[e][2] - s)) / b);
                        }
                        function x(t, e, i, r, o) {
                                for (
                                        var n,
                                                a,
                                                h = Math.abs(e - t),
                                                l = Math.min(e + t, s),
                                                u = e + 1,
                                                p = e - 1,
                                                f = 1;
                                        u < l || p > h;

                                )
                                        (a = Q[f++]),
                                                u < l &&
                                                        ((n = z[u++]),
                                                        (n[0] -=
                                                                (a *
                                                                        (n[0] -
                                                                                i)) /
                                                                B),
                                                        (n[1] -=
                                                                (a *
                                                                        (n[1] -
                                                                                r)) /
                                                                B),
                                                        (n[2] -=
                                                                (a *
                                                                        (n[2] -
                                                                                o)) /
                                                                B)),
                                                p > h &&
                                                        ((n = z[p--]),
                                                        (n[0] -=
                                                                (a *
                                                                        (n[0] -
                                                                                i)) /
                                                                B),
                                                        (n[1] -=
                                                                (a *
                                                                        (n[1] -
                                                                                r)) /
                                                                B),
                                                        (n[2] -=
                                                                (a *
                                                                        (n[2] -
                                                                                o)) /
                                                                B));
                        }
                        function v(t, e, i) {
                                (t = 0 | t), (e = 0 | e), (i = 0 | i);
                                var r,
                                        o,
                                        h,
                                        c,
                                        y,
                                        w = ~(1 << 31),
                                        d = w,
                                        g = -1,
                                        x = g;
                                for (r = 0; r < s; r++)
                                        (o = z[r]),
                                                (h =
                                                        (Math.abs(
                                                                (0 | o[0]) - t
                                                        ) +
                                                                Math.abs(
                                                                        (0 |
                                                                                o[1]) -
                                                                                e
                                                                ) +
                                                                Math.abs(
                                                                        (0 |
                                                                                o[2]) -
                                                                                i
                                                                )) |
                                                        0),
                                                h < w && ((w = h), (g = r)),
                                                (c =
                                                        h -
                                                        ((0 | R[r]) >>
                                                                (a - n))),
                                                c < d && ((d = c), (x = r)),
                                                (y = U[r] >> u),
                                                (U[r] -= y),
                                                (R[r] += y << l);
                                return (U[g] += p), (R[g] -= f), x;
                        }
                        function m() {
                                var t,
                                        e,
                                        i,
                                        r,
                                        n,
                                        a,
                                        h = 0,
                                        l = 0;
                                for (t = 0; t < s; t++) {
                                        for (
                                                i = z[t],
                                                        n = t,
                                                        a = i[1],
                                                        e = t + 1;
                                                e < s;
                                                e++
                                        )
                                                (r = z[e]),
                                                        r[1] < a &&
                                                                ((n = e),
                                                                (a = r[1]));
                                        if (
                                                ((r = z[n]),
                                                t != n &&
                                                        ((e = r[0]),
                                                        (r[0] = i[0]),
                                                        (i[0] = e),
                                                        (e = r[1]),
                                                        (r[1] = i[1]),
                                                        (i[1] = e),
                                                        (e = r[2]),
                                                        (r[2] = i[2]),
                                                        (i[2] = e),
                                                        (e = r[3]),
                                                        (r[3] = i[3]),
                                                        (i[3] = e)),
                                                a != h)
                                        ) {
                                                for (
                                                        E[h] = (l + t) >> 1,
                                                                e = h + 1;
                                                        e < a;
                                                        e++
                                                )
                                                        E[e] = t;
                                                (h = a), (l = t);
                                        }
                                }
                                for (
                                        E[h] = (l + o) >> 1, e = h + 1;
                                        e < 256;
                                        e++
                                )
                                        E[e] = o;
                        }
                        function C(t, e, i) {
                                (t = 0 | t), (e = 0 | e), (i = 0 | i);
                                for (
                                        var r,
                                                o,
                                                n,
                                                a = 1e3,
                                                h = -1,
                                                l = 0 | E[e],
                                                u = l - 1;
                                        l < s || u >= 0;

                                )
                                        l < s &&
                                                ((o = z[l]),
                                                (n = (0 | o[1]) - e),
                                                n >= a
                                                        ? (l = s)
                                                        : (l++,
                                                          n < 0 && (n = -n),
                                                          (r = (0 | o[0]) - t),
                                                          r < 0 && (r = -r),
                                                          (n += r),
                                                          n < a &&
                                                                  ((r =
                                                                          (0 |
                                                                                  o[2]) -
                                                                          i),
                                                                  r < 0 &&
                                                                          (r =
                                                                                  -r),
                                                                  (n += r),
                                                                  n < a &&
                                                                          ((a =
                                                                                  n),
                                                                          (h =
                                                                                  0 |
                                                                                  o[3]))))),
                                                u >= 0 &&
                                                        ((o = z[u]),
                                                        (n = e - (0 | o[1])),
                                                        n >= a
                                                                ? (u = -1)
                                                                : (u--,
                                                                  n < 0 &&
                                                                          (n =
                                                                                  -n),
                                                                  (r =
                                                                          (0 |
                                                                                  o[0]) -
                                                                          t),
                                                                  r < 0 &&
                                                                          (r =
                                                                                  -r),
                                                                  (n += r),
                                                                  n < a &&
                                                                          ((r =
                                                                                  (0 |
                                                                                          o[2]) -
                                                                                  i),
                                                                          r <
                                                                                  0 &&
                                                                                  (r =
                                                                                          -r),
                                                                          (n +=
                                                                                  r),
                                                                          n <
                                                                                  a &&
                                                                                  ((a =
                                                                                          n),
                                                                                  (h =
                                                                                          0 |
                                                                                          o[3])))));
                                return h;
                        }
                        function I() {
                                var i,
                                        s = t.length,
                                        o = 30 + (e - 1) / 3,
                                        a = s / (3 * e),
                                        h = ~~(a / r),
                                        l = b,
                                        u = d,
                                        p = u >> y;
                                for (p <= 1 && (p = 0), i = 0; i < p; i++)
                                        Q[i] =
                                                l *
                                                (((p * p - i * i) * P) /
                                                        (p * p));
                                var f;
                                s < A
                                        ? ((e = 1), (f = 3))
                                        : (f =
                                                  s % S !== 0
                                                          ? 3 * S
                                                          : s % T !== 0
                                                          ? 3 * T
                                                          : s % M !== 0
                                                          ? 3 * M
                                                          : 3 * F);
                                var c,
                                        m,
                                        B,
                                        C,
                                        I = 0;
                                for (i = 0; i < a; )
                                        if (
                                                ((c = (255 & t[I]) << n),
                                                (m = (255 & t[I + 1]) << n),
                                                (B = (255 & t[I + 2]) << n),
                                                (C = v(c, m, B)),
                                                w(l, C, c, m, B),
                                                0 !== p && x(p, C, c, m, B),
                                                (I += f),
                                                I >= s && (I -= s),
                                                i++,
                                                0 === h && (h = 1),
                                                i % h === 0)
                                        )
                                                for (
                                                        l -= l / o,
                                                                u -= u / g,
                                                                p = u >> y,
                                                                p <= 1 &&
                                                                        (p = 0),
                                                                C = 0;
                                                        C < p;
                                                        C++
                                                )
                                                        Q[C] =
                                                                l *
                                                                (((p * p -
                                                                        C * C) *
                                                                        P) /
                                                                        (p *
                                                                                p));
                        }
                        function D() {
                                i(), I(), c(), m();
                        }
                        function G() {
                                for (var t = [], e = [], i = 0; i < s; i++)
                                        e[z[i][3]] = i;
                                for (var r = 0, o = 0; o < s; o++) {
                                        var n = e[o];
                                        (t[r++] = z[n][0]),
                                                (t[r++] = z[n][1]),
                                                (t[r++] = z[n][2]);
                                }
                                return t;
                        }
                        var z, E, R, U, Q;
                        (this.buildColormap = D),
                                (this.getColormap = G),
                                (this.lookupRGB = C);
                }
                var r = 100,
                        s = 256,
                        o = s - 1,
                        n = 4,
                        a = 16,
                        h = 1 << a,
                        l = 10,
                        u = 10,
                        p = h >> u,
                        f = h << (l - u),
                        c = s >> 3,
                        y = 6,
                        w = 1 << y,
                        d = c * w,
                        g = 30,
                        x = 10,
                        b = 1 << x,
                        v = 8,
                        P = 1 << v,
                        m = x + v,
                        B = 1 << m,
                        S = 499,
                        T = 491,
                        M = 487,
                        F = 503,
                        A = 3 * F;
                t.exports = i;
        },
        function (t, e) {
                function i(t, e, i, a) {
                        function h(t, e) {
                                (S[x++] = t), x >= 254 && c(e);
                        }
                        function l(t) {
                                u(o), (A = P + 2), (C = !0), d(P, t);
                        }
                        function u(t) {
                                for (var e = 0; e < t; ++e) T[e] = -1;
                        }
                        function p(t, e) {
                                var i, n, a, h, p, f, c;
                                for (
                                        v = t,
                                                C = !1,
                                                n_bits = v,
                                                b = y(n_bits),
                                                P = 1 << (t - 1),
                                                m = P + 1,
                                                A = P + 2,
                                                x = 0,
                                                h = w(),
                                                c = 0,
                                                i = o;
                                        i < 65536;
                                        i *= 2
                                )
                                        ++c;
                                (c = 8 - c), (f = o), u(f), d(P, e);
                                t: for (; (n = w()) != r; )
                                        if (
                                                ((i = (n << s) + h),
                                                (a = (n << c) ^ h),
                                                T[a] !== i)
                                        ) {
                                                if (T[a] >= 0) {
                                                        (p = f - a),
                                                                0 === a &&
                                                                        (p = 1);
                                                        do
                                                                if (
                                                                        ((a -=
                                                                                p) <
                                                                                0 &&
                                                                                (a +=
                                                                                        f),
                                                                        T[a] ===
                                                                                i)
                                                                ) {
                                                                        h =
                                                                                M[
                                                                                        a
                                                                                ];
                                                                        continue t;
                                                                }
                                                        while (T[a] >= 0);
                                                }
                                                d(h, e),
                                                        (h = n),
                                                        A < 1 << s
                                                                ? ((M[a] = A++),
                                                                  (T[a] = i))
                                                                : l(e);
                                        } else h = M[a];
                                d(h, e), d(m, e);
                        }
                        function f(i) {
                                i.writeByte(B),
                                        (remaining = t * e),
                                        (curPixel = 0),
                                        p(B + 1, i),
                                        i.writeByte(0);
                        }
                        function c(t) {
                                x > 0 &&
                                        (t.writeByte(x),
                                        t.writeBytes(S, 0, x),
                                        (x = 0));
                        }
                        function y(t) {
                                return (1 << t) - 1;
                        }
                        function w() {
                                if (0 === remaining) return r;
                                --remaining;
                                var t = i[curPixel++];
                                return 255 & t;
                        }
                        function d(t, e) {
                                for (
                                        g &= n[F],
                                                F > 0 ? (g |= t << F) : (g = t),
                                                F += n_bits;
                                        F >= 8;

                                )
                                        h(255 & g, e), (g >>= 8), (F -= 8);
                                if (
                                        ((A > b || C) &&
                                                (C
                                                        ? ((b = y(
                                                                  (n_bits = v)
                                                          )),
                                                          (C = !1))
                                                        : (++n_bits,
                                                          (b =
                                                                  n_bits == s
                                                                          ? 1 <<
                                                                            s
                                                                          : y(
                                                                                    n_bits
                                                                            )))),
                                        t == m)
                                ) {
                                        for (; F > 0; )
                                                h(255 & g, e),
                                                        (g >>= 8),
                                                        (F -= 8);
                                        c(e);
                                }
                        }
                        var g,
                                x,
                                b,
                                v,
                                P,
                                m,
                                B = Math.max(2, a),
                                S = new Uint8Array(256),
                                T = new Int32Array(o),
                                M = new Int32Array(o),
                                F = 0,
                                A = 0,
                                C = !1;
                        this.encode = f;
                }
                var r = -1,
                        s = 12,
                        o = 5003,
                        n = [
                                0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023,
                                2047, 4095, 8191, 16383, 32767, 65535,
                        ];
                t.exports = i;
        },
]);
//# sourceMappingURL=gif.worker.js.map
