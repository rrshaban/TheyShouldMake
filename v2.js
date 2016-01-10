//  They Should Make – retweeting people's suggestions
//  Razi Shaban – 1/5/16 
// 
// This code monitors the Twitter stream for people saying "they should make"
// and retweets if the post hits a like + retweet threshold within a time lapse
//
// This is my first JS project, so please point out where I could improve the code

// User parameters 

var delay = 10000                 // how long after tweeting to wait
var retweet_threshold = 3         // how many combined likes + retweets necessary to retweet
var query = { q: "they should make", 
              count: 100, 
              result_type: "recent",
              // until: // YYYY-MM-DD TODO: maybe only load last day's tweets
              }; // result_type: recent/popular/mixed


// making our twitter object

require('dotenv').load();         // checks .env for all our secret parameters
var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY
  , consumer_secret:      process.env.CONSUMER_SECRET
  , access_token:         process.env.ACCESS_TOKEN
  , access_token_secret:  process.env.ACCESS_TOKEN_SECRET
});

var check_and_retweet = function (query, retweet_threshold) {
  T.get('search/tweets', query, function (error, data) {
    console.log(data.statuses.length);
    if (!error) {
      for (var i in data.statuses) {
        var tweet = data.statuses[i];
        var id = tweet.id_str;
        
        // console.log(i);

        if (tweet.text.toLowerCase().indexOf(query.q) === -1) { continue; }

        if (tweet.retweeted) { continue; }
        if (tweet.quoted_status || tweet.retweeted_status) { continue; }

        if (tweet.retweet_count + tweet.favorite_count < retweet_threshold) { continue; }

        T.post('statuses/retweet/:id', { id: id }, function (error, data, response) {
          if (response) {
            console.log('Retweeted '.concat(id));
          }
          if (error) {
            console.log('Twitter error: ', error);
          }
        });

      }
    } else { // error searching for tweets
      console.log(error);
    }

  });

}

// TODO: change from running only once
check_and_retweet(query, retweet_threshold);
// setInterval(check_and_retweet, delay, query, retweet_threshold);
