import nock from 'nock'
import { resolve } from 'path'

export default function declareMockScope(): () => void {
  nock.disableNetConnect()

  const scope = nock('https://dopeoplesay.com')
    .get(/\/q\/+/)
    .replyWithFile(200, resolve(__dirname, '../fixtures/search-test.txt'))

  return function cleanAll() {
    nock.cleanAll()
    nock.enableNetConnect()
  }
}
