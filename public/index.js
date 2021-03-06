const socket = io();
let username;
let known = false;
let amount = 0;

var project = document.getElementById("project");
var error = document.getElementById("error");
var login = document.getElementById("login");
var form = document.getElementById("form");
var user = document.getElementById("user");
var money = document.getElementById("amount");

// validate amount and send it to the server
function invest(investment) {
  const value = parseInt(investment);
  
  if (value < 0) {
    error.innerHTML = "Keine valide Zahl";
    return
  }
  if(value%10 !== 0){
    return
  }
  if (amount < value) {
    error.innerHTML = "Zu wenig Guthaben";
    return
  }
  if(project.value === ""){
    error.innerHTML = "Kein Projekt ausgewählt";
    return
  }
  socket.emit("invest", username, project.value, value);
  error.innerHTML = "";
}

function loginUsr() {
  username = user.value;
  if (!known && username != "") {
    socket.emit("new user", username);
    login.style.display = "none";
    form.style.display = "block";
  }
}

socket.on("set amount", function (user, AMOUNT) {
  if (username === user) {
    amount = AMOUNT;
    known = true;
    money.innerHTML = "Guthaben: " + amount + "&euro;";
  }
});

socket.on("invested", function (user, AMOUNT) {
  if (username === user) {
    amount -= AMOUNT;
    money.innerHTML = "Guthaben: " + amount + "&euro;";
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
  if (event.key !== "Enter") {
    return
  }
  if (login.style.display === "none") {
      invest();
    } else {
      loginUsr();
    }
});
