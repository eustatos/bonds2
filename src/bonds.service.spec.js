import {
  getBondsData,
  getMockData,
  makeRequest,
  request,
} from './bonds.service';

test('test getMockData', async () => {
  const mockData = getMockData();
  expect(Object.keys(mockData).length).toBe(4);
  expect(Object.keys(mockData['XS0971721963']).length).toBe(10);
});

test('test makeRequest', () => {
  const data = makeRequest({
    date: '20200101',
    isins: ['XS0971721963', 'XS0971721964'],
  });
  expect(data).toStrictEqual([
    {
      isin: 'XS0971721963',
      data: 'nocached',
    },
    {
      isin: 'XS0971721964',
      data: 'nocached',
    },
  ]);
});

test('test request', async () => {
  const data = await request({
    date: '20200101',
    isins: ['XS0971721963', 'XS0971721964'],
  });
  expect(data).toStrictEqual([
    {
      isin: 'XS0971721963',
      data: 'nocached',
    },
    {
      isin: 'XS0971721964',
      data: 'nocached',
    },
  ]);
});

test('test caching', async () => {
  let cache = {};
  let data = await getBondsData(
    {
      date: '20200101',
      isins: ['XS0971721964'],
    },
    cache
  );
  expect(data[0].data).toBe('nocached');
  data = await getBondsData(
    {
      date: '20200101',
      isins: ['XS0971721964', 'XS0971721965'],
    },
    cache
  );
  expect(data[0].data).toBe('cachednocached');
  expect(data[1].data).toBe('nocached');
  data = await getBondsData(
    {
      date: '20200102',
      isins: ['XS0971721964'],
    },
    cache
  );
  expect(data[0].data).toBe('nocached');
  data = await getBondsData(
    {
      date: '20200102',
      isins: ['XS0971721964'],
    },
    cache
  );
  expect(data[0].data).toBe('cachednocached');
});
