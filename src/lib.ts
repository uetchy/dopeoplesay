import fetch from 'node-fetch'
import chalk from 'chalk'
import { JSDOM } from 'jsdom'

export function consoleJSON(obj: any) {
  console.log(JSON.stringify(obj, null, 2))
}

export function info(text: string) {
  console.log(chalk.yellow(text))
}

export function head(text: string) {
  console.log(chalk.bold.blue(`[${text.toUpperCase()}]`))
}

export function hr() {
  console.log()
}

export function makeURL(queryString: string) {
  return 'https://dopeoplesay.com/q/' + encodeURIComponent(queryString)
}

export async function fetchDOM(queryString: string) {
  const url = makeURL(queryString)
  const res = await fetch(url)
  const html = await res.text()
  return new JSDOM(html)
}

export function parse(dom: JSDOM, { trimLine = true, color = true } = {}) {
  const { document } = dom.window
  const matchedCounter = document.querySelector('.match-counter > span')
  if (!matchedCounter) {
    throw new Error('No search result found')
  }
  // Dictionary
  const definitions = Array.from(
    document.querySelectorAll('#dictionary > div > .term')
  ).map((item) => {
    const label = item.querySelector('h6 > em')!.textContent
    const posElem = item.querySelector('h6 > .term-pos')
    const pos = posElem ? posElem.textContent!.replace(/[\(\)]/g, '') : ''
    const definitions = Array.from(item.querySelectorAll('li')).map(
      (def) => def.textContent
    )
    const source = item.querySelector('small > i > a')!.textContent
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
  ).map((item) => {
    let matchedContent = item.querySelector('.match-content')!.innerHTML
    if (trimLine) {
      matchedContent = matchedContent.match(
        /((?:[^\s]+[\,\.]?\s?){0,4}<.+>(?:[\,\.]?\s?[^\s]+){0,4})/m
      )![0]
    }
    const highlightedText = matchedContent.replace(
      /<em.+?>(.+?)<\/em>/g,
      color ? chalk.yellow.bold('$1') : '$1'
    )
    return highlightedText
  })
  return { definitions, collocations }
}