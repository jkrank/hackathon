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
       res.redirect(301, '/sign_up_failed?err=1');
       return;
    }

    conn.query("SELECT id from users WHERE phone_number = ?", [phone], function (err, result) {
        if (err) {
           console.log(err);
           res.redirect(301, '/sign_up_failed?err=2');
           return;
        }
        if (result.length > 0) {
          res.redirect(301, '/sign_up_failed?err=3');
          return;
        }
        conn.query("INSERT INTO users SET ?", user, function (err, resp) {
          if (err) {
            console.log(err);
            res.redirect(301, '/sign_up_failed?err=4');
            return;
          }
          sms.sendSMS(phone, "Welcome to BrokePhone! Reply to this message with your phrase");
          res.redirect(301, '/sign_up_success');
        });
    });
  });
}