require('dotenv').load();

var TwitterBot = require("node-twitterbot").TwitterBot;

var Bot = new TwitterBot({
  "consumer_secret": process.env.CONSUMER_SECRET,
  "consumer_key": process.env.CONSUMER_KEY,
  "access_token": process.env.ACCESS_TOKEN,
  "access_token_secret": process.env.ACCESS_TOKEN_SECRET
});

Bot.addAction("retweet", function(twitter, action, tweet) {
  Bot.tweet(tweet);
});

tweetTheyShouldMake = function(tweet) {
  return ~tweet.indexOf('they should make');  // http://stackoverflow.com/questions/1789945/how-can-i-check-if-one-string-contains-another-substring#comment8972847_1789952
}

Bot.listen("they should make", tweetTheyShouldMake, function(twitter, action, tweet) {
  Bot.now(Bot.randomWeightedAction("retweet"), tweet);
});

// Bot.tweet("I'm posting a tweet!");
