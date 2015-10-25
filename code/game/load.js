module.exports = function(params)
{
  var app  = params.app,
      conn = params.conn;

  app.get("/test-game", function(req, res){
    var phone_number = req.query.phone_number,
        phrase       = req.query.phrase,
        obj = {phone_number: phone_number, phrase: phrase};

    function returnResult(result) {
      res.send(String(result));
    }

    phoneNumberToUser(obj, processMessage, returnResult);
  });

  function phoneNumberToUser(obj, next, cb) {
    var param = {};
    param.phone_number=obj.phone_number;

    conn.query("SELECT id FROM users WHERE ?", param, function (err, rows) {
      if (err) {
        console.log(err);
        res.send("PROBLEM");
        return;
      }
      if (!rows || rows.length ===0 ) {
        cb("error");
      } else {
        for (var i in rows) {
          console.log(rows[i].id);
          obj.user_id = rows[i].id;
        }
        next(obj, cb);
      }
    });
  }

  this.processMessage = function(obj, callback) {
      checkStop(obj, callback)
  }

  function checkStop(obj, callback) {
      if (obj.phrase === "STOP"){
          userDereg(obj, callback);
      } else {
        checkUserActive(obj, processSubmission, callback);
      }
  }


  function checkUserActive(obj, next, cb) {
    //conn.query("SELECT status, dereg FROM users WHERE id = ?", [obj.id], function (err, rows) {
    console.log(obj.user_id);
    conn.query("SELECT A.status as status, A.dereg as dereg, B.id as id FROM users A LEFT JOIN challenge B ON A.id = B.user_id  WHERE A.id = ? AND B.reply IS NULL;", [obj.user_id], function(err, rows){
      if (err || !rows || rows.length === 0) {
        console.log(err);
          cb("PROBLEM checkUserActive");
          return;
      }
      if (rows[0].dereg === 1) {
        cb("user already deregistered");
      } else if (rows[0].status === 0) {
        processFirstPhrase(obj, cb);
      } else if (rows[0].id) {
        obj.challenge_id = rows[0].id;
        processSubmission(obj, cb);
      } else {
        cb("Very odd state");
      }
    });
  }

  function userDereg(obj, cb) {
    conn.query("UPDATE users SET dereg = 1 WHERE id = ?", [obj.user_id], function (err) {
      if (err) {
        console.log(err);
        cb("PROBLEM userDereg");
        return;
      }
      cb("deregistered user");
    });
  }

  function processSubmission(onj, cb) {
    cb("processSubmission");
  }

  function processFirstPhrase(obj, cb) {
    var params = { phrase      : obj.phrase,
                   submitted_by: obj.user_id
                 };

    conn.query("INSERT INTO phrase SET ?", params, function (err) {
      if (err) {
        console.log(err);
        cb("PROBLEM processFirstSubmission");
        return;
      }
      conn.query("UPDATE users SET status = 1 WHERE id = ?", [obj.user_id], function (err) {
        if (err) {
          console.log(err);
          cb("PROBLEM processFirstSubmission - update status");
          return;
        }
        cb("processFirstSubmission - Success!");
      });
    });
  }

  function sendChallenge(user_id, callback) {

  }

  return this;
}