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
  const {sub, symbol, buyCost, date, quantity } = req

  let userStock = await Prisma.userStock.findFirst({
    where: { sub, symbol }
  })

  if (!userStock) {
    const newUserStock = await Prisma.userStock.create({
      data: {
        sub,
        symbol,
        entryValuePerShare: buyCost,
        numberOfShares: quantity,
        totalValueOfShares,
        firstBought: date,
        lastBought: date
      }
    })
    return newUserStock
  } else {
    // Another userStock of this investment exists - need to update accordingly
    
    const averageEntryValuePerShare = (userStock.entryValuePerShare + req.buyCost) / 2
    const totalNumberOfShares = userStock.numberOfShares + req.quantity
    

    const updatedUserStock = await Prisma.userStock.updateMany({
      where: { sub: req.sub, symbol: req.sub },
      data: {
        sub: req.sub,
        symbol: req.symbol,
        entryValuePerShare: averageEntryValuePerShare,
        numberOfShares: totalNumberOfShares,
        totalValueOfShares: totalValueOfShares,
        firstBought: userStock.firstBought,
        lastBought: req.date
      }
    })
    return updatedUserStock
  }
}

export const updateUserStock = async (sub: string, symbol: string, newEntry: number, quantity: number) => {
  let userStock = await Prisma.userStock.findFirst({
    where: { sub, symbol }
  })

  // get ((total value of shares / number of shares) + newEntry )/ 2
  const averageEntry = userStock?.entryValuePerShare as number + newEntry / 2
  const totalNumberOfShares = userStock?.numberOfShares as number + quantity
  

  const updatedUserStock = await Prisma.userStock.updateMany({
    where: { sub, symbol },
    data: {
      sub,
      symbol,
      entryValuePerShare: averageEntry,
      numberOfShares: totalNumberOfShares,
      totalValueOfShares: totalNumberOfShares * averageEntry,
      lastBought: new Date().toISOString()
    }
  })
  
  return updatedUserStock
}
