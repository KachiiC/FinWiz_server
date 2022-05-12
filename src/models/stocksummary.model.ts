import Prisma from './index'

export const stockSummary = async (sub: string, symbol: string, quantity: number, buyCost: number) => {

  let stockSummary = await Prisma.stockSummary.findUnique({
    where: {
      sub: sub
    }
  })

  const listOfUserStocks = await Prisma.userStock.findMany({
    where: {
      sub: sub
    }
  })

  let oldestStock
  let newestStock
  let stockWithMostShares
  let currentTotalAmount
  let highestInvestmentStock

  if (listOfUserStocks.length > 0) {
    oldestStock = listOfUserStocks.reduce((prev, curr) => {
      prev = new Date(prev.firstBought).getTime() < new Date(curr.firstBought).getTime() ? prev : curr
      return prev
    }).symbol
  
    newestStock = listOfUserStocks.reduce((prev, curr) => {
      prev = new Date(prev.firstBought).getTime() > new Date(curr.firstBought).getTime() ? prev : curr
      return prev
    }).symbol
  
    stockWithMostShares = listOfUserStocks.reduce((prev, curr) => {
      prev = prev.numberOfShares > curr.numberOfShares ? prev : curr
      return prev
    }).symbol
  
    currentTotalAmount = listOfUserStocks.reduce((prev, curr) => {
      return prev + curr.totalValueOfShares
    }, 0)
    
    highestInvestmentStock = listOfUserStocks.reduce((prev, curr) => {
      prev = prev.totalValueOfShares > curr.totalValueOfShares ? prev : curr
      return prev
    }).symbol

  } else {
    oldestStock = symbol
    newestStock = symbol
    stockWithMostShares = symbol
    currentTotalAmount = quantity * buyCost
    highestInvestmentStock = symbol
  }
  
  if (!stockSummary) {
    stockSummary = await Prisma.stockSummary.create({
      data: {
        sub: sub,
        currentTotalAmount: currentTotalAmount,
        oldestStock: oldestStock,
        newestStock: newestStock,
        stockWithMostShares: stockWithMostShares,
        highestInvestmentStock: highestInvestmentStock
      }
    })
   } else {
     stockSummary = await Prisma.stockSummary.update({
       where: {
         sub: sub
       },
       data: {
         currentTotalAmount: currentTotalAmount,
         oldestStock: oldestStock,
         newestStock: newestStock,
         stockWithMostShares: stockWithMostShares,
         highestInvestmentStock: highestInvestmentStock
       }
     })
   }

   return stockSummary
}