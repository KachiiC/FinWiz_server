import NodeCache from "node-cache";

export const investmentsCache = new NodeCache({ stdTTL: 900 });

export const newsCache = new NodeCache({ stdTTL: 1800 });
