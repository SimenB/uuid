/* global browser:false, $:false, $$:false */

const v1Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const v4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const v6Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-6[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const v7Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-7[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const V1_ID = 'f1207660-21d2-11ef-8c4f-419efbd44d48';
const V6_ID = '1ef21d2f-1207-6660-8c4f-419efbd44d48';

const v1 = (result) => expect(result).toMatch(v1Regex);
const v4 = (result) => expect(result).toMatch(v4Regex);
const v6 = (result) => expect(result).toMatch(v6Regex);
const v7 = (result) => expect(result).toMatch(v7Regex);
const v3dns = (result) => expect(result).toBe('9125a8dc-52ee-365b-a5aa-81b0b3681cf6');
const v3url = (result) => expect(result).toBe('c6235813-3ba4-3801-ae84-e0a6ebb7d138');
const v3custom = (result) => expect(result).toBe('f5a52d34-dcd7-30f7-b581-0112fab43d0c');
const v5dns = (result) => expect(result).toBe('fdda765f-fc57-5604-a269-52a7df8164ec');
const v5url = (result) => expect(result).toBe('3bbcee75-cecc-5b56-8031-b6641c1ed1f1');
const v5custom = (result) => expect(result).toBe('c49c5142-4d9a-5940-a926-612ede0ec632');

const v1ToV6 = (result) => expect(result).toBe(V6_ID);
const v6ToV1 = (result) => expect(result).toBe(V1_ID);

const nil = (result) => expect(result).toBe('00000000-0000-0000-0000-000000000000');
const max = (result) => expect(result).toBe('ffffffff-ffff-ffff-ffff-ffffffffffff');
const parse = (result) =>
  expect(result).toEqual('85,35,141,21,201,38,69,152,180,157,207,78,145,59,161,60');
const stringify = (result) => expect(result).toBe('55238d15-c926-4598-b49d-cf4e913ba13c');
const validate = (result) => expect(result).toBe('true');
const version = (result) => expect(result).toBe('4');

const expectations = {
  'uuidv1()': v1,
  'uuidv4()': v4,
  'uuidv7()': v7,
  'uuidv3() DNS': v3dns,
  'uuidv3() URL': v3url,
  'uuidv3() MY_NAMESPACE': v3custom,
  'uuidv5() DNS': v5dns,
  'uuidv5() URL': v5url,
  'uuidv5() MY_NAMESPACE': v5custom,
  'uuidv6()': v6,

  'uuidv1ToV6()': v1ToV6,
  'uuidv6ToV1()': v6ToV1,

  NIL_UUID: nil,
  MAX_UUID: max,
  'uuidParse()': parse,
  'uuidStringify()': stringify,
  'uuidValidate()': validate,
  'uuidVersion()': version,

  'uuid.v1()': v1,
  'uuid.v4()': v4,
  'uuid.v7()': v7,
  'uuid.v3() DNS': v3dns,
  'uuid.v3() URL': v3url,
  'uuid.v3() MY_NAMESPACE': v3custom,
  'uuid.v5() DNS': v5dns,
  'uuid.v5() URL': v5url,
  'uuid.v5() MY_NAMESPACE': v5custom,
  'uuid.v6()': v6,

  'uuid.v1ToV6()': v1ToV6,
  'uuid.v6ToV1()': v6ToV1,

  'uuid.NIL': nil,
  'uuid.MAX': max,
  'uuid.parse()': parse,
  'uuid.stringify()': stringify,
  'uuid.validate()': validate,
  'uuid.version()': version,
};
const expectationTitles = Object.keys(expectations);

const PORT = 9000;

describe('BrowserStack Local Testing', () => {
  async function testExpectations(path, titleFilter) {
    const url = `http://127.0.0.1:${PORT}/${path}`;
    await browser.url(url);

    await browser.waitUntil(async () => $('#done').isExisting(), 30000);

    const elements = await $$('.test_result');

    // Unfortunately the WebDriver API is not thread safe and we cannot use Promise.all() to
    // query it in parallel:
    // https://github.com/SeleniumHQ/selenium/issues/422#issuecomment-90629726
    const titles = [];

    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      const titleEl = await element.$('dt');
      const title = await titleEl.getText();
      const resultEl = await element.$('dd');
      const result = await resultEl.getText();

      if (!expectations[title]) {
        throw new Error(`Unexpected title: ${title}`);
      }

      expectations[title](result);
      titles.push(title);
    }

    // Confirm the expected titles are all present
    const expectedTitles = expectationTitles.filter(titleFilter);
    expect(titles.length).toEqual(expectedTitles.length);
    expect(titles.sort()).toEqual(expectedTitles.sort());
  }

  describe('webpack', () => {
    it('renders all', async () => testExpectations('browser-webpack/example-all.html', () => true));

    it('renders v1 only', async () =>
      testExpectations('browser-webpack/example-v1.html', (title) => title.includes('uuidv1()')));

    it('renders v4 only', async () =>
      testExpectations('browser-webpack/example-v4.html', (title) => title.includes('uuidv4()')));
  });

  describe('rollup', () => {
    it('renders all', async () => testExpectations('browser-rollup/example-all.html', () => true));

    it('renders v1 only', async () =>
      testExpectations('browser-rollup/example-v1.html', (title) => title.includes('uuidv1()')));

    it('renders v4 only', async () =>
      testExpectations('browser-rollup/example-v4.html', (title) => title.includes('uuidv4(')));
  });
});
