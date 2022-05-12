import { Request } from 'express'
import Prisma from './index'
import { investmentValues } from './investmentvalue.model'
import { stockSummary } from './stocksummary.model'

export const addStock = async (req: Request) => {

  try {

    const { 
      symbol, 
      quantity, 
      buyCost,
      date,
      sub 
      } = req.body

    const singleStock = await Prisma.singleStock.findUnique({
      where: {
        symbol: symbol
      }
    })

    if (!singleStock) {
      // TODO singleStock not found in DB- need API call to find market value of stock
    }
    
    const marketValuePerShare = singleStock?.marketValuePerShare
    const totalValueOfShares = quantity * (marketValuePerShare as number)

    const userStockSummary = await stockSummary(sub, symbol, quantity, buyCost)

    const userStock = await Prisma.userStock.create({
      data: {
        sub: sub,
        symbol: symbol,
        entryValuePerShare: buyCost,
        numberOfShares: quantity,
        totalValueOfShares: totalValueOfShares,
        firstBought: date,
        lastBought: date
      }
    })

    const userInvestmentValue = await investmentValues(sub, date, totalValueOfShares)

    const userUpdate = await Prisma.user.update({
      where: {
        sub: sub
      },
      data: {
        totalInvestmentValue: userInvestmentValue.value
      }
    })

    const userRecord = await Prisma.user.findUnique({
      where: {
        sub: sub
      },
      include: {
        investmentValues :true,
        stocks: {
          include: { userStock: true}
        },
        cryptos: {
          include: { cryptoList: true}
        }
      }
    })

    return userRecord

  } catch (err) {
    console.error('Error in addUserStock: ', err)
  }
}