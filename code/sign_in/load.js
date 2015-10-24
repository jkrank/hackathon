module.exports = function(params)
{
  var app = params.app;
  app.get('/sign_in', require('../routes/sign_in').sign_in);
}