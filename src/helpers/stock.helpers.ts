import Prisma from '../models'


export const stockFinder = async (symbol: string) => {
    return await Prisma.singleStock.findUnique({
      where: { symbol: symbol }
    })
}

export const stockApiFormatter = ( data, symbol ) => {
    const marketValuePerShare = data.data[symbol].quote.latestPrice
    const name = data.data[symbol].quote.companyName

    return { symbol, name, marketValuePerShare }
}

export const stockUpdateOrCreate = async ( req, data ) => {
    const result = await stockFinder(req.symbol)
    const stockData = stockApiFormatter(data, req.symbol)
    
    if (!result) {
        return await Prisma.singleStock.create({
        data: stockData
      })
    }

    return Prisma.singleStock.update({
      where: { symbol: req.symbol },
      data: { marketValuePerShare : stockData.marketValuePerShare }
    })
}

export const createUserStock = async ( req, totalValueOfShares: number ) => {

  //Need to find out if there is another userStock of the same sub and symbol

  let userStock = await Prisma.userStock.findMany({
    where: { sub: req.sub, symbol: req.symbol }
  })

  if (userStock.length === 0) {
    const newUserStock = await Prisma.userStock.create({
      data: {
        sub: req.sub,
        symbol: req.symbol,
        entryValuePerShare: req.buyCost,
        numberOfShares: req.quantity,
        totalValueOfShares: totalValueOfShares,
        firstBought: req.date,
        lastBought: req.date
      }
    })
    return newUserStock
  } else {
    // Another userStock of this investment exists - need to update accordingly
    
    const averageEntryValuePerShare = (userStock[0].entryValuePerShare + req.buyCost) / 2
    const totalNumberOfShares = userStock[0].numberOfShares + req.quantity
    

    const updatedUserStock = await Prisma.userStock.updateMany({
      where: { sub: req.sub, symbol: req.sub },
      data: {
        sub: req.sub,
        symbol: req.symbol,
        entryValuePerShare: averageEntryValuePerShare,
        numberOfShares: totalNumberOfShares,
        totalValueOfShares: totalValueOfShares,
        firstBought: userStock[0].firstBought,
        lastBought: req.date
      }
    })
    return updatedUserStock
  }
  
}