require('dotenv').load();

var delay = 1000              // how long after tweeting to wait
var retweet_threshold = 3     // how many combined likes + retweets necessary to retweet

var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY
  , consumer_secret:      process.env.CONSUMER_SECRET
  , access_token:         process.env.ACCESS_TOKEN
  , access_token_secret:  process.env.ACCESS_TOKEN_SECRET
});

var check_and_retweet = function (id, retweet_threshold) {
  T.get('statuses/show/'.concat(id), function (err, data, response) {
    
    if (err) {
      console.log(err);
      return;
    }

    if (data['retweeted']) { return; }

    if (data['in_reply_to_status_id'] || data['quoted_status']) { return; }
    if (data['retweet_count'] + data['favorite_count'] < retweet_threshold) { return; }

    if (data['text'].toLowerCase().indexOf("they should make") === -1) { return; }

    T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
      console.log('Retweeted '.concat(id));
    });

  });
}

var stream = T.stream('statuses/filter', { track: 'they should make' });

stream.on('tweet', function (tweet) {
  var id = tweet['id_str'];
  setTimeout(check_and_retweet, delay, id, retweet_threshold);
});