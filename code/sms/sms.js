module.exports = function(params)
{
  var app = params.app,
      http = require("https"),
      api_key = require("./clockwork_api_key.js");
    app.get('/receive-sms', function (req, res) {
      var to     = req.query.to,
          from   = req.query.from,
          text   = req.query.content,
          msg_id = req.query.msg_id;

      res.send("api_key: "+api_key+"<br>from: "+from+"<br>to"+to+"<br>content: "+text)
    });
    app.get('/send-sms', function (req, res) {
      var to = req.query.to,
          content = req.query.content;
      res.send(this.sendSMS(to, content));
    });

  sendSMS = function(to, text) {
      var options = {
            host: "api.clockworksms.com",
            port: 443,
            path: "/http/send.aspx?key="+api_key
                    +"&from=BrokePhone",
          },
          success = false;

      function composeMessage(msg) {
          return encodeURIComponent(msg);
      }

      callback = function(response) {
        var str = "";
        console.log(options.path+": "+response.statusCode);
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          return str;
        });
      }

      if (!to || !text) {
        throw new Error("Destination and content needed!");
      }
      options.path += "&to="+encodeURIComponent(to)+"&content="+composeMessage(text);

      return http.request(options, callback).end();
  };

}