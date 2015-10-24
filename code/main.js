var express = require('express');
var wordnet = require("wordnet");
var mysql = require('mysql');
var conn = mysql.createConnection({ host: 'localhost', user: 'root', password: 'x', database: 'whispers' });
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use('/static', express.static(__dirname + '/public'));

require('./sign_in/load.js')({app: app});
require('./sign_up/load.js')({app: app});
require("./sms/sms.js")({app:app});
require("./scrample/scrample.js")({app:app});

require("./server.js")({app:app});
