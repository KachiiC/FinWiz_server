import { Router, Request, Response } from 'express';

const router = Router();

router.get('/user', (req: Request, res: Response) => res.send('user!'))
    .get('/stock', (req: Request, res: Response) => res.send('stock!'))
    .get('/crypto', (req: Request, res: Response) => res.send('crypto!'))

export default router;
