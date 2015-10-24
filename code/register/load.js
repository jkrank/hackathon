module.exports = function(params)
{
  var app  = params.app,
      conn = params.conn,
      sms  = params.sms;
  app.post('/register', function (req, res) {
    var name = req.body.name,
        phone = req.body.phone,
        user  = {user_name: name, phone_number: phone };

    conn.query("INSERT INTO users SET ?", user, function (err, resp) {
      if (err) {
        console.log(err);
        res.render('../views/sign_in_failed.jsx', { name: name, title: 'Sign In Failed' });
        return;
      }

      sms.sendSMS(phone, "Welcome to BrokePhone! Reply to this message with your phrase");

      rres.render('../views/sign_in_success.jsx', { name: name, title: 'Sign In Successfull' });
    });


  });
}