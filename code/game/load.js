module.exports = function(params)
{
  var app  = params.app,
      conn = params.conn;

  app.get("/test-game", function(req, res){
    var phone_number = req.query.phone_number,
        phrase       = req.query.phrase.toLowerCase(),
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
      if (obj.phrase === "stop"){
          userDereg(obj, callback);
      } else {
        checkUserActive(obj, processSubmission, callback);
      }
  }


  function checkUserActive(obj, next, cb) {
    //conn.query("SELECT status, dereg FROM users WHERE id = ?", [obj.id], function (err, rows) {
    console.log(obj.phrase);
    //conn.query("SELECT A.status as status, A.dereg as dereg, B.id as id FROM users A LEFT JOIN challenge B ON A.id = B.user_id  WHERE A.id = ? AND B.reply IS NULL;", [obj.user_id], function(err, rows){
    conn.query("SELECT A.status as status, A.dereg as dereg, B.id as id FROM users A LEFT JOIN challenge B ON A.id = B.user_id  WHERE A.id = ?;", [obj.user_id], function(err, rows){
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

  function processSubmission(obj, cb) {
    var params = {};
    conn.query("SELECT *, levenshtein(phrase, ?) as dist FROM challenge A JOIN phrase B ON A.phrase_id = B.id AND A.id=?;", [ obj.phrase, obj.challenge_id], function(err, rows){
      if (err || !rows || rows.length === 0) {
        console.log(err);
        cb("PROBLEM processSubmission");
        return;
      }
      if (rows[0].dist <2){
        obj.score = 10;
      } else {
        obj.score = 0;
      }
      addPhrase(obj, addScore, cb);
    });
  }

  function addScore(obj, cb) {
    var params = {
      reply  : obj.phrase_id,
      score  : obj.score,
      id     : obj.challenge_id
    }
    conn.query("UPDATE challenge SET reply = ?, replied_at = NOW(), score = ? WHERE id = ?", [ params.reply, params.score, params.id ], function(err){
      if (err) {
        console.log(err);
          cb("PROBLEM processFirstSubmission - update status");
          return;
      }
      cb("Submission sucessful");
    })

  }

  function processFirstPhrase(obj, cb) {
    var params = { phrase      : obj.phrase,
                   submitted_by: obj.user_id
                 };
    console.log(params.phrase);
      conn.query("UPDATE users SET status = 1 WHERE id = ?", [obj.user_id], function (err) {
        if (err) {
          console.log(err);
          cb("PROBLEM processFirstSubmission - update status");
          return;
        }
        addPhrase(obj, null, cb);
      });
  }

  function addPhrase(obj, next, cb) {
    params = {
      phrase: obj.phrase
    }
    conn.query("SELECT id FROM phrase WHERE phrase = ?", [params.phrase], function (err, rows) {
        if (err) {
          console.log(err);
          cb("PROBLEM addPhrase - select");
          return;
        }
        if (!rows || rows.length === 0) {
          params.submitted_by = obj.user_id;
          conn.query("INSERT INTO phrase SET ?", params, function (err, result) {
            if (err) {
              console.log(err);
              cb("PROBLEM addPhrase - insert");
              return;
            }
            console.log("INSERT ID: "+result.insertId);
          obj.phrase_id = result.insertId;
          if (next && typeof next === "function") {
            next(obj, cb);
            return;
          }
            cb("phrase added");
          });
        } else {
          obj.phrase_id = rows[0].id;
          if (next && typeof next === "function") {
            next(obj, cb);
            return;
          }
          cb("phrase added");
        }
    });
  }

  function sendChallenge(user_id, callback) {

  }

  return this;
}