# dopeoplesay-cli

[![Build Status](https://travis-ci.org/uetchy/dopeoplesay-cli.svg?branch=master)](https://travis-ci.org/uetchy/dopeoplesay-cli)
[![Coverage Status](https://coveralls.io/repos/github/uetchy/dopeoplesay-cli/badge.svg?branch=master)](https://coveralls.io/github/uetchy/dopeoplesay-cli?branch=master)

A command-line interface for [Do People Say it](https://dopeoplesay.com).

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
