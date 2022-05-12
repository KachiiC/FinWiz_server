import { Request, Response, NextFunction } from 'express'
import { stockCache } from './node.cache';


export const stockListCache = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;
        if (stockCache.has(type)) {
            return res.status(200).json(stockCache.get(type));
        }
        return next();
    } catch (err) {
        throw new Error;
    }
};