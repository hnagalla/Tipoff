package com.example.tipoff_new;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    private ArrayList<Game> gamesArrayList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Write a message to the databaseseses
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference myRef = database.getReference("2021-03-02/numGames");
        DatabaseReference myRefGames = database.getReference("2021-03-02/games");

        // Read from the database
        myRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // This method is called once with the initial value and again
                // whenever data at this location is updated.
                int numGames = dataSnapshot.getValue(int.class); //Get number of games for today
                Log.d("CHANGEDATA", "numGames: " + numGames);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                // Failed to read value
                Log.w("FAIL", "Failed to read value.", error.toException());
            }
        });

        myRefGames.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for(DataSnapshot ds : dataSnapshot.getChildren()) { //For every child (game property) of "2012-02-28/games"
                    String homeTeam = ds.child("homeTeam").getValue(String.class); //Get the homeTeam
                    int homeTeamScore = ds.child("homeTeamScore").getValue(int.class); //Get the int homeTeamScore

                    String awayTeam = ds.child("awayTeam").getValue(String.class); //Get the int homeTeamScore
                    int awayTeamScore = ds.child("awayTeamScore").getValue(int.class); //Get the int homeTeamScore

                    String status = ds.child("status").getValue(String.class); //Get the status
                    String time = ds.child("time").getValue(String.class); //Get the time
                    int period = ds.child("period").getValue(int.class); //Get the period

                    //Create game object
                    Game game = new Game(homeTeam, awayTeam, homeTeamScore, awayTeamScore, period, status, time);
                    gamesArrayList.add(game); //Add game to ArrayList gamesArrayList of type Game
                }

                String gamesListSize = String.valueOf(gamesArrayList.size());
                Log.d("YESBABY", gamesListSize);
                for (int i = 0; i < gamesArrayList.size(); i++){ //Check if data exists or has changed
                    Log.d("CHECKTHAT", "Home: " + gamesArrayList.get(i).getHomeTeam() + " Away: " + gamesArrayList.get(i).getAwayTeam()
                        + " Home Score: " + gamesArrayList.get(i).getHomeTeamScore() + " Away Score: " + gamesArrayList.get(i).getAwayTeamScore()
                        + " Status: " + gamesArrayList.get(i).getStatus() + " Time: " + gamesArrayList.get(i).getTime()
                        + " Period: " + gamesArrayList.get(i).getPeriod());
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                // Failed to read value
                Log.w("FAIL", "Failed to read value.", error.toException());
            }
        });
    }
}