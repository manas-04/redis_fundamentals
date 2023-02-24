const client = require("../utils/redisDbConfig");
const { query, validationResult } = require('express-validator');

module.exports.getValue = [
    query('key').notEmpty().withMessage('Key parameter is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const key = req.query.key;
        client.get(key, (error, value) => {
            if (error) {
              return res.status(500).json({ error: 'Error retrieving value from Redis' });
            }
            if (value === null) {
              return res.status(404).json({ error: 'Key not found in Redis' });
            }
            return res.status(200).json({ value });
        });
    }
];

module.exports.getHashValue = [
    query('key').notEmpty().withMessage('Key parameter is required'),
    query('hashValue').notEmpty().withMessage('Hash Value parameter is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const key = req.query.key;
        const hashValue = req.query.hashValue;

        client.hget(hashValue ,key, (error, value) => {
            if (error) {
              return res.status(500).json({ error: 'Error retrieving value from Redis' });
            }
            if (value === null) {
              return res.status(404).json({ error: 'Key not found in Redis' });
            }
            return res.status(200).json({ value });
        });
    }
];

module.exports.getAllKeyValuePairs = [
  query('page').notEmpty().withMessage('Page parameter is required'),
  query('limit').notEmpty().withMessage('Limit parameter is required'),
  (req,res) => {
    const batchSize = 10;
const cursor = 0;
const startIndex = 10;
const endIndex = 19;

// Use SCAN command with MATCH and COUNT options to extract a subset of keys
client.scan(
  cursor,
  'MATCH',
  '*',
  'COUNT',
  batchSize,
  async function(err, keys) {
    if (err) throw err;

    // Extract keys 11-20 from the array of keys
    const pageKeys = keys.slice(startIndex, endIndex + 1);

    // Fetch values for the keys in the page
    const values = await Promise.all(
      pageKeys.map((key) => new Promise((resolve, reject) => {
        client.get(key, (err, value) => {
          if (err) return reject(err);
          resolve(JSON.parse(value));
        });
      }))
    );

    // Return the results for keys 11-20
    res.json(values);
  });
}];