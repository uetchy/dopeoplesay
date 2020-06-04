# dopeoplesay

Node.js wrapper for [Do People Say it](https://dopeoplesay.com).

## Usage

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
