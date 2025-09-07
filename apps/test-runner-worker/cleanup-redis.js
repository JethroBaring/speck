const redis = require('redis');

async function cleanupRedis() {
  const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB || 0,
  });

  await client.connect();

  try {
    console.log('🧹 Cleaning up Redis...');
    
    // Get all keys
    const keys = await client.keys('*');
    console.log(`Found ${keys.length} keys`);
    
    if (keys.length > 0) {
      // Delete all keys
      await client.del(keys);
      console.log('✅ All keys deleted');
    } else {
      console.log('ℹ️ No keys found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

cleanupRedis();
