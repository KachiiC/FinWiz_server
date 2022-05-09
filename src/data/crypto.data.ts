import { CryptoListProps } from "controllers/interfaces/crypto.controllers.interface"

const BitCoin = {
    name: 'BitCoin',
    value: 33625.620,
    code: 'BTC',
    entry_time: '2022-04-09T09:21:00.000Z',
    entry_value: 33620.40,
    current_time: '2022-05-09T10:48:00.000Z',
    first_bought: '2022-04-09T09:21:00.000Z',
    last_bought: '2022-05-03T10:48:00.000Z'
}

const LiteCoin = {
    name: 'LiteCoin',
    value: 91.401,
    code: 'LTC',
    entry_time: '2022-03-09T09:21:00.000Z',
    entry_value: 90.300,
    current_time: '2022-05-09T10:48:00.000Z',
    first_bought: '2022-03-09T09:21:00.000Z',
    last_bought: '2022-04-03T10:48:00.000Z'
}

const DogeCoin = {
    name: 'DogeCoin',
    value: 0.124,
    code: 'DOGE',
    entry_time: '2022-01-14T12:21:00.000Z',
    entry_value: 0.127,
    current_time: '2022-05-09T10:48:00.000Z',
    first_bought: '2022-01-12T12:21:00.000Z',
    last_bought: '2022-01-14T12:21:00.000Z'
}

const Monero = {
    name: 'Monero',
    value: 210.323,
    code: 'XMR',
    entry_time: '2022-02-10T18:30:00.000Z',
    entry_value: 209.400,
    current_time: '2022-05-09T10:48:00.000Z',
    first_bought: '2022-02-10T18:30:00.000Z',
    last_bought: '2022-02-18T18:30:00.000Z'
}

const Stellar = {
    name: 'Stellar',
    value: 0.168,
    code: 'XLM',
    entry_time: '2022-02-20T10:30:00.000Z',
    entry_value: 0.165,
    current_time: '2022-05-09T10:48:00.000Z',
    first_bought: '2022-04-10T18:30:00.000Z',
    last_bought: '2022-05-04T10:20:00.000Z'
}

const cryptoMockData: CryptoListProps = {
    crypto_list: [BitCoin, LiteCoin, DogeCoin, Monero, Stellar],
    total_value: 33927.636,
    total_amount: 5,
    highest_value: BitCoin,
    lowest_value: DogeCoin,
    newest: Stellar,
    oldest: DogeCoin,
    highest_quantity: DogeCoin,
    lowest_quantity: BitCoin
}

export default cryptoMockData