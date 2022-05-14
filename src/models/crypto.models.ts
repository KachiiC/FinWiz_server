import { Request } from 'express'
import { cryptoUpdateOrCreate, createUserCrypto } from '../helpers/crypto.helpers'
import { cryptoApiData } from '../helpers/apiRequests'
import Prisma from './index'
import { investmentValues } from './user.models'


export const addCrypto = async (req: Request) => {

    try {
        // DECONSTRUCT
        const {
            symbol,
            quantity,
            buyCost,
            date,
            sub
        } = req.body

        const apiData = await cryptoApiData(symbol)
        
        const apiDataValue = apiData.data[symbol].quote.USD.price

        await cryptoUpdateOrCreate(symbol, apiData)

        const totalValueOfCrypto = quantity * apiDataValue

        await cryptoSummary(req.body, totalValueOfCrypto)

        const userInvestmentValue = await investmentValues(sub, date, totalValueOfCrypto)

        await Prisma.user.update({
            where: { sub: sub },
            data: { totalInvestmentValue: userInvestmentValue.value }
        })

    } catch (err) {
        console.error('Error in addUserCrypto: ', err)
    }
}


export const cryptoSummary = async (req, totalValueOfCrypto: number ) => {

    let cryptoSummary = await Prisma.cryptoSummary.findUnique({
        where: { sub: req.sub }
    })

    if (!cryptoSummary) {
      // create a cryptoSummary for the user first time with default values. This will be updated later.
      await Prisma.cryptoSummary.create({
        data: {
          sub: req.sub,
          totalValueOf: req.buyCost * req.quantity,
          numberOfDifferent: 1,
          highestInvestedCurrency: req.symbol,
          highestValuePerCurrency: req.symbol,
          lowestValuePerCurrency: req.symbol,
          highestOwnedVolume: req.symbol,
          lowestOwnedVolume: req.symbol,
          newestBoughtCurrency: req.symbol,
          oldestBoughtCurrency: req.symbol
        }
      })
    }

    await createUserCrypto( req, totalValueOfCrypto)

    const listOfUserCrypto = await Prisma.userCrypto.findMany({
        where: { sub: req.sub }
    })

    let totalValueOf,
        numberOfDifferent,
        highestInvestedCurrency,
        highestValuePerCurrency,
        lowestValuePerCurrency,
        highestOwnedVolume,
        lowestOwnedVolume,
        newestBoughtCurrency,
        oldestBoughtCurrency

    if (listOfUserCrypto.length > 0) {

        totalValueOf = listOfUserCrypto.reduce((prev, curr) => {
            return prev + curr.totalCryptoValue
        }, 0)

        numberOfDifferent = listOfUserCrypto.length

        highestInvestedCurrency = listOfUserCrypto.reduce((prev, curr) => prev.totalCryptoValue > curr.totalCryptoValue ? prev : curr).symbol

        highestValuePerCurrency = listOfUserCrypto.reduce((prev, curr) => prev.averageValuePerCrypto > curr.averageValuePerCrypto ? prev : curr).symbol
        
        lowestValuePerCurrency = listOfUserCrypto.reduce((prev, curr) => prev.averageValuePerCrypto < curr.averageValuePerCrypto ? prev : curr).symbol
        
        highestOwnedVolume = listOfUserCrypto.reduce((prev, curr) => prev.quantityOfCrypto > curr.quantityOfCrypto ? prev : curr).symbol
        
        lowestOwnedVolume = listOfUserCrypto.reduce((prev, curr) => prev.quantityOfCrypto < curr.quantityOfCrypto ? prev : curr).symbol
        
        newestBoughtCurrency = listOfUserCrypto.reduce((prev, curr) => new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr).symbol
        
        oldestBoughtCurrency = listOfUserCrypto.reduce((prev, curr) => new Date(prev.firstBought).getTime() < new Date(prev.firstBought).getTime() ? prev : curr).symbol

    }

    const inputData = {
        totalValueOf,
        numberOfDifferent,
        highestInvestedCurrency,
        highestValuePerCurrency,
        lowestValuePerCurrency,
        highestOwnedVolume,
        lowestOwnedVolume,
        newestBoughtCurrency,
        oldestBoughtCurrency,
    }

    cryptoSummary = await Prisma.cryptoSummary.update({
        where: { sub: req.sub },
        data: { ...inputData }
    })

    return cryptoSummary
}