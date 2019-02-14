const socket = io();
var ctx = document.getElementById("results").getContext("2d");


socket.on("update", function(names, amounts) {
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: names,
      datasets: [
        {
          label: "# of Votes",
          data: amounts,
          backgroundColor: palette('tol', amounts.length).map(function(hex) {
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
