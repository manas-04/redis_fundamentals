const { createClient } = require('redis');

const client = createClient({
    url: `redis://default:${process.env.PASSWORD}@${process.env.URL}:10596`,
      socket: {
      reconnectStrategy: retries => Math.min(retries * 50, 1000)
    }
});

module.exports = client;