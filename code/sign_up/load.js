module.exports = function(params)
{
  var app = params.app;
  app.get('/sign_up', require('../routes/sign_up').sign_in);
}