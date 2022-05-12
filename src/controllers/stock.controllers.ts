// TYPES
import { Request, Response } from 'express'
import { iexApiStockList, iexApiStockQuotes } from "../helpers/urls"
import { getRequest } from "../helpers/apiRequests"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    const url = iexApiStockList(req.params.type)
    try {
        const data = await getRequest(url)

        res.send(data.data)
    } catch (err) {
        console.error(err)
        res.sendStatus(404)
    }
}

export const addUserStock = async (req: Request, res: Response) => {

    const { 
      symbol, 
      quantity, 
      buyCost, 
      buyQuantity,
      date,
      sub 
      } = req.body

    const singleStock = await prisma.singleStock.findUnique({
      where: {
        symbol: symbol
      }
    })

    if (!singleStock) {
      // TODO singleStock not found in DB- need API call to find market value of stock
    }
    
    const marketValuePerShare = singleStock?.marketValuePerShare
    const totalValueOfShares = quantity * (marketValuePerShare as number)

    // Create new record in UserStock table
    const userStock = await prisma.userStock.create({
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

    const userStockSummary = await stockSummary(sub);

    const userInvestmentValue = await investmentValues(sub, date, totalValueOfShares);
}

const stockSummary = async (sub: string) => {

  let stockSummary = await prisma.stockSummary.findUnique({
    where: {
      sub: sub
    }
  })

  const listOfUserStocks = await prisma.userStock.findMany({
    where: {
      sub: sub
    }
  })

  const oldestStock = listOfUserStocks.reduce((prev, curr) => {
    prev = new Date(prev.firstBought).getTime() < new Date(curr.firstBought).getTime() ? prev : curr
    return prev
  })

  const newestStock = listOfUserStocks.reduce((prev, curr) => {
    prev = new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr
    return prev
  })

  const stockWithMostShares = listOfUserStocks.reduce((prev, curr) => {
    prev = prev.numberOfShares > curr.numberOfShares ? prev : curr
    return prev
  })

  const currentTotalAmount = listOfUserStocks.reduce((prev, curr) => {
    return prev + curr.totalValueOfShares
  }, 0)
  
  const highestInvestmentStock = listOfUserStocks.reduce((prev, curr) => {
    prev = prev.totalValueOfShares > curr.totalValueOfShares ? prev : curr
    return prev
  })

  if (!stockSummary) {
    //StockSummary doesn't exist so need to create one
    stockSummary = await prisma.stockSummary.create({
      data: {
        sub: sub,
        currentTotalAmount: currentTotalAmount,
        oldestStock: oldestStock.symbol,
        newestStock: newestStock.symbol,
        stockWithMostShares: stockWithMostShares.symbol,
        highestInvestmentStock: highestInvestmentStock.symbol
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

export const investmentValues = async (sub: string, dateTime: Date, value: number) => {
  const userInvestmentValue = prisma.userInvestmentValues.create({
    data: {
      sub: sub,
      dateTime: dateTime,
      value: value
    }
  })
  return userInvestmentValue
}