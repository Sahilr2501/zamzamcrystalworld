const { createClient } = require('redis');

let client;

const getRedisClient = async () => {
    if (client) return client;

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        // Redis is optional during local dev; return null client.
        return null;
    }

    client = createClient({ url: redisUrl });
    client.on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error('Redis Client Error', err);
    });

    await client.connect();
    return client;
};

module.exports = { getRedisClient };

