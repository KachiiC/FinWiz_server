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

export const createUser = async (sub: string ) => {

  await Prisma.user.create({
    data: { sub: sub }
  })

  //! this needs to call getProfile again else it wont return the full data
  return await getProfile(sub);
}

export const getProfile = async ( sub: string ) => {

  const userProfile = await Prisma.user.findUnique({
    where: { sub: sub },
    include: {
      investmentValues : true,
      stocks: {
        include: {
          userStock: {
            include: {
              details: true
            }
          }
        }
      },
      cryptos: true
    }
  })

  if (!userProfile) return await createUser(sub)

  return userProfile
}