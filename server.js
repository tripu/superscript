/* jshint node: true */
/* globals window: false */

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

// const cache = () => {};

// const throttle = () => {};

/**
 * https://davidwalsh.name/javascript-debounce-function
 */

const debounce = null;

if ('undefined' !== typeof exports) {
  exports.hold = hold;
  exports.Palette = Palette;
  // exports.cache = cache;
  // exports.throttle = throttle;
  exports.debounce = debounce;
}
