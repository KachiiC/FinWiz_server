import { Request, Response } from 'express'
import { addCommodity, liveCommodities, updateCommodity } from '../models/commodities.models'

export const getCommodities = async (req: Request, res: Response) => {
  const resData = await liveCommodities()

  res.status(200)
  res.send(resData)
}

export const addUserCommodity = async (req: Request, res: Response) => {
  try {
    await addCommodity(req)
    res.status(201)
    res.send('created')
  } catch (err) {
    console.error('Error in addUserCrypto: ', err)
    res.sendStatus(500)
  }
}

export const updateUserCommodity = async (req: Request, res: Response) => {
  try {
    await updateCommodity(req)
    res.status(201)
    res.send('user commodity updated')
  } catch (err) {
    console.error('Error in updateUserCommodity: ', err)
    res.sendStatus(500)
  }
}
