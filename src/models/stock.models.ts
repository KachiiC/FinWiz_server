import { Request } from 'express'
import { stockUpdateOrCreate } from '../helpers/stock.helpers'
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

        await stockSummary(sub)

        await Prisma.userStock.create({
            data: {
                sub,
                symbol,
                entryValuePerShare: buyCost,
                numberOfShares: quantity,
                totalValueOfShares: totalValueOfShares,
                firstBought: date,
                lastBought: date
            }
        })

        const userInvestmentValue = await investmentValues(sub, date, totalValueOfShares)

        //! need to add the rest of the data here
        await Prisma.user.update({
            where: { sub: sub },
            data: { totalInvestmentValue: userInvestmentValue.value }
        })

    } catch (err) {
        console.error('Error in addUserStock: ', err)
    }
}

export const stockSummaryCheck = async (sub: string) => {
    let stockSummary = await Prisma.stockSummary.findUnique({
        where: { sub: sub }
    })

    if (!stockSummary) {
        stockSummary = await Prisma.stockSummary.create({
            data: {
                sub: sub,
                currentTotalAmount: 0,
                oldestStock: "",
                newestStock: "",
                stockWithMostShares: "",
                highestInvestmentStock: ""
            }
        })

        return stockSummary
    }
}

export const stockSummary = async (sub: string) => {
    console.log('in stock summary')

    let stockSummary = await Prisma.stockSummary.findUnique({
        where: { sub: sub }
    })

    console.log('user stock summary', stockSummary)

    const listOfUserStocks = await Prisma.userStock.findMany({
        where: { sub: sub }
    })

    let oldestStock,
        newestStock,
        stockWithMostShares,
        currentTotalAmount,
        highestInvestmentStock

    if (listOfUserStocks.length > 0) {
        oldestStock = listOfUserStocks.reduce((prev, curr) => {
            prev = new Date(prev.firstBought).getTime() < new Date(curr.firstBought).getTime() ? prev : curr
            return prev
        }).symbol

        newestStock = listOfUserStocks.reduce((prev, curr) => {
            prev = new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr
            return prev
        }).symbol

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

    if (!stockSummary) {
        console.log('creating stock summary')
        stockSummary = await Prisma.stockSummary.create({
            data: { sub: sub, ...inputData }
        })
    } else {
        console.log('updating stock summary')
        stockSummary = await Prisma.stockSummary.update({
            where: { sub: sub },
            data: { ...inputData }
        })
    }

    console.log('returned stock summary: ', stockSummary)
    return stockSummary
}