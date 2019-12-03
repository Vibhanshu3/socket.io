var http = require("http")
var socketio = require("socket.io")

var server = http.createServer();
var socketServer = socketio(server)

var db = {}

socketServer.on("connect", function (socket) {

  socket.on("message", function (data) {
    console.log(data.user + " :- " + socket.id)

    if (data.kind === "private") {
      socket.to(db[data.receiver]).emit("notice", data.data);

    } else {
      var message = ""
      if (data.kind === "joining") {
        db[data.user] = socket.id;
        message = data.data;

      } else if (data.kind === "public") {
        message = data.data;

      }
      socket.broadcast.emit("notice", message);
    }
  })
})

server.listen(3001, function () {
  console.log("server has started on port 3001")
})