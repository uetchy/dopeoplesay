import nock from 'nock';
import {resolve} from 'path';

export default function declareMockScope(): () => void {
  nock.disableNetConnect();

  nock('https://dopeoplesay.com')
    .get(/\/q\/+/)
    .replyWithFile(200, resolve(__dirname, '../fixtures/search-test.txt'));

  return function cleanAll(): void {
    nock.cleanAll();
    nock.enableNetConnect();
  };
}
