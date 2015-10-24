var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/soundex', function (req, res) {
  res.send(req.params.word);
});

app.use('/static', express.static(__dirname + '/public'));

require("./test")({app: app});
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});