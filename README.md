[![npm version](https://img.shields.io/npm/v/@danieldietrich/async-memoize-file-store?logo=npm&style=flat-square)](https://www.npmjs.com/package/@danieldietrich/async-memoize-file-store/)[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@danieldietrich/async-memoize-file-store?style=flat-square)](https://snyk.io/test/npm/@danieldietrich/async-memoize-file-store)[![minzipped size](https://img.shields.io/bundlephobia/minzip/@danieldietrich/async-memoize-file-store?style=flat-square)](https://bundlephobia.com/result?p=@danieldietrich/async-memoize-file-store@latest)
&nbsp;
[![build](https://img.shields.io/travis/danieldietrich/async-memoize-file-store?logo=github&style=flat-square)](https://travis-ci.org/danieldietrich/async-memoize-file-store/)[![coverage](https://img.shields.io/codecov/c/github/danieldietrich/async-memoize-file-store?style=flat-square)](https://codecov.io/gh/danieldietrich/async-memoize-file-store/)
&nbsp;
![Platform](https://img.shields.io/badge/platform-Node%20v10%20%28ES6%2fES2015%29-decc47?logo=TypeScript&style=flat-square)
&nbsp;
[![donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal&style=flat-square)](https://paypal.me/danieldietrich13)[![patrons](https://img.shields.io/liberapay/patrons/danieldietrich?style=flat-square)](https://liberapay.com/danieldietrich/)[![license](https://img.shields.io/github/license/danieldietrich/async-memoize-file-store?style=flat-square)](https://opensource.org/licenses/MIT/)
&nbsp;
[![Follow](https://img.shields.io/twitter/follow/danieldietrich?label=Follow&style=social)](https://twitter.com/danieldietrich/)

# async-memoize-file-store

Filesystem store for the [async-memoize](https://www.npmjs.com/package/@danieldietrich/async-memoize) module.

## Installation

```bash
npm i @danieldietrich/async-memoize-file-store
```

## Usage

The module supports ES6 _import_ and CommonJS _require_ style.

```ts
import memoize from '@danieldietrich/async-memoize';
import fileStore from '@danieldietrich/async-memoize-file-store';

// an arbitrary function
declare function fn(i: number, s: string, b: boolean): Promise<string>;

async function example1() {
    const cacheFor = fileStore();
    // creates a cache directory `.file-store/` in the module directory
    const cache = cacheFor('my-module.my-function');
    const memoized = memoize(fn, cache);
    const result = memoized(1, 'a', true);
}

async function example2() {
    const cacheFor = fileStore('my/path/.cache');
    // creates a cache directory `my/path/.cache`
    const cache = cacheFor('my-module.my-function');
    const memoized = memoize(fn, cache);
    const result = memoized(1, 'a', true);
}
```

---

Copyright &copy; 2019 by [Daniel Dietrich](cafebab3@gmail.com). Released under the [MIT](https://opensource.org/licenses/MIT/) license.