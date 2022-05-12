import Prisma from './index'

export const cryptoSummary = async (sub: string, symbol: string, quantity: number, buyCost: number) => {

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