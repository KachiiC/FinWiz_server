// TYPES
import { Request, Response } from 'express'
import { cryptoHeaders } from '../helpers/headers'
import { cryptoUrl } from '../helpers/urls'
import { getRequestWithHeaders } from "../helpers/apiRequests"
import { addCrypto } from '../models/addcrypto.model'

export const getUserCrypto = async (req: Request, res: Response) => {

    const url = cryptoUrl(req.params.cryptolist)

    try {
        const data = await getRequestWithHeaders(
            url,
            cryptoHeaders(process.env.COINCAP_KEY || "")
        )

        res.send(data.data)
    }
    catch (err) {
        console.error(err)
        res.sendStatus(404)
    }

}

export const addUserCrypto = async (req: Request, res: Response) => {
  
  try {
    const userRecord = await addCrypto(req)
    res.status(201)
    res.json(userRecord)
  }catch (err) {
    console.error('Error in addUserCrypto: ', err)
    res.sendStatus(404)
  }
}


