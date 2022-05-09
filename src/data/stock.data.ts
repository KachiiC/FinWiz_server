import { StocksListProps } from "controllers/interfaces/stock.controllers.interface"

const Apple = {
    name: 'Apple Inc',
    value: 157.28,
    code: 'AAPL',
    entry_value: 156.20,
    quantity: 10,
    first_bought: '2022-04-06T09:21:00.000Z',
    last_bought: '2022-04-06T09:21:00.000Z'
}

const Facebook = {
    name: 'Meta Platforms Inc - Class A',
    value: 203.77,
    code: 'FB',
    entry_value: 204.35,
    quantity: 5,
    first_bought: '2021-12-06T09:21:00.000Z',
    last_bought: '2021-12-06T09:21:00.000Z'
}

const Tesla = {
    name: 'Tesla Inc',
    value: 865.65,
    code: 'TSLA',
    entry_value: 868.00,
    quantity: 3,
    first_bought: '2022-01-06T14:45:00.000Z',
    last_bought: '2022-02-04T14:45:00.000Z'
}

const Microsoft = {
    name: 'Microsoft Corporation',
    value: 274.73,
    code: 'MSFT',
    entry_value: 274.88,
    quantity: 6,
    first_bought: '2022-03-15T13:30:00.000Z',
    last_bought: '2022-04-15T11:30:00.000Z'
}

const Google = {
    name: 'Alphabet Inc - Class C',
    value: 2313.2,
    code: 'GOOG',
    entry_value: 2316.23,
    quantity: 2,
    first_bought: '2022-04-07T10:30:00.000Z',
    last_bought: '2022-04-07T10:30:00.000Z'
}

const stockMockData: StocksListProps = {
    stocks_list: [Apple,
        Facebook,
        Tesla,
        Microsoft,
        Google
    ],
    total_value: 11463.38,
    total_amount: 5,
    oldest_stock: Facebook,
    newest_stock: Google,
    highest_quantity: Apple,
    highest_quantity_amount: 10,
    highest_value: 4626.4,
    lowest_value: 1018.85,
    bought_most: Apple,
    sold_most: Tesla
}

export default stockMockData