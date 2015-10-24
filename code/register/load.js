module.exports = function(params)
{
  var app  = params.app,
      conn = params.conn,
      sms  = params.sms;
  app.post('/register', function (reg, res) {
    var name = req.query.name,
        phone = req.query.phone,
        user  = {user_name: name, phone_number: phone };

    conn.query("INSERT INTO users SET ?", user, function (err, resp) {
      if (err) {
        console.log(err);
        res.render('../views/sign_in_failed.jsx', { title: 'Sign In Failed' });
        return;
      }

      sms.sendSMS(phone, "Thank you for registering");

      res.send("Thank you. We've send you confirmation to your phone number")
    });


  });
}