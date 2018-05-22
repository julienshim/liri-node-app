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
          fs.appendFile('log.txt', "Spotify Error occured: " + err + "\n");
        }

        //On success
        for (var i = 0; i < data.tracks.items.length; i++) {
          console.log("Artist: " + data.tracks.items[i].artists[0].name);
          console.log("Track name: " + data.tracks.items[i].name);
          fs.appendFile('log.txt', "Artist: " + data.tracks.items[i].artists[0].name + "\n");
          fs.appendFile('log.txt', "Track name: " + data.tracks.items[i].name + "\n");
          if (data.tracks.items[i].preview_url === null) { //Checks if song preview exists
            console.log("Song preview: Preview for this track is not available.")
            fs.appendFile('log.txt', "Song preview: Preview for this track is not available.\n");
          } else {
            console.log("Song preview: " + data.tracks.items[i].preview_url);
            fs.appendFile('log.txt', "Song preview: " + data.tracks.items[i].preview_url + "\n");
          }
          console.log("Album: " + data.tracks.items[i].album.name);
          fs.appendFile('log.txt', "Album: " + data.tracks.items[i].album.name + "\n");
        }
        console.log("\n"); //Styling
    });
}

function twitterStatuses() {
    var params = {screen_name: 'hgd_wd'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        //If no error
        if (!error) {
            for (var i = 0; i < tweets.length; i++){
            console.log(i+1 + ". " + tweets[i].created_at.replace(/ \+0000/g, "") + " - " + tweets[i].text); //Get rid of the " +0000" on .created_at
            fs.appendFile('log.txt', tweets[i].created_at.replace(/ \+0000/g, "") + " - " + tweets[i].text + "\n");
            }
            console.log("\n"); //Styling
        }
    });
}

function omdbResults(movieName){
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieResponse = JSON.parse(body);
            if (movieResponse.Title === undefined) {
                console.log("Movie not found in the OMDb database. Try another search.")
                fs.appendFile('log.txt', "Movie not found in the OMDb database.\n");
            } else {
                console.log("Movie Title: " + movieResponse.Title);
                console.log("Release Date: " + movieResponse.Year);
                console.log("IMDB Rating: " + movieResponse.Ratings[0].Value);
                fs.appendFile('log.txt', "Movie Title: " + movieResponse.Title + "\n");
                fs.appendFile('log.txt', "Release Date: " + movieResponse.Year + "\n");
                fs.appendFile('log.txt', "IMDB Rating: " + movieResponse.Ratings[0].Value + "\n");
                if (movieResponse.Ratings[1] === undefined) { //Checks if Rotten Tomatoes Rating exists
                    console.log("Rotten Tomatoes Rating: Not available for this movie title.")
                    fs.appendFile('log.txt', "Rotten Tomatoes Rating: Not available for this movie title.\n");
                } else {
                    console.log("Rotten Tomatoes Rating: " + movieResponse.Ratings[1].Value);
                    fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + movieResponse.Ratings[1].Value + "\n");
                }
                console.log("Country: " + movieResponse.Country);
                console.log("Language: " + movieResponse.Language);
                console.log("Plot: " + movieResponse.Plot);
                console.log("Actors: " + movieResponse.Actors);
                fs.appendFile('log.txt', "Country: " + movieResponse.Country + "\n");
                fs.appendFile('log.txt', "Language: " + movieResponse.Language + "\n");
                fs.appendFile('log.txt', "Plot: " + movieResponse.Plot + "\n");
                fs.appendFile('log.txt', "Actors: " + movieResponse.Actors + "\n");
            }
            console.log("\n"); //Styling
        }
    })
}

//RESULTS HEADERS

function resultsHeader(heading) {
    console.log("\n");
    console.log("===================================================================================================================");
    console.log("# " + heading);
    console.log("===================================================================================================================");
    console.log("\n");
}

//DO-WHAT-IT-SAYS FUNCTION

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            return console.log(error);
            fs.appendFile('log.txt', "File-System Read File Error occured: " + error + "\n");
        }
        var dataArr = data.split(", ");
        var randomOperator = dataArr[0];
        var randomString = dataArr[1];
    
        switch (randomOperator) {
            case "my-tweets":
                resultsHeader("My 20 Latest Tweets");
                fs.appendFile('log.txt', "random.txt file command: " + randomOperator + ". file argument: " + randomString + "\n");
                twitterStatuses();
                break;
            case "spotify-this-song":
                resultsHeader("Spotify Song Info");
                fs.appendFile('log.txt', "random.txt file command: " + randomOperator + ". random.txt file argument: " + randomString + "\n");
                spotifySearch(randomString);
                break;
            case "movie-this":
                resultsHeader("OMDb Movie Info");
                fs.appendFile('log.txt', "random.txt file command: " + randomOperator + ". random.txt file argument: " + randomString + "\n");
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
            resultsHeader("My 20 Latest Tweets");
            twitterStatuses();
            fs.appendFile('log.txt', "User command: my-tweets \n");
        }
        break;
    case "spotify-this-song":
        resultsHeader("Spotify Song Info");
        if ((process.argv[3] === undefined) && (userInput.length <= 3)) {
            console.log("Error Handling: No arugment input by user. Results for \"The Sign\" by Ace of Base automatically shown.\n");
            spotifySearch("The+Sign+Ace+of+Base");
            fs.appendFile('log.txt', "Error Handling: No argument input by user. Results for \"The Sign\" by Ace of Base automatically shown.\n");
        } else {
            spotifySearch(userInputString.substring(1)); //Improves search results
            fs.appendFile('log.txt', "User command: " + operator + ". User arguments: " + userInputString.replace(/\+/g, " ") + "\n");
        }
        break;
    case "movie-this":
        resultsHeader("OMDb Movie Info");
        if ((process.argv[3] === undefined) && (userInput.length <= 3)) {
            console.log("Error Handling: No arugment input by user. Results for \"Mr. Nobody\" automatically shown.\n");
            omdbResults("Mr.+Nobody");
            fs.appendFile('log.txt', "User Input Error: User command: " + operator + " User arguments: null. Results for \"Mr. Nobody\" automatically shown.\n");
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
            fs.appendFile('log.txt', "User command: do-what-it-says \n");
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
    console.log("    " + errorMessage+": Invalid command or argument, or no command was specified                                 ");
    console.log("                                                                                                                 ");
    console.log("    Usage: node liri.js <command> [<args>]                                                                       ");
    console.log("                                                                                                                 ");
    console.log("    my-tweets                      Retrieves last 20 tweets from hgd_wd ('Hong Gildong') test twitter account    ");
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
