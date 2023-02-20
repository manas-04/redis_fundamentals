require("dotenv").config();

const cors = require('cors');
const express = require('express');
const setRouter = require("./routers/setRouters");
const getRouter = require("./routers/getRouters");
const client = require("./utils/redisDbConfig");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getRouter);
app.use(setRouter);

//Redis monitoring functions
client.on('connect', function() {
  console.log('Connected to Redis Cloud');
});

client.on('error', function(err) {
  console.error('Redis error:', err);
});

client.on('end', function() {
  console.log('Disconnected from Redis Cloud');
});

app.get('/', function(req, res) {
  res.send('<h1>Server up and running!</h1>');
});

app.listen(process.env.PORT, function() {
  console.log(`Server running on port ${process.env.PORT}!`);
});
