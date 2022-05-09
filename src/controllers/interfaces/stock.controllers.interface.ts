export interface singleStockProps {
    name: String;
    value: Number
    code: String;
    entry_value: Number
    quantity: Number
    first_bought: String;
    last_bought: String;
}

export interface StocksListProps {
    stocks_list: singleStockProps[];
    total_value: Number,
    total_amount: Number,
    oldest_stock: singleStockProps
    newest_stock: singleStockProps
    highest_quantity: singleStockProps
    highest_quantity_amount: Number
    highest_value: Number
    lowest_value: Number
    bought_most: singleStockProps
    sold_most: singleStockProps
}