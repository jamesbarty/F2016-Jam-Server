var fps = 20;
var frameRate = 1000 / fps;
var moveDuration = 200;
var numGames = 2;
var numTeams = 2;
var gameEndDelay = 3000;
var Map = require('./map.js');

function moveArraySlot(array, old_index, new_index) {
  if (new_index === old_index) {
    return;
  }
  if (new_index >= array.length) {
    var k = new_index - array.length;
    while ((k--) + 1) {
      array.push(undefined);
    }
  }
  array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  return;
}

function getDestCoords(coords, direction) {
  switch (direction) {
    case 'w':
      return {
        x: coords.x,
        y: coords.y - 1
      };
      break;
    case 'a':
      return {
        x: coords.x - 1,
        y: coords.y
      };
      break;
    case 's':
      return {
        x: coords.x,
        y: coords.y + 1
      };
      break;
    case 'd':
      return {
        x: coords.x + 1,
        y: coords.y
      };
      break;
    default:
      console.log("what are you smoking?:", direction);
  }
}

function Game(lobby, players) {
  this.lobby = lobby;
  this.players = players.players;
  this.maps = [];
  this.teams = players.teams;
  this.games = players.games;

  this.ended = false;

  // Build the maps
  for (var i = 0; i < numTeams; i++) {
    this.maps.push(new Map("test"));
  }

  // Send data to clients
  for (var i = 0; i < this.games.length; i++) {

    // For each player in the game
    for (var j = 0; j < this.games[i].length; j++) {
    var gameData = {
    mapData: this.maps[i].blueprint,
    playerData: []
    }
      // Get player data for each player in the game
      for (var k = 0; k < this.games[i].length; k++) {
        var playerData = {
          spawn: this.maps[i].spawns[k][0],
          id: this.games[i][k].id
        }
        if (this.games[i][j] === this.games[i][k]) {
          playerData.me = 1;
        }
        else {
          playerData.me = 0;
        }
        gameData.playerData.push(playerData);
      }
      var curPlayer = this.games[i][j];
      console.log("Emmitting init data to player", curPlayer.id);
      //console.log(gameData["playerData"]);
      curPlayer.socket.emit("initGame", gameData);
    }
  }

  this.startGame();
}

Game.prototype.startGame = function() {
  for (var i = 0; i < this.games[0].length; i++) {
    this.initPlayer(this.games[0][i], 0);
  }
  for (var i = 0; i < this.games[1].length; i++) {
    this.initPlayer(this.games[1][i], 1);
  }

  this.gameLoop = setInterval(function() {
    // If game over stop this madness
    if (this.ended) {
      clearInterval(this.gameloop);
      return;
    }
    // For each game
    for (var i = 0; i < this.games.length; i++) {
      // For each player in the game
      for (var j = 0; j < this.games[i].length; j++) {
        // Try to move them
        var player = this.games[i][j];
        this.movePlayer(player, i);
      }
    }
  }.bind(this), frameRate);
};


Game.prototype.initPlayer = function(player, gameNum) {
  player.keys = {'w': 0, 'a': 0, 's': 0, 'd': 0};
  player.directions = ['w','a','s','d'];
  player.directionToMove = "";
  player.moving = false;
  //player.coords = {x: 0, y: 0};

  // Setup key listeners
  player.keydown = function(key) {
    //console.log("before  down");
     // console.log(player.keys);
    if (key["key"] === 119)
    {
        key = 'w';       
    }
    else if (key["key"] === 115)
    {
        key = 's'
    }
    else if (key["key"] === 100)
    {
        key = 'd'
    }
    else if (key["key"] === 97)
    {
        key = 'a'
    }
    //console.log(key);
    player.keys[key] = 1;
      //console.log("set ", key, "to 1");

    // I want to move in this direction next
    var index = player.directions.indexOf(key);
    moveArraySlot(player.directions, index, 0);
    player.directionToMove = key;
      
     // console.log("after  down");
     //console.log(player.keys);
    console.log("down on", key, "game:",gameNum);
    console.log(player.moving);
    // Try to move
    this.movePlayer(player, gameNum);
  }.bind(this);
  player.socket.on('keydown', player.keydown);

  player.keyup = function(key) {
      //console.log("before  up");
      //console.log(player.keys);
      //console.log("Up on key ", key["key"])
    
    if (key["key"] === 119)
    {
        player.keys["w"] = 0;       
    }
    else if (key["key"] === 115)
    {
        player.keys["s"] = 0;
    }
    else if (key["key"] === 100)
    {
        player.keys["d"] = 0;
        //console.log("zeroed d");
    }
    else if (key["key"] === 97)
    {
        player.keys["a"] = 0;
    }

    //console.log("after down");
     // console.log(player.keys);
    // Determine the direction I want to be moving in
    var found = false;
    for (var i = 0; i < player.directions.length; i++) {
      if (player.keys[player.directions[i]] === 1) {
        player.directionToMove = player.directions[i];
          //console.log("Found another dir:", player.directions[i]);
        found = true;
        break;
      }
    }
    if (!found) {
        //console.log("No direction now");
      player.directionToMove = "";
    }
  }.bind(this);
  player.socket.on('keyup', player.keyup);
};


