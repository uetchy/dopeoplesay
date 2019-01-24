#!/usr/bin/env node

import ora from 'ora'
import { red, underline, italic, gray } from 'chalk'
import { fetchDOM, parse, hr, head, info, makeURL } from './lib'

const spinner = ora()

async function main() {
  const query = process.argv.slice(2).join(' ')
  const trimLine = true

  if (!query) {
    info('No query provided')
    process.exit()
  }

  spinner.text = `Querying for '${query}'`
  spinner.start()

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
  const { definitions, collocations } = parse(dom, trimLine)

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

main().catch(err => spinner.fail(err))
