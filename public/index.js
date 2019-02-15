const socket = io();
let username;
let known = false;
let amount = 0;

var investment = document.getElementById("investment");
var project = document.getElementById("project");
var error = document.getElementById("error");
var login = document.getElementById("login");
var form = document.getElementById("form");
var user = document.getElementById("user");
var money = document.getElementById("amount");

// validate give amount and send it to the server
function invest() {
  const value = parseFloat(investment.value);
  if (value < 0) {
    error.innerHTML = "Keine valide Zahl";
  } else {
    console.log(value, amount);
    if (amount >= value) {
      console.log(
        username + " trying to invest " + value + " into " + project.value
      );
      socket.emit("invest", username, project.value, value);
      error.innerHTML = "";
    } else {
      error.innerHTML = "Zu wenig Guthaben";
    }
  }
}

function loginUsr() {
  username = user.value;
  if (!known && username != "") {
    socket.emit("new user", username);
  }
  login.style.display = "none";
  form.style.display = "block";
}

socket.on("set amount", function (user, AMOUNT) {
  if (username === user) {
    amount = AMOUNT;
    known = true;
    money.innerHTML = "Guthaben: " + amount;
  }
});

socket.on("invested", function (user, AMOUNT) {
  if (username === user) {
    amount -= AMOUNT;
    money.innerHTML = "Guthaben: " + amount;
    socket.emit("update chart");
  }
});

socket.on("not a user", function (user) {
  if (user === username) {
    form.style.display = "none";
    error.innerHTML = "IF-Nummer falsch";
  }
});

// add EventListener for Enter event
window.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (login.style.display === "none") {
      invest();
    } else {
      loginUsr();
    }
  }
});
