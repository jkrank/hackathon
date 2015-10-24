module.exports = function(params)
{
  var app = params.app;
  app.get('/sign_in', require('../routes/sign_in.js').sign_in);
}