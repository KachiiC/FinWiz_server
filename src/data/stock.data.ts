import { StocksListProps } from 'controllers/interfaces/stock.controllers.interface'

const Apple = {
  name: 'Apple Inc',
  market_value_per_share: 157.28,
  symbol: 'AAPL',
  entry_value_per_share: 156.2,
  number_of_shares: 10,
  total_value_of_shares: 1572.8,
  first_bought: '2022-04-06T09:21:00.000Z',
  last_bought: '2022-05-03T11:21:00.000Z'
}

const Facebook = {
  name: 'Meta Platforms Inc - Class A',
  market_value_per_share: 203.77,
  symbol: 'FB',
  entry_value_per_share: 204.35,
  number_of_shares: 5,
  total_value_of_shares: 1018.85,
  first_bought: '2021-12-06T09:21:00.000Z',
  last_bought: '2022-02-10T14:30:00.000Z'
}

const Tesla = {
  name: 'Tesla Inc',
  market_value_per_share: 865.65,
  symbol: 'TSLA',
  entry_value_per_share: 868,
  number_of_shares: 3,
  total_value_of_shares: 2596.95,
  first_bought: '2022-01-06T14:45:00.000Z',
  last_bought: '2022-02-04T14:45:00.000Z'
}

const Microsoft = {
  name: 'Microsoft Corporation',
  market_value_per_share: 274.73,
  symbol: 'MSFT',
  entry_value_per_share: 274.88,
  number_of_shares: 6,
  total_value_of_shares: 1648.38,
  first_bought: '2022-03-15T13:30:00.000Z',
  last_bought: '2022-04-15T11:30:00.000Z'
}

const Google = {
  name: 'Alphabet Inc - Class C',
  market_value_per_share: 2313.2,
  symbol: 'GOOG',
  entry_value_per_share: 2316.23,
  number_of_shares: 2,
  total_value_of_shares: 4626.4,
  first_bought: '2022-04-07T10:30:00.000Z',
  last_bought: '2022-04-07T10:30:00.000Z'
}

const stockMockData: StocksListProps = {
  stocks_list: [Apple, Facebook, Tesla, Microsoft, Google],
  total_value_of_stocks: 11463.38,
  number_of_different_stocks: 5,
  oldest_stock: Facebook,
  newest_stock: Google,
  stock_with_most_shares: Apple,
  number_of_most_shares: 10,
  highest_investment_total: 4626.4,
  highest_value_stock_price: 2313.2,
  lowest_value_stock_price: 157.28
}

export default stockMockData
