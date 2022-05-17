import { Request, Response, NextFunction } from 'express'
import { commoditiesCache, stockCache } from './node.cache';

export const stockListCache = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (stockCache.has('stock')) {
            return res.status(200).json(stockCache.get('stock'));
        }
        return next();
    } catch (err) {
        res.sendStatus(500)
        throw new Error;
    }
};

export const commoditiesListCache = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (commoditiesCache.has('commodities')) {
            return res.status(200).json(commoditiesCache.get('commodities'));
        }
        return next();
    } catch (err) {
        res.sendStatus(500)
        throw new Error;
    }
};