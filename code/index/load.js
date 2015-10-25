module.exports = function(params)
{
  var app = params.app;
  app.get('/', require('../routes/index.js').index);
}