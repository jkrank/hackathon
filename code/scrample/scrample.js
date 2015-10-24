module.exports = function (params) {
  var app = params.app,
      mysql = params.mysql,
      wordnet = params.wordnet;
  this.scrample = function (sentence, callback) {
  var words = sentence.split(" "), i, word;
  i = Math.round(Math.random() * (words.length - 1));
  word = words[i];
  wordnet.lookup(word, function(err, definitions) {
    var definition = definitions && definitions[0];
    if (definition.meta && definition.meta.synsetType) {
        conn.query("SELECT * FROM words where soundex(word) = soundex('" + word + "') and type = '" + definition.meta.synsetType + "' ORDER BY RAND() LIMIT 1",
             function (err, data) {
                 words[i] = data ? data[0].word : word;
                 callback(words.join("_"));
            });
        }
      });
  };
  return this;
};