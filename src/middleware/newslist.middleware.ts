import { Request, Response, NextFunction } from 'express'
import { newsCache } from './node.cache';

export const newsListCache = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (newsCache.has("news")) {
            return res.status(200).json(newsCache.get("news"));
        }
        return next();
    } catch (err) {
        throw new Error;
    }
};