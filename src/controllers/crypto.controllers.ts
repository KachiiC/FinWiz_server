// TYPES
import { Request, Response } from 'express'
import { cryptoHeaders } from '../helpers/headers'
import { cryptoUrl } from '../helpers/urls'
import { getRequestWithHeaders } from "../helpers/apiRequests"

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
