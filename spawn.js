function Spawn(teamNum) {
  this.teamNum = teamNum;
}

Spawn.prototype.isBlocking = function() {
  return false;
};

module.exports = Spawn;