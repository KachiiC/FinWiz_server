import { jest, test, expect } from '@jest/globals'
import { prismaMock } from '../../singleton'
import * as stockHelpers from '../stock.helpers'

test('should find unique single stock from symbol ', async () => {
  const appleStock = {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc',
    marketValuePerShare: 200
  }

  prismaMock.singleStock.findUnique.mockResolvedValue(appleStock)
  await expect(stockHelpers.stockFinder('AAPL')).resolves.toEqual({
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc',
    marketValuePerShare: 200
  })
})

test('should create a stock if it does not exist ', async () => {
  const appleStock = {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc',
    marketValuePerShare: 200
  }

  const appleData = { AAPL: { quote: { latestPrice: 200 } } }
  jest.spyOn(stockHelpers, 'stockApiFormatter').mockReturnValue({ symbol: 'AAPL', name: 'Apple Inc', marketValuePerShare: 200 })
  prismaMock.singleStock.findUnique.mockResolvedValue(null)
  prismaMock.singleStock.create.mockResolvedValue(appleStock)
  await expect(stockHelpers.stockUpdateOrCreate('AAPL', { data: appleData })).resolves.toEqual(appleStock)
})
