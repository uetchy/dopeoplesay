#!/usr/bin/env node

const fetch = require('node-fetch')
const chalk = require('chalk')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

async function searchForCollocation(queryString) {
  const url = 'https://dopeoplesay.com/q/' + encodeURIComponent(queryString)
  const res = await fetch(url)
  const html = await res.text()
  return new JSDOM(html)
}

function info(text) {
  console.log(chalk.yellow(text))
}

async function main() {
  const query = process.argv.slice(2).join(' ')
  info(`Querying for '${query}' ...\n`)

  const dom = await searchForCollocation(query)
  const documet = dom.window.document

  // Metadata
  const matchedCount = documet.querySelector('.match-counter > span')
    .textContent

  // Dictionary
  const terms = Array.from(
    documet.querySelectorAll('#dictionary > div > .term')
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

  // Mapping all collocation
  const collocations = Array.from(
    documet.querySelectorAll('.hits > div > p.mb-4')
  ).map(item => {
    const matchedContent = item.querySelector('.match-content')
    const highlight = matchedContent.innerHTML.replace(
      /<em.+?>(.+?)<\/em>/g,
      chalk.yellow.bold('$1')
    )
    return highlight
  })

  // Showing result
  // info(`Found ${matchedCount} records for '${query}'`)
  // console.log('\n')
  for (const term of terms) {
    console.log(
      chalk.red(
        `${chalk.underline(term.label)}${
          term.pos ? ' (' + term.pos + ')' : ''
        } from ${chalk.italic(term.source)}`
      )
    )
    for (const def of term.definitions) {
      console.log('•', def.replace(/\n/g, '\n  '))
    }
    console.log()
  }

  console.log()
  for (const col of collocations) {
    console.log(col)
  }

  return 0
}

main().catch(err => {
  console.error(err)
})
