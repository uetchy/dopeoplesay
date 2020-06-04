# dopeoplesay

[![Build Status](https://travis-ci.com/uetchy/dopeoplesay.svg?branch=master)](https://travis-ci.com/uetchy/dopeoplesay)
[![Coverage Status](https://coveralls.io/repos/github/uetchy/dopeoplesay/badge.svg?branch=master)](https://coveralls.io/github/uetchy/dopeoplesay?branch=master)

Node.js bindings and a command-line app for [Do People Say it](https://dopeoplesay.com).

## Usage

```shell
npm install -g dopeoplesay-cli
```

You can call the CLI either from `dopeoplesay`, `dpsi` or `dps`:

```shell
dopeoplesay <keyword>
dopeoplesay sequel to
dopeoplesay extraordinary
dpsi sequel to
dpsi extraordinary
dps sequel to
dps extraordinary
```

### JSON output

Option `-j, --json` provides JSON output formatter.

```shell
dps --json epic fail
dps -j epic fail
```

You'll get a result like this:

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

This can be combined with various pipelines and workflows.

```shell
dps --json "epic fail" | jq ".collocations[0]" | pbcopy
```

### API

To gain access to Do People Say API, install `dopeoplesay-cli` locally.

```
yarn add dopeoplesay-cli
npm install dopeoplesay-cli
```

then:

```js
const {fetchDOM, parse} = require('dopeoplesay-cli');

async function main() {
  const dom = await fetchDOM(query);
  const {definitions, collocations} = parse(dom, {
    trimLine: true,
    color: false,
  });
  console.log(collocations);
}
```
