/* eslint-disable camelcase */
import axios from 'axios'
import { commoditiesHeaders } from './headers'
import Prisma from '../models'

export const commoditiesFetch = async (type: string) => {
  try {
    const encodedParams = new URLSearchParams()
    encodedParams.append('n_results', '15')
    encodedParams.append('group_name', type)

    const options = {
      method: 'POST',
      url: 'https://investing4.p.rapidapi.com/commodities/overview',
      headers: commoditiesHeaders(process.env.COMMODITIES_KEY || ''),
      data: encodedParams
    }

    const res = await axios.request(options)

    return res.data.data
  } catch (err) {
    console.log(err)
  }
}

export const commoditiesRender = (data, type) => {
  return data.map((commodity) => {
    const {
      name,
      change,
      change_percentage,
      currency,
      high,
      low,
      last,
      last_close
    } = commodity

    return {
      type,
      name,
      change: Number(change),
      change_percentage: Number(change_percentage.slice(0, -1)),
      currency,
      high,
      low,
      last,
      last_close
    }
  })
}

export const createUserCommodity = async (req, totalValue: number) => {
  const { sub, name, buyCost, date, quantity } = req

  const userCommodity = await Prisma.userCommodity.findFirst({
    where: { sub, name }
  })

  if (!userCommodity) {
    const newUserCommodity = await Prisma.userCommodity.create({
      data: {
        sub,
        name,
        quantityOfCommoditiy: quantity,
        averageBuyPrice: buyCost,
        totalCommodityValue: totalValue,
        firstBought: date,
        lastBought: date
      }
    })
    return newUserCommodity
  } else {
    // Another userCrypto of this investment exists - update accordingly

    return await updateUserCommodity(sub, name, buyCost, quantity)
  }
}

export const updateUserCommodity = async (sub: string, name: string, newEntry: number, quantity: number) => {
  const userCommodities = await Prisma.userCommodity.findFirst({
    where: { sub, name }
  })

  const averageValue = (userCommodities?.averageBuyPrice as number + newEntry) / 2
  const newTotal = userCommodities?.quantityOfCommoditiy as number + quantity

  const updateUserCommodity = await Prisma.userCommodity.updateMany({
    where: { sub, name },
    data: {
      quantityOfCommoditiy: newTotal,
      averageBuyPrice: averageValue,
      totalCommodityValue: newTotal * averageValue,
      lastBought: new Date().toISOString()
    }
  })

  return updateUserCommodity
}
