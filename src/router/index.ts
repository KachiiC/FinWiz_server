import { getUserStocks } from '../controllers/stock.controllers';
import { Router } from 'express';

const router = Router();

router.get('/user-stock', getUserStocks)

export default router;
