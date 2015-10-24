module.exports = function(params)
{
  var app = params.app;
  app.get('/sign_up_success', require('../routes/sign_up_success').sign_up_success);
}