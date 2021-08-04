# superscript

*A library of miscellaneous JavaScript utilities*

[![npm version](https://img.shields.io/npm/v/supers.svg)](https://npmjs.org/package/supers)
[![Licence](https://img.shields.io/npm/l/supers.svg)](https://github.com/tripu/superscript/blob/master/LICENSE.md)
[![Build Status](https://travis-ci.com/tripu/superscript.svg?branch=master)](https://travis-ci.com/tripu/superscript)
[![dependencies Status](https://david-dm.org/tripu/superscript/status.svg)](https://david-dm.org/tripu/superscript)
[![devDependencies Status](https://david-dm.org/tripu/superscript/dev-status.svg)](https://david-dm.org/tripu/superscript?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/tripu/superscript/badge.svg?branch=master)](https://coveralls.io/github/tripu/superscript?branch=master)
[![Inline docs](https://inch-ci.org/github/tripu/superscript.svg?branch=master)](https://inch-ci.org/github/tripu/superscript)

**Contents:**

1. [Installation](#1-installation)
1. [Documentation](#2-documentation)
1. [Coming soon](#3-coming-soon)
1. [Contributing](#4-contributing)
1. [Credits](#5-credits)

## 1. Installation

### On the browser

Any of these should work:

* Download [the *browserified* version from GitHub](https://raw.githubusercontent.com/tripu/superscript/master/superscript.js) and load it:  
  `<script src="superscript.js"></script>`
* Load it via [jsDelivr](https://www.jsdelivr.com/):  
  `<script src="https://cdn.jsdelivr.net/npm/supers/superscript.js"></script>`
* Load it via [Unpkg](https://unpkg.com/):  
`<script src="https://unpkg.com/supers/superscript.js"></script>`

### On Node.js

```bash
$ npm i supers
```

```javascript
const superscript = require('supers');
```

## 2. Documentation

### Functions

* [hold()](#hold)
* [debounce()](#debounce)
* [Palette()](#Palette)

<a name="hold"></a>

### hold()
Invoke callback `cb` once with optional parameters `args` as soon as condition `check` is `true`, checking every `interval` *ms*
(by default, *60 Hz ≈ 16.67 ms*).

**Kind**: global function  
**Example**  
```js
superscript.hold(check, cb, interval, ...args)
```
<a name="debounce"></a>

### debounce()
https://davidwalsh.name/javascript-debounce-function

**Kind**: global function  
<a name="Palette"></a>

### Palette()
Create a palette of `n` evenly-distributed colours (*n ≥ 2*).

&#9758; [Demo](https://codepen.io/tripu/full/JEMBoN)

Invoke <code>get(i)</code> on the resulting object to retrieve the <em>i<sup>th</sup></em> colour in the palette (<em>0 ≥ i < n</em>):
<code>get(i, rbg = false)</code>

Default options:

```json
{
  "shuffle": false,
  "shades": "auto",
  "greys": "auto",
  "blackAndWhite": false
}
```

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

**Kind**: global function  
**Example**  
```js
new superscript.Palette(n[, opts])
```

## 3. Coming soon

* `cache()`
* `throttle()`
* `debounce()` (based on [David Walsh' code](https://davidwalsh.name/javascript-debounce-function))

## 4. Contributing

```bash
npm clone https://github.com/tripu/superscript.git
cd superscript
npm i && npm run build
```

## 5. Credits

Copyright &copy; 2017&ndash;2018 tripu ([`t@tripu.info`](mailto:t@tripu.info), [`https://tripu.info`](https://tripu.info/)).

This project is licenced [under the terms of the MIT licence](https://github.com/tripu/superscript/blob/master/LICENSE.md).
