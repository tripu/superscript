/* jshint node: true, mocha: true */
/* globals window: false */

'use strict';

const assert = require('assert');
const superscript = require('./server');

const ONE_SECOND = 1000,
  HALF_A_SECOND = ONE_SECOND / 2,
  TENTH_OF_A_SECOND = ONE_SECOND / 10,
  HUNDREDTH_OF_A_SECOND = ONE_SECOND / 100;

let timer;

if ('undefined' !== typeof setTimeout)
  timer = setTimeout;
else if ('undefined' !== typeof window && 'undefined' !== typeof window.setTimeout)
  timer = window.setTimeout;
else
  throw new Error('superscript[tests]: cannot use “setTimeout()” nor “window.setTimeout()”');

describe('“hold()”', () => {

  var start,
    checks;

  const reset = () => {
    start = new Date().getTime();
    checks = 0;
  };

  const oneSecondHasElapsed = () => {
    checks++;
    return new Date().getTime() - start >= ONE_SECOND;
  };

  const yes = () => true;

  it('should work', (done) => {
    reset();
    superscript.hold(oneSecondHasElapsed, done);
  });

  it('should invoke callback immediately if check passes', (done) => {
    const checkImmediacy = () => done(checks > 1 ? 'checked condition more than once' : null);
    reset();
    superscript.hold(yes, checkImmediacy);
  });

  it('should honour custom interval', (done) => {
    const FOUR_HERTZ = 250;
    const checkAccuracy = () => {
      const DELTA = new Date().getTime() - start - ONE_SECOND;
      if (DELTA <= 0)
        done('ran callback too soon');
      else if (DELTA >= FOUR_HERTZ)
        done('ran callback too late');
      else if (checks < 5)
        done('did not checked condition often enough');
      else if (checks > 5)
        done('checked condition too often');
      else
        done();
    };
    reset();
    superscript.hold(oneSecondHasElapsed, checkAccuracy, FOUR_HERTZ);
  });

  it('should pass along parameters to callback', (done) => {
    const x = '1',
      y = '2',
      z = '3';
    const checkParams = (a, b, c) => done(a === x && b === y && c === z ? null : 'callback did not receive right parameters');
    reset();
    superscript.hold(yes, checkParams, null, x, y, z);
  });

});

describe('“debounce()”', () => {

  let start,
    checks;

  it('should work', (done) => {
    const cushioned = superscript.debounce(() => {
      done(assert(Math.abs(new Date().getTime() - start - ONE_SECOND) < HUNDREDTH_OF_A_SECOND));
    }, HALF_A_SECOND);
    start = new Date().getTime();
    for (let i = 1; i < 6; i ++)
      timer(cushioned, i * TENTH_OF_A_SECOND);
  });

  it('should delay (but not mute) scattered events', (done) => {
    const cushioned = superscript.debounce(() => {
      assert(Math.abs(new Date().getTime() - start - HALF_A_SECOND) < HUNDREDTH_OF_A_SECOND);
      if (++checks > 2)
        done();
      else
        start = new Date().getTime();
    }, TENTH_OF_A_SECOND);
    checks = 0;
    timer(() => {
      start = new Date().getTime();
    }, TENTH_OF_A_SECOND);
    for (let i = 1; i < 4; i ++)
      timer(cushioned, i * HALF_A_SECOND);
  });

});

describe('“palette()”', () => {

  const GAMUT = 23,
    RGB_REGEX = /[\dabcdef]{6}/i;

  var p;

  it('should work', (done) => {
    p = new superscript.Palette(GAMUT);
    if (!p)
      done('does not work');
    else if (GAMUT !== p.n)
      done('wrong size of palette');
    else if ('number' !== typeof p.get(0) || 'number' !== typeof p.get(GAMUT - 1))
      done('cannot retrieve colours');
    else if (!p.get(parseInt(GAMUT / 2), true).match(RGB_REGEX))
      done('RGB colour is incorrect');
    else
      done();
  });

});
