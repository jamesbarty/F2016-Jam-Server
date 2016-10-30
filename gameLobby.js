var Game = require("./game.js");

function GameLobby(lobby, player, gid) {
  this.lobby = lobby;
  this.gid = gid;
  this.players = [player];
  this.maxPlayers = 4;
  this.maxTeam = 3;

  this.teamOne = [player];
  this.teamTwo = [];

  player.team = 1;

  this.setupOwner(player);
  // gamelobby owner can start and leave games
  
}

GameLobby.prototype.setupOwner = function(player) {
  player.startGame = function() {
    // Can start if I have two players on each team
    if (this.teamOne.length == this.maxPlayers / 2 && this.teamTwo.length == this.maxPlayers / 2) {
      var players = {
        players: this.players,
        teams: [this.teamOne, this.teamTwo],
        games: [[this.teamOne[0], this.teamTwo[0]], [this.teamOne[1], this.teamTwo[1]]]
      }
      
      // Destroy the game lobby as we are going into the game!
      player.socket.removeListener("startGame", player.startGame);
      for (var i = this.players.length - 1; i >= 0; i--) {
        console.log("DEBUG: player", this.players[i].id, "removed from game lobby", this.gid, "to enter game");
        this.removePlayer(this.players[i]); 
      }
      this.lobby.removeGameLobby(this);

      console.log("DEBUG: player", player.id, "starting game with id", this.gid);
      var game = new Game(this.lobby, players);
    }
    else {
      console.log("DEBUG: player", player.id, "cant start game with id", this.gid);
    }
  }.bind(this);
  player.socket.on("startGame", player.startGame);


  player.switchTeam = function(teamNumData) {
    this.switchPlayer(player, teamNumData.teamNum);
  }.bind(this);
  player.socket.on("switchTeam", player.switchTeam);


  player.leaveGame = function() {
    player.socket.removeListener("startGame", player.startGame);

    // If the owner leaves then everyone gets booted
    for (var i = this.players.length - 1; i >= 0; i--) {
      var curPlayer = this.players[i];
      this.removePlayer(curPlayer);
      this.lobby.addPlayer(curPlayer.id, curPlayer);
      console.log("DEBUG: player", curPlayer.id, " booted to lobby from game lobby with id", this.gid);
    }

    this.lobby.removeGameLobby(this);
  }.bind(this);
  player.socket.on("leaveGame", player.leaveGame);

  player.socket.emit("gameLobbyUpdate", this.getInfo());

  console.log("DEBUG: created game lobby with id", this.gid, "for player", player.id);
};


GameLobby.prototype.addPlayer = function(player, socket) {
  console.log("DEBUG: added player", player.id, "to game lobby with id", this.gid);

  if (this.isFull()) {
    console.log("Cannot add player to game lobby, already full");
    return;
  }
  this.players.push(player);
  if (this.teamOne.length <= this.teamTwo.length) {
    player.team = 1;
    this.teamOne.push(player);
  }
  else {
    this.teamTwo.push(player);
    player.team = 2;
  }

  // Now in game lobby, can leave the game or switch teams
  player.leaveGame = function() {
    this.removePlayer(player);
    this.lobby.addPlayer(player.id, player);
    console.log("DEBUG: player", player.id, "to lobby left game lobby with id", this.gid);
    // Let everyone know
    this.broadcast("gameLobbyUpdate", this.getInfo());
  }.bind(this);
  player.socket.on("leaveGame", player.leaveGame);

  player.switchTeam = function(teamNumData) {
    this.switchPlayer(player, teamNumData.teamNum);
  }.bind(this);
  player.socket.on("switchTeam", player.switchTeam);

  // Let everyone know
  this.broadcast("gameLobbyUpdate", this.getInfo());
};


GameLobby.prototype.removePlayer = function(player) {
  console.log("DEBUG: removed player", player.id, "from game lobby with id", this.gid);

  // Not in game lobby, cant leave or switch teams anymore
  player.socket.removeListener("leaveGame", player.leaveGame);
  player.socket.removeListener("switchTeam", player.switchTeam);

  // Remove player from team and from players
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id == player.id) {
      this.players.splice(i, 1);
      break;
    }
  }
  if (player.team == 1) {
    for (var i = 0; i < this.teamOne.length; i++) {
      if (this.teamOne[i].id == player.id) {
        this.teamOne.splice(i, 1);
        break;
      }
    }
  }
  else if (player.team == 2) {
    for (var i = 0; i < this.teamTwo.length; i++) {
      if (this.teamTwo[i].id == player.id) {
        this.teamTwo.splice(i, 1);
        break;
      }
    }
  }
};


GameLobby.prototype.switchPlayer = function(player, teamNum) {

  if (teamNum == 1 && this.teamOne.length < this.maxTeam && player.team == 2) {
    console.log("DEBUG: switching player", player.id, " to team", teamNum, "in game lobby", this.gid);
    for (var i = 0; i < this.teamTwo.length; i++) {
      if (this.teamTwo[i].id == player.id) {
        this.teamTwo.splice(i, 1);
        break;
      }
    }
    this.teamOne.push(player);
    player.team = 1;
    // Update clients
    this.broadcast('gameLobbyUpdate', this.getInfo());
  }
  else if (teamNum == 2 && this.teamTwo.length < this.maxTeam && player.team == 1) {
    console.log("DEBUG: switching player", player.id, " to team", teamNum, "in game lobby", this.gid);
    for (var i = 0; i < this.teamOne.length; i++) {
      if (this.teamOne[i].id == player.id) {
        this.teamOne.splice(i, 1);
        break;
      }
    }
    this.teamTwo.push(player);
    player.team = 2;
    // Update clients
    this.broadcast('gameLobbyUpdate', this.getInfo());
  }
  else {
    console.log("DEBUG: can't switch player", player.id, " to team", teamNum, "in game lobby", this.gid);
  }
};


GameLobby.prototype.broadcast = function(event, data) {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].socket.emit(event, data);
  }
}


GameLobby.prototype.isFull = function() {
  return this.players.length == this.maxPlayers;
};


GameLobby.prototype.getInfo = function() {
  var teamOnePlayers = [];
  var teamTwoPlayers = [];
  for (var i = 0; i < this.teamOne.length; i++) {
    teamOnePlayers.push({name: this.teamOne[i].name});
  }
  for (var i = 0; i < this.teamTwo.length; i++) {
    teamTwoPlayers.push({name: this.teamTwo[i].name});
  }
  return {
    teamOne: teamOnePlayers,
    teamTwo: teamTwoPlayers
  }
};

module.exports = GameLobby;