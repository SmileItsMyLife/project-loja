const redis = require('../clients/redisClient');

const clearRedisProducts = async () => {
    try {
        const keys = await redis.keys('products:*');
        if (keys.length) {
            await redis.del(keys);
            console.log(`🧹 Cleared ${keys.length} product cache entries`);
        } else {
            console.log('No product cache entries found to clear.');
        }
    } catch (error) {
        console.error('Error clearing Redis product cache:', error);
    }
}

module.exports = { clearRedisProducts };