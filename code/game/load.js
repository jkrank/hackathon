module.exports = function(params)
{
  var app  = params.app,
      conn = params.conn,
      sms  = require("../sms/sms.js")({app:app}),
      scrample = params.scrample;

  app.get("/test-game", function(req, res){
    var phone_number = req.query.phone_number,
        phrase       = req.query.phrase.toLowerCase(),
        obj = {phone_number: phone_number, phrase: phrase};

    function returnResult(result) {
      res.send(String(result));
    }

    phoneNumberToUser(obj, processMessage, returnResult);
  });

  app.handleMessage = function(obj, cb) {
    phoneNumberToUser(obj, processMessage, cb);
  }

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
    conn.query("SELECT A.status as status, A.dereg as dereg, A.active_challenge as active_challenge FROM users A WHERE A.id = ?;", [obj.user_id], function(err, rows){
      if (err || !rows || rows.length === 0) {
        console.log(err);
          cb("PROBLEM checkUserActive");
          return;
      }
      if (rows[0].dereg === 1) {
        cb("user already deregistered");
      } else if (rows[0].status === 0) {
        processFirstPhrase(obj, cb);
      } else if (rows[0].active_challenge) {
        obj.challenge_id = rows[0].active_challenge;
        processSubmission(obj, cb);
      } else {
        processFirstPhrase(obj, cb);
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
    console.log(obj.challenge_id);
    console.log(obj.phrase);
    conn.query("SELECT *, levenshtein(phrase, ?) as dist FROM challenge A JOIN phrase B ON A.phrase_id = B.id AND A.id=?;", [ obj.phrase, obj.challenge_id], function(err, rows){
      if (err || !rows || rows.length === 0) {
        console.log(err);
        cb("PROBLEM processSubmission");
        return;
      }
      obj.orig_phrase = rows[0].phrase_id;
      if (rows[0].dist ===0){
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
          cb("PROBLEM addScore - update challenge");
          return;
      }
      conn.query("UPDATE users SET active_challenge = 0, scores = scores+? WHERE id = ?", [ obj.score, obj.user_id ], function(err){
        if (err) {
          console.log(err);
            cb("PROBLEM addScore - update user");
            return;
        }
        if (obj.score === 0 ) {
          sendChallenge(obj, cb);
        } else {
          cb("Submission sucessful");
        }
      });

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
        //scrample.startScrample(obj.phrase, function (phrase) {
        //  obj.phrase = phrase;
          addPhrase(obj, sendChallenge, cb);
        //});

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

  function sendChallenge(obj, cb) {
    var params;
    conn.query("SELECT * FROM users WHERE active_challenge = 0 AND status = 1 AND id<> ? ORDER BY RAND() LIMIT 1", [obj.user_id], function(err, rows){
      if (err) {
        console.log(err);
        cb("PROBLEM sendChallenge - find competitor");
        return;
      }
      if (rows.length == 0) {
        cb("no competitors");
        return;
      }
      params = {
        phrase_id  : obj.orig_phrase || obj.phrase_id,  // This should chain, send the new phrase, but link to the originally submitted phrase
        user_id    : rows[0].id,
        phone_number: rows[0].phone_number,
        challenge_id: obj.challenge_id
      };
      console.log(params.phrase_id);
      console.log(params.user_id);
      conn.query("INSERT INTO challenge(phrase_id, user_id, sent_at) VALUES(?,?,now())",[ params.phrase_id, params.user_id ], function(err,result){
        if (err) {
          console.log(err);
          cb("PROBLEM sendChallenge - inserting challenge");
          return;
        }
        params.challenge_id = result.insertId;
        conn.query("UPDATE users SET active_challenge = ? WHERE id = ?", [params.challenge_id, params.user_id], function(err){
           if (err) {
             console.log(err);
             cb("PROBLEM sendChallenge - inserting challenge");
             return;
           }
          scrample.startScrample(obj.phrase, function(phrase){
            obj.phrase = phrase;
            sms.sendSMS(params.phone_number, obj.phrase)
            cb("success");
          });

        });
      });
    });
  }

  return this;
}