export const iexApiStockQuotes = (stockList: string) => {
  return `https://cloud.iexapis.com/stable/stock/market/batch?types=quote&token=${process.env.STOCK_KEY}&symbols=${stockList}`
}

export const iexApiStockList = (stockList: string) => {
  return `https://cloud.iexapis.com/stable/stock/market/list/${stockList}/?token=${process.env.STOCK_KEY}&listLimit=20`
}

export const cryptoUrl = (cryptoList: string) => {
  return `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cryptoList}`
}

export const cryptoSymbolUrl = (cryptoList: string) => {
  return `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cryptoList}`
}

export const newsUrl = () => `https://newsapi.org/v2/top-headlines?country=gb&category=business&apiKey=${process.env.NEWS_KEY}&totalResults=25`

export const userNewsUrl = (topics: string) => `https://newsapi.org/v2/everything?q=${topics}&apiKey=${process.env.NEWS_KEY}`
