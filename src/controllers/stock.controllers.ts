import { Request, Response } from 'express'
import { iexApiStockList, iexApiStockQuotes } from '../helpers/urls'
import { getRequest } from '../helpers/apiRequests'
import { addStock, stockListModel, updateStock } from '../models/stock.models'
import { investmentsCache } from '../middleware/node.cache'

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
  const stockUrl = (url: 'gainers' | 'losers' | 'mostactive') => getRequest(iexApiStockList(url))

  try {
    const gainers = await stockUrl('gainers')
    const losers = await stockUrl('losers')
    const mostActive = await stockUrl('mostactive')

    const resData = {
      gainers: stockListModel(gainers.data),
      losers: stockListModel(losers.data),
      mostActive: stockListModel(mostActive.data)
    }

    investmentsCache.set('stock', resData)

    res.status(200).send(resData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

export const addUserStock = async (req: Request, res: Response) => {
  try {
    await addStock(req)
    res.status(201)
    res.send('userRecord')
  } catch (err) {
    console.error('Error in addUserStock: ', err)
    res.sendStatus(500)
  }
}

export const updateUserStocks = async (req: Request, res: Response) => {
  try {
    await updateStock(req)
    res.status(200)
    res.send('user stock updated')
  } catch (err) {
    console.error('Error in updateUserStocks: ', err)
    res.sendStatus(500)
  }
}
