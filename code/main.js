var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(express.static(__dirname + '/public'));

require('./sign_in/load.js')({app: app});
require('./sign_up/load.js')({app: app});
require("./sms/sms.js")({app:app});

require("./server.js")({app:app});