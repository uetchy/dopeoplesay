# dopeoplesay

[![dopeoplesay npm badge)](https://img.shields.io/npm/v/dopeoplesay.svg)](https://npmjs.com/package/dopeoplesay)
[![npm: total downloads](https://badgen.net/npm/dt/dopeoplesay)](https://npmjs.com/package/dopeoplesay)
[![Build Status](https://travis-ci.org/uetchy/dopeoplesay.svg?branch=master)](https://travis-ci.org/uetchy/dopeoplesay)
[![Coverage Status](https://coveralls.io/repos/github/uetchy/dopeoplesay/badge.svg?branch=master)](https://coveralls.io/github/uetchy/dopeoplesay?branch=master)

Node.js wrapper for [Do People Say it](https://dopeoplesay.com).

## Usage

```
yarn add dopeoplesay
npm install dopeoplesay
```

then:

```js
const {search} = require('dopeoplesay');

async function main() {
  const {definitions, collocations} = await search(dom, {
    trim: true,
    color: false,
  });
  console.log(collocations);
}
```

```jsonc
{
  "definitions": [
    {
      "label": "epic fail",
      "pos": "noun",
      "definitions": [
        "Utter, total failure, especially where success should have been reasonably expected."
      ],
      "source": "Wiktionary"
    },
    ...
  ],
  "collocations": [
    "Bravo, bravo on the epic fail!",
    "So, that's an epic fail then?",
    "Not giving myself an epic fail for going wheat on",
    ...
  ]
}
```
