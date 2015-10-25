module.exports = function(params)
{
  var app = params.app;
  app.get('/sign_up_failed', require('../routes/sign_up_failed.js').sign_up_failed);
}