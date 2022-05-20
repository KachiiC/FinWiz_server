import { Request } from 'express'
import { stockUpdateOrCreate, createUserStock } from '../helpers/stock.helpers'
import { stockApiData } from '../helpers/apiRequests'
import Prisma from './index'
import { investmentValues, updateUserTotalInvestment } from './user.models'
import { currencyRounder, percentageCalculator } from '../helpers/priceHelpers'
import { AddStockProps, UpdateStockProps } from './interfaces/stock.models.interface'

export const stockListModel = (data: any[]) => {
  return data.map((stock) => {
    const {
      symbol,
      companyName,
      latestPrice,
      change,
      changePercent,
      previousClose,
      previousVolume,
      marketCap
    } = stock

    const changeAmountLogic = change || latestPrice - previousClose
    const changePercentLogic = changePercent ? changePercent * 100 : percentageCalculator(latestPrice, previousClose)

    return {
      symbol,
      name: companyName,
      marketValuePerShare: latestPrice,
      changeAmount: currencyRounder(changeAmountLogic),
      changePercent: currencyRounder(changePercentLogic),
      volume: previousVolume,
      marketCap
    }
  })
}

export const addStock = async (req: Request) => {
  try {
    const {
      symbol,
      quantity,
      date,
      sub
    }: AddStockProps = req.body

    const apiData = await stockApiData(symbol)

    const apiDataValue = apiData.data[symbol].quote.latestPrice

    await stockUpdateOrCreate(symbol, apiData)

    const totalValueOfShares = quantity * apiDataValue

    // Stock summary should be created first befor user stock to avoid foreign key issues
    await createStockSummary(sub)
    await createUserStock(req.body, totalValueOfShares)
    await updateStockSummary(req.body)

    const userInvestmentValue = await investmentValues(sub, date, totalValueOfShares)

    await Prisma.user.update({
      where: { sub },
      data: { totalInvestmentValue: userInvestmentValue.value }
    })
  } catch (err) {
    console.error('Error in addUserStock: ', err)
  }
}

export const createStockSummary = async (sub: string) => {
  const stockSummary = await Prisma.stockSummary.findUnique({
    where: { sub }
  })

  if (!stockSummary) {
    // create a stockSummary for the user first time with some default values. Will update later
    await Prisma.stockSummary.create({
      data: { sub }
    })
  }
}

export const updateStockSummary = async (req: AddStockProps) => {
  const { symbol, quantity, sub } = req

  const existingStockSummary = await Prisma.stockSummary.findUnique({
    where: { sub }
  })

  const listOfUserStocks = await Prisma.userStock.findMany({
    where: { sub }
  })

  let oldestStock,
    newestStock,
    stockWithMostShares,
    currentTotalAmount,
    highestInvestmentStock

  if (listOfUserStocks.length > 0) {
    newestStock = listOfUserStocks.reduce((prev, curr) => new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr).symbol

    //! can just check if its the first stock bought and set it rather than looping through all stocks each time
    oldestStock = listOfUserStocks.reduce((prev, curr) => new Date(prev.firstBought).getTime() < new Date(curr.firstBought).getTime() ? prev : curr).symbol

    stockWithMostShares = listOfUserStocks.reduce((prev, curr) => prev.numberOfShares > curr.numberOfShares ? prev : curr).symbol

    currentTotalAmount = listOfUserStocks.reduce((prev, curr) => prev + curr.totalValueOfShares, 0)

    highestInvestmentStock = listOfUserStocks.reduce((prev, curr) => prev.totalValueOfShares > curr.totalValueOfShares ? prev : curr).symbol
  }

  const inputData = {
    currentTotalAmount,
    oldestStock,
    newestStock,
    stockWithMostShares,
    highestInvestmentStock
  }

  if (!existingStockSummary) {
    const apiData = await stockApiData(symbol)
    const apiDataValue = apiData.data[symbol].quote.latestPrice

    const newStockSummary = await Prisma.stockSummary.create({
      data: {
        sub,
        currentTotalAmount: apiDataValue * quantity,
        oldestStock: symbol,
        newestStock: symbol,
        stockWithMostShares: symbol,
        highestInvestmentStock: symbol
      }
    })
    return newStockSummary
  }

  // Should be a stockSummary because we created one if there isn't on Line 81
  const stockSummary = await Prisma.stockSummary.update({
    where: { sub },
    data: { ...inputData }
  })

  return stockSummary
}

export const updateStock = async (req: Request) => {
  const {
    sub,
    symbol,
    quantity,
    boughtOrSold,
    date
  }: UpdateStockProps = req.body

  // boughtOrSold (boolean -> true = bought, false = sold)
  const existingStockArr = await Prisma.userStock.findMany({
    where: { sub, symbol }
  })

  const existingStock = existingStockArr[0]
  const existingStockNoOfShares = existingStock.numberOfShares

  const apiData = await stockApiData(symbol)
  const apiDataValue = apiData.data[symbol].quote.latestPrice

  if (!boughtOrSold && existingStockNoOfShares === quantity) {
    // User has sold off all shares of stock. Delete userStock
    const deletedStock = await Prisma.userStock.deleteMany({
      where: { sub, symbol }
    })

    const valueToAdd = -quantity * apiDataValue
    await updateStockSummary(req.body)
    await investmentValues(sub, date, valueToAdd)
    await updateUserTotalInvestment(sub)

    return deletedStock
  }
  // User has bought more stock to add on, get existing quantity and price and update.

  let updatedNoOfShares: number = 0

  if (boughtOrSold) updatedNoOfShares = existingStockNoOfShares + quantity
  if (!boughtOrSold) updatedNoOfShares = existingStockNoOfShares - quantity

  const updatedTotalValueOfShares = updatedNoOfShares * apiDataValue

  let updatedDate
  if (boughtOrSold) updatedDate = date
  if (!boughtOrSold) updatedDate = existingStock.lastBought

  const updatedStock = await Prisma.userStock.updateMany({
    where: { sub, symbol },
    data: {
      numberOfShares: updatedNoOfShares,
      entryValuePerShare: apiDataValue,
      totalValueOfShares: updatedTotalValueOfShares,
      lastBought: updatedDate
    }
  })

  // Now need to update StockSummary, UserInvestmentValues and User
  let valueToAdd = 0
  if (boughtOrSold) valueToAdd = quantity * apiDataValue
  if (!boughtOrSold) valueToAdd = -quantity * apiDataValue

  await updateStockSummary(req.body)
  await investmentValues(sub, updatedDate, valueToAdd)
  await updateUserTotalInvestment(sub)

  return updatedStock
}
