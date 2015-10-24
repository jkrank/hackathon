module.exports = function () {
  var lineReader = require('line-reader');
  var wordnet = require("wordnet");
  var mysql = require('mysql');
  var conn = mysql.createConnection({ host: 'localhost', user: 'root', password: 'x' });

  this.build = function () {
    console.log("DROP DATABASE");
    conn.query("DROP DATABASE IF EXISTS whispers", createDB);
  }
  function createDB (err) {
    if (err) { console.log(err); return; }
    console.log("CREATE DATABASE");
    conn.query("CREATE DATABASE whispers", useDB);
  }

  function useDB (err) {
    if (err) { console.log(err); return; }
    console.log("USE DATABASE");
    conn.query("USE whispers", createWord);
  }

  function createWord (err) {
    if (err) { console.log(err); return; }
    console.log("CREATE TABLE words");
    conn.query("CREATE TABLE words( id INTEGER NOT NULL AUTO_INCREMENT, word VARCHAR(255), type VARCHAR(255), PRIMARY KEY(id))engine=INNODB", createUsers);
  }

  function createUsers (err) {
    if (err) { console.log(err); return; }
    console.log("CREATE TABLE users");
    conn.query("CREATE TABLE users( id INTEGER NOT NULL AUTO_INCREMENT, user_name VARCHAR(255), phone_number VARCHAR(255), scores INTEGER, status INTEGER DEFAULT 0, PRIMARY KEY(id))engine=INNODB", populate);
  }

  function populate (err) {
    if (err) {
      console.log(err); return;
    }
    console.log("populate words");
    var insert_els = [];
    lineReader.eachLine('words', function(line, last) {
      wordnet.lookup(line, function(err, definitions) {
        if (definitions) {
           definitions.forEach(function(definition) {
             if (definition.meta && definition.meta.synsetType) {
               insert_els.push([line, definition.meta.synsetType]);
             }
           });
        }
      });
      if (last && insert_els.length > 0) {
        conn.query("INSERT INTO words (word, type) VALUES ?", [insert_els], function (er, re) {
          if (er) {
            console.log(er);
          } else {
            console.log('inserted ' + re.affectedRows + ' rows')
          }
          conn.end();
        });
      }
    });
  }
  return this;
}