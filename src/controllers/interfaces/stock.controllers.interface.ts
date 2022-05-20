export interface SingleStockProps {
    name: string
    symbol: string
    market_value_per_share: number
    entry_value_per_share: number
    number_of_shares: number
    total_value_of_shares: number
    first_bought: string
    last_bought: string
}

export interface StocksListProps {
    stocks_list: SingleStockProps[]
    total_value_of_stocks: number
    number_of_different_stocks: number
    oldest_stock: SingleStockProps
    newest_stock: SingleStockProps
    stock_with_most_shares: SingleStockProps
    number_of_most_shares: number
    highest_investment_total: number
    highest_value_stock_price: number
    lowest_value_stock_price: number
}
