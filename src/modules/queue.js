import Queue from 'bull';

const { REDIS_URL } = process.env;

export const postQueue = new Queue('scrapeQueue', REDIS_URL);
