require('dotenv').load();

var TwitterBot = require("node-twitterbot").TwitterBot;

var Bot = new TwitterBot({
  "consumer_secret": process.env.CONSUMER_SECRET,
  "consumer_key": process.env.CONSUMER_KEY,
  "access_token": process.env.ACCESS_TOKEN,
  "access_token_secret": process.env.ACCESS_TOKEN_SECRET
});

Bot.tweet("I'm posting a tweet!");