const Redis = require('ioredis');

const redis_host = (process.env.NODE_ENV === "development" ? "localhost:6379" : process.env.REDIS_HOST) || 'localhost:6379';

const redis = new Redis({
  host: "0.0.0.0",
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