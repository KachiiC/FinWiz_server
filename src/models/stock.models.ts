export const stockListModel = (data: any[]) => {

    return data.map((stock) => {
        const { symbol, companyName, latestPrice } = stock
        return {
            symbol,
            name: companyName,
            marketValuePerShare: latestPrice
        }
    })
}