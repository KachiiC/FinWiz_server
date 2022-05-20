export interface AddStockProps {
  sub: string
  symbol: string
  quantity: number
  buyCost: number
  date: Date
}

export interface UpdateStockProps {
  sub: string
  symbol: string
  quantity: number
  price: number
  boughtOrSold: boolean
  date: Date
}
