// TYPES
import { Request, Response } from 'express'
import { cryptoHeaders } from '../helpers/headers'
import { cryptoUrl } from '../helpers/urls'
import { getRequestWithHeaders } from "../helpers/apiRequests"
import { investmentValues } from './stock.controllers'
import Prisma from '../models/index'

export const getUserCrypto = async (req: Request, res: Response) => {

    const url = cryptoUrl(req.params.cryptolist)

    try {
        const data = await getRequestWithHeaders(
            url,
            cryptoHeaders(process.env.COINCAP_KEY || "")
        )

        res.send(data.data)
    }
    catch (err) {
        console.error(err)
        res.sendStatus(404)
    }

}

export const addUserCrypto = async (req: Request, res: Response) => {
  
  try {

    const { 
      symbol, 
      quantity, 
      buyCost,
      date,
      sub 
      } = req.body

    let singleCrypto = await Prisma.singleCrypto.findUnique({
      where: {
        symbol: symbol
      }
    })

    if (!singleCrypto) {
      // TODO singleCrypto not found in DB- need API call to find market value of Crypto
    }

    const marketValuePerCurrency = singleCrypto?.marketValuePerCrypto
    const totalValueOfCrypto = quantity * (marketValuePerCurrency as number)

    const userCryptoSummary = await cryptoSummary(sub, symbol, quantity, buyCost)

    const userCrypto = await Prisma.userCrypto.create({
      data: {
        sub: sub,
        symbol: symbol,
        quantityOfCrypto: quantity,
        averageValuePerCrypto: marketValuePerCurrency as number,
        totalCryptoValue: totalValueOfCrypto,
        firstBought: date,
        lastBought: date
      }
    })

    const userInvestmentValue = await investmentValues(sub, date, totalValueOfCrypto)

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

    res.status(201)
    res.json(userRecord)

  }catch (err) {
    console.error('Error in addUserCrypto: ', err)
    res.sendStatus(404)
  }
}

const cryptoSummary = async(sub: string, symbol: string, quantity: number, buyCost: number) => {

  let cryptoSummary = await Prisma.cryptoSummary.findUnique({
    where: {
      sub: sub
    }
  })

  const listOfUserCrypto = await Prisma.userCrypto.findMany({
    where: {
      sub: sub
    }
  })

  let totalValueOf
  let numberOfDifferent
  let highestInvestedCurrency 
  let highestValuePerCurrency 
  let lowestValuePerCurrency  
  let highestOwnedVolume      
  let lowestOwnedVolume       
  let newestBoughtCurrency    
  let oldestBoughtCurrency    

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

  } else {
    totalValueOf              = quantity * buyCost
    numberOfDifferent         = 1
    highestInvestedCurrency   = symbol
    highestValuePerCurrency   = symbol
    lowestValuePerCurrency    = symbol
    highestOwnedVolume        = symbol 
    lowestOwnedVolume         = symbol    
    newestBoughtCurrency      = symbol
    oldestBoughtCurrency      = symbol
  }

  if (!cryptoSummary) {
    cryptoSummary = await Prisma.cryptoSummary.create({
      data: {
        sub: sub,
        totalValueOf: totalValueOf,
        numberOfDifferent: numberOfDifferent,
        highestInvestedCurrency: highestInvestedCurrency,
        highestValuePerCurrency: highestValuePerCurrency,
        lowestValuePerCurrency: lowestValuePerCurrency,
        highestOwnedVolume: highestOwnedVolume,
        lowestOwnedVolume: lowestOwnedVolume,
        newestBoughtCurrency: newestBoughtCurrency,
        oldestBoughtCurrency: oldestBoughtCurrency
      }
    })
  } else {
    cryptoSummary = await Prisma.cryptoSummary.update({
      where: {
        sub: sub
      },
      data: {
        totalValueOf: totalValueOf,
        numberOfDifferent: numberOfDifferent,
        highestInvestedCurrency: highestInvestedCurrency,
        highestValuePerCurrency: highestValuePerCurrency,
        lowestValuePerCurrency: lowestValuePerCurrency,
        highestOwnedVolume: highestOwnedVolume,
        lowestOwnedVolume: lowestOwnedVolume,
        newestBoughtCurrency: newestBoughtCurrency,
        oldestBoughtCurrency: oldestBoughtCurrency
      }
    })
  }

  return cryptoSummary
}
