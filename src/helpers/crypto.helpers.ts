import Prisma from '../models'

export const cryptoFinder = async (symbol: string) => {
    return Prisma.singleCrypto.findUnique({
        where: { symbol: symbol }
    })
}

export const cryptoApiFormatter = (data, symbol) => {
    const marketValuePerCrypto = data.data[symbol].quotes.USD.price
    const name = data.data[symbol].symbol

    return {
        symbol,
        name,
        marketValuePerCrypto
    }
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