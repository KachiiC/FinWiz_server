import NodeCache from "node-cache";

export const stockCache = new NodeCache({ stdTTL: 100 });