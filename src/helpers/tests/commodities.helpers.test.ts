import { test, jest, expect } from '@jest/globals'
import axios from 'axios'
import { prismaMock } from '../../singleton'
import { commoditiesFetch, createUserCommodity, commoditiesRender, updateUserCommodity } from '../commodities.helpers'
import { commoditiesHeaders } from '../headers'

jest.mock('axios')

test('should fetch commodities data on type ', async () => {
  const Gold =
    {
      data: {
        name: 'Gold',
        type: 'metals',
        currency: 'USD',
        change: 12.34,
        change_percentage: 0.68,
        high: 1829.11,
        low: 1820.74,
        last: 1826.34,
        last_close: 1814
      }
    }
  const encodedParams = new URLSearchParams()
  encodedParams.append('n_results', '15')
  encodedParams.append('group_name', 'metals')

  const options = {
    method: 'POST',
    url: 'https://investing4.p.rapidapi.com/commodities/overview',
    headers: commoditiesHeaders(process.env.COMMODITIES_KEY || ''),
    data: encodedParams
  }

  // @ts-ignore
  axios.request.mockResolvedValueOnce({ data: Gold })
  const response = await commoditiesFetch('metals')
  expect(axios.request).toHaveBeenCalledWith(options)
  expect(response).toEqual(Gold.data)
})

test('should correctly render the commodities data', () => {
  const mockData = [{
    name: 'Gold',
    change: '12.34',
    change_percentage: '0.680',
    currency: 'USD',
    high: 1829.11,
    low: 1820.74,
    last: 1826.34,
    last_close: 1814
  }]
  const result = [{
    type: 'metals',
    name: 'Gold',
    change: 12.34,
    currency: 'USD',
    change_percentage: 0.68,
    high: 1829.11,
    low: 1820.74,
    last: 1826.34,
    last_close: 1814
  }]
  expect(commoditiesRender(mockData, 'metals')).toEqual(result)
})

test('should create a user Commodity if it does not exist', async () => {
  const mockDate = new Date('2022-04-10T18:30:00.000Z')
  const mockReq =
    {
      sub: 'user',
      name: 'Gold',
      buyCost: 1814,
      date: mockDate,
      quantity: 1
    }
  const mockUserCommodity =
    {
      sub: 'user',
      name: 'Gold',
      quantityOfCommoditiy: 1,
      averageBuyPrice: 1814,
      totalCommodityValue: 1814,
      firstBought: mockDate,
      lastBought: mockDate
    }
  // @ts-ignore
  prismaMock.userCommodity.findFirst.mockResolvedValue(null)
  // @ts-ignore
  prismaMock.userCommodity.create.mockResolvedValue(mockUserCommodity)
  await expect(createUserCommodity(mockReq, 1814)).resolves.toEqual(mockUserCommodity)
})

test('should update a user commodity if it exists', async () => {
  const mockDate = new Date('2022-04-10T18:30:00.000Z')
  const mockUserCommodity =
    {
      sub: 'user',
      name: 'Gold',
      quantityOfCommoditiy: 1,
      averageBuyPrice: 1814,
      totalCommodityValue: 1814,
      firstBought: mockDate,
      lastBought: mockDate
    }
  // @ts-ignore
  prismaMock.userCommodity.findFirst.mockResolvedValue(mockUserCommodity)
  // @ts-ignore
  prismaMock.userCommodity.updateMany.mockResolvedValue({ count: 1 })
  await expect(updateUserCommodity('user', 'Gold', 1814, 1)).resolves.toEqual({ count: 1 })
})
