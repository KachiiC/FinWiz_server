// CONTROLLERS
import { getStockList, getUserStocks, addUserStock } from '../controllers/stock.controllers';
import { getUserCrypto, addUserCrypto } from '../controllers/crypto.controllers';
import { getDummyStocks } from '../controllers/dummy.controllers';
import { getUserProfile } from '../controllers/user.controller';
// ROUTER
import { Router } from 'express';
import { stockListCache } from '../middleware/stocklist.middleware';
import { newsListCache } from '../middleware/newslist.middleware';
import { getNewsList } from '../controllers/news.controllers';

const router = Router();

router.get('/user-stock/:stocklist', getUserStocks)
router.get('/user-crypto/:cryptolist', getUserCrypto)
router.get('/stock-list-:type', stockListCache, getStockList)
router.get('/news', newsListCache, getNewsList)

router.get('/user/:sub', getUserProfile)
router.get('/test-user', getDummyStocks)
router.post('/user-add-stock', addUserStock)
router.post('/user-add-crypto', addUserCrypto)

export default router;
