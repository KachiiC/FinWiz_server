import { Request, Response } from 'express'
import { iexApiStockList, iexApiStockQuotes } from "../helpers/urls"
import { getRequest } from "../helpers/apiRequests"
import Prisma from '../models/index'
import { stockListModel } from '../models/stock.models'
import { stockCache } from '../middleware/node.cache'

export const getUserStocks = async (req: Request, res: Response) => {

  const url = iexApiStockQuotes(req.params.stocklist)

  try {
    const data = await getRequest(url)

    res.send(data.data)
  } catch (err) {
    console.error(err)
    res.sendStatus(404)
  }
}

export const getStockList = async (req: Request, res: Response) => {
  const { type } = req.params

  const url = iexApiStockList(type)

  try {
    const stockResponse = await getRequest(url)

    const resData = stockListModel(stockResponse.data)

    stockCache.set(type, resData);

    res.status(200).send(resData)
  } catch (err) {
    console.error(err)
    res.sendStatus(404)
  }
}

export const addUserStock = async (req: Request, res: Response) => {

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

    // User should already exist in DB

    const userStockSummary = await stockSummary(sub, symbol, quantity, buyCost);

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

    const userInvestmentValue = await investmentValues(sub, date, totalValueOfShares);

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
        investmentValues: true,
        stocks: {
          include: { userStock: true }
        },
        cryptos: {
          include: { cryptoList: true }
        }
      }
    })

    res.status(201)
    res.json(userRecord)

  } catch (err) {
    console.error('Error in addUserStock: ', err)
    res.sendStatus(404)
  }
}


const stockSummary = async (sub: string, symbol: string, quantity: number, buyCost: number) => {

  let stockSummary = await Prisma.stockSummary.findUnique({
    where: {
      sub: sub
    }
  })

  const listOfUserStocks = await Prisma.userStock.findMany({
    where: {
      sub: sub
    }
  })

  let oldestStock
  let newestStock
  let stockWithMostShares
  let currentTotalAmount
  let highestInvestmentStock

  if (listOfUserStocks.length > 0) {
    oldestStock = listOfUserStocks.reduce((prev, curr) => {
      prev = new Date(prev.firstBought).getTime() < new Date(curr.firstBought).getTime() ? prev : curr
      return prev
    })

    newestStock = listOfUserStocks.reduce((prev, curr) => {
      prev = new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr
      return prev
    })

    stockWithMostShares = listOfUserStocks.reduce((prev, curr) => {
      prev = prev.numberOfShares > curr.numberOfShares ? prev : curr
      return prev
    })

    currentTotalAmount = listOfUserStocks.reduce((prev, curr) => {
      return prev + curr.totalValueOfShares
    }, 0)

    highestInvestmentStock = listOfUserStocks.reduce((prev, curr) => {
      prev = prev.totalValueOfShares > curr.totalValueOfShares ? prev : curr
      return prev
    })
  } else {
    oldestStock = symbol
    newestStock = symbol
    stockWithMostShares = symbol
    currentTotalAmount = quantity * buyCost
    highestInvestmentStock = symbol
  }

  if (!stockSummary) {
    stockSummary = await Prisma.stockSummary.create({
      data: {
        sub: sub,
        currentTotalAmount: currentTotalAmount,
        oldestStock: oldestStock,
        newestStock: newestStock,
        stockWithMostShares: stockWithMostShares,
        highestInvestmentStock: highestInvestmentStock
      }
    })
  } else {
    stockSummary.currentTotalAmount = currentTotalAmount
    stockSummary.oldestStock = oldestStock.symbol
    stockSummary.newestStock = newestStock.symbol
    stockSummary.stockWithMostShares = stockWithMostShares.symbol
    stockSummary.highestInvestmentStock = highestInvestmentStock.symbol
  }

  return stockSummary
}

export const investmentValues = async (sub: string, dateTime: Date, valueToAdd: number) => {

  const listOfUserInvestments = await Prisma.userInvestmentValues.findMany({
    where: {
      sub: sub
    }
  })

  let totalInvestmentValueToDate

  if (listOfUserInvestments.length > 0) {
    totalInvestmentValueToDate = listOfUserInvestments.reduce((prev, curr) => {
      return prev + curr.value
    }, 0)
  } else {
    totalInvestmentValueToDate = valueToAdd
  }

  const userInvestmentValue = await Prisma.userInvestmentValues.create({
    data: {
      sub: sub,
      dateTime: dateTime,
      value: totalInvestmentValueToDate
    }
  })

  return userInvestmentValue
}