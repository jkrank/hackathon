module.exports = function(params)
{
  var app = params.app;
  app.get('/sign_in_failed', require('../routes/sign_in_failed.js').sign_in_failed);
}