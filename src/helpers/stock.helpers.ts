import Prisma from '../models'
import { AddStockProps } from '../models/interfaces/stock.models.interface'
import { currencyRounder } from './priceHelpers'

export const stockFinder = async (symbol: string) => {
  return await Prisma.singleStock.findUnique({
    where: { symbol }
  })
}

export const stockApiFormatter = (data, symbol: string) => {
  const marketValuePerShare = data.data[symbol].quote.latestPrice
  const name = data.data[symbol].quote.companyName

  return { symbol, name, marketValuePerShare }
}

export const stockUpdateOrCreate = async (symbol: string, data) => {
  const result = await stockFinder(symbol)
  const stockData = stockApiFormatter(data, symbol)

  if (!result) {
    return await Prisma.singleStock.create({
      data: stockData
    })
  }

  return Prisma.singleStock.update({
    where: { symbol },
    data: { marketValuePerShare: stockData.marketValuePerShare }
  })
}

export const createUserStock = async (req : AddStockProps, totalValueOfShares: number) => {
  // Need to find out if there is another userStock of the same sub and symbol
  const { sub, symbol, buyCost, date, quantity } : AddStockProps = req

  const userStock = await Prisma.userStock.findFirst({
    where: { sub, symbol }
  })

  if (!userStock) {
    const newUserStock = await Prisma.userStock.create({
      data: {
        sub,
        symbol,
        entryValuePerShare: buyCost,
        numberOfShares: quantity,
        totalValueOfShares,
        firstBought: date,
        lastBought: date
      }
    })
    return newUserStock
  }
  return await updateUserStock(sub, symbol, buyCost, quantity)
}

export const updateUserStock = async (sub: string, symbol: string, newEntry: number, quantity: number) => {
  const userStock = await Prisma.userStock.findFirst({
    where: { sub, symbol }
  })

  // get ((total value of shares / number of shares) + newEntry )/ 2
  const averageEntry = (userStock?.entryValuePerShare as number + newEntry) / 2
  const totalNumberOfShares = userStock?.numberOfShares as number + quantity

  const updatedUserStock = await Prisma.userStock.updateMany({
    where: { sub, symbol },
    data: {
      sub,
      symbol,
      entryValuePerShare: averageEntry,
      numberOfShares: totalNumberOfShares,
      totalValueOfShares: currencyRounder(totalNumberOfShares * averageEntry),
      lastBought: new Date().toISOString()
    }
  })

  return updatedUserStock
}
