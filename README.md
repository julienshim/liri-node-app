# liri-node-app

**Overview**

LIRI Bot was created for the LIRI Node App homework assignment for Berkeley Coding Bootcamp and features a language interpretation and recognition interface. LIRI is a command line node app that takes in parameters and gives you back data.

**Deployment Requirements**

`npm i` will install the following:

-npm install dotenv
    **NOTE: user must have own .env file with twitter and spotify API keys**
-npm install node-spotify-api
-npm install twitter
-npm install request



**Requirements**

- Make it so liri.js can take in one of the following commands: `my-tweets`, `spotify-this-song`, `movie-this`, `do-what-it-says`
- What each command should do:
    - `node liri.js my-tweets` Shows your last 20 tweets and when they were created at in your terminal/bash window.
    -  `node liri.js spotify-this-song '<song name here>'` This will show the following information about the song in your terminal/bash window: Artist(s), The song's name, A          preview link of the song from Spotify, The album that the song is form, If no song is provided then your program will default to "The Sign" by Ace of Base. Utilize the         [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.
    - `node liri.js movie-this '<movie name here>'` This will output the following information to your terminal/bash window: Title of the movie. Year the movie came out. IMDB          Rating of the movie. Rotten Tomatoes Rating of the movie, Country where the movie was produced, Language of the movie. Plot of the movie. Actors in the movie. If the user      doesn't type in a movie in, the program will output data for the movie 'Mr. Nobody." You'll use the request package to retrieve data from the OMDB API.
    - `node liri.js do-what-it-says` Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands. It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

**BONUS**

- In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`. Make sure you append each command you run to the `log.txt` file.       Do not overwrite your file each time you run a command.

    *Note:* Also added incorrect command/argument user inputs. 


**Usage**

Usage: `node liri.js <command> [<args>]`

`my-tweets`

Retrieves lasts 20 tweets from hgd_wd ('Hong Gildong') test twitter account and siplays them.

`spotify-this-song [<song>]`

Searches Spotify and returns basic information about specified song.

`movie-this [<movie>]`

Searches OMDb and returns basic information about specified movie.

`do-what-it-says`

Reads and executes the instructions contained in random.txt formatted as follows: `<command>, [<args>]`  