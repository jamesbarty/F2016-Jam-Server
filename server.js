var io = require("socket.io")(process.env.PORT || 3000);
var lobby = require("./lobby.js");
var game = require("./game.js");

var _lobby = new lobby();

console.log('server started');

var uid = 1;

// Someone connects to the server
io.on('connection', function(socket) {
  console.log('on connection');
  socket.emit("test");
  // Assign ID to socket
  var newID = uid;
  uid += 1;

  // Create the player object
  var player = {
    id: newID,
    socket: socket
  };

  socket.on("name", function(nameData) {
    player.name = nameData.name;
    // Add player to lobby
    _lobby.addPlayer(newID, player);
  })
});