import Redis from 'ioredis';

const { REDIS_URL } = process.env;

export default new Redis(REDIS_URL);
