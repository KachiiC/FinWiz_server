import { oldestCrypto, topCrypto, newestCrypto } from '../data/crypto.snippet.data'
import Prisma from '../models'
import { currencyRounder } from './priceHelpers'

export const cryptoFinder = async (symbol: string) => {
    return Prisma.singleCrypto.findUnique({
        where: { symbol: symbol }
    })
}

export const cryptoApiFormatter = (data, symbol) => {
    const marketValuePerCrypto = data.data[symbol].quote.USD.price
    const name = data.data[symbol].name

    return { symbol, name, marketValuePerCrypto }
}

export const cryptoUpdateOrCreate = async (symbol: string, data) => {

    const result = cryptoFinder(symbol)
    const cryptoData = cryptoApiFormatter(data, symbol)

    if (!result) {
        return Prisma.singleCrypto.create({
            data: cryptoData
        })
    }

    return Prisma.singleCrypto.update({
        where: { symbol: symbol },
        data: {
            marketValuePerCrypto: cryptoData.marketValuePerCrypto,
        }
    })
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

// export const 