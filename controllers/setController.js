const client = require("../utils/redisDbConfig");
const { body, validationResult } = require('express-validator');

module.exports.setvalue = [
    // Add validation rules using the check function
    body('myKey').notEmpty().withMessage('Key is required'),
    body('myValue').notEmpty().withMessage('Value is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Handle validation errors
            return res.status(400).json({ errors: errors.array() });
        } else {
            // Proceed with setting the Redis key
            const myKey = req.body.myKey;
            const myValue = req.body.myValue;

            client.set(myKey, myValue, function(err, reply) {
                if (err) {
                    console.error(err);
                    res.send('Error: ' + err);
                } else {
                    console.log(reply);
                    res.send('Redis key set successfully');
                }
            });
        }
    }
]

module.exports.setHashValue = [
    // Add validation rules using the check function
    body('myKey').notEmpty().withMessage('Key is required'),
    body('myValue').notEmpty().withMessage('Value is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Handle validation errors
            return res.status(400).json({ errors: errors.array() });
        } else {
            // Proceed with setting the Redis hash key-value pair
            const myKey = req.body.myKey;
            const myValue = req.body.myValue;

            client.hset("key", myKey, myValue, function(err, reply) {
                if (err) {
                    console.error(err);
                    res.send('Error: ' + err);
                } else {
                    console.log(reply);
                    res.send('Redis hash key-value pair set successfully');
                }
            });
        }
    }
]