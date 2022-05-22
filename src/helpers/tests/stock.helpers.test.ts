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
  // @ts-ignore
  prismaMock.singleStock.findUnique.mockResolvedValue(appleStock)
  await expect(stockHelpers.stockFinder('AAPL')).resolves.toEqual(appleStock)
})

test('should format the api data of stock ', () => {
  const appleStock = {
    symbol: 'AAPL',
    name: 'Apple Inc',
    marketValuePerShare: 200
  }
  const appleData = { AAPL: { quote: { latestPrice: 200, companyName: 'Apple Inc' } } }
  expect(stockHelpers.stockApiFormatter({ data: appleData }, 'AAPL')).toEqual(appleStock)
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
  // @ts-ignore
  prismaMock.singleStock.findUnique.mockResolvedValue(null)
  // @ts-ignore
  prismaMock.singleStock.create.mockResolvedValue(appleStock)
  await expect(stockHelpers.stockUpdateOrCreate('AAPL', { data: appleData })).resolves.toEqual(appleStock)
})

test('should update a stock if it exists ', async () => {
  const appleStock = {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc',
    marketValuePerShare: 200
  }

  const appleData = { AAPL: { quote: { latestPrice: 200 } } }
  jest.spyOn(stockHelpers, 'stockApiFormatter').mockReturnValue({ symbol: 'AAPL', name: 'Apple Inc', marketValuePerShare: 200 })
  // @ts-ignore
  prismaMock.singleStock.findUnique.mockResolvedValue(appleStock)
  // @ts-ignore
  prismaMock.singleStock.update.mockResolvedValue(appleStock)
  await expect(stockHelpers.stockUpdateOrCreate('AAPL', { data: appleData })).resolves.toEqual(appleStock)
})

test('should create a user stock if it does not exist', async () => {
  const mockReqBody =
    {
      sub: 'user',
      symbol: 'TSLA',
      buyCost: 170,
      date: new Date('2022-04-10T18:30:00.000Z'),
      quantity: 2
    }
  const mockUserStock =
    {
      sub: 'user',
      symbol: 'TSLA',
      entryValuePerShare: 170,
      numberOfShares: 2,
      totalValueOfShares: 340,
      firstBought: new Date('2022-04-10T18:30:00.000Z'),
      lastBought: new Date('2022-04-10T18:30:00.000Z')
    }
  // @ts-ignore
  prismaMock.userStock.findFirst.mockResolvedValue(null)
  // @ts-ignore
  prismaMock.userStock.create.mockResolvedValue(mockUserStock)
  await expect(stockHelpers.createUserStock(mockReqBody, 340)).resolves.toEqual(mockUserStock)
})

test('should update a user stock if it exists', async () => {
  const mockUserStock =
    {
      sub: 'user',
      symbol: 'TSLA',
      entryValuePerShare: 170,
      numberOfShares: 2,
      totalValueOfShares: 340,
      firstBought: new Date('2022-04-10T18:30:00.000Z'),
      lastBought: new Date('2022-04-10T18:30:00.000Z')
    }
  // @ts-ignore
  prismaMock.userStock.findFirst.mockResolvedValue(mockUserStock)
  // @ts-ignore
  prismaMock.userStock.updateMany.mockResolvedValue({ count: 1 })
  await expect(stockHelpers.updateUserStock('user', 'TSLA', 175, 1)).resolves.toEqual({ count: 1 })
})
