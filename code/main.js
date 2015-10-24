var express = require('express');
var app = express();

require('./sign_in/load.js')({app: app});

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.get('/routes', require('./routes').index);

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