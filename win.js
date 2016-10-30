function Win(team) {
  this.team = team;
}

Win.prototype.isBlocking = function() {
  return false;
};

Win.prototype.onEnter = function(player) {
  return {
    action: "winGame",
    data: {
      pteam: player.team,
      wteam: this.team
    }
  }
};

module.exports = Win;