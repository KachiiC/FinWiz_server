import { oldestCrypto, topCrypto, newestCrypto } from '../data/crypto.snippet.data'
import Prisma from '../models'
import { currencyRounder } from './priceHelpers'

export const cryptoFinder = async (symbol: string) => {
    return await Prisma.singleCrypto.findUnique({
        where: { symbol: symbol }
    })
}

export const cryptoApiFormatter = (data, symbol) => {
    const marketValuePerCrypto = data.data[symbol].quote.USD.price
    const name = data.data[symbol].name

    return { symbol, name, marketValuePerCrypto }
}

export const cryptoUpdateOrCreate = async (req, data) => {
    const result = await cryptoFinder(req.symbol)
    const cryptoData = cryptoApiFormatter(data, req.symbol)

    if (!result) {
        return Prisma.singleCrypto.create({
            data: cryptoData
        })
    }

    return Prisma.singleCrypto.update({
        where: { symbol: req.symbol },
        data: { marketValuePerCrypto: cryptoData.marketValuePerCrypto }
    })
}

export const createUserCrypto = async ( req, totalCryptoValue: number ) => {

    let userCrypto = await Prisma.userCrypto.findMany({
      where: { sub: req.sub, symbol: req.symbol }
    })

    if (userCrypto.length === 0 ) {
      const newUserCrypto = await Prisma.userCrypto.create({
        data: {
          sub: req.sub,
          symbol: req.symbol,
          averageValuePerCrypto: req.buyCost,
          quantityOfCrypto: req.quantity,
          totalCryptoValue: totalCryptoValue,
          firstBought: req.date,
          lastBought: req.date
        }
      })
      return newUserCrypto
    } else {

      // Another userCrypto of this investment exists - update accordingly

      const averageValuePerCrypto = (userCrypto[0].averageValuePerCrypto + req.buyCost) / 2
      const totalNumberOfCrypto = userCrypto[0].quantityOfCrypto + req.quantity

      const updatedUserCrypto = await Prisma.userCrypto.updateMany({
        where: { sub: req.sub, symbol: req.sub },
        data: {
          sub: req.sub,
          symbol: req.symbol,
          quantityOfCrypto: totalNumberOfCrypto,
          averageValuePerCrypto: averageValuePerCrypto,
          totalCryptoValue: totalCryptoValue,
          firstBought: userCrypto[0].firstBought,
          lastBought: req.date
        }
      })
      return updatedUserCrypto
    }
  
}

export const cryptoObjects = {
    "oldest": oldestCrypto,
    "top": topCrypto,
    "newest": newestCrypto
}

export const cryptoListSorter = (data) => {

    const allKeys = Object.keys(data.data);

    const cryptoData = allKeys.map((key) => {
        const { name, symbol, quote, cmc_rank } = data.data[key]
        const { price, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d } = quote.USD
        return {
            name,
            symbol,
            rank: cmc_rank,
            price: currencyRounder(price, 4),
            hourly_change: currencyRounder(percent_change_1h, 4),
            weekly_change: currencyRounder(percent_change_7d, 4),
            daily_change: currencyRounder(percent_change_24h, 4),
            monthly_change: currencyRounder(percent_change_30d, 4)
        }
    })

    return cryptoData.sort((a,b) => a.rank - b.rank)
}

