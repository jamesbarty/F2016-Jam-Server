var fps = 20;
var frameRate = 1000 / fps;
var moveDuration = 1000;
var numGames = 2;
var numTeams = 2;
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
    case "w":
      return {
        x: coords.x,
        y: coords.y - 1
      };
      break;
    case "a":
      return {
        x: coords.x - 1,
        y: coords.y
      };
      break;
    case "s":
      return {
        x: coords.x,
        y: coords.y + 1
      };
      break;
    case "d":
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
    var gameData = {
      mapData: this.maps[i].blueprint,
      playerData: []
    }
    // For each player in the game
    for (var j = 0; j < this.games[i].length; j++) {
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
  player.coords = {x: 0, y: 0};

  // Setup key listeners
  player.keydown = function(key) {
    player.keys[key] = 1;

    // I want to move in this direction next
    var index = players.directions.indexOf(e.key);
    moveArraySlot(directions, index, 0);
    player.directionToMove = key;

    // Try to move
    this.movePlayer(player, gameNum);
  };
  player.socket.on('keydown', player.keydown);

  player.keyup = function(key) {
    player.keys[key] = 0;

    // Determine the direction I want to be moving in
    var found = false;
    for (var i = 0; i < player.directions.length; i++) {
      if (player.keys[player.directions[i]]) {
        player.directionToMove = player.directions[i];
        found = true;
        break;
      }
    }
    if (!found) {
      player.directionToMove = "";
    }
  };
  player.socket.on('keyup', player.keyup);
};


Game.prototype.movePlayer = function(player, gameNum) {
  var map = this.maps[gameNum];
  // Check if able to move

  // Do I have the potential to move and am I trying to?
  if (!player.moving && player.directionToMove) {
    // Does the space I'm trying to move to exist?
    var destCoords = getDestCoords(player.coords, player.directionToMove);
    if (destCoords.x >= 0 && 
        destCoords.x < map.width && 
        destCoords.y >= 0 && 
        destCoords.y < map.height) {
      // Is the space not blocking me?
      if (!(map.map[destCoords.y][destCoords.x].isBlocking)) {
        // If so, start moving there
        player.moving = true;
        // Tell clients to animate me moving there
        var moveData = {
          id: player.id,
          coords: destCoords
        }
        this.broadcastToGame(gameNum, 'moveTo', moveData);
        // After moving halfway, check if I can still move there
        setTimeout(function() {
          // Is the space im moving to a door, is it closed now?
          if (map.map[destCoords.y][destCoords.x].isBlocking) {
            // Blocked, so move back to my previous space instead
            var moveData = {
              id: player.id,
              coords: player.coords
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
              this.processEvent(tile.onEnter(), gameNum);
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
      this.toggleDoorsOfColor(color, gameNum);
      break;
    case "winGame":
      var teamNum = event.data;
      this.endGame(teamNum);
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
    if (door.color === color) {
      var doorCoords = map.doors[i];
      var door = map.map[doorCoords.y][doorCoords.x];
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
          var playerData = {
            id: player.id
          }
          this.broadcastToGame(gameNum, 'playerKilled', playerData);
          // Reset player to their spawn point
          player.coords = {
            x: spawn.x,
            y: spawn.y
          };
          // Player can't move for a bit
          player.moving = true;
          setTimeout(function() {
            player.moving = false;
          }, 500);
        }
      }
    }
  } 
};


Game.prototype.endGame = function(teamNum) {
  // Stop taking input, clean up here
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
  this.broadcastToTeam(teamNum, 'gameOver', winData);
  this.broadcastToTeam(1 - teamNum, 'gameOver', loseData);
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