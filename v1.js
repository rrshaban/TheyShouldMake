//  They Should Make – retweeting people's suggestions
//  Razi Shaban – 1/5/16 
// 
// This code monitors the Twitter stream for people saying "they should make"
// and retweets if the post hits a like + retweet threshold within a time lapse



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


// the function we call on each tweet after a delay

var check_and_retweet = function (id, retweet_threshold) {
  T.get('statuses/show/'.concat(id), function (err, data, response) {
    
    if (err) {
      console.log(err);
      return;
    }

    if (data['retweeted']) { return; }

    if (data['in_reply_to_status_id'] || data['quoted_status']) { return; }
    if (data['retweet_count'] + data['favorite_count'] < retweet_threshold) { return; }

    if (data['text'].toLowerCase().indexOf(phrase) === -1) { return; }

    T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
      console.log('Retweeted '.concat(id));
    });

  });
}

// Monitor the Twitter stream and call check_and_retweet after a delay

var stream = T.stream('statuses/filter', { track: 'they should make' });

stream.on('tweet', function (tweet) {
  var id = tweet['id_str'];
  setTimeout(check_and_retweet, delay, id, retweet_threshold);
});