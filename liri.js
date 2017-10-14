//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var client = new twitter(keys.twitterKeys);
var spotify = new spotify(keys.spotifyKeys);
var fs = require('fs');

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch case for all commands to the terminal
switch(command){
  case "my-tweets":
    displayTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySearch(x);
    } else{
      spotifySearch("The Sign");
    }
  break;

  case "movie-this":
    if(x){
      omdbSearch(x)
    } else{
      omdbSearch("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function displayTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'rjones75313673'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@rjones75313673: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        fs.appendFile('log.txt', "@rjones75313673: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFile('log.txt', "-----------------------");
      }
    }else{
      console.log('Error, No Tweets Shown');
    }
  });
}

// this is the main spotify search function which will take in a song title and query the spotify api.   It should display ten songs.
// spotify pulls in the key parameters and will search the api
function spotifySearch(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < 10; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
        //adds text to log.txt
        fs.appendFile('log.txt', songData.artists[0].name);
        fs.appendFile('log.txt', songData.name);
        fs.appendFile('log.txt', songData.preview_url);
        fs.appendFile('log.txt', songData.album.name);
        fs.appendFile('log.txt', "-----------------------");
      }
    } else{
      // display in case of error occurs with query
      console.log('Error occurred.');
    }
  });
}

//OMDB movie search function
function omdbSearch(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&apikey=40e9cece';
  console.log(omdbURL);

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);
      console.log(response);

      // Display Movie Info to Terminal Console
      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      
      //append movie info to log.txt
      fs.appendFile('log.txt', "Title: " + body.Title);
      fs.appendFile('log.txt', "Release Year: " + body.Year);
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
      fs.appendFile('log.txt', "Country: " + body.Country);
      fs.appendFile('log.txt', "Language: " + body.Language);
      fs.appendFile('log.txt', "Plot: " + body.Plot);
      fs.appendFile('log.txt', "Actors: " + body.Actors);
      
      

    } else{
      console.log('Error No Movie Info Found.')
    }
    // this is the default movie display if no movie title is passed into the omdbSearch () function
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //updates log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });

}
//This function will perform a spotify 
function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySearch(txt[1]);
  });
}