Game.prototype.movePlayer = function(player, gameNum) {
  //console.log("checking for loop");
  var map = this.maps[gameNum];
  // Check if able to move

  // Do I have the potential to move and am I trying to?
  if (!player.moving && player.directionToMove) {
    console.log("moving is possible");
    // Does the space I'm trying to move to exist?
    var destCoords = getDestCoords(player.coords, player.directionToMove);
    //console.log("Trying to move to:", destCoords.x, ",", destCoords.y);
    //console.log("y: " + destCoords.y);
    if (destCoords.x >= 0 && 
        destCoords.x < map.cols && 
        destCoords.y >= 0 && 
        destCoords.y < map.rows) {
      // Is the space not blocking me?
        //console.log(map.map[destCoords.y][destCoords.x]);
        //console.log(map.map[destCoords.y][destCoords.x].isBlocking());
      if (!(map.map[destCoords.y][destCoords.x].isBlocking())) {
        console.log("moving is gappening");
        // If so, start moving there
        player.moving = true;
        // Tell clients to animate me moving there
        var moveData = {
          id: player.id,
          coords: destCoords,
          duration: moveDuration
        }
        this.broadcastToGame(gameNum, 'moveTo', moveData);
        // After moving halfway, check if I can still move there
        setTimeout(function() {
          // Is the space im moving to a door, is it closed now?
          if (map.map[destCoords.y][destCoords.x].isBlocking()) {
            // Blocked, so move back to my previous space instead
            var moveData = {
              id: player.id,
              coords: player.coords,
              duration: moveDuration / 2
            }
            this.broadcastToGame(gameNum, 'moveTo', moveData);
            // Let me know when done
            setTimeout(function() {
              player.moving = false;
            }.bind(this), moveDuration / 2);
          }
          // I can actually move there, so update my position
          else {
            player.coords = destCoords;
            // I'm now actually on the next tile, so handle enter events
            var tile = map.map[destCoords.y][destCoords.x];
            if (tile.onEnter) {
              this.processEvent(tile.onEnter(player), gameNum);
            }
            // Move the other halfway and yer done!
            setTimeout(function() {
              player.moving = false;
            }.bind(this), moveDuration / 2);
          }
        }.bind(this), moveDuration / 2);
      }
    }
  }
}


Game.prototype.processEvent = function(event, gameNum) {
  switch (event.action) {
    case "toggleDoorsOfColor":
      var color = event.data;
      this.toggleDoorsOfColor(color, 1 - gameNum);
      break;
    case "winGame":
      console.log("process win p:",event.data.pteam,",w:",event.data.wteam)
      if (event.data.pteam === event.data.wteam) {
        this.endGame(event.data.wteam);
      }
      break;
    default:
      console.log("Invalid event type:", event.action);
  }
};


Game.prototype.toggleDoorsOfColor = function(color, gameNum) {
  var map = this.maps[gameNum];
  console.log("DEBUG: toggling", color, "doors");
  for (var i = 0; i < map.doors.length; i++) {
    // If this door is the right color, close it
    if (map.doors[i].color === color) {
      var doorCoords = map.doors[i].coords;
      var door = map.doors[i];
      door.toggle();
      // Tell clients to animate the door
      var doorData = {
        coords: doorCoords,
        state: door.open
      }
      this.broadcastToGame(gameNum, "doorToggle", doorData);
      // Check if the door closed on any players
      for (var j = 0; j < this.games[gameNum].length; j++) {
        var player = this.games[gameNum][j];
        if (player.coords.x == doorCoords.x && player.coords.y == doorCoords.y) {
          // Tell clients to animate the player's death
          var spawnCoords = map.spawns[player.team - 1][0];
          var playerData = {
            id: player.id,
            spawnCoords: spawnCoords
          };
          console.log("broadcasting killed");
          this.broadcastToGame(gameNum, 'playerKilled', playerData);
          // Reset player to their spawn point
          player.coords = {
            x: spawnCoords.x,
            y: spawnCoords.y
          };
          // Player can't move for a bit
          /*player.moving = true;
          setTimeout(function() {
            console.log("can move again");
            player.moving = false;
          }, 500);*/
        }
      }
    }
  } 
};


Game.prototype.endGame = function(teamNum) {
  // Stop taking input, clean up here
  console.log("endgame, ", this.players.length);
  this.ended = true;
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    player.socket.removeListener('keydown', player.keydown);
    player.socket.removeListener('keyup', player.keyup);
  }
  // Do existing timeouts mattter? Don't think so, just people finishing moving etc.
  // Tell clients
  var winData = {
    won: 1
  };
  var loseData = {
    won: 0
  };
  console.log("broadcasting game over event");
  this.broadcastToTeam(teamNum - 1, 'gameOver', winData);
  this.broadcastToTeam(1 - (teamNum - 1), 'gameOver', loseData);
  
  setTimeout(function() {
    for (var i = 0; i < this.players.length; i++) {
      var player = this.players[i];
      this.lobby.addPlayer(player.id, player);
    }
  }.bind(this), gameEndDelay);
};


// Send events to all players in a given game
Game.prototype.broadcastToGame = function(gameNum, event, data) {
  for (var i = 0; i < this.games[gameNum].length; i++) {
    this.games[gameNum][i].socket.emit(event, data);
  }
};


// Send events to all players in a given game
Game.prototype.broadcastToTeam = function(teamNum, event, data) {
  for (var i = 0; i < this.teams[teamNum].length; i++) {
    //console.log("broad");
    this.teams[teamNum][i].socket.emit(event, data);
  }
};


// Send events to all players in the entire game
Game.prototype.broadcast = function(event, data) {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].socket.emit(event, data);
  }
};

module.exports = Game;