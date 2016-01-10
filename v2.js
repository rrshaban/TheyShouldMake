//  They Should Make – retweeting people's suggestions
//  Razi Shaban – 1/5/16 
// 
// This code monitors the Twitter stream for people saying "they should make"
// and retweets if the post hits a like + retweet threshold within a time lapse
//
// This is my first JS project, so please point out where I could improve the code


require('dotenv').load(); 
var Twit = require('twit');


// User parameters 

var interval = 10000                  // how long after tweeting to wait
var likes_and_RTs = 3      
var query = { q: "they should make", count: 100, result_type: "recent" };

 
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY
  , consumer_secret:      process.env.CONSUMER_SECRET
  , access_token:         process.env.ACCESS_TOKEN
  , access_token_secret:  process.env.ACCESS_TOKEN_SECRET
});


var check_and_retweet = function (query, likes_and_RTs) {
  T.get('search/tweets', query, function (error, data) {
    if (!error) {
      for (var i in data.statuses) {
        var tweet = data.statuses[i];
        
        // does tweet contain our phrase? 
        // Twitter API doesn't seem to allow strict phrase searching?         [REVISE]
        if (tweet.text.toLowerCase().indexOf(query.q) === -1) { continue; }

        // is it a RT/quote? have we already retweeted it?
        if (tweet.retweeted) { continue; } // [TODO: not sure this works]     [TODO]
        if (tweet.quoted_status || tweet.retweeted_status) { continue; }

        // is tweet good enough to RT?
        if (tweet.retweet_count + tweet.favorite_count < likes_and_RTs) { continue; }


        T.post('statuses/retweet/:id', { id: tweet.id_str }, function (error, data, response) {
          if (response) { console.log('Retweeted: '.concat(tweet.text));}
          if (error) { console.log('Twitter error: ', error); }
        });

      }
    } else { console.log(error); }
  });
}

setInterval(check_and_retweet, interval, query, retweet_threshold);
