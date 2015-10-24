exports.sign_in = function(req, res){
    res.render('../views/sign_in.jsx', { name: 'John', title: 'Sign In' });
};