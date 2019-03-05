const socket = io();
var ctx = document.getElementById("results").getContext("2d");
var first = document.getElementById("first")
var second = document.getElementById("second")
var third = document.getElementById("third")


socket.on("update", function (names, amounts) {
  // update leaderboard
  leaders = amounts.sort((a, b) => a - b);
  leaders = leaders.reverse();
  if (leaders[0] !== 0) {
    first.innerHTML = "1. " + names[amounts.indexOf(leaders[0])];
  }
  if(leaders[1] !== 0 ){
    second.innerHTML = "2. " + names[amounts.indexOf(leaders[1])];
  }
  if(leaders[2] !== 0){
    third.innerHTML = "3. " + names[amounts.indexOf(leaders[2])];
  }

  // repaint chart
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: names,
      pointLabelFontSize : 16,
      scaleFontSize: 16,
      datasets: [
        {
          label: 'Amount',
          data: amounts,
          backgroundColor: palette('tol-rainbow', amounts.length).map(function (hex) {
            return '#' + hex;
          })
        }
      ]
    },
    options: {
      animation: {
        animateRotate: false //to prevent reload animation
      }
    }
  });
});

socket.emit("update chart");
