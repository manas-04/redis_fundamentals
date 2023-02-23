const client = require("../utils/redisDbConfig");

const { query, validationResult } = require('express-validator');

module.exports.partialSearch = [
    query('strToSearch').notEmpty().withMessage('StrToSearch parameter is required'),
    (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const strToSearch = req.query.strToSearch.toLowerCase();
        console.log(strToSearch);

        // scanner.scan("*", (err, matchingKeys) => {
        //     if (err) throw(err);

        //     let filteredKeys = matchingKeys.filter((e)=> e.toLowerCase().includes(strToSearch));

        //     // matchingKeys will be an array of strings if matches were found
        //     // otherwise it will be an empty array.
        //     console.log(filteredKeys);
        // });

        const regex = new RegExp(`.*${strToSearch}.*`, 'i');
        const pairs = {};
        let cursor = '0';

        client.scan(cursor, 'MATCH', '*', 'COUNT', '100', function(err, reply) {
          if (err) {
            return res.status(400).json({ errors: errors.array() });
          }
          function scan() {
          // Parse the SCAN response
          cursor = reply[0];
          const keys = reply[1];
      
          // Filter the keys that match the regex and fetch their values
          const matchingKeys = keys.filter(key => regex.test(key));
          const numMatchingKeys = matchingKeys.length;
      
          if (numMatchingKeys === 0) {
            // If there are no more matching keys, exit
            console.log(pairs);
            client.quit();
          } else {
            // Fetch the values for each matching key and store them in the pairs object
            matchingKeys.forEach(key => {
              client.get(key, function(err, value) {
                if (err) {
                  return res.status(400).json({ errors: errors.array() });
                }
                pairs[key] = value;
      
                // If we've fetched all the key-value pairs, log them and exit
                if (Object.keys(pairs).length === numMatchingKeys) {
                  console.log(pairs);
                  client.quit();
                  return res.status(200).json({ data:pairs });
                }
              });
            });
      
            // If there are more keys to fetch, continue scanning
            if (cursor !== '0') {
              scan();
            }
          }
        }
        scan();
      });
    }
]