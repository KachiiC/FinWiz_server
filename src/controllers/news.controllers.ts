import { Response, Request } from 'express'
import { newsUrl, userNewsUrl } from '../helpers/urls'
import { getRequest } from '../helpers/apiRequests'
import { newsListModel } from '../models/news.models'
import { newsCache, userNewsCache } from '../middleware/node.cache'

export const getNewsList = async (req: Request, res: Response) => {
  const url = newsUrl()

  try {
    const newsResponse = await getRequest(url)

    const resData = newsListModel(newsResponse.data.articles)

    newsCache.set('news', resData)

    res.status(201).send(resData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

export const getUserNewsList = async (req: Request, res: Response) => {
  const listOfTopics = req.params.list // aapl,tsla,btc
  const topicsArr = listOfTopics.split(',')
  const topics = topicsArr.join('+') // aapl+tsla+btc

  const url = userNewsUrl(topics)
  try {
    const userNewsResponse = await getRequest(url)

    const resData = newsListModel(userNewsResponse.data.articles)

    userNewsCache.set('userNews', resData)

    res.status(201).send(resData)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
}
