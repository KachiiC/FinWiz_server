export interface SingleStockProps {
    name: String;
    value: Number
    code: String;
    entry_value: Number
    quantity: Number
    first_bought: String;
    last_bought: String;
}

export interface StocksListProps {
    stocks_list: SingleStockProps[];
    total_value: Number,
    total_amount: Number,
    oldest_stock: SingleStockProps
    newest_stock: SingleStockProps
    highest_quantity: SingleStockProps
    highest_quantity_amount: Number
    highest_value: Number
    lowest_value: Number
    bought_most: SingleStockProps
    sold_most: SingleStockProps
}