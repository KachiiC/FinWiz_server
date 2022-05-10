// TYPES
import { Request, Response } from 'express'
import { iexApiStockList, iexApiStockQuotes } from "../helpers/urls"
import { getRequest } from "../helpers/apiRequests"

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
        const data = await getRequest(url)

        res.send(data.data)
    } catch (err) {
        console.error(err)
        res.sendStatus(404)
    }
}
