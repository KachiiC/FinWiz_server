import { Request, Response, NextFunction } from 'express'
import { newsCache, userNewsCache } from './node.cache'

export const newsListCache = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (newsCache.has('news')) {
      return res.status(200).json(newsCache.get('news'))
    }
    return next()
  } catch (err) {
    res.status(500)
    res.send(`Error in newsListCache: ${err}`)
  }
}

export const userNewsListCache = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (userNewsCache.has('userNews')) {
      return res.status(200).json(userNewsCache.get('userNews'))
    }
    return next()
  } catch (err) {
    res.status(500)
    res.send(`Error in userNewsListCache: ${err}`)
  }
}
