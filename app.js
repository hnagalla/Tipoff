const https = require('https');
const fs = require('fs');

const date = require('./date.js');

var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./tipoff-api-key.json");
const { stringify } = require('querystring');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tipoff-f4eb8-default-rtdb.firebaseio.com"
});

 const dateToday = date.getDateToday();
 console.log(dateToday + " " + typeof(dateToday));

admin.database.enableLogging(true);
// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref(dateToday);
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

//var gamesRef = ref.child("games");

let url = "https://www.balldontlie.io/api/v1/games?dates[]=" + dateToday;

    https.get(url,(res) => {
        let body = "";
    
        res.on("data", (chunk) => {
            body += chunk;
        });
    
        res.on("end", () => {
            try {
                let games = JSON.parse(body);
                console.log(games);
                //do something with JSON
    
                //Parse date info
                const dateYear = JSON.stringify(games.data[0].date).substring(1,5);
                const dateMonth = JSON.stringify(games.data[0].date).substring(6,8);
                const dateDay = JSON.stringify(games.data[0].date).substring(9,11);
                
                let gamesjson = {
                    numGames : games.meta.total_count,
                    /*date : { 
                        year : dateYear,
                        month : dateMonth,
                        day : dateDay
                    },*/
                    gamesArray : [] //Contents are added from each api GET request
                }
    
                for (i = 0; i < games.data.length; i++){
                    //gameObject stores all information for a particular game
                    let gameObject = {
                        homeTeam : games.data[i].home_team.abbreviation,
                        awayTeam : games.data[i].visitor_team.abbreviation,
    
                        homeTeamScore : games.data[i].home_team_score,
                        awayTeamScore : games.data[i].visitor_team_score,
    
                        period : games.data[i].period,
                        time : games.data[i].time,
                        status : games.data[i].status
                    };
                    gamesjson.gamesArray.push(gameObject); //Add game Object to array
                }
                
                //Overwrite scores.json file
                fs.writeFile('gamesApiResponse.json', JSON.stringify(games,null,4), function (err) {
    
                });
                fs.writeFile('gamesSendToFirebase.json', JSON.stringify(gamesjson,null,4), function (err) {
    
                });


              
                //Set data to db with callback that tells if successful/failed
                ref.set({
                    numGames : games.meta.total_count,
                    games : gamesjson.gamesArray
                }, function(error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    } else {
                      console.log("Data saved successfully.");
                    }
                  });

                /*ref.set({
                    numGames : games.meta.total_count,
                    games : gamesjson.gamesArray
                });*/
                

            } catch (error) {
                console.error(error.message);
            };
        });
    
    }).on("error", (error) => {
        console.error(error.message);
    });

