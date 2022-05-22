import { test, jest, expect } from '@jest/globals'
import { prismaMock } from '../../singleton'
import * as cryptoHelpers from '../crypto.helpers'

const BitCoin = {
  symbol: 'BTC',
  name: 'BitCoin',
  marketValuePerCrypto: 30000
}

const cryptoData = {
  BTC: {
    quote: {
      USD: { price: 30000 }
    },
    name: 'BitCoin'
  }
}

test('should find unique single crypto from symbol ', async () => {
  // @ts-ignore
  prismaMock.singleCrypto.findUnique.mockResolvedValue(BitCoin)
  await expect(cryptoHelpers.cryptoFinder('BTC')).resolves.toEqual(BitCoin)
})

test('should format the api data of crypto', () => {
  expect(cryptoHelpers.cryptoApiFormatter({ data: cryptoData }, 'BTC')).toEqual(BitCoin)
})

test('should create a crypto if it does not exist ', async () => {
  jest.spyOn(cryptoHelpers, 'cryptoApiFormatter').mockReturnValue({ symbol: 'BTC', name: 'BitCoin', marketValuePerCrypto: 30000 })
  // @ts-ignore
  prismaMock.singleCrypto.findUnique.mockResolvedValue(null)
  // @ts-ignore
  prismaMock.singleCrypto.create.mockResolvedValue(BitCoin)
  await expect(cryptoHelpers.cryptoUpdateOrCreate({ symbol: 'BTC' }, { data: cryptoData })).resolves.toEqual(BitCoin)
})

test('should update a crypto if it exists', async () => {
  jest.spyOn(cryptoHelpers, 'cryptoApiFormatter').mockReturnValue({ symbol: 'BTC', name: 'BitCoin', marketValuePerCrypto: 30000 })
  // @ts-ignore
  prismaMock.singleCrypto.findUnique.mockResolvedValue(BitCoin)
  // @ts-ignore
  prismaMock.singleCrypto.update.mockResolvedValue(BitCoin)
  await expect(cryptoHelpers.cryptoUpdateOrCreate({ symbol: 'BTC' }, { data: cryptoData })).resolves.toEqual(BitCoin)
})

test('should create a user Crypto if it does not exist', async () => {
  const mockDate = new Date('2022-04-10T18:30:00.000Z')
  const mockReqBody =
    {
      sub: 'user',
      symbol: 'BTC',
      buyCost: 30000,
      date: mockDate,
      quantity: 1
    }

  const mockUserCrypto =
    {
      sub: 'user',
      symbol: 'BTC',
      quantityOfCrypto: 1,
      averageValuePerCrypto: 30000,
      totalCryptoValue: 30000,
      firstBought: mockDate,
      lastBought: mockDate
    }
  // @ts-ignore
  prismaMock.userCrypto.findFirst.mockResolvedValue(null)
  // @ts-ignore
  prismaMock.userCrypto.create.mockResolvedValue(mockUserCrypto)
  await expect(cryptoHelpers.createUserCrypto(mockReqBody, 30000)).resolves.toEqual(mockUserCrypto)
})

test('should update a user crypto if it exists', async () => {
  const mockDate = new Date('2022-04-10T18:30:00.000Z')
  const mockUserCrypto =
    {
      sub: 'user',
      symbol: 'BTC',
      quantityOfCrypto: 1,
      averageValuePerCrypto: 30000,
      totalCryptoValue: 30000,
      firstBought: mockDate,
      lastBought: mockDate
    }
  // @ts-ignore
  prismaMock.userCrypto.findFirst.mockResolvedValue(mockUserCrypto)
  // @ts-ignore
  prismaMock.userCrypto.updateMany.mockResolvedValue({ count: 1 })
  await expect(cryptoHelpers.updateUserCrypto('user', 'BTC', 30000, 1)).resolves.toEqual({ count: 1 })
})
