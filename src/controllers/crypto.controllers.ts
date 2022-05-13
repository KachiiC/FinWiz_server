// TYPES
import { Request, Response } from 'express'
import { cryptoHeaders } from '../helpers/headers'
import { cryptoUrl } from '../helpers/urls'
import { getRequestWithHeaders, spreadArgs } from "../helpers/apiRequests"
import { addCrypto } from '../models/crypto.models'
import { cryptoListSorter, cryptoObjects } from '../helpers/crypto.helpers'

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
    await addCrypto(req)
    res.status(201)
    res.send("created")
  } catch (err) {
    console.error('Error in addUserCrypto: ', err)
    res.sendStatus(404)
  }
}

export const getCryptoList = async (req: Request, res: Response) => {

  // GETS MODEL
  const correctModel = cryptoObjects[req.params.cryptolist]
  const argsList = spreadArgs(correctModel)
  const url = cryptoUrl(argsList)

  try {
    const data = await getRequestWithHeaders(
      url,
      cryptoHeaders(process.env.COINCAP_KEY || "")
    )

    const resData = cryptoListSorter(data.data)

    res.send(resData)
  }
  catch (err) {
    console.error(err)
    res.sendStatus(404)
  }

}

