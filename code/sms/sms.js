module.exports = function(params)
{
  var app = params.app;
    app.get('/receive-sms', function (req, res) {
      var to     = req.query.to,
          from   = req.query.from,
          text   = req.query.content,
          msg_id = req.query.msg_id;

      res.send("from: "+from+"<br>to"+to+"<br>content: "+text)
  });

  sendSMS = function(to, text) {
      return false;
  }

}