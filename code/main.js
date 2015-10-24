var express = require('express');
var wordnet = require("wordnet");
var mysql  = require('mysql');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.static(__dirname + '/public'));

var sms    = require("./sms/sms.js")({app:app});
var conn = mysql.createConnection({ host: 'localhost', user: 'root', password: 'x', database: 'whispers' });

require('./sign_in/load.js')({app: app});
require('./sign_up/load.js')({app: app});
require('./register/load.js')({ app: app, conn: conn, sms: sms});
require("./scrample/scrample.js")({app:app, wordnet: wordnet, conn: conn});
require("./server.js")({app:app});
