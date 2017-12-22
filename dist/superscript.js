(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.superscript = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const DEFAULT_INTERVAL = 1000 / 60;

const UTILS = require('./lib/utils');

/**
 * Invoke callback <code>cb</code> once with optional parameters <code>args</code> as soon as condition <code>check</code> is <code>true</code>,
 * checking every <code>interval</code> <em>ms</em> (by default, <em>60 Hz ≈ 16.67 ms</em>).
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
 * Create a palette of <code>n</code> evenly-distributed colours (<em>n ≥ 2</em>).
 *
 * Invoke <code>get(i)</code> on the resulting object to retrieve the <em>i<sup>th</sup></em> colour in the palette (<em>0 ≥ i < n</em>):
 *
 * <code>get(i, rbg = false)</code>
 */

const Palette = function(n, opts) {
  const OPTIONS = JSON.parse(JSON.stringify(UTILS.DEFAULT_PALETTE_OPTIONS));
  if (opts)
    for (let i in opts)
      OPTIONS[i] = opts[i];
  const ERROR = UTILS.checkPaletteParams(n, OPTIONS);
  if (ERROR)
    throw ERROR;
  const MAX = 0xff,
    RANGE = n - (OPTIONS.blackAndWhite ? 2 : 0);
  var x, r, g, b;
  this.n = n;
  this.c = new Array(n);
  for (let i = 0; i < RANGE; i ++) {
    x = i * 6 / n;
    if (x < 1) {
      r = MAX;
      g = parseInt(MAX * x);
      b = 0;
    } else if (x < 2) {
      r = parseInt(MAX - MAX * (x - 1));
      g = MAX;
      b = 0;
    } else if (x < 3) {
      r = 0;
      g = MAX;
      b = parseInt(MAX * (x - 2));
    } else if (x < 4) {
      r = 0;
      g = parseInt(MAX - MAX * (x - 3));
      b = MAX;
    } else if (x < 5) {
      r = parseInt(MAX * (x - 4));
      g = 0;
      b = MAX;
    } else {
      r = MAX;
      g = 0;
      b = parseInt(MAX - MAX * (x - 5));
    }
    this.c[i] = (r << 16) + (g << 8) + b;
  }
  if (OPTIONS.blackAndWhite) {
    this.c.unshift(0);
    this.c.push(0xffffff);
  }
  if ('random' === OPTIONS.shuffle)
    this.c = UTIL.randomiseArray(this.c);
  else if (OPTIONS.shuffle)
    this.c = UTIL.shuffleArray(this.c);
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

// const cache = () => {};

// const throttle = () => {};

// const debounce = () => {};

if ('undefined' !== typeof exports) {
  exports.hold = hold;
  exports.Palette = Palette;
  // exports.cache = cache;
  // exports.throttle = throttle;
  // exports.debounce = debounce;
}

},{"./lib/utils":2}],2:[function(require,module,exports){
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
  if (true === opts.greys && opts.blackAndWhite && n < 3)
    return new Error('superscript.Palette: “blackAndWhite” and “greys” cannot be both “true” when “n” < 3');
  if (true === opts.shades && opts.blackAndWhite && n < 4)
    return new Error('superscript.Palette: “shades” and “blackAndWhite” cannot be both “true” when “n” < 4');
  if (opts.shades + (opts.blackAndWhite ? 2 : 0) < n)
    return new Error(`superscript.Palette: the palette is too small to include ${opts.shades} shades` + (opts.blackAndWhite ? ' plus black and white' : ''));
  return false;
};

exports.DEFAULT_PALETTE_OPTIONS = DEFAULT_PALETTE_OPTIONS;
exports.shuffleArray = shuffleArray;
exports.randomiseArray = randomiseArray;
exports.checkPaletteParams = checkPaletteParams;

},{}]},{},[1])(1)
});