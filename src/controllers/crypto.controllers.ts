// DATA
import cryptoMockData from "../data/crypto.data"
// TYPES
import { Request, Response } from 'express'

export const getUserCrypto = (req: Request, res: Response) => {
    res.send(cryptoMockData)
}
