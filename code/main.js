var express = require('express');
var wordnet = require("wordnet");
var mysql  = require('mysql');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.static(__dirname + '/public'));

var sms    = require("./sms/sms.js")({app:app});
var conn = mysql.createConnection({ host: 'localhost', user: 'root', password: 'x', database: 'whispers' });

require('./index/load.js')({app: app});
require('./results/load.js')({app: app});
require('./sign_up/load.js')({app: app});
require('./sign_up_failed/load.js')({app: app});
require('./sign_up_success/load.js')({app: app});
require('./getStatistics/load.js')({app: app, conn: conn});
require('./register/load.js')({ app: app, conn: conn, sms: sms});
require("./scrample/scrample.js")({app:app, wordnet: wordnet, conn: conn});
require("./game/load.js")({ app: app, conn: conn, sms: sms});
require("./server.js")({app:app});
