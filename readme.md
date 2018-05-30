# tap-emitter [![Build Status](https://travis-ci.org/avajs/tap-emitter.svg?branch=master)](https://travis-ci.org/avajs/tap-emitter)

> My premium module

**This is pre-alpha code** - not ready for any practical use yet.


## Install

```
$ npm install --save tap-emitter
```


## Usage

```js
const tapEmitter = require('tap-emitter');

tapEmitter('unicorns');
//=> 'unicorns & rainbows'
```


## API

### tapEmitter(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## Dev

### Build commands

- `npm run tap` - Runs `node-tap` with some simple fixtures. Useful for checking how it's done in `node-tap`.
- `node index.js` - Spits out some fake tap data using this library. Useful for checking how this libraries output is displayed in multiple reporters.
- `npm run spec` - Runs `node index.js` and pipes it to the `spec` reporter from `tap-mocha-reporter`


## License

MIT © [James Talmage](https://github.com/jamestalmage)
