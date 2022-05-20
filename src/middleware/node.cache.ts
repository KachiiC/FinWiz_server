import NodeCache from 'node-cache'

export const stockCache = new NodeCache({ stdTTL: 100 })
export const commoditiesCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 2 })

export const investmentsCache = new NodeCache({ stdTTL: 900 })

export const newsCache = new NodeCache({ stdTTL: 1800 })
export const userNewsCache = new NodeCache({ stdTTL: 1800 })
