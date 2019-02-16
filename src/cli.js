#!/usr/bin/env node

import ora from 'ora'
import { red, underline, italic, gray } from 'chalk'
import { fetchDOM, parse, hr, head, info, makeURL, consoleJSON } from './lib'

const spinner = ora()

async function main(argv) {
  const query = argv._.join(' ')
  const jsonOutputMode = argv.json
  const trimLineMode = true

  if (!query) {
    throw new Error('No query provided. Try $ dps [--json] <query>')
  }

  if (!jsonOutputMode) {
    spinner.text = `Querying for '${query}'`
    spinner.start()
  }

  let dom
  try {
    dom = await fetchDOM(query)
  } catch (err) {
    switch (err.code) {
      case 'ENOTFOUND':
        throw new Error(
          'Your request has been failed maybe due to network lost. Try it again.'
        )
      default:
        throw new Error(err.message)
    }
  }
  const { definitions, collocations } = parse(dom, {
    trimLine: trimLineMode,
    color: !jsonOutputMode,
  })

  if (jsonOutputMode) {
    return consoleJSON({ definitions, collocations })
  }

  spinner.succeed()
  hr()

  // Showing result
  if (definitions.length > 0) {
    head('Dictionary')
    for (const term of definitions) {
      console.log(
        red(
          `${underline(term.label)}${
            term.pos ? ' (' + term.pos + ')' : ''
          } from ${term.source}`
        )
      )
      for (const def of term.definitions) {
        console.log(italic(' →', def.replace(/\n/g, '\n  ')))
      }
    }
    hr()
  }

  head('Collocations')
  collocations.forEach((item, index) => {
    console.log(`${gray(String(index + 1).padStart(2))} ${item}`)
  })

  info(`\nSee more at ${makeURL(query)}`)
}

const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['json'],
  alias: { j: 'json' },
})
main(argv).catch((err) =>
  argv.json ? consoleJSON({ error: err.message }) : spinner.fail(err)
)
