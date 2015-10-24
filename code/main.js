var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

<<<<<<< HEAD
app.get('/routes', require('./routes').index);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/soundex', function (req, res) {
  res.send(req.query.word);
  res.sen
});

=======
>>>>>>> 24bb1cd8ae9bcb1c900a4fd99d80165c1aaa6ac3
app.use('/static', express.static(__dirname + '/public'));

require('./sign_in/load.js')({app: app});
require('./sign_up/load.js')({app: app});
require("./sms/sms.js")({app:app});

require("./server.js")({app:app});
