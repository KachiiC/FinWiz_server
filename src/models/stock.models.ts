import { Request } from 'express'
import { stockUpdateOrCreate , createUserStock } from '../helpers/stock.helpers'
import { stockApiData } from '../helpers/apiRequests'
import Prisma from './index'
import { investmentValues, updateUserTotalInvestment } from './user.models'
import { currencyRounder, percentageCalculator } from '../helpers/priceHelpers'


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

        const changeAmountLogic = change ? change : latestPrice - previousClose
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

  // If user adds a stock 
  // check if user already has that in userStock
  // if they don't have userStock proceed:
  // 1. Create a singleStock
  // 2. Based on that singleStock create a userStock
  // 3. add userStock to stockSummary
  // 4. update stockSummary
    try {
        const {
            symbol,
            quantity,
            buyCost,
            date,
            sub
        } = req.body

        const apiData = await stockApiData(symbol)

        const apiDataValue = apiData.data[symbol].quote.latestPrice

        await stockUpdateOrCreate(req.body, apiData)

        const totalValueOfShares = quantity * apiDataValue

        // need to pass symbol and buy cost else wont set oldest/newest etc.
        // in stockSummary if first time adding investment to a user!!! -> line 135
        await createUserStock( req.body, totalValueOfShares)
        await stockSummary(sub)

        const userInvestmentValue = await investmentValues(sub, date, totalValueOfShares)

        await Prisma.user.update({
            where: { sub: sub },
            data: { totalInvestmentValue: userInvestmentValue.value }
        })

    } catch (err) {
        console.error('Error in addUserStock: ', err)
    }
}

export const stockSummary = async (sub: string) => {

    let stockSummary = await Prisma.stockSummary.findUnique({
        where: { sub }
    })

    if (!stockSummary) {
      // create a stockSummary for the user first time with some default values. Will update later
      await Prisma.stockSummary.create({
        data: { sub }
      })
    }
    
    await updateStockSummary( sub )

}

export const updateStockSummary = async (sub: string ) => {
      const listOfUserStocks = await Prisma.userStock.findMany({
        where: { sub: sub }
    })

    let oldestStock,
        newestStock,
        stockWithMostShares,
        currentTotalAmount,
        highestInvestmentStock

    if (listOfUserStocks.length > 0) {
        
        newestStock =  listOfUserStocks.reduce((prev, curr) => new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr).symbol;

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

    // Should be a stockSummary because we created one if there isn't on Line 81
      const stockSummary = await Prisma.stockSummary.update({
          where: { sub: sub },
          data: { ...inputData }
      })


    return stockSummary
}

export const updateStock = async ( req: Request ) => {

    const {
      sub,
      symbol,
      quantity,
      price,
      boughtOrSold,
      date
    } = req.body

   // boughtOrSold (boolean -> true = bought, false = sold)
    const existingStockArr = await Prisma.userStock.findMany({
      where: {sub: sub, symbol: symbol}
    })

    const existingStock = existingStockArr[0]
    const existingStockNoOfShares = existingStock.numberOfShares

    if (!boughtOrSold && existingStockNoOfShares === quantity) {
      // User has sold off all shares of stock. Delete userStock
      const deletedStock = await Prisma.userStock.deleteMany({
        where: { sub: sub, symbol: symbol}
      })

      const valueToAdd = -quantity * price
      await updateStockSummary( sub )
      await investmentValues( sub, date, valueToAdd )
      await updateUserTotalInvestment( sub )

      return deletedStock
    }
     // User has bought more stock to add on, get existing quantity and price and update.
    
    let updatedNoOfShares : number = 0

    if (boughtOrSold) updatedNoOfShares = existingStockNoOfShares + quantity
    if (!boughtOrSold) updatedNoOfShares = existingStockNoOfShares - quantity

    const updatedTotalValueOfShares = updatedNoOfShares * price

    let updatedDate = existingStock.lastBought
    if (boughtOrSold) updatedDate = date
    if (!boughtOrSold) updatedDate = existingStock.lastBought

    const updatedStock = await Prisma.userStock.updateMany({
        where: { sub: sub, symbol: symbol },
        data: {
          numberOfShares: updatedNoOfShares,
          entryValuePerShare: price,
          totalValueOfShares: updatedTotalValueOfShares,
          lastBought: updatedDate
        }
      })
   
   // Now need to update StockSummary, UserInvestmentValues and User
      let valueToAdd = 0
      if (boughtOrSold) valueToAdd = quantity * price
      if (!boughtOrSold) valueToAdd = -quantity * price

      await updateStockSummary( sub )
      await investmentValues( sub, updatedDate, valueToAdd )
      await updateUserTotalInvestment( sub )
      
      return updatedStock
}