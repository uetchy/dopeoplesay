/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as lib from '../lib'
import nockHelper from './helpers/nock'

let cleaner: () => void

beforeEach(() => {
  cleaner = nockHelper()
})

afterEach(() => {
  cleaner()
})

test('makeURL', () => {
  const url = lib.makeURL('a b')
  expect(url).toBe('https://dopeoplesay.com/q/a%20b')
})

test('fetchDOM', async () => {
  const dom = await lib.fetchDOM('test')
  expect(dom).toHaveProperty('window')
})

test('parse', async () => {
  const dom = await lib.fetchDOM('test')
  const result = await lib.parse(dom, { trimLine: true, color: true })
  expect(Object.keys(result)).toEqual(['definitions', 'collocations'])
})
