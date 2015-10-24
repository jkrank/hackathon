var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/public'));

require('./sign_in/load.js')({app: app});
require('./sign_up/load.js')({app: app});
require("./sms/sms.js")({app:app});

require("./server.js")({app:app});