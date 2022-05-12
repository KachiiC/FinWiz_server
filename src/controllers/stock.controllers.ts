import { Request, Response } from 'express'
import { iexApiStockList, iexApiStockQuotes } from "../helpers/urls"
import { getRequest } from "../helpers/apiRequests"
import { addStock } from '../models/adduserstock.model'
import { stockListModel } from '../models/stock.models'
import { stockCache } from '../middleware/node.cache'

export const getUserStocks = async (req: Request, res: Response) => {

  const url = iexApiStockQuotes(req.params.stocklist)

  try {
    const data = await getRequest(url)

    res.send(data.data)
  } catch (err) {
    console.error(err)
    res.sendStatus(404)
  }
}

export const getStockList = async (req: Request, res: Response) => {
  const { type } = req.params

  const url = iexApiStockList(type)

  try {
    const stockResponse = await getRequest(url)

    const resData = stockListModel(stockResponse.data)

    stockCache.set(type, resData);

    res.status(200).send(resData)
  } catch (err) {
    console.error(err)
    res.sendStatus(404)
  }
}

export const addUserStock = async (req: Request, res: Response) => {

  try {
    const userRecord = await addStock(req)
    res.sendStatus(201)
    res.json(userRecord)
  } catch (err) {
    console.error('Error in addUserStock: ', err)
    res.sendStatus(404)
  }
}

