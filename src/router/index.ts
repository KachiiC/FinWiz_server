// CONTROLLERS
import { getStockList, getUserStocks, addUserStock, updateUserStocks } from '../controllers/stock.controllers'
import { getUserCrypto, addUserCrypto, getCryptoList, updateUserCrypto } from '../controllers/crypto.controllers'
import { getDummyStocks } from '../controllers/dummy.controllers'
import { getUserProfile } from '../controllers/user.controller'
// ROUTER
import { Router } from 'express'

import { commoditiesListCache, cryptoListCache, stockListCache } from '../middleware/investments.middleware'
import { newsListCache, userNewsListCache } from '../middleware/newslist.middleware'
import { getNewsList, getUserNewsList } from '../controllers/news.controllers'

import { addUserCommodity, getCommodities, updateUserCommodity } from '../controllers/commodities.controllers'

const router = Router()

router.get('/user-stock/:stocklist', getUserStocks)
router.get('/user-crypto/:cryptolist', getUserCrypto)
router.get('/commodities-list', commoditiesListCache, getCommodities)
router.get('/crypto-list/', cryptoListCache, getCryptoList)
router.get('/stock-list', stockListCache, getStockList)
router.get('/commodities-list', getCommodities)
router.get('/news', newsListCache, getNewsList)
router.get('/user-news/:list', userNewsListCache, getUserNewsList)

router.get('/user/:sub', getUserProfile)
router.get('/test-user', getDummyStocks)
router.post('/user-add-stock', addUserStock)
router.post('/user-add-crypto', addUserCrypto)
router.post('/user-add-commodity', addUserCommodity)

router.patch('/user-update-stock', updateUserStocks)
router.patch('/user-update-crypto', updateUserCrypto)
router.patch('/user-update-commodity', updateUserCommodity)

export default router
