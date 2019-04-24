#!/usr/bin/env node

import chalk from 'chalk'
import ora from 'ora'
import yargs from 'yargs'
import { consoleJSON, fetchDOM, head, hr, info, makeURL, parse } from './lib'

interface IArgs {
  [x: string]: any
  $0: string
  json: boolean
  trim: boolean
  _: string[]
}

async function main(args: IArgs) {
  const query = args._.join(' ')
  const jsonOutputMode = args.json
  const trimLineMode = args.trim

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
    color: !jsonOutputMode,
    trimLine: trimLineMode,
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
      // tslint:disable-next-line: no-console
      console.log(
        chalk.red(
          `${chalk.underline(term.label!)}${
            term.pos ? ' (' + term.pos + ')' : ''
          } from ${term.source}`
        )
      )
      for (const def of term.definitions) {
        // tslint:disable-next-line: no-console
        console.log(chalk.italic(' →', def!.replace(/\n/g, '\n  ')))
      }
    }
    hr()
  }

  head('Collocations')
  collocations.forEach((item, index) => {
    // tslint:disable-next-line: no-console
    console.log(`${chalk.gray(String(index + 1).padStart(2))} ${item}`)
  })

  info(`\nSee more at ${makeURL(query)}`)
}

function errorHandler(error: string, jsonOutput: boolean) {
  if (jsonOutput) {
    consoleJSON({ error })
  } else {
    spinner.fail(error)
  }
}

const spinner = ora()
const argv: IArgs = yargs
  .option('$0', { required: true, demandOption: true })
  .option('json', { alias: 'j', boolean: true, default: false })
  .option('trim', { alias: 't', boolean: true, default: true })
  .demandOption(['$0'])
  .help()
  .fail((msg, err) => errorHandler(msg || err.message, argv.json)).argv

main(argv).catch((err) => errorHandler(err.message, argv.json))
