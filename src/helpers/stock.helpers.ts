import Prisma from '../models'


export const stockFinder = async (symbol: string) => {
    return Prisma.singleStock.findUnique({
      where: { symbol: symbol }
    })
}

export const stockApiFormatter = (data, symbol) => {
    const marketValuePerShare = data.data[symbol].quote.latestPrice
    const name = data.data[symbol].quote.companyName

    return { symbol, name, marketValuePerShare }
}

export const stockUpdateOrCreate = async (req, data) => {
    const result = stockFinder(req.symbol)
    const stockData = stockApiFormatter(data, req.symbol)

    if (!result) {
      await createStockSummary(req)
      await createUserStock(req)
      return Prisma.singleStock.create({
        data: stockData
      })
    }

    return Prisma.singleStock.update({
      where: { symbol: req.symbol },
      data: { marketValuePerShare : stockData.marketValuePerShare }
    })
}

export const createStockSummary = async (req) => {
  const newStockSummary = await Prisma.stockSummary.create({
    data: {
      sub: req.sub,
      currentTotalAmount: req.quantity * req.buyCost,
      oldestStock: req.symbol,
      newestStock: req.symbol,
      stockWithMostShares: req.symbol,
      highestInvestmentStock: req.symbol
    }
  })
  return newStockSummary
}

export const createUserStock = async(req) => {
  const newUserStock = await Prisma.userStock.create({
    data: {
      sub: req.sub,
      symbol: req.symbol,
      entryValuePerShare: req.entryValue,
      numberOfShares: req.quantity,
      totalValueOfShares: req.quantity * req.entryValue,
      firstBought: req.date,
      lastBought: req.date
    }
  })
  return newUserStock
}