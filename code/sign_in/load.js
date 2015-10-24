module.exports = function(params)
{
  var app = params.app;
    app.get('/sign_in', function (req, res) {
      res.send("testing the sing_in page");
    });
}