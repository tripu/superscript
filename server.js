/* jshint node: true, browser: true */

'use strict';

const DEFAULT_INTERVAL = 1000 / 60;

const UTILS = require('./utils');

/**
 * Invoke callback `cb` once with optional parameters `args` as soon as condition `check` is `true`, checking every `interval` *ms*
 * (by default, *60 Hz ≈ 16.67 ms*).
 *
 * @example
 * superscript.hold(check, cb, interval, ...args)
 */

const hold = (check, cb, interval, ...args) => {
    var timer;
    if ('undefined' !== typeof setTimeout) timer = setTimeout;
    else if ('undefined' !== typeof window && 'undefined' !== typeof window.setTimeout) timer = window.setTimeout;
    else throw new Error('superscript.hold: cannot use “setTimeout()” nor “window.setTimeout()”');
    const DELAY = interval ? interval : DEFAULT_INTERVAL;
    (function loop() {
        if (check()) cb(...args);
        else timer(loop, DELAY);
    })();
};

/**
 * https://davidwalsh.name/javascript-debounce-function
 */

const debounce = (func, wait, immediate) => {
    var timeout;

    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/**
 * Create a palette of `n` evenly-distributed colours (*n ≥ 2*).
 *
 * &#9758; [Demo](https://codepen.io/tripu/full/JEMBoN)
 *
 * Invoke <code>get(i)</code> on the resulting object to retrieve the <em>i<sup>th</sup></em> colour in the palette (<em>0 ≥ i < n</em>):
 * <code>get(i, rbg = false)</code>
 *
 * Default options:
 *
 * ```json
 * {
 *   "shuffle": false,
 *   "shades": "auto",
 *   "greys": "auto",
 *   "blackAndWhite": false
 * }
 * ```
 *
 * Then, invoke `get(i)` on the resulting object to retrieve the *i<sup>th</sup>* colour in the palette (*0 ≥ i < n*):
 *
 * ```javascript
 * new superscript.palette(10).get(5);        // 65535
 * new superscript.palette(10).get(0, true);  // 'ff0000'
 * ```
 *
 * ```javascript
 * // Assume there's a pie chart with 4 slices. Let's assign colours to them:
 * const palette = new superscript.palette(4);
 * chart[0].css('color', '#' + palette.get(0, true));
 * chart[1].css('color', '#' + palette.get(1, true));
 * chart[2].css('color', '#' + palette.get(2, true));
 * chart[3].css('color', '#' + palette.get(3, true));
 * ```
 * @example
 * new superscript.Palette(n[, opts])
 */

const Palette = function (n, opts) {
    const OPTIONS = JSON.parse(JSON.stringify(UTILS.DEFAULT_PALETTE_OPTIONS));
    if (opts) for (const i in opts) OPTIONS[i] = opts[i];
    const ERROR = UTILS.checkPaletteParams(n, OPTIONS);
    if (ERROR) throw ERROR;
    const MAX = 0x100;
    const range = n - (OPTIONS.blackAndWhite ? 2 : 0);
    let /* Shades, */ b, g, r, x;
    /*
     *  If (false === OPTIONS.shades) {
     * shades = 0;
     * } else if (true === OPTIONS.shades)
     * shades = 0;
     * else if (true === OPTIONS.shades)
     * shades = 0;
     * else
     *shades = OPTIONS.shades;
     */
    this.n = n;
    this.c = [];
    for (let i = 0; i < range; i++) {
        x = i * 6 / range;
        r = g = b = 0;
        if (1 > x) {
            r = MAX - 1;
            g = MAX * x;
        } else if (2 > x) {
            r = MAX - MAX * (x - 1);
            g = MAX - 1;
        } else if (3 > x) {
            g = MAX - 1;
            b = MAX * (x - 2);
        } else if (4 > x) {
            g = MAX - MAX * (x - 3);
            b = MAX - 1;
        } else if (5 > x) {
            r = MAX * (x - 4);
            b = MAX - 1;
        } else {
            r = MAX - 1;
            b = MAX - MAX * (x - 5);
        }
        r = Math.min(MAX - 1, Math.round(r));
        g = Math.min(MAX - 1, Math.round(g));
        b = Math.min(MAX - 1, Math.round(b));
        this.c.push((r << 16) + (g << 8) + b);
    }
    if (OPTIONS.blackAndWhite) {
        this.c.unshift(0);
        this.c.push(0xffffff);
    }
    if ('random' === OPTIONS.shuffle) this.c = UTILS.randomiseArray(this.c);
    else if (OPTIONS.shuffle) this.c = UTILS.shuffleArray(this.c);
};

Palette.prototype.get = function (i, rgb = false) {
    if (!this.hasOwnProperty('n') || !this.hasOwnProperty('c')) throw new Error('superscript.Palette.get: wrong palette object');
    if (0 > i || i >= this.n) throw new Error('superscript.Palette.get: “i” should be an integer ≥ 0 and < n');
    if (rgb) return (0x1000000 + this.c[i]).toString(16).substr(1, 6);

    return this.c[i];
};

if ('undefined' !== typeof exports) {
    exports.hold = hold;
    exports.debounce = debounce;
    exports.Palette = Palette;
}
