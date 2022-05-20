import Prisma from './index'

export const investmentValues = async (sub: string, dateTime: Date, valueToAdd: number) => {
  const listOfUserInvestments = await Prisma.userInvestmentValues.findMany({
    where: { sub }
  })

  let totalInvestmentValueToDate

  if (listOfUserInvestments.length > 0) {
    // Add up previous investments + this current investment

    const lastInvestment = listOfUserInvestments[listOfUserInvestments.length - 1]
    const lastValue = lastInvestment.value
    totalInvestmentValueToDate = lastValue + valueToAdd
  } else {
    // This is their 1st investment
    totalInvestmentValueToDate = valueToAdd
  }

  const userInvestmentValue = await Prisma.userInvestmentValues.create({
    data: {
      sub,
      dateTime,
      value: totalInvestmentValueToDate
    }
  })

  return userInvestmentValue
}

export const createUser = async (sub: string) => {
  await Prisma.user.create({
    data: { sub }
  })

  //! this needs to call getProfile again else it wont return the full data
  return await getProfile(sub)
}

export const updateUserTotalInvestment = async (sub: string) => {
  const listOfUserInvestments = await Prisma.userInvestmentValues.findMany({
    where: {
      sub
    }
  })

  const highestInvestment = listOfUserInvestments[listOfUserInvestments.length - 1].value

  await Prisma.user.update({
    where: { sub },
    data: {
      totalInvestmentValue: highestInvestment
    }
  })
}

export const getProfile = async (sub: string) => {
  const userProfile = await Prisma.user.findUnique({
    where: { sub },
    include: {
      investmentValues: true,
      stocks: {
        include: {
          userStock: {
            include: {
              details: true
            }
          }
        }
      },
      cryptos: {
        include: {
          cryptoList: {
            include: {
              details: true
            }
          }
        }
      },
      commodities: {
        include: {
          commoditiesList: {
            include: {
              details: true
            }
          }
        }
      }
    }
  })

  if (!userProfile) return await createUser(sub)

  return userProfile
}
