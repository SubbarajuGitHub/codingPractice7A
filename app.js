const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const DataBasePath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const updateServerInstance = async () => {
  try {
    db = await open({
      filename: DataBasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running on http://localhost/3000/");
    });
  } catch (errror) {
    console.log(`DB Error:error.messege`);
    process.exit(1);
  }
};
updateServerInstance();

//API first

//Converting For API 1

const convertToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

app.get("/players/", async (request, response) => {
  const playersQuery = `
    SELECT
    *
    FROM
     player_details`;
  const PlayersArray = await db.all(playersQuery);
  response.send(PlayersArray.map((each) => convertToResponseObject(each)));
});

//API second

const ConvertObjectSecond = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const PlayerQuery = `
    select
    *
    from 
    player_details
    where player_id="${playerId}";`;
  const PlayerArray = await db.get(PlayerQuery);
  response.send(ConvertObjectSecond(PlayerArray));
});

// API third

//api convert

const convert = (dbs) => {
  playerName: dbs.player_name;
};

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName } = request.params;
  const array = `
    UPDATE 
    player_details
    SET
    player_name="${playerName}"
    WHERE player_id=${playerId}`;
  const a = await db.run(array);
  response.send("Player Details Updated");
});

//API Fourth

//convert fourth Object

const ConvertObjectFourth = (dbObject) => {
  return {
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
  };
};

app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const matchQuery = `
    SELECT
    *
    FROM
    match_details
    where match_id="${matchId}"
    ;`;
  const matchArray = await db.get(matchQuery);
  response.send(ConvertObjectFourth(matchArray));
});

//API 5

//convert Fifth

const convertObjectFifth = (dbObject) => {
  return {
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
  };
};

app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;
  const allMatchesQuery = `
    SELECT 
    *
    from
    player_match_score
    natural join match_details
    where
    player_id=${playerId}
    `;
  const matchDetailsArray = await db.all(allMatchesQuery);
  response.send(
    matchDetailsArray.map((eachplayer) => convertObjectFifth(eachplayer))
  );
});

//API 6

//convert Sixth

const convertObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

app.get("/matches/:matchId/players", async (request, response) => {
  const { matchId } = request.params;
  const playersArray = `
    SELECT
    player_id ,
    player_name 
    FROM
     player_details  INNER JOIN player_match_score ON player_details.player_id=
     player_match_score.player_id
    WHERE
    match_id=${matchId}
    `;
  const Arrays = await db.get(playersArray);
  response.send(convertObject(Arrays));
});

//API 7

app.get("/players/:playerId/playerScores", async (request, response) => {
  const { playerId } = request.params;
  const maxScores = `
    SELECT 
    player_details.player_id AS playerId,
    player_details.player_name AS playerName,
    SUM(player_match_score.score) as totalScore,
    SUM(player_match_score.fours) as totalFours,
    SUM(player_match_score.sixes) as totalSixes
    FROM 
    player_details inner join player_match_score on player_details.player_id=
    player_match_score.player_id
    WHERE player_details.player_id=${playerId}
    `;
  const Arrays = await db.get(maxScores);
  response.send(Arrays);
});

module.exports = app;
