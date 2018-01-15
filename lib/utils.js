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
