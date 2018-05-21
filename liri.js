require('dotenv').config();

var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter); 

var operator = process.argv[2]; //command variable
var userInput = process.argv;
var userInputString = "";

for (var i = 3; i < userInput.length; i++) { //userInput to userInputString handling
    if (i > 2 && i < userInput.length) {
        userInputString = userInputString + "+" + userInput[i];
    } else {
        userInputString += userInput[i];
    }
}

//INTENTIONAL USER FUNCTIONS

function spotifySearch(song){
    spotify.search({type: 'track', query: song, popularity: 100, limit: 1}, function(err, data) {
        //Error Status
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //On success
        for (var i = 0; i < data.tracks.items.length; i++) {
          console.log("Artist: " + data.tracks.items[i].artists[0].name);
          console.log("Track name: " + data.tracks.items[i].name);
          if (data.tracks.items[i].preview_url === null) {
            console.log("Song preview: Preview for this track is not available.")
          } else {
            console.log("Song preview: " + data.tracks.items[i].preview_url);
          }
          console.log("Album: " + data.tracks.items[i].album.name);
        }
        console.log("\n");
    });
}

function twitterStatuses() {
    var params = {screen_name: 'hgd_wd'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        //If no error
        if (!error) {
            for (var i = 0; i < tweets.length; i++){
            console.log(i+1 + ". " + tweets[i].created_at.replace(/ \+0000/g, "") + " - " + tweets[i].text); //Get rid of the " +0000 on .creat_at"
            }
            console.log("\n");
        }
    });
}

function omdbResults(movieName){

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

    // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            // console.log(JSON.parse(body));
            var movieResponse = JSON.parse(body);
            if (movieResponse.Title === undefined) {
                console.log("Movie not found in the OMDb database. Try another search.")
            } else {
                console.log("Movie Title: " + movieResponse.Title);
                console.log("Release Date: " + movieResponse.Year);
                console.log("IMDB Rating: " + movieResponse.Ratings[0].Value);
                if (movieResponse.Ratings[1] === undefined) {
                    console.log("Rotten Tomatoes Rating: Not available for this movie title.")
                } else {
                    console.log("Rotten Tomatoes Rating: " + movieResponse.Ratings[1].Value);
                }
                console.log("Country: " + movieResponse.Country);
                console.log("Plot: " + movieResponse.Plot);
                console.log("Actors: " + movieResponse.Actors);
                
            }
            console.log("\n");
        }
    })
}

//RESULTS HEADERS

function tweetHeader() {
    console.log("\n");
    console.log("===================================================================================================================");
    console.log("# My Latest 20 Tweets");
    console.log("===================================================================================================================");
    console.log("\n");
}

function spotifyHeader() {
    console.log("\n");
    console.log("===================================================================================================================");
    console.log("# Spotify Song Info");
    console.log("===================================================================================================================");
    console.log("\n");
}

function movieHeader() {
    console.log("\n");
    console.log("===================================================================================================================");
    console.log("# OMDb Movie Info");
    console.log("===================================================================================================================");
    console.log("\n");
}

//DO-WHAT-IT-SAYS FUNCTION

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            return console.log(error);
        }
        var dataArr = data.split(", ");
        var randomOperator = dataArr[0];
        var randomString = dataArr[1];
    
        switch (randomOperator) {
            case "my-tweets":
                tweetHeader();
                twitterStatuses();
                break;
            case "spotify-this-song":
                spotifyHeader();
                spotifySearch(randomString);
                break;
            case "movie-this":
                movieHeader();
                omdbResults(randomString);
                break;
        }
    })
}

//Operating checking and handling

switch (operator) {
    case "my-tweets":
        if (userInput.length > 3) {
            liriError("liri.js " + operator + userInputString.replace(/\+/g, " "));
            fs.appendFile('log.txt', "User Input Error: liri.js " + operator + userInputString.replace(/\+/g, " ") + " is an invalid command or argument.\n");
        } else {
            fs.appendFile('log.txt', "User command: my-tweets \n");
            tweetHeader();
            twitterStatuses();
        }
        break;
    case "spotify-this-song":
        spotifyHeader();
        if ((process.argv[3] === undefined) && (userInput.length <= 3)) {
            fs.appendFile('log.txt', "User Input Error: User command: " + operator + " User arguments: null.\n");
            console.log("Error: User is missing an argument after the 'spotify-this-song' command.\n");
        } else {
            fs.appendFile('log.txt', "User command: " + operator + ". User arguments: " + userInputString.replace(/\+/g, " ") + "\n");
            spotifySearch(userInputString.substring(1)); //Improves search results
        }
        break;
    case "movie-this":
        movieHeader();
        if ((process.argv[3] === undefined) && (userInput.length <= 3)) {
            fs.appendFile('log.txt', "User Input Error: User command: " + operator + " User arguments: null. Results for \"Mr. Nobody\" automatically shown.\n");
            console.log("Error Handling: No arugment input by user. Results for \"Mr. Nobody\" automatically shown.\n");
            omdbResults("Mr.+Nobody");
        } else {
            fs.appendFile('log.txt', "User command: " + operator + ". User arguments: " + userInputString.replace(/\+/g, " ") + "\n");
            omdbResults(userInputString.substring(1)); //Improve search results
        }
        break;
    case "do-what-it-says":
        if (userInput.length > 3) {
            liriError("liri.js " + operator + userInputString.replace(/\+/g, " "));
            fs.appendFile('log.txt', "User Input Error: liri.js " + operator + userInputString.replace(/\+/g, " ") + " is an invalid command or argument. \n");
        } else {
            doWhatItSays();
        }
        break;
    default: 
        if (operator !== undefined) { //Makes sure operator is defined as we already have an error handler for undefined (blank)
            liriError("liri.js " + operator);
            fs.appendFile('log.txt', "User Input Error: liri.js " + operator + " is an invalid command or argument. \n");
        }
}

//Run file with no command or invalid command or argument handling

function liriError(errorMessage) {
    console.log("\n");
    console.log("/////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("                                                                                                                 ");
    console.log("    " + errorMessage+": Invalid command or argument, or no command was specified                                    ");
    console.log("                                                                                                                 ");
    console.log("    Usage: node liri.js <command> [<args>]                                                                       ");
    console.log("                                                                                                                 ");
    console.log("    my-tweets [<username>]         Retrieves last 20 tweets from hgd_wd test ('Hong Gildong) twittter account    ");
    console.log("                                   and displays them.                                                            ");
    console.log("    spotify-this-song [<song>]     Searches Spotify and returns basic information about specified song.          ");
    console.log("    movie-this [<movie>]           Searches OMDb and returns basic information about specified movie.            ");
    console.log("    do-what-it-says                Reads and executes the instructions contained in random.txt formatted as      ");
    console.log("                                   follows: <command>, [<args>]                                                  ");
    console.log("                                                                                                                 ");
    console.log("/////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("\n");
}

if ((operator === undefined) && (userInput.length <= 2)) {
    liriError("liri.js");
    fs.appendFile('log.txt', "User Input Error: liri.js is an invalid command or argument. \n");
}
