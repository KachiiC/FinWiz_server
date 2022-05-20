import { Request, Response, NextFunction } from 'express'
import { investmentsCache } from './node.cache'

export const cryptoListCache = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (investmentsCache.has('crypto')) {
      res.status(200)
      return res.json(investmentsCache.get('crypto'))
    }
    return next()
  } catch (err) {
    res.sendStatus(500)
    console.log(err)
    throw new Error()
  }
}

export const stockListCache = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (investmentsCache.has('stock')) {
      return res.status(200).json(investmentsCache.get('stock'))
    }
    return next()
  } catch (err) {
    res.sendStatus(500)
    throw new Error()
  }
}

export const commoditiesListCache = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (investmentsCache.has('commodities')) {
      return res.status(200).json(investmentsCache.get('commodities'))
    }
    return next()
  } catch (err) {
    res.sendStatus(500)
    throw new Error()
  }
}
