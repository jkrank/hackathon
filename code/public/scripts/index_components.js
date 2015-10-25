var table_data = {headers: ["#", "Full Name", "Phone", "Score"]
  , rows: page.lib.getRankings()}
  , key_pos = 0
  , rank_pos = 1
  , RegisterImg = React.createClass({
      render: function () {
        return <img src="images/logo.png" className="img-responsive center-block logo space_top"/>;
      }
  })
  , RankingTable = React.createClass({
      render: function () {
        return <table className="table table-striped table-bordered space_top">
          <thead>
            <tr>
            {table_data.headers.map(function(header) {
              return <th key={key_pos++}>{header}</th>;
            })}
            </tr>
          </thead>
          <tbody>
          {table_data.rows.map(function(row, row_pos, rows) {
              return <tr key={key_pos++}>
                   {(row.length > 0) ? <td key={key_pos++}>{rank_pos++}</td> : '' }
                   {row.map(function (row_td, td_pos, rows) {
                     return <td key={key_pos++}>{row_td}</td>;
                   })}
              </tr>
          })}
          </tbody>
          </table>;
      }
  });
ReactDOM.render(
  <div className="container-fluid">
    <div className="col-md-6 col-sm-6 col-sm-offset-3  ">
      <RegisterImg />
      <RankingTable />
    </div>
  </div>
, register_form_container);