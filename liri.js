require('dotenv').config();

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
//   if (err) {
//     return console.log('Error occurred: ' + err);
//   }
 
// console.log(data[0]); 
// });

var params = {screen_name: 'hgd_wd'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for (var i = 0; i < tweets.length; i++){
      console.log(tweets[i].text);
      console.log(tweets[i].created_at);
    }
  }
});