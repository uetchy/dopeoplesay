/* eslint no-console: 0 */
import chalk from 'chalk'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

interface DictionaryItem {
  definitions: string[]
  label: string
  pos: string
  source: string
}

type CollocationResponse = string[]

interface Response {
  definitions: DictionaryItem[]
  collocations: CollocationResponse
}

export function consoleJSON(obj: unknown): void {
  console.log(JSON.stringify(obj, null, 2))
}

export function info(text: string): void {
  console.log(chalk.yellow(text))
}

export function head(text: string): void {
  console.log(chalk.bold.blue(`[${text.toUpperCase()}]`))
}

export function hr(): void {
  console.log()
}

export function makeURL(queryString: string): string {
  return 'https://dopeoplesay.com/q/' + encodeURIComponent(queryString)
}

export async function fetchDOM(queryString: string): Promise<JSDOM> {
  const url = makeURL(queryString)
  const res = await fetch(url)
  const html = await res.text()
  return new JSDOM(html)
}

export function parse(
  dom: JSDOM,
  { trimLine = true, color = true } = {}
): Response {
  const { document } = dom.window
  const matchedCounter = document.querySelector('.match-counter > span')
  if (!matchedCounter) {
    throw new Error('No search result found')
  }
  // Dictionary
  const definitions = Array.from(
    document.querySelectorAll<HTMLDivElement>('#dictionary > div > .term')
  ).map(
    (item: HTMLDivElement): DictionaryItem => {
      const label =
        item.querySelector<HTMLElement>('h6 > em')!.textContent || ''
      const posElem = item.querySelector('h6 > .term-pos')
      const pos = posElem ? posElem.textContent!.replace(/[()]/g, '') : ''
      // tslint:disable-next-line: no-shadowed-variable
      const definitions = Array.from(item.querySelectorAll('li')).map(
        (def): string => def.textContent || ''
      )
      const source = item.querySelector('small > i > a')!.textContent || ''
      return {
        definitions,
        label,
        pos,
        source,
      }
    }
  )
  // Collocations
  const collocations = Array.from(
    document.querySelectorAll('.hits > div > p.mb-4')
  ).map(
    (item): string => {
      let matchedContent = item.querySelector('.match-content')!.innerHTML
      if (trimLine) {
        matchedContent = matchedContent.match(
          /((?:[^\s]+[,.]?\s?){0,4}<.+>(?:[,.]?\s?[^\s]+){0,4})/m
        )![0]
      }
      const highlightedText = matchedContent.replace(
        /<em.+?>(.+?)<\/em>/g,
        color ? chalk.yellow.bold('$1') : '$1'
      )
      return highlightedText
    }
  )
  return { definitions, collocations }
}
