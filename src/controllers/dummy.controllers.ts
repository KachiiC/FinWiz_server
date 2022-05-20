import { Response, Request } from 'express'
import UserData from '../data/user.data'

export const getDummyStocks = async (req: Request, res: Response) => {
  try {
    res.send(UserData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
