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

module.exports.addDummyData = (req,response) => {
    client.hmset('myhash', 'key1', 'value1', 'key2', 'value2', 'key3', 'value3', 'key4', 'value4', 'key5', 'value5', (err, res) => {
    if (err) throw err;

    client.zadd('myset', 1, 'key1', 2, 'key2', 3, 'key3', 4, 'key4', 5, 'key5', (err, res) => {
        if (err)  return response.status(400).json({ errors: errors.array() });
        else  response.send('Redis hash key-value pair set successfully');
   });
  });
}