var socketclient = require("socket.io-client")
var readline = require("readline");

var reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'chat>'

});

reader.prompt()

var socket = socketclient.connect("http://localhost:3001")
var username;

reader.question("Enter your name ", function (name) {

    var message = {}
    username = name
    message.kind = "joining"
    message.user = name
    message.data = `${name} has joined`

    socket.emit("message", message)

    reader.prompt()

})

reader.on("line", function (data) {

    var sarr = data.split(" ")
    var kind = sarr[0]
    var message = {}

    if (kind == "private") {
        //syntax :- private receiver_name message
        var receiver = sarr[1]
        message.data = `${username} : ${sarr.slice(2, sarr.length).join(" ")} `
        message.kind = "private"
        message.receiver = receiver

    } else {
        //syntax :- message
        message.data = `${username} : ${data} `
        message.kind = "public"
    }

    socket.emit("message", message)
    reader.prompt()

})

socket.on("notice", function (message) {
    console.log(message)
    reader.prompt()

})



