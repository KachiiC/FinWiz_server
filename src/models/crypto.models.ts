import { Request } from 'express'
import { cryptoUpdateOrCreate } from '../helpers/crypto.helpers'
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
        const apiDataValue = apiData.data[symbol].quotes.USD.price

        await cryptoUpdateOrCreate(symbol, apiData)

        const totalValueOfCrypto = quantity * apiDataValue

        await cryptoSummaryCheck(sub)

        await Prisma.userCrypto.create({
            data: {
                sub: sub,
                symbol: symbol,
                quantityOfCrypto: quantity,
                averageValuePerCrypto: buyCost,
                totalCryptoValue: totalValueOfCrypto,
                firstBought: date,
                lastBought: date
            }
        })

        const userInvestmentValue = await investmentValues(sub, date, totalValueOfCrypto)

        await Prisma.user.update({
            where: { sub: sub },
            data: { totalInvestmentValue: userInvestmentValue.value }
        })

    } catch (err) {
        console.error('Error in addUserCrypto: ', err)
    }
}

export const cryptoSummaryCheck = async (sub) => {
    let cryptoSummary = await Prisma.cryptoSummary.findUnique({
        where: { sub: sub }
    })

    if (!cryptoSummary) {
        cryptoSummary = await Prisma.cryptoSummary.create({
            data: {
                sub,
                totalValueOf: 0,
                numberOfDifferent: 0,
                highestInvestedCurrency: "",
                highestValuePerCurrency: "",
                lowestValuePerCurrency: "",
                highestOwnedVolume: "",
                lowestOwnedVolume: "",
                newestBoughtCurrency: "",
                oldestBoughtCurrency: ""
            }
        })
    }

    return cryptoSummary

}

export const cryptoSummary = async (sub: string) => {

    let cryptoSummary = await Prisma.cryptoSummary.findUnique({
        where: { sub: sub }
    })

    const listOfUserCrypto = await Prisma.userCrypto.findMany({
        where: { sub: sub }
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

        highestInvestedCurrency = listOfUserCrypto.reduce((prev, curr) => {
            prev = prev.totalCryptoValue > curr.totalCryptoValue ? prev : curr
            return prev
        }).symbol

        highestValuePerCurrency = listOfUserCrypto.reduce((prev, curr) => {
            prev = prev.averageValuePerCrypto > curr.averageValuePerCrypto ? prev : curr
            return prev
        }).symbol

        lowestValuePerCurrency = listOfUserCrypto.reduce((prev, curr) => {
            prev = prev.averageValuePerCrypto < curr.averageValuePerCrypto ? prev : curr
            return prev
        }).symbol

        highestOwnedVolume = listOfUserCrypto.reduce((prev, curr) => {
            prev = prev.quantityOfCrypto > curr.quantityOfCrypto ? prev : curr
            return prev
        }).symbol

        lowestOwnedVolume = listOfUserCrypto.reduce((prev, curr) => {
            prev = prev.quantityOfCrypto < curr.quantityOfCrypto ? prev : curr
            return prev
        }).symbol

        newestBoughtCurrency = listOfUserCrypto.reduce((prev, curr) => {
            prev = new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr
            return prev
        }).symbol

        oldestBoughtCurrency = listOfUserCrypto.reduce((prev, curr) => {
            prev = new Date(prev.firstBought).getTime() < new Date(prev.firstBought).getTime() ? prev : curr
            return prev
        }).symbol

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
        where: { sub: sub },
        data: { ...inputData }
    })

    return cryptoSummary
}