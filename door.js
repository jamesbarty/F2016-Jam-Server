function Door(color, state, coords/*, orientation*/) {
  this.color = color;
  //this.orientation = orientation;
  this.open = state;
  this.coords = coords;
}

Door.prototype.isBlocking = function() {
  return !this.open;
};

Door.prototype.open = function() {
  this.open = true;
};

Door.prototype.close = function() {
  this.open = false;
};

Door.prototype.toggle = function() {
  this.open = !this.open;
};

module.exports = Door;