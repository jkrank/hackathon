module.exports = function(params) {
  var app  = params.app,
      conn = params.conn;

  app.get("/getStatistics", function(req, res){
    res.setHeader('Content-Type', 'application/json');
    getRankingData(res);
  });

  function getRankingData (res) {
    var rank_rows = [];
    conn.query("SELECT  user_name, CONCAT(REPEAT('*', LENGTH(phone_number) - 3), RIGHT(phone_number, 3)) as phone_number, scores FROM users ORDER BY scores DESC LIMIT 10;", function (err, rows) {
      if (err) {
        console.log(err);
        res.send(JSON.stringify({err: true}));
        return;
      }
      rows.map(function (row) {
        rank_rows.push([row.user_name, row.phone_number, row.scores]);
      });
      res.send(JSON.stringify(rank_rows));
    });
  }
 }