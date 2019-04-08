var fs = require("fs");
var pdfkit = require("pdfkit");

var data = {
  names: [],
  amounts: []
};
var filename;
var doc = new pdfkit();

function main() {
  checkArgs();
  generateCodes();
  saveCodes();
}

function getNext() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
}

function checkArgs() {
  if (process.argv > 2) {
    filename = process.argv[2];
  } else {
    filename = "users";
  }
}

function generateCodes() {
  for (var i = 0; i < 200; i++) {
    data.names.push(getNext());
  }
}

function saveCodes() {
  fs.writeFile(filename + ".json", JSON.stringify(data), "utf-8", err => {
    if (err) {
      throw err;
    }
  });

  if (fs.exists(filename + ".pdf")) {
    fs.unlinkSync(filename + ".pdf");
  }

  var exp = "";
  for (var i = 0; i < data.names.length; i++) {
    if (i % 3 == 0) {
      exp += data.names[i] + "\n";
    } else {
      exp += data.names[i] + "                               ";
    }
  }
  doc.pipe(fs.createWriteStream(filename + ".pdf"));
  doc.fontSize(15).text(exp, 100, 100);
  doc.end();
}

main();
