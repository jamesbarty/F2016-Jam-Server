var GameLobby = require('./gameLobby.js');

function Lobby() {
  
  this.players = {};
  this.numPlayers = 0;

  this.gameLobbies = [];
  this.gid = 1;
}

Lobby.prototype.addPlayer = function(id, player) {
  console.log("DEBUG: Adding player", id, "to lobby");

  if (this.containsPlayer(id)) {
    console.log("Player already exists with id:", id);
    return;
  }
  this.players[id] = player;
  this.numPlayers += 1;
  
  // Now in the lobby, the player can create games
  player.createGame = function() {
    this.removePlayer(player.id);
    this.addGameLobby(player);
  }.bind(this);
  player.socket.on('createGame', player.createGame);

  // Now in the lobby, the player can join games
  player.joinGame = function(gameNumData) {
    var gid = gameNumData.gameNum;
    // Add them to the game lobby
    for (var i = 0; i < this.gameLobbies.length; i++) {
      if (this.gameLobbies[i].gid === gid) {
        if (this.gameLobbies[i].isFull()) {
          console.log("DEBUG: cannot add player", player.id, " to game", gid, "(too full)");
        }
        else {
          this.removePlayer(player.id);
          this.gameLobbies[i].addPlayer(player);
          break;
        }
      }
    }
  }.bind(this);
  player.socket.on('joinGame', player.joinGame);

  // Tell client they are in
  player.socket.emit('lobbyUpdate', this.getLobbyInfo());
};

Lobby.prototype.removePlayer = function(id) {
  console.log("DEBUG: removing player ", id, "from lobby");

  if (!this.containsPlayer(id)) {
    console.log("Could not remove player with id:", id);
    return;
  }
  var player = this.players[id];
  this.players[id] = null;
  delete this.players[id];
  this.numPlayers -= 1;

  // Now out of the lobby, can't create games
  player.socket.removeListener('createGame', player.createGame);
  // Now out of the lobby, can't join games
  player.socket.removeListener('joinGame', player.joinGame);
};

Lobby.prototype.containsPlayer = function(id) {
  if (this.players[id]) {
    return true;
  }
  return false;
};

Lobby.prototype.numPlayers = function(id) {
  return this.numPlayers;
};

Lobby.prototype.addGameLobby = function(player) {
  console.log("DEBUG: adding game lobby with id", this.gid);

  var gl = new GameLobby(this, player, this.gid);
  this.gid += 1;
  this.gameLobbies.push(gl);

  // Update lobbies for players
  this.broadcast('lobbyUpdate', this.getLobbyInfo());
};

Lobby.prototype.removeGameLobby = function(gl) {
  console.log("DEBUG: removing game lobby with id", gl.gid);

  for (var i = 0; i < this.gameLobbies.length; i++) {
    if (this.gameLobbies[i].gid == gl.gid) {
      this.gameLobbies.splice(i, 1);
      break;
    }
  }
  // Update lobbies for players
  this.broadcast('lobbyUpdate', this.getLobbyInfo());
};

Lobby.prototype.broadcast = function(event, data) {
  for (var prop in this.players) {
    if (this.players.hasOwnProperty(prop)) {
      this.players[prop].socket.emit(event, data);
    }
  }
};

Lobby.prototype.getLobbyInfo = function() {
  var gamesOpen = [];
  for (var i = 0; i < this.gameLobbies.length; i++) {
    gamesOpen.push({
      id: this.gameLobbies[i].gid,
      numPlayers: this.gameLobbies[i].players.length
    });
  }
  return {gamesOpen:gamesOpen};
};

module.exports = Lobby;