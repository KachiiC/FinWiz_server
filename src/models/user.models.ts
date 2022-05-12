import Prisma from './index'

export const investmentValues = async (sub: string, dateTime: Date, valueToAdd: number) => {

  const listOfUserInvestments = await Prisma.userInvestmentValues.findMany({
    where: {
      sub: sub
     }
  })

  let totalInvestmentValueToDate

  if (listOfUserInvestments.length > 0) {
     totalInvestmentValueToDate = listOfUserInvestments.reduce((prev, curr) => {
      return prev + curr.value
    }, 0)
  } else {
    totalInvestmentValueToDate = valueToAdd
  }

  const userInvestmentValue = await Prisma.userInvestmentValues.create({
    data: {
      sub: sub,
      dateTime: dateTime,
      value: totalInvestmentValueToDate
    }
  })
  
  return userInvestmentValue
}