export const iexApiStockQuotes = (stock_list: string) => {
    return `https://cloud.iexapis.com/stable/stock/market/batch?types=quote&token=${process.env.STOCK_KEY}&symbols=${stock_list}`
}

export const iexApiStockList = (stock_list: string) => {
    return `https://cloud.iexapis.com/stable/stock/market/list/${stock_list}/?token=${process.env.STOCK_KEY}&listLimit=20`
}

export const cryptoUrl = (crypto_list: string) => {
    return `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto_list}`
} 

export const cryptoSymbolUrl = (crypto_list: string) => {
    return `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto_list}`
} 

export const newsUrl = () => `https://newsapi.org/v2/top-headlines?country=gb&category=business&apiKey=${process.env.NEWS_KEY}&totalResults=25`

export const userNewsUrl = (topics: string) => `https://newsapi.org/v2/everything?q=${topics}&apiKey=${process.env.NEWS_KEY}`