function Switch(color) {
  this.color = color;
}

Switch.prototype.isBlocking = function() {
  return false;
};

Switch.prototype.onEnter = function() {
  return {
    action: "toggleDoorsOfColor",
    data: this.color
  };
}

module.exports = Switch;