// import { commoditiesFetch, commoditiesRender } from '../helpers/commodities.helpers'
import { latestCommoditiesData } from '../data/commodities.data'
import Prisma from '../models'
import { Request } from 'express'
import { createUserCommodity } from '../helpers/commodities.helpers'
import { investmentValues, updateUserTotalInvestment } from './user.models'

export const liveCommodities = async () => {
  // const metals = await commoditiesFetch("metals")
  // const softs = await commoditiesFetch("softs")
  // const meats = await commoditiesFetch("meats")
  // const energy = await commoditiesFetch("energy")
  // const grains = await commoditiesFetch("grains")

  // const metalsData = commoditiesRender(metals, 'metals')
  // const softsData = commoditiesRender(softs, 'softs')
  // const meatsData = commoditiesRender(meats, 'meats')
  // const energyData = commoditiesRender(energy, 'energy')
  // const grainsData = commoditiesRender(grains, 'grains')

  // const resData = [
  //     ...metalsData,
  //     ...softsData,
  //     ...meatsData,
  //     ...energyData,
  //     ...grainsData
  // ]
  return latestCommoditiesData
}

export const commoditiesList = async () => {
  try {
    const currentCommodities = await Prisma.singleCommodity.findMany()

    if (currentCommodities.length > 0) return

    await Prisma.singleCommodity.createMany({
      data: latestCommoditiesData
    })

    const resData = await Prisma.singleCommodity.findMany()

    return resData
  } catch (err) {
    console.log(err)
  }
}

export const addCommodity = async (req: Request) => {
  try {
    const {
      name,
      quantity,
      date,
      sub
    } = req.body

    const apiData = latestCommoditiesData.find((commodity) => commodity.name === name)

    const totalValueOfCommodity = apiData?.last as number * quantity

    console.log('TOTAL VALUE OF COMMODITY', totalValueOfCommodity)
    await commoditiesList()

    await createCommoditiesSummary(req.body)
    await createUserCommodity(req.body, totalValueOfCommodity)
    await updateCommoditiesSummary(sub)
    const userInvestmentValue = await investmentValues(sub, date, totalValueOfCommodity)

    await Prisma.user.update({
      where: { sub: sub },
      data: { totalInvestmentValue: userInvestmentValue.value }
    })
  } catch (err) {
    console.log(err)
  }
}

export const createCommoditiesSummary = async (req) => {
  const { sub, name, buyCost, quantity } = req

  const commoditiesSummary = await Prisma.commoditiesSummary.findUnique({
    where: { sub }
  })

  if (!commoditiesSummary) {
    await Prisma.commoditiesSummary.create({
      data: {
        sub,
        totalValueOf: buyCost * quantity,
        highestInvestedCommodity: name,
        highestValuePerCommodity: name
      }
    })
  }
}

export const updateCommoditiesSummary = async (sub: string) => {
  const listOfUserCommodities = await Prisma.userCommodity.findMany({
    where: { sub }
  })

  let totalValueOf, highestInvestedCommodity, highestValuePerCommodity

  if (listOfUserCommodities.length > 0) {
    totalValueOf = listOfUserCommodities.reduce((prev, curr) => {
      return prev + curr.totalCommodityValue
    }, 0)

    highestInvestedCommodity = listOfUserCommodities.reduce((prev, curr) => prev.totalCommodityValue > curr.totalCommodityValue ? prev : curr).name

    highestValuePerCommodity = listOfUserCommodities.reduce((prev, curr) => prev.averageBuyPrice > curr.averageBuyPrice ? prev : curr).name
  }

  const inputData = {
    totalValueOf,
    highestInvestedCommodity,
    highestValuePerCommodity
  }

  const commoditiesSummary = await Prisma.commoditiesSummary.update({
    where: { sub },
    data: { ...inputData }
  })

  return commoditiesSummary
}

export const updateCommodity = async (req: Request) => {
  const {
    sub,
    name,
    quantity,
    boughtOrSold,
    date
  } = req.body

  const existingCommodity = await Prisma.userCommodity.findFirst({
    where: { sub, name }
  })

  const existingQuantity = existingCommodity?.quantityOfCommoditiy

  const singleCommod = await Prisma.singleCommodity.findFirst({
    where: { name }
  })

  const apiDataValue : number = singleCommod?.last as number

  if (!boughtOrSold && existingQuantity === quantity) {
    // User has sold off all quantity of this commodity. Delete userCommodity
    const deletedUserCommodity = await Prisma.userCommodity.deleteMany({
      where: { sub, name }
    })

    const valueToAdd = -quantity * apiDataValue
    await updateCommoditiesSummary(sub)
    await investmentValues(sub, date, valueToAdd)
    await updateUserTotalInvestment(sub)

    return deletedUserCommodity
  }

  // User has bought more commodity to add on

  let updatedQuantity: number = 0

  if (boughtOrSold) updatedQuantity = existingQuantity as number + quantity
  if (!boughtOrSold) updatedQuantity = existingQuantity as number - quantity

  const updatedTotalValue = updatedQuantity * apiDataValue

  let updatedDate
  if (boughtOrSold) updatedDate = date
  if (!boughtOrSold) updatedDate = existingCommodity?.lastBought

  const updatedUserCommod = await Prisma.userCommodity.updateMany({
    where: { sub, name },
    data: {
      quantityOfCommoditiy: updatedQuantity,
      totalCommodityValue: updatedTotalValue,
      averageBuyPrice: apiDataValue,
      lastBought: updatedDate
    }
  })

  let valueToAdd = 0
  if (boughtOrSold) valueToAdd = quantity * apiDataValue
  if (!boughtOrSold) valueToAdd = -quantity * apiDataValue

  await updateCommoditiesSummary(sub)
  await investmentValues(sub, updatedDate, valueToAdd)
  await updateUserTotalInvestment(sub)

  return updatedUserCommod
}
