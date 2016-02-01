var express = require("express");
var app = express();
var fs = require('fs');


app.get('/', function (req, res) {
  var json = fs.readFileSync("data/L-11.json", "UTF8");
  res.send(json);
});

app.listen(3000, function () {
  console.log('Cest passe!');
});
app.use(express.static('public'));