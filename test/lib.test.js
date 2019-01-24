import { stdout } from 'test-console'
import * as lib from '../src/lib'

test('makeURL', () => {
  expect(lib.makeURL('a b')).toBe('https://dopeoplesay.com/q/a%20b')
})
