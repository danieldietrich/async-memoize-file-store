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

A file store is used in conjunction with the npm module [@danieldietrich/async-memoize](https://www.npmjs.com/package/@danieldietrich/async-memoize).

```ts
import memoize from '@danieldietrich/async-memoize';
import fileStore from '@danieldietrich/async-memoize-file-store';
```

A file store is bound to a specific directory. By default it is `path.join(__dirname, '.file-store'))`.

```ts
const storeFactory = fileStore();
```

Optionally, the store directory can be changed to a different location. Please note that the parent directory is required to already exist.

```ts
const storeFactory = fileStore('/tmp/.my-cache');
```

A file store is used in conjunction with function memoization. For each function that is memoized, we need a unique id. Valid id characters are `a-z A-Z 0-9 - . _ ~ ! $ & ' ( ) + , ; = @`. Invalid characters will be replaced with dash `-`. Please use only valid characters, otherwise it might lead to name collisions.

```ts
const store = storeFactory('my-module.my-function');
```

Once we created a file store instance, we can start to memoize function calls.

```ts
// example
function myFunction(a: number, b: string, c: boolean): string[] { return []; }

// typesafe, memoized version of myFunction
const mem = memoize(myFunction, store);

// result is written to the file store and returned
const res = mem(1, 'ok', true);
```

---

Copyright &copy; 2019 by [Daniel Dietrich](cafebab3@gmail.com). Released under the [MIT](https://opensource.org/licenses/MIT/) license.