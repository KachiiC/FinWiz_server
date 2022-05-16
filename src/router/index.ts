// CONTROLLERS
import { getStockList, getUserStocks, addUserStock, updateUserStocks } from '../controllers/stock.controllers';
import { getUserCrypto, addUserCrypto, getCryptoList } from '../controllers/crypto.controllers';
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
router.get('/crypto-list/:cryptolist', stockListCache, getCryptoList)
router.get('/stock-list/:type', stockListCache, getStockList)
router.get('/news', newsListCache, getNewsList)

router.get('/user/:sub', getUserProfile)
router.get('/test-user', getDummyStocks)
router.post('/user-add-stock', addUserStock)
router.post('/user-add-crypto', addUserCrypto)

router.patch('/user-update-stock', updateUserStocks)

export default router;
