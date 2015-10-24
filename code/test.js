module.exports = function(params)
{
  var app = params.app;
    app.get('/test', function (req, res) {
      res.send("eq.params.word");
    });
}