const socket = io()
var ctx = document.getElementById("results").getContext("2d")
var first = document.getElementById("first")
var second = document.getElementById("second")
var third = document.getElementById("third")


socket.on("update", function (names, amounts) {
  // update leaderboard
  var struct = []
  for(var i = 0; i < names.length; i++){
    struct.push({name:names[i],amount:amounts[i]});
  }
  var sorted = struct.sort(compare).reverse();

  if(sorted[0].amount === sorted[1].amount || sorted[0].amount === sorted[2].amount){
    first.className = "green-text"
  }
  if(sorted[0].amount === sorted[1].amount || sorted[1].amount === sorted[2].amount ){
    second.className = "green-text"
  }
  if(sorted[0].amount === sorted[2].amount || sorted[2].amount === sorted[1].amount){
    third.className = "green-text"
  }

  first.innerHTML = "1. "+sorted[0].name
  second.innerHTML = "2. "+sorted[1].name
  third.innerHTML = "3. "+sorted[2].name

  // repaint chart
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: names,
      pointLabelFontSize: 16,
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

function compare(a,b){
  if(a.amount < b.amount){
    return -1
  }
  if(a.amount > b.amount){
    return 1;
  }
  return 0;
}