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

exports.hold = hold;
