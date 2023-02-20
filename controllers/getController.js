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