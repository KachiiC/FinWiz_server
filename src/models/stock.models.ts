import { Request } from 'express'
import { stockUpdateOrCreate , createUserStock } from '../helpers/stock.helpers'
import { stockApiData } from '../helpers/apiRequests'
import Prisma from './index'
import { investmentValues } from './user.models'
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
        await stockSummary(req.body, totalValueOfShares)

        const userInvestmentValue = await investmentValues(sub, date, totalValueOfShares)

        await Prisma.user.update({
            where: { sub: sub },
            data: { totalInvestmentValue: userInvestmentValue.value }
        })

    } catch (err) {
        console.error('Error in addUserStock: ', err)
    }
}

export const stockSummary = async (req, totalValueOfShares: number) => {

    let stockSummary = await Prisma.stockSummary.findUnique({
        where: { sub: req.sub }
    })

    if (!stockSummary) {
      // create a stockSummary for the user first time with some default values. Will update later
      await Prisma.stockSummary.create({
        data: { 
            sub: req.sub,
            currentTotalAmount: req.buyCost,
            oldestStock: req.symbol,
            newestStock: req.symbol,
            stockWithMostShares: req.symbol,
            highestInvestmentStock: req.symbol,          
        }
    })
  }
    
    await createUserStock( req, totalValueOfShares)

    const listOfUserStocks = await Prisma.userStock.findMany({
        where: { sub: req.sub }
    })

    let oldestStock,
        newestStock,
        stockWithMostShares,
        currentTotalAmount,
        highestInvestmentStock

    if (listOfUserStocks.length > 0) {
        
        newestStock = req.symbol;

        //! can just check if its the first stock bought and set it rather than looping through all stocks each time
        oldestStock = listOfUserStocks.reduce((prev, curr) => {
            prev = new Date(prev.firstBought).getTime() < new Date(curr.firstBought).getTime() ? prev : curr
            return prev
        }).symbol


        //! These reduce functions are not taking into account the newly added stock :)
        stockWithMostShares = listOfUserStocks.reduce((prev, curr) => {
            prev = prev.numberOfShares > curr.numberOfShares ? prev : curr
            return prev
        }).symbol

        currentTotalAmount = listOfUserStocks.reduce((prev, curr) => {
            return prev + curr.totalValueOfShares
        }, 0)

        highestInvestmentStock = listOfUserStocks.reduce((prev, curr) => {
            prev = prev.totalValueOfShares > curr.totalValueOfShares ? prev : curr
            return prev
        }).symbol
    }

    const inputData = {
        currentTotalAmount,
        oldestStock,
        newestStock,
        stockWithMostShares,
        highestInvestmentStock
    }

    // Should be a stockSummary because we created one if there isn't on Line 81
      stockSummary = await Prisma.stockSummary.update({
          where: { sub: req.sub },
          data: { ...inputData }
      })
    

    return stockSummary
}