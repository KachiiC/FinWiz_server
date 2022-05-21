import { test, expect } from '@jest/globals'
import { currencyRounder, percentageCalculator } from '../priceHelpers'

test('should round the currency to 2 decimal places', () => {
  expect(currencyRounder(15.632)).toEqual(15.63)
})

test('should round the currency to 3 decimal places', () => {
  expect(currencyRounder(15.2940, 3)).toEqual(15.294)
})

test('should calculate the percentage', () => {
  expect(percentageCalculator(20, 18)).toEqual(10.00)
})
