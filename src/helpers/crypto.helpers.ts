/* eslint-disable camelcase */
import { oldestCrypto, topCrypto, newestCrypto } from '../data/crypto.snippet.data'
import Prisma from '../models'
import { currencyRounder } from './priceHelpers'
import { AddCryptoProps } from '../models/interfaces/crypto.models.interface'

export const cryptoFinder = async (symbol: string) => {
  return await Prisma.singleCrypto.findUnique({
    where: { symbol }
  })
}

export const cryptoApiFormatter = (data, symbol: string) => {
  const marketValuePerCrypto = data.data[symbol].quote.USD.price
  const name = data.data[symbol].name

  return { symbol, name, marketValuePerCrypto }
}

export const cryptoUpdateOrCreate = async (req, data) => {
  const result = await cryptoFinder(req.symbol)
  const cryptoData = cryptoApiFormatter(data, req.symbol)

  if (!result) {
    return await Prisma.singleCrypto.create({
      data: cryptoData
    })
  }

  return await Prisma.singleCrypto.update({
    where: { symbol: req.symbol },
    data: { marketValuePerCrypto: cryptoData.marketValuePerCrypto }
  })
}

export const createUserCrypto = async (req: AddCryptoProps, totalCryptoValue: number) => {
  const { sub, symbol, buyCost, date, quantity } : AddCryptoProps = req

  const userCrypto = await Prisma.userCrypto.findFirst({
    where: { sub: req.sub, symbol: req.symbol }
  })

  if (!userCrypto) {
    const newUserCrypto = await Prisma.userCrypto.create({
      data: {
        sub,
        symbol,
        averageValuePerCrypto: buyCost,
        quantityOfCrypto: quantity,
        totalCryptoValue,
        firstBought: date,
        lastBought: date
      }
    })
    return newUserCrypto
  }
  return await updateUserCrypto(sub, symbol, buyCost, quantity)
}

export const updateUserCrypto = async (sub: string, symbol: string, newEntry: number, quantity: number) => {
  const userCrypto = await Prisma.userCrypto.findFirst({
    where: { sub, symbol }
  })

  const averageValuePerCrypto = (userCrypto?.averageValuePerCrypto as number + newEntry) / 2
  const totalNumberOfCrypto = userCrypto?.quantityOfCrypto as number + quantity

  const updatedUserCrypto = await Prisma.userCrypto.updateMany({
    where: { sub, symbol },
    data: {
      quantityOfCrypto: totalNumberOfCrypto,
      averageValuePerCrypto,
      totalCryptoValue: currencyRounder(totalNumberOfCrypto * averageValuePerCrypto),
      lastBought: new Date().toISOString()
    }
  })
  return updatedUserCrypto
}

export const cryptoObjects = {
  oldest: oldestCrypto,
  top: topCrypto,
  newest: newestCrypto
}

export const cryptoListSorter = (input) => {
  const allKeys = Object.keys(input.data)

  const cryptoData = allKeys.map((key) => {
    const { name, symbol, quote, cmc_rank } = input.data[key]
    const { price, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d } = quote.USD
    return {
      name,
      symbol,
      rank: cmc_rank,
      price: currencyRounder(price, 4),
      hourly_change: currencyRounder(percent_change_1h, 4),
      weekly_change: currencyRounder(percent_change_7d, 4),
      daily_change: currencyRounder(percent_change_24h, 4),
      monthly_change: currencyRounder(percent_change_30d, 4)
    }
  })

  return cryptoData.sort((a, b) => a.rank - b.rank)
}
