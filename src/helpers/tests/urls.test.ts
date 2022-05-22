import { test, expect } from '@jest/globals'
import { iexApiStockQuotes, iexApiStockList, cryptoUrl, cryptoSymbolUrl } from '../urls'

test('should return iexApiStockQuotes string', () => {
  const stockList = 'AAPL'
  const url = `https://cloud.iexapis.com/stable/stock/market/batch?types=quote&token=${process.env.STOCK_KEY}&symbols=${stockList}`
  expect(iexApiStockQuotes(stockList)).toEqual(url)
})

test('should return iexApiStockList string', () => {
  const stockList = 'AAPL'
  const url = `https://cloud.iexapis.com/stable/stock/market/list/${stockList}/?token=${process.env.STOCK_KEY}&listLimit=20`
  expect(iexApiStockList(stockList)).toEqual(url)
})

test('should return cryptoURL string', () => {
  const cryptoList = 'BTC,DOGE'
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cryptoList}`
  expect(cryptoUrl(cryptoList)).toEqual(url)
})

test('should return cyptoSymbolUrl string', () => {
  const symbol = 'BTC'
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`
  expect(cryptoSymbolUrl(symbol)).toEqual(url)
})
