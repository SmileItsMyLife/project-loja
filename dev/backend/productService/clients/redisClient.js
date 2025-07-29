const Redis = require('ioredis');

const env = process.env.NODE_ENV || 'development';
const redis_host = (env === "development" ? "localhost" : process.env.REDIS_HOST);

const redis = new Redis({
  host: redis_host,
  port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
//   db: process.env.REDIS_DB || 0,
});

redis.on('connect', () => {
  console.log('✅ Redis client connected successfully');
});
redis.on('error', (err) => {
  console.error('❌ Redis client connection error:', err);
});

module.exports = redis;