export const currencyRounder = (num: number, round?: number) => Number((num).toFixed(round || 2))

export const percentageCalculator = (num1: number, num2: number) => {
  const change = (num1 - num2) / num1 * 100

  return Number((change).toFixed(2))
}
