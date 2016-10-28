var io = require("socket.io")(process.env.PORT || 3000);

console.log('server started');

io.on('connection', function(socket) {
  console.log('on connection');

  socket.on('move', function() {
    console.log('client moved');
  });
});