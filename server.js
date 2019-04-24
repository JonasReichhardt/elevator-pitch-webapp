const express = require("express");
const http = require("http");
const sio = require("socket.io");
const fs = require("fs");

const prjFile = "projects.json";
const usrFile = "users.json";
const enc = "utf8";
const AMOUNT = 100000;

const app = express();
const server = http.createServer(app);
const io = sio(server);
const port = process.env.PORT || 3000;

var curAmount;
var projects;
var users;

loadConf();
setAmount();

//setup server
server.listen(port, function () {
  console.log("Server is listening on port:" + port);
});
app.use(express.static(__dirname + "/public"));

//Socket.io events
io.on("connection", function (socket) {
  socket.on("invest", function (user, project, amount) {
    // valid amount
    if (amount !== 1000 && amount !== 10000 && amount !== 25000) {
      return
    }
    // valid username
    if (users.names.indexOf(user) === -1) {
      socket.emit("not a user", user);
      return
    }
    // enough credits
    if (users.values[users.names.indexOf(user)] - amount < 0) {
      return
    }

    projects.amount[projects.names.indexOf(project)] += parseFloat(amount);
    users.values[users.names.indexOf(user)] -= parseFloat(amount);
    console.log(user + " hat " + amount + " Euro in " + project + " investiert");

    io.sockets.emit("update", projects.names, projects.amount);
    socket.emit("invested", user, amount);
  });
  socket.on("new user", function (user) {
    if (users.names.indexOf(user) === -1) {
      socket.emit("not a user", user);
      return
    }
    socket.emit("set amount", user, users.values[users.names.indexOf(user)]);
  });
  socket.on("update chart", () => {
    socket.emit("update", projects.names, projects.amount);
  });
});

// loading data from JSON files
function loadConf() {
  projects = JSON.parse(fs.readFileSync(prjFile), enc);
  users = JSON.parse(fs.readFileSync(usrFile), enc);
}

// check command line arguments
function setAmount() {
  if (process.argv.length > 2) {
    curAmount = process.argv[2];
  } else {
    curAmount = AMOUNT;
  }
  console.log("Budget pro Benutzer: " + curAmount);
  for (var i = 0; i < users.names.length; i++) {
    users.values.push(curAmount);
  }
}
