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
var phrase = "they should make"


// making our twitter object

require('dotenv').load();         // checks .env for all our secret parameters
var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY
  , consumer_secret:      process.env.CONSUMER_SECRET
  , access_token:         process.env.ACCESS_TOKEN
  , access_token_secret:  process.env.ACCESS_TOKEN_SECRET
});

var query = {q: phrase, count: 10, result_type: "recent"};

var check_and_retweet = function (query, retweet_threshold) {
  T.get('search/tweets', query, function (error, data) {
    console.log(error, data);

    if(!error) {
      var id = data.statuses[0].id_str;

      if (data['retweeted']) { return; }

      if (data['in_reply_to_status_id'] || data['quoted_status']) { return; }
      if (data['retweet_count'] + data['favorite_count'] < retweet_threshold) { return; }

      if (data['text'].toLowerCase().indexOf(phrase) === -1) { return; }

      T.post('statuses/retweet/:id', { id: id }, function (error, data, response) {
        if (response) {
          console.log('Retweeted '.concat(id));
        }
        if (error) {
          console.log('Twitter error: ', error);
        }
      });

    }

  })

}

setInterval(check_and_retweet, delay, query, retweet_threshold);
