import { CryptoListProps } from "controllers/interfaces/crypto.controllers.interface"

const BitCoin = {
    name: 'BitCoin',
    market_value_per_crypto: 33625.62,
    symbol: 'BTC',
    entry_value_per_crypto: 33620.4,
    quantity_of_crypto: 0.03,
    total_crypto_value: 1008.769,
    first_bought: '2022-04-09T09:21:00.000Z',
    last_bought: '2022-05-03T10:48:00.000Z'
  }
  ​
  const LiteCoin = {
    name: 'LiteCoin',
    market_value_per_crypto: 91.401,
    symbol: 'LTC',
    entry_value_per_crypto: 90.3,
    quantity_of_crypto: 1.2,
    total_crypto_value: 109.68,
    first_bought: '2022-03-09T09:21:00.000Z',
    last_bought: '2022-04-03T10:48:00.000Z'
  }
  ​
  const DogeCoin = {
    name: 'DogeCoin',
    market_value_per_crypto: 0.124,
    symbol: 'DOGE',
    entry_value_per_crypto: 0.127,
    quantity_of_crypto: 140,
    total_crypto_value: 17.36,
    first_bought: '2022-01-12T12:21:00.000Z',
    last_bought: '2022-01-14T12:21:00.000Z'
  }
  ​
  const Monero = {
    name: 'Monero',
    market_value_per_crypto: 210.323,
    symbol: 'XMR',
    entry_value_per_crypto: 209.4,
    quantity_of_crypto: 2.5,
    total_crypto_value: 525.8,
    first_bought: '2022-02-10T18:30:00.000Z',
    last_bought: '2022-02-18T18:30:00.000Z'
  }
  ​
  const Stellar = {
    name: 'Stellar',
    market_value_per_crypto: 0.168,
    symbol: 'XLM',
    entry_value_per_crypto: 0.165,
    quantity_of_crypto: 400,
    total_crypto_value: 67.2,
    first_bought: '2022-04-10T18:30:00.000Z',
    last_bought: '2022-05-04T10:20:00.000Z'
  }

const cryptoMockData: CryptoListProps = {
    crypto_list: [BitCoin, LiteCoin, DogeCoin, Monero, Stellar],
    total_value_of_crypto: 1728.817,
    number_of_different_crypto: 5,
    highest_invested_crypto: "BitCoin",
    highest_invested_crypto_total: 1008.769,
    highest_valued_per_crypto: BitCoin,
    lowest_valued_per_crypto: DogeCoin,
    highest_quantity_crypto: Stellar,
    lowest_quantity_crypto: BitCoin,
    newest_crypto_bought: Stellar,
    oldest_crypto_bought: DogeCoin,
}

export default cryptoMockData