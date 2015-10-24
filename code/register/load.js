module.exports = function(params)
{
  var app = params.app;
  app.get('/register', function (reg, res) {
      res.send("register");
  });
}