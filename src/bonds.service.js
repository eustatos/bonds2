async function getBondsData({ date, isins }, cache) {
  const cachedData = getCacheData(
    {
      date: date,
      isins: isins,
    },
    cache
  );
  const nonCachedData = await request({
    date: date,
    isins: getNonCachedIsinsArray({ date, isins }, cache),
  });
  cache = addToCache(date, nonCachedData, cache);
  return [...cachedData, ...nonCachedData];
}

//@TODO: объединить с созданием кэша
function getNonCachedIsinsArray({ date, isins }, cache) {
  const result = isins.reduce((acc, isin) => {
    if (!cache[isin]) {
      acc.push(isin);
    } else {
      if (!cache[isin][date]) {
        acc.push(isin);
      }
    }
    return acc;
  }, []);
  return result;
}

function getCacheData({ date, isins }, cache) {
  return searchData(cache, { date: date, isins: isins });
}

function addToCache(date, nonCachedData, cache) {
  nonCachedData.reduce((acc, item) => {
    const isin = item.isin;
    if (!acc[isin]) {
      acc[isin] = {};
    }
    acc[isin][date] = {
      data: `cached${item.data}`,
    };
    return acc;
  }, cache);
  return cache;
}

function request({ date, isins }) {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(makeRequest({ date, isins }));
    }, 0);
  });
  return promise;
}

function searchData(data, { date, isins }) {
  const result = [];
  isins.reduce((acc, isin) => {
    const actualIsin = data[isin];
    if (actualIsin) {
      const dataFromDate = actualIsin[date];
      if (dataFromDate) {
        acc.push({
          isin: isin,
          data: dataFromDate.data,
        });
      }
    }
    return acc;
  }, result);
  return result;
}

function makeRequest({ date, isins }) {
  const mockData = getMockData();
  return searchData(mockData, { date: date, isins: isins });
}

function getMockData() {
  const isins = [
    'XS0971721963',
    'XS0971721964',
    'XS0971721965',
    'XS0971721966',
  ];
  const date = [
    '20200101',
    '20200102',
    '20200103',
    '20200104',
    '20200105',
    '20200106',
    '20200107',
    '20200108',
    '20200109',
    '20200110',
  ];
  const mockData = {};
  isins.forEach((isin) => {
    mockData[isin] = {};
    date.forEach((date) => {
      mockData[isin][date] = { data: 'nocached' };
    });
  });
  return mockData;
}

export { makeRequest, request, getBondsData, getMockData };
