(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.superscript = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* jshint node: true */

'use strict';

const DEFAULT_PALETTE_OPTIONS = {
  blackAndWhite: false,
  greys: 'auto',
  shades: 'auto',
  shuffle: false
};

const shuffleArray = (a) => {
  const CUTOFF = a.length % 22 + 1,
    MASK = 0xffffff & (a.length << 16 + a.length << 8 + a.length);
  const HASH = (n) => MASK & (n << CUTOFF + (n >> 24 - CUTOFF));
  return a.slice().sort((x, y) => {
    if (HASH(x) > HASH(y))
      return -1;
    if (HASH(x) < HASH(y))
      return +1;
    else
      return 0;
  });
};

const randomiseArray = (a) => {
  const RESULT = a.slice();
  let x, tmp;
  for (let i = 0; i < RESULT.length; i ++) {
    x = Math.floor(Math.random() * RESULT.length);
    tmp = RESULT[x];
    RESULT[x] = RESULT[i];
    RESULT[i] = tmp;
  }
  return RESULT;
};

const checkPaletteParams = (n, opts) => {
  if (!Number.isInteger(n) || n < 2)
    return new Error('superscript.Palette: “n” must be an integer ≥ 2');
  for (let i in opts)
    if ('blackAndWhite' === i) {
      if (false !== opts[i] && true !== opts[i])
        return new Error('superscript.Palette: “blackAndWhite” must be either “false” or “true”');
    } else if ('greys' === i) {
      if (false !== opts[i] && true !== opts[i] && 'auto' !== opts[i])
        return new Error('superscript.Palette: “greys” must be either “false”, “true” or “auto”');
    } else if ('shades' === i) {
      if (false !== opts[i] && true !== opts[i] && 'auto' !== opts[i] && (!Number.isInteger(opts[i]) || opts[i] < 1))
        return new Error('superscript.Palette: “shades” must be either “false”, “true”, “auto” or an integer ≥ 1');
    } else if ('shuffle' === i) {
      if (false !== opts[i] && true !== opts[i] && 'random' !== opts[i])
        return new Error('superscript.Palette: “shuffle” must be either “false”, “true” or “random”');
    } else
      return new Error(`superscript.Palette: “${i}” is not a valid option`);
  if (opts.blackAndWhite &&  true === opts.greys && n < 3)
    return new Error('superscript.Palette: “blackAndWhite” and “greys” cannot be both “true” when “n” < 3');
  if (opts.blackAndWhite && true === opts.shades && n < 4)
    return new Error('superscript.Palette: “blackAndWhite” and “shades” cannot be both “true” when “n” < 4');
  if (opts.shades + (opts.blackAndWhite ? 2 : 0) < n)
    return new Error(`superscript.Palette: the palette is too small to include ${opts.shades} shades` + (opts.blackAndWhite ? ' plus black and white' : ''));
  return false;
};

exports.DEFAULT_PALETTE_OPTIONS = DEFAULT_PALETTE_OPTIONS;
exports.shuffleArray = shuffleArray;
exports.randomiseArray = randomiseArray;
exports.checkPaletteParams = checkPaletteParams;

},{}],2:[function(require,module,exports){
/* jshint node: true */
/* globals window: false */

'use strict';

const DEFAULT_INTERVAL = 1000 / 60;

const UTILS = require('./lib/utils');

/**
 * Invoke callback `cb` once with optional parameters `args` as soon as condition `check` is `true`, checking every `interval` *ms*
 * (by default, *60 Hz ≈ 16.67 ms*).
 *
 * @example
 * superscript.hold(check, cb, interval, ...args)
 */

const hold = (check, cb, interval, ...args) => {
  var timer;
  if ('undefined' !== typeof setTimeout)
    timer = setTimeout;
  else if ('undefined' !== typeof window && 'undefined' !== typeof window.setTimeout)
    timer = window.setTimeout;
  else
    throw new Error('superscript.hold: cannot use “setTimeout()” nor “window.setTimeout()”');
  const DELAY = interval ? interval : DEFAULT_INTERVAL;
  (function loop() {
    if (check())
      cb(...args);
    else
      timer(loop, DELAY);
  })();
};

/**
 * Create a palette of `n` evenly-distributed colours (*n ≥ 2*).
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

const Palette = function(n, opts) {
  const OPTIONS = JSON.parse(JSON.stringify(UTILS.DEFAULT_PALETTE_OPTIONS));
  if (opts)
    for (let i in opts)
      OPTIONS[i] = opts[i];
  const ERROR = UTILS.checkPaletteParams(n, OPTIONS);
  if (ERROR)
    throw ERROR;
  const MAX = 0x100;
  let range = n - (OPTIONS.blackAndWhite ? 2 : 0);
  let shades, x, r, g, b;
  if (false === OPTIONS.shades) {
    shades = 0;
  } else if (true === OPTIONS.shades)
    shades = 0;
  else if (true === OPTIONS.shades)
    shades = 0;
  else
    shades = OPTIONS.shades;
  console.log(shades); // eslint-disable-line no-console
  this.n = n;
  this.c = [];
  for (let i = 0; i < range; i ++) {
    x = i * 6 / range;
    r = g = b = 0;
    if (x < 1) {
      r = MAX - 1;
      g = MAX * x;
    } else if (x < 2) {
      r = MAX - MAX * (x - 1);
      g = MAX - 1;
    } else if (x < 3) {
      g = MAX - 1;
      b = MAX * (x - 2);
    } else if (x < 4) {
      g = MAX - MAX * (x - 3);
      b = MAX - 1;
    } else if (x < 5) {
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
  if ('random' === OPTIONS.shuffle)
    this.c = UTILS.randomiseArray(this.c);
  else if (OPTIONS.shuffle)
    this.c = UTILS.shuffleArray(this.c);
};

Palette.prototype.get = function(i, rgb = false) {
  if (!this.hasOwnProperty('n') || !this.hasOwnProperty('c'))
    throw new Error('superscript.Palette.get: wrong palette object');
  if (i < 0 || i >= this.n)
    throw new Error('superscript.Palette.get: “i” should be an integer ≥ 0 and < n');
  if (rgb)
    return (0x1000000 + this.c[i]).toString(16).substr(1, 6);
  else
    return this.c[i];
};

if ('undefined' !== typeof exports) {
  exports.hold = hold;
  exports.Palette = Palette;
}

},{"./lib/utils":1}]},{},[2])(2)
});
