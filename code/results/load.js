module.exports = function(params)
{
  var app = params.app;
  app.get('/results', require('../routes/results.js').results);
}