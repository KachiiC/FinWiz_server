export const iexApiStockQuotes = (stock_list:string) => {
    return `https://cloud.iexapis.com/stable/stock/market/batch?types=quote&token=${process.env.STOCK_KEY}&symbols=${stock_list}`
}

export const iexApiStockList = (stock_list:string) => {
    return `https://cloud.iexapis.com/stable/stock/market/list/${stock_list}/?token=${process.env.STOCK_KEY}`
}

export const cryptoUrl = (crypto_list: string) => {
    return `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=${crypto_list}`
} 