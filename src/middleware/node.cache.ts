import NodeCache from "node-cache";

const HALF_HOUR = 1800

export const stockCache = new NodeCache({ stdTTL: 100 });
export const commoditiesCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 2 });

export const newsCache = new NodeCache({ stdTTL: HALF_HOUR });
export const userNewsCache = new NodeCache({ stdTTL: HALF_HOUR })
