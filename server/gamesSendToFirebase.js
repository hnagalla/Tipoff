  const games = require('./app.js');
  const gamesJSON = requie('./gamesSendToFireBase.json');

  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    // For databases not in the us-central1 location, databaseURL will be of the
    // form https://[databaseName].[region].firebasedatabase.app.
    // For example, https://your-database-123.europe-west1.firebasedatabase.app
    databaseURL: "https://tipoff-f4eb8-default-rtdb.firebaseio.com/",
    storageBucket: "bucket.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  const games = gamesJSON.parse();

  //SEND GAMES DATA to FIREBASE db
  function writeGamesData(games) {
    firebase.database().ref('games/').set({
      date : games.date,
      numGames : games.numGames,
      games = games.gamesArray
    
    });
  }

  writeGamesData(games);




