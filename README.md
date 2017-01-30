[![npm version](https://img.shields.io/npm/v/supers.svg)](https://npmjs.org/package/supers)
[![Licence](https://img.shields.io/npm/l/supers.svg)](LICENSE)
[![Build Status](https://travis-ci.org/tripu/superscript.svg?branch=master)](https://travis-ci.org/tripu/superscript)
[![Coverage Status](https://coveralls.io/repos/tripu/superscript/badge.svg)](https://coveralls.io/r/tripu/superscript)
[![Dependency Status](https://david-dm.org/tripu/superscript.svg)](https://david-dm.org/tripu/superscript)
[![devDependency Status](https://david-dm.org/tripu/superscript/dev-status.svg)](https://david-dm.org/tripu/superscript#info=devDependencies)
[![Inline docs](https://inch-ci.org/github/tripu/superscript.svg?branch=master)](https://inch-ci.org/github/tripu/superscript)

# superscript

A library of miscellaneous JavaScript utilities

* [Usage](#usage)
  * [JavaScript](#javascript)
  * [Node.js](#nodejs)
* [Reference](#reference)
  * [`hold()`](#hold)
  * [`palette()`](#palette)
  * [`cache()`](#cache)
  * [`throttle()`](#throttle)
  * [`debounce()`](#debounce)
* [Contributing](#contributing)
* [Credits](#credits)

## Usage

### JavaScript

```html
<script src="https://tripu.github.io/superscript/index.js"></script>
```

### Node.js

```bash
npm install supers
```

```javascript
const superscript = require('supers');
```

## Reference

### `hold()`

```javascript
superscript.hold(check, cb, interval, ...args)
```

Invoke callback `cb` once with optional parameters `args` as soon as condition `check` is `true`, checking every `interval` *ms* (by default, *60 Hz ≈ 16.67
ms*).

### `palette()`

```javascript
superscript.palette(n)
```

Create a palette of `n` evenly-distributed colours (*n ≥ 2*).

Then, invoke `get(i)` on the resulting object to retrieve the *i<sup>th</sup>* colour in the palette (*0 ≥ i < n*):

```javascript
new superscript.palette(10).get(5);        // 65535
new superscript.palette(10).get(0, true);  // 'ff0000'
```

```javascript
// Assume there's a pie chart with 4 slices. Let's assign colours to them:
const palette = new superscript.palette(4);
chart[0].css('color', '#' + palette.get(0, true));
chart[1].css('color', '#' + palette.get(1, true));
chart[2].css('color', '#' + palette.get(2, true));
chart[3].css('color', '#' + palette.get(3, true));
```

### `cache()`

Coming soon.

### `throttle()`

Coming soon.

### `debounce()`

Coming soon.

## Contributing

```bash
npm clone https://github.com/tripu/superscript.git
cd superscript
npm install
npm test

```

## Credits

Copyright &copy; 2017 tripu ([`t@tripu.info`](mailto:t@tripu.info), [`https://tripu.info`](https://tripu.info/)).

This project is licenced [under the terms of the MIT licence](LICENSE.md).
