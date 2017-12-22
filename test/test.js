'use strict';

const superscript = require('../index');

describe('“hold()”', () => {

  const ONE_SECOND = 1000;

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
