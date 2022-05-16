import { Request } from 'express'
import { cryptoUpdateOrCreate, createUserCrypto } from '../helpers/crypto.helpers'
import { cryptoApiData } from '../helpers/apiRequests'
import Prisma from './index'
import { investmentValues, updateUserTotalInvestment } from './user.models'


export const addCrypto = async (req: Request) => {

    try {
        const {
            symbol,
            quantity,
            buyCost,
            date,
            sub
        } = req.body

        const apiData = await cryptoApiData(symbol)
        
        const apiDataValue = apiData.data[symbol].quote.USD.price

        await cryptoUpdateOrCreate(req.body, apiData)

        const totalValueOfCrypto = quantity * apiDataValue

        await createCryptoSummary(req.body)
        await createUserCrypto( req.body, totalValueOfCrypto)

        const userInvestmentValue = await investmentValues(sub, date, totalValueOfCrypto)

        await Prisma.user.update({
            where: { sub: sub },
            data: { totalInvestmentValue: userInvestmentValue.value }
        })

    } catch (err) {
        console.error('Error in addUserCrypto: ', err)
    }
}


export const createCryptoSummary = async ( req ) => {

    const { sub, symbol, buyCost, quantity } = req

    let cryptoSummary = await Prisma.cryptoSummary.findUnique({
        where: { sub }
    })

    if (!cryptoSummary) {
      // create a cryptoSummary for the user first time with default values. This will be updated later.
      await Prisma.cryptoSummary.create({
        data: {
          sub,
          totalValueOf: buyCost * quantity,
          numberOfDifferent: 1,
          highestInvestedCurrency: symbol,
          highestValuePerCurrency: symbol,
          lowestValuePerCurrency: symbol,
          highestOwnedVolume: symbol,
          lowestOwnedVolume: symbol,
          newestBoughtCurrency: symbol,
          oldestBoughtCurrency: symbol
        }
      })
    }


    await updateCryptoSummary(sub)
}



export const updateCryptoSummary = async (sub: string) => {

      const listOfUserCrypto = await Prisma.userCrypto.findMany({
        where: { sub }
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

    const cryptoSummary = await Prisma.cryptoSummary.update({
        where: { sub },
        data: { ...inputData }
    })

    return cryptoSummary

}

export const updateCrypto = async ( req: Request ) => {

    const {
      sub,
      symbol,
      quantity,
      price,
      boughtOrSold,
      date
    } = req.body

    const existingUserCrypto = await Prisma.userCrypto.findFirst({
      where: { sub, symbol }
    })

    if (!boughtOrSold && existingUserCrypto?.quantityOfCrypto === quantity) {

      const deletedCrypto = await Prisma.userCrypto.deleteMany({
        where: { sub, symbol }
      })

      const valueToAdd = -quantity * price
      await updateCryptoSummary( sub )
      await investmentValues( sub, date, valueToAdd )
      await updateUserTotalInvestment( sub )

      return deletedCrypto
    }
    // User has bought more crypto to add on, get existing quantity and price and update.

    let updatedQuantityOfCrypto = 0

    if (boughtOrSold) updatedQuantityOfCrypto = existingUserCrypto?.quantityOfCrypto as number + quantity
    if (!boughtOrSold) updatedQuantityOfCrypto = existingUserCrypto?.quantityOfCrypto as number - quantity

    const updatedTotalCryptoValue = updatedQuantityOfCrypto * price

    let updatedDate
    if (boughtOrSold) updatedDate = date
    if (!boughtOrSold) updatedDate = existingUserCrypto?.lastBought

    const averageValuePerCrypto = (existingUserCrypto?.averageValuePerCrypto as number + price) / 2

    const updatedCrypto = await Prisma.userCrypto.updateMany({
      where: { sub, symbol },
      data: {
        quantityOfCrypto: updatedQuantityOfCrypto,
        averageValuePerCrypto,
        totalCryptoValue: updatedTotalCryptoValue,
        lastBought: updatedDate
      }
    })

    let valueToAdd = 0
    if (boughtOrSold) valueToAdd = quantity * price
    if (!boughtOrSold) valueToAdd = -quantity * price

    await updateCryptoSummary( sub )
    await investmentValues( sub, updatedDate, valueToAdd )
    await updateUserTotalInvestment( sub )
    
    return updatedCrypto
}