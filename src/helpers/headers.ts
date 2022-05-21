export const cryptoHeaders = (key: string) => {
  return {
    'X-CMC_PRO_API_KEY': key
  }
}

export const commoditiesHeaders = (key: string) => {
  return {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Host': 'investing4.p.rapidapi.com',
    'X-RapidAPI-Key': key
  }
}
