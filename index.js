'use strict';

const DEFAULT_INTERVAL = 1000 / 60;

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
    throw new Error('superscript→hold: cannot use “setTimeout()” nor “window.setTimeout()”');
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
 * Invoke <code>get(i)</code> on the resulting object to retrieve the <em>i<sup>th</sup></em> colour in the palette (<em>0 ≥ i < n</em>).
 */

const palette = function(n) {
  if (!n || n < 2)
    throw new Error('superscript→palette: “n” should be an integer ≥ 2');
  const MAX = 0xff;
  var x, r, g, b;
  this.n = n;
  this.c = new Array(n);
  for (let i = 0; i < n; i ++) {
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
};

palette.prototype.get = function(i) {
  if (!this.hasOwnProperty('n') || !this.hasOwnProperty('c'))
    throw new Error('superscript→palette→get: wrong palette object');
  if (i < 0 || i >= this.n)
    throw new Error('superscript→palette→get: “i” should be an integer ≥ 0 and < n');
  return this.c[i];
};

// const cache = () => {};

// const throttle = () => {};

// const debounce = () => {};

exports.hold = hold;
exports.palette = palette;
// exports.cache = cache;
// exports.throttle = throttle;
// exports.debounce = debounce;
