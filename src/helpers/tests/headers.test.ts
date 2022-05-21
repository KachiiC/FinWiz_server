import { test, expect } from '@jest/globals'
import { cryptoHeaders, commoditiesHeaders } from '../headers'

test('should return a header for crypto', () => {
  const mockHeader = { 'X-CMC_PRO_API_KEY': 'test' }
  expect(cryptoHeaders('test')).toEqual(mockHeader)
})

test('should return commodities header', () => {
  const mockHeader =
    {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Host': 'investing4.p.rapidapi.com',
      'X-RapidAPI-Key': 'test'
    }
  expect(commoditiesHeaders('test')).toEqual(mockHeader)
})
