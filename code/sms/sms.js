module.exports = function(params)
{
  var app = params.app,
      http = require("http"),
      api_key = require("./clockwork_api_key.js");
    app.get('/receive-sms', function (req, res) {
      var to     = req.query.to,
          from   = req.query.from,
          text   = req.query.content,
          msg_id = req.query.msg_id;

      res.send("api_key: "+api_key+"<br>from: "+from+"<br>to"+to+"<br>content: "+text)
  });

  sendSMS = function(to, text) {
      var options = {
        host: "https://api.clockworksms.com",
        path: "/http/send.aspx?key="+api_key
                +"&from=BrokePhone",
      }

      function composeMessage(msg) {
          return encodeURIComponent(msg);
      }

      if (!to || !text) {
        throw new Error("Destination and content needed!");
      }
      path += "&to="+encodeURIComponent(to)+"&content="+composeMessage(text);
  

      return false;
  }

}