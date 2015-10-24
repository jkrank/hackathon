module.exports = function (params) {
  var app = params.app,
      conn = params.conn,
      wordnet = params.wordnet,
      round   = 0;

  replaceWord = function (word, type, callback, words, i) {
      if (round >= word.length) {
        round = 0;
        return word;
      } else {
        round += 1;
        conn.query("SELECT *, levenshtein(word, "ball") a, rand() b FROM words where soundex(word) = soundex('" + word + "') and type = '" + type + "' HAVING a<>0 ORDER BY a, b LIMIT 1",
               function (err, data) {
                  //console.log(data[0]);
                  if (data && data[0]) {
                    words[i] = data[0].word;

                  } else {
                    i = Math.round(Math.random() * (words.length - 1));
                    word = words[i];
                    words[i] = replaceWord(word, type, callback, words, i);

                  }
                  callback(words.join(" "));
              });
        }
  };
  this.scrample = function (sentence, callback) {
    var words = sentence.split(" "), i, word, rr = 0;
    round = 0;
    i = Math.round(Math.random() * (words.length - 1));
    word = words[i];
    //console.log(word);
    wordnet.lookup(word, function(err, definitions) {
      if (rr > 0) {
        callback(sentence);
      }
      rr += 1;
      var definition = definitions && definitions[0];
      //console.log(definition);
      if (definition && definition.meta && definition.meta.synsetType) {
          replaceWord(word, definition.meta.synsetType, callback, words, i);
      } else {
        callback(sentence);
      }
    });
  };
  return this;
};