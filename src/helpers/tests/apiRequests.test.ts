import axios from 'axios'
import { test, jest, expect } from '@jest/globals'
import { getRequest, getRequestWithHeaders, cryptoApiData, stockApiData, spreadArgs } from '../apiRequests'

const cryptoData = {
  BTC: {
    quote: {
      USD: { price: 30000 }
    },
    name: 'BitCoin'
  }
}

jest.mock('axios')

test('should return response from getRequest ', async () => {
  const URL = 'http://test.com'
  // @ts-ignore
  axios.request.mockResolvedValueOnce({ data: cryptoData })
  const response = await getRequest(URL)
  expect(axios.request).toHaveBeenCalledWith({ method: 'GET', url: URL })
  expect(response).toEqual({ data: cryptoData })
})

test('shoud return response from getRequestWithHeaders ', async () => {
  const URL = 'http://test.com'
  // @ts-ignore
  axios.request.mockResolvedValueOnce({ data: cryptoData })
  const response = await getRequestWithHeaders(URL, { test: 'header' })
  expect(axios.request).toHaveBeenCalledWith({ method: 'GET', url: URL, headers: { test: 'header' } })
  expect(response).toEqual({ data: cryptoData })
})

test('should call get request with crypto api data', async () => {
  // @ts-ignore
  axios.request.mockResolvedValueOnce({ data: cryptoData })
  const response = await cryptoApiData('BTC')
  expect(response).toEqual(cryptoData)
})

test('should call get request with stock api data', async () => {
  // @ts-ignore
  axios.request.mockResolvedValueOnce({ data: cryptoData })
  const response = await stockApiData('BTC')
  expect(response).toEqual({ data: cryptoData })
})

test('should spread an array of symbols into a string', () => {
  const dataArray = [{ symbol: 'BTC' }, { symbol: 'DOGE' }, { symbol: 'XLM' }]
  const result = 'BTC,DOGE,XLM'
  expect(spreadArgs(dataArray)).toEqual(result)
})
