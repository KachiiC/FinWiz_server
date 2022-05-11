// CONTROLLERS
import { getStockList, getUserStocks } from '../controllers/stock.controllers';
import { getUserCrypto } from '../controllers/crypto.controllers';
import { getDummyStocks }  from '../controllers/dummy.controllers';
// ROUTER
import { Router } from 'express';

const router = Router();

router.get('/user-stock/:stocklist', getUserStocks)
router.get('/user-crypto/:cryptolist', getUserCrypto)
router.get('/stock-list-:type', getStockList)
router.get('/test-user', getDummyStocks)

export default router;
