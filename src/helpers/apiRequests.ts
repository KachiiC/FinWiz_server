import axios from 'axios'
import { cryptoHeaders } from './headers'
import { cryptoSymbolUrl } from './urls'
import { iexApiStockQuotes } from './urls'

export const getRequest = (url: string) => {
    return axios.request({
        method: "GET",
        url: url
    })
}

export const getRequestWithHeaders = (url: string, headers: { [x: string]: string }) => {
    return axios.request({
        method: "GET",
        url: url,
        headers: headers
    })
}


export const cryptoApiData = async (symbol: string) => {

    const apiUrl = cryptoSymbolUrl(symbol)
    const apiHeader = cryptoHeaders(process.env.COINCAP_KEY || "")

    const result = await getRequestWithHeaders(apiUrl, apiHeader)

    return result.data
}

export const stockApiData = async (symbol: string) => {

  const apiUrl = iexApiStockQuotes(symbol)
  const result = await getRequestWithHeaders(apiUrl, {})

  return result
}