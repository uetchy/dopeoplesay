import rewire from 'rewire';
import nockHelper from './helpers/nock';

const module = rewire('../../lib');

let cleaner: () => void;

beforeEach(() => {
  cleaner = nockHelper();
});

afterEach(() => {
  cleaner();
});

test('makeURL', () => {
  const url = module.__get__('makeURL')('a b');
  expect(url).toBe('https://dopeoplesay.com/q/a%20b');
});

test('fetchDOM', async () => {
  const dom = await module.__get__('fetchDOM')('test');
  expect(dom).toHaveProperty('window');
});

test('parse', async () => {
  const dom = await module.__get__('fetchDOM')('test');
  const result = await module.__get__('parse')(dom, {
    trimLine: true,
    color: true,
  });
  expect(Object.keys(result)).toEqual(['definitions', 'collocations']);
});
