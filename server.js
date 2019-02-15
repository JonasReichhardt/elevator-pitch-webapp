const express = require("express");
const http = require("http");
const sio = require("socket.io");
const fs = require("fs");

const prjFile = "projects.json";
const usrFile = "users.json";
const enc = "utf8";

const app = express();
const server = http.createServer(app);
const io = sio(server);
const port = process.env.PORT || 3000;

var AMOUNT;
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
    if (amount > 0) {
      if (users.names.indexOf(user) !== -1) {
        if (projects.names.indexOf(project) !== -1) {
          if (users.value[users.names.indexOf(user)] - amount >= 0) {
            console.log(
              user + " hat " + amount + " Euro in " + project + " investiert"
            );
            projects.amount[projects.names.indexOf(project)] += parseFloat(
              amount
            );
            users.value[users.names.indexOf(user)] -= parseFloat(amount);
            io.sockets.emit("update", projects.names, projects.amount);
            socket.emit("invested", user, amount);
          }
        }
      } else {
        socket.emit("not a user", user);
      }
    }
  });
  socket.on("new user", function (user) {
    if (users.names.indexOf(user) !== -1) {
      socket.emit("set amount", user, users.value[users.names.indexOf(user)]);
    } else {
      socket.emit("not a user", user);
    }
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
    AMOUNT = process.argv[2];
  } else {
    AMOUNT = 100000;
  }
  console.log("Budget pro Benutzer: " + AMOUNT);
  for (var i = 0; i < users.names.length; i++) {
    users.value.push(AMOUNT);
  }
}
