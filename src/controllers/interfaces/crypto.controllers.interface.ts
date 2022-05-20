export interface SingleCryptoProps {
    name: string
    symbol: string
    market_value_per_crypto: number
    entry_value_per_crypto: number
    quantity_of_crypto: number
    total_crypto_value: number
    first_bought: string
    last_bought: string
}

export interface CryptoListProps {
    crypto_list: SingleCryptoProps[]
    total_value_of_crypto: number
    number_of_different_crypto: number
    highest_invested_crypto: string
    highest_invested_crypto_total: number
    highest_valued_per_crypto: SingleCryptoProps
    lowest_valued_per_crypto: SingleCryptoProps
    highest_quantity_crypto: SingleCryptoProps
    lowest_quantity_crypto: SingleCryptoProps
    newest_crypto_bought: SingleCryptoProps
    oldest_crypto_bought: SingleCryptoProps
}
