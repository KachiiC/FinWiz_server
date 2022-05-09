// DATA
import stockMockData from "../data/stock.data"
// TYPES
import { Request, Response } from 'express'

export const getUserStocks = (req: Request, res: Response) => {
    res.send(stockMockData)
}
