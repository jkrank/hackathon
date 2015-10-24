exports.sign_in = function(req, res){
  res.render('sign_in', { name: 'John', title: 'Sign In' });
};