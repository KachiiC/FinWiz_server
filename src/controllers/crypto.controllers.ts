// TYPES
import { Request, Response } from 'express'
import { cryptoHeaders } from '../helpers/headers'
import { cryptoUrl } from '../helpers/urls'
import { getRequestWithHeaders, spreadArgs } from '../helpers/apiRequests'
import { addCrypto, updateCrypto } from '../models/crypto.models'
import { cryptoListSorter } from '../helpers/crypto.helpers'
import { oldestCrypto, topCrypto, newestCrypto } from '../data/crypto.snippet.data'
import { investmentsCache } from '../middleware/node.cache'

export const getUserCrypto = async (req: Request, res: Response) => {
  const url = cryptoUrl(req.params.cryptolist)

  try {
    const data = await getRequestWithHeaders(
      url,
      cryptoHeaders(process.env.COINCAP_KEY || '')
    )

    res.send(data.data)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

export const addUserCrypto = async (req: Request, res: Response) => {
  try {
    await addCrypto(req)
    res.status(201)
    res.send('created')
  } catch (err) {
    console.error('Error in addUserCrypto: ', err)
    res.sendStatus(500)
  }
}

export const updateUserCrypto = async (req: Request, res: Response) => {
  try {
    await updateCrypto(req)
    res.status(201)
    res.send('user crypto updated')
  } catch (err) {
    console.error('Error in updateUserCrypto: ', err)
    res.sendStatus(500)
  }
}

export const getCryptoList = async (req: Request, res: Response) => {
  // GETS MODEL

  const oldest = spreadArgs(oldestCrypto)
  const top = spreadArgs(topCrypto)
  const newest = spreadArgs(newestCrypto)

  const oldestUrl = cryptoUrl(oldest)
  const topUrl = cryptoUrl(top)
  const newestUrl = cryptoUrl(newest)

  try {
    const oldestData = await getRequestWithHeaders(
      oldestUrl,
      cryptoHeaders(process.env.COINCAP_KEY || '')
    )
    const topData = await getRequestWithHeaders(
      topUrl,
      cryptoHeaders(process.env.COINCAP_KEY || '')
    )
    const newestData = await getRequestWithHeaders(
      newestUrl,
      cryptoHeaders(process.env.COINCAP_KEY || '')
    )

    const resData = {
      oldest: cryptoListSorter(oldestData.data),
      top: cryptoListSorter(topData.data),
      newest: cryptoListSorter(newestData.data)
    }

    investmentsCache.set('crypto', resData)

    res.status(201)
    res.send(resData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
