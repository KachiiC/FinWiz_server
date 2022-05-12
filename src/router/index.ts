// CONTROLLERS
import { getStockList, getUserStocks, addUserStock } from '../controllers/stock.controllers';
import { getUserCrypto, addUserCrypto } from '../controllers/crypto.controllers';
import { getDummyStocks }  from '../controllers/dummy.controllers';
// ROUTER
import { Router } from 'express';

const router = Router();

router.get('/user-stock/:stocklist', getUserStocks)
router.get('/user-crypto/:cryptolist', getUserCrypto)
router.get('/stock-list-:type', getStockList)
router.get('/test-user', getDummyStocks)

router.post('/user-add-stock', addUserStock)
router.post('/user-add-crypto', addUserCrypto)

export default router;
