export interface AddCryptoProps {
  sub: string
  symbol: string
  quantity: number
  buyCost: number
  date: Date
}

export interface UpdateCryptoProps {
  sub: string
  symbol: string
  quantity: number
  price: number
  boughtOrSold: boolean
  date: Date
}
