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
    conn.query("CREATE TABLE users( id INTEGER NOT NULL AUTO_INCREMENT, user_name VARCHAR(255), phone_number VARCHAR(255), scores INTEGER, PRIMARY KEY(id))engine=INNODB", populate);
  }

  function populate (err) {
    if (err) { console.log(err); return; }
    console.log("populate words");
    lineReader.eachLine('words', function(line, last) {
      wordnet.lookup(line, function(err, definitions) {
        if (definitions) {
           definitions.forEach(function(definition) {
             if (definition.meta && definition.meta.synsetType) {
               var obj = { word: line, type: definition.meta.synsetType };
               conn.query("INSERT INTO words SET ?",obj, function (er,re) {
                  if (er) {
                    console.log(er);
                  } else {
                    console.log(re.insertId);
                  }
               });
              console.log('  type: %s', definition.meta.synsetType);
            }
          });
        }
      });
    });
  }

  return this;
}