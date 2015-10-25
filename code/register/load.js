module.exports = function(params)
{
  var app  = params.app,
      conn = params.conn,
      sms  = params.sms;
  app.post('/register', function (req, res) {
    var name = req.body.name,
        phone = req.body.phone || '',
        user  = {user_name: name, phone_number: phone };

    if (!new RegExp("^\\d+$").test(phone.replace(/\D/g, '').replace(' ', ''))) {
       res.render('../views/sign_up_failed.jsx', { name: name, title: 'Sign Up Failed' });
       return;
    }

    conn.query("SELECT id from users WHERE phone_number = ?", [phone], function (err, result) {
        if (err) {
            console.log(err);
            res.render('../views/sign_up_failed.jsx', { name: name, title: 'Error while validating phone number' });
            return;
        }
        if (result.length > 0) {
          res.send("This phone number is already registered");
          return;
        }
        conn.query("INSERT INTO users SET ?", user, function (err, resp) {
          if (err) {
            console.log(err);
            res.render('../views/sign_up_failed.jsx', { name: name, title: 'Sign Up Failed' });
            return;
          }
          sms.sendSMS(phone, "Welcome to BrokePhone! Reply to this message with your phrase");
          res.render('../views/sign_up_success.jsx', { name: name, title: 'Sign Up Successfull' });
        });
    });
  });
}