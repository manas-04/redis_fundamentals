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

module.exports.paginatedSearch = [
    query('page').notEmpty().withMessage('Page is required'),
    query('limit').notEmpty().withMessage('Limit is required'),
    (req,response)=>{

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      client.zrange('myset', startIndex, endIndex-1, (err, res) => {
      if (err) return response.status(400).json({ errors: errors.array() });
      const keyValues = [];
      for (let i = 0; i < res.length; i++) {
          client.hget('myhash', res[i], (err, value) => {
          if (err) return response.status(400).json({ errors: errors.array() });
          keyValues.push({
              key: res[i],
              value: value
          });
          if (keyValues.length === res.length) {
              console.log(keyValues); // logs an array of key-value pairs within the specified range
              return response.status(200).json({ keyValues });
          }
        });
      }
      if(res.length==0){
        return response.status(200).json({ keyValues });
      }
    });
  }
];

// module.exports.searchingInHash = [
//   (req,res) => {
//     const start = 0; // start index of range
//     const count = 10; // number of items in range

//     const stream = client.hscanStream('myhash', { match: '*', count: count, start: start });
//     const keyValues = [];

//     stream.on('data', function (result) {
//       for (let i = 0; i < result.length; i += 2) {
//         const key = result[i];
//         const value = result[i + 1];
//         keyValues.push({ key, value });
//       }
//     });

//     stream.on('end', function () {
//       console.log(keyValues); // logs an array of key-value pairs within the specified range
//     });
//   }
// ]