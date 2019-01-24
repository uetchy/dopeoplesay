import { stdout } from 'test-console'
import * as lib from '../lib/lib'

test('makeURL', () => {
  expect(lib.makeURL('a b')).toBe('https://dopeoplesay.com/q/a%20b')
})
