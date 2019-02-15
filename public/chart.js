const socket = io();
var ctx = document.getElementById("results").getContext("2d");
var first = document.getElementById("first")
var second = document.getElementById("second")
var third = document.getElementById("third")


socket.on("update", function(names, amounts) {
  //fill leaderboard
  leaders = amounts.sort((a,b) => a-b);
  leaders = leaders.reverse();
  first.innerHTML = "1. " + names[amounts.indexOf(leaders[0])];
  second.innerHTML = "2. " + names[amounts.indexOf(leaders[1])];
  third.innerHTML = "3. " + names[amounts.indexOf(leaders[2])];

  // repaint chart
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: names,
      datasets: [
        {
          label: 'Amount',
          data: amounts,
          backgroundColor: palette('tol-rainbow', amounts.length).map(function(hex) {
            return '#' + hex;
          })
        }
      ]
    },
    options: {
      animation: {
        duration: 0 //to prevent reload animation
      }
    }
  });
});

socket.emit("update chart");
