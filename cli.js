#!/usr/bin/env node

const fetch = require('node-fetch')
const ora = require('ora')
const chalk = require('chalk')
const { JSDOM } = require('jsdom')

const spinner = ora()

function info(text) {
  console.log(chalk.yellow(text))
}

function head(text) {
  console.log(chalk.bold.blue(`[${text.toUpperCase()}]`))
}

function hr() {
  console.log()
}

function makeURL(queryString) {
  return 'https://dopeoplesay.com/q/' + encodeURIComponent(queryString)
}

async function fetchDOM(queryString) {
  const url = makeURL(queryString)
  const res = await fetch(url)
  const html = await res.text()
  return new JSDOM(html)
}

function parse(dom, trimLine = true) {
  const { document } = dom.window

  const matchedCounter = document.querySelector('.match-counter > span')
  if (!matchedCounter) {
    throw new Error('No search result found')
  }

  // Dictionary
  const definitions = Array.from(
    document.querySelectorAll('#dictionary > div > .term')
  ).map(item => {
    const label = item.querySelector('h6 > em').textContent
    const posElem = item.querySelector('h6 > .term-pos')
    const pos = posElem ? posElem.textContent.replace(/[\(\)]/g, '') : ''
    const definitions = Array.from(item.querySelectorAll('li')).map(
      def => def.textContent
    )
    const source = item.querySelector('small > i > a').textContent
    return {
      label,
      pos,
      definitions,
      source,
    }
  })

  // Collocations
  const collocations = Array.from(
    document.querySelectorAll('.hits > div > p.mb-4')
  ).map(item => {
    let matchedContent = item.querySelector('.match-content').innerHTML
    if (trimLine) {
      matchedContent = matchedContent.match(
        /((?:[^\s]+[\,\.]?\s?){0,4}<.+>(?:[\,\.]?\s?[^\s]+){0,4})/m
      )[0]
    }
    const highlightedText = matchedContent.replace(
      /<em.+?>(.+?)<\/em>/g,
      chalk.yellow.bold('$1')
    )
    return highlightedText
  })

  return { definitions, collocations }
}

async function main() {
  const query = process.argv.slice(2).join(' ')
  const trimLine = true

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
        chalk.red(
          `${chalk.underline(term.label)}${
            term.pos ? ' (' + term.pos + ')' : ''
          } from ${term.source}`
        )
      )
      for (const def of term.definitions) {
        console.log(chalk.italic(' →', def.replace(/\n/g, '\n  ')))
      }
    }
    hr()
  }

  head('Collocations')
  collocations.forEach((item, index) => {
    console.log(`${chalk.gray(String(index + 1).padStart(2))} ${item}`)
  })

  info(`\nSee more at ${makeURL(query)}`)
}

main().catch(err => spinner.fail(err))
