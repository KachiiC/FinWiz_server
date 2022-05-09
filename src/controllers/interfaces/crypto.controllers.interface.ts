export interface SingleCryptoProps {
    name: string
    value: number
    code: string
    entry_time: string
    entry_value: number
    current_time: string
    first_bought: string
    last_bought: string
}

export interface CryptoListProps {
    crypto_list: SingleCryptoProps[]
    total_value: Number,
    total_amount: Number
    highest_value: SingleCryptoProps
    lowest_value: SingleCryptoProps
    newest: SingleCryptoProps
    oldest: SingleCryptoProps
    highest_quantity: SingleCryptoProps
    lowest_quantity: SingleCryptoProps
}