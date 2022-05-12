import NodeCache from "node-cache";

export const stockCache = new NodeCache({ stdTTL: 100 });

export const newsCache = new NodeCache({ stdTTL: 1800 });
