// TYPES
import { Request, Response } from 'express'
import { iexApiStockList, iexApiStockQuotes } from "../helpers/urls"
import { getRequest } from "../helpers/apiRequests"
import Prisma from '../models/index'
import { createStockList } from '../models/stock.models'
import { investmentValues } from '../models/investmentvalue.model'
import { addStock } from '../models/adduserstock.model'


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

  const url = iexApiStockList(req.params.type)
  try {
      const stockResponse = await getRequest(url)

      const inputData = stockResponse.data.map((stock) => {
          const { symbol, companyName, latestPrice } = stock
          return {
              symbol,
              name: companyName,
              marketValuePerShare: latestPrice
          }
      })
      const resData = await createStockList(inputData)

      res.send(resData)
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



