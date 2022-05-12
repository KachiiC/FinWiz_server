import { Request } from 'express'
import Prisma from './index'
import { investmentValues } from './investmentvalue.model'
import { cryptoSummary } from './cryptosummary.model'

export const addCrypto = async (req: Request) => {

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

      return userRecord

    }catch (err) {
      console.error('Error in addUserCrypto: ', err)
    }
}