import { Response, Request } from "express"
import { newsUrl } from "../helpers/urls"
import { getRequest } from "../helpers/apiRequests"
import { newsListModel } from "../models/news.models"
import { newsCache } from "../middleware/node.cache"

export const getNewsList = async (req: Request, res: Response) => {

    const url = newsUrl()

    try {
        const stockResponse = await getRequest(url)

        const resData = newsListModel(stockResponse.data.articles)

        newsCache.set("news", resData);

        res.status(201).send(resData)
    } catch (err) {
        console.error(err)
        res.sendStatus(404)
    }
}