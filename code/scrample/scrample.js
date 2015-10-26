module.exports = function (params) {
  var app = params.app,
      conn = params.conn,
      wordnet = params.wordnet,
      round   = 0;

  app.get("/test-scrample", function (req, res) {
    var sentence = req.query.sentence,
        difficulty,
        count = 0;
    difficulty = Math.round(Math.random() * 10);
    callback = function(a) {
      console.log(count);
      if (count===difficulty) {
        res.send(a);
        return;
      } else {
        count +=1;
        this.scrample(a, callback);
      }
    };
    this.scrample(sentence, callback);

  });
  this.startScrample = function (sentence, cb) {
    var difficulty,
        count = 0;
    difficulty = Math.round(Math.random() * 100);
    callback = function(a) {
      console.log(count);
      if (count===difficulty) {
        cb(a);
        return;
      } else {
        count +=1;
        this.scrample(a, callback);
      }
    };
    this.scrample(sentence, callback);
  };
  replaceWord = function (word, type, callback, words, i) {
      if (round >= words.length) {
        round = 0;
        return word;
      } else {
        round += 1;
        conn.query("SELECT *, levenshtein(word, '"+word+"') a, rand() b FROM words where soundex(word) = soundex('" + word + "') and type = '" + type + "' HAVING a<>0 ORDER BY a, b LIMIT 1",
               function (err, data) {
                  //console.log(data[0]);
                  if (data && data[0]) {
                    words[i] = data[0].word;

                  } else {
                    i = Math.round(Math.random() * (words.length - 1));
                    word = words[i];
                    words[i] = replaceWord(word, type, callback, words, i);
                    return;
                  }
                  callback(words.join(" "));
              });
        }
  };
  this.scrample = function (sentence, callback) {
    var words = sentence.split(" "), i, word, rr = 0,
        a = 0;
    round = 0;
    i = Math.round(Math.random() * (words.length - 1));
    word = words[i];
    console.log(word);
    wordnet.lookup(word, function(err, definitions) {
      if (rr > 0) {
        callback(sentence);
      }
      rr += 1;
      if (definitions && definitions.length > 0) {
        while (a < definitions.length) {
          if (definitions[a] && definitions[a].meta && definitions[a].meta.synsetType) {
              replaceWord(word, definitions[a].meta.synsetType, callback, words, i);
              return;
          } else {
            a += 1;
          }
        }
      }
      callback(sentence);
    });
  };
  return this;
};