var RegisterImg = React.createClass({
      render: function() {
        return <img src="images/logo.png" className="img-responsive center-block logo space_top"/>;
      }
  });

ReactDOM.render(
  <div className="container-fluid">
    <div className="col-md-6 col-sm-6 col-sm-offset-3">
      <RegisterImg />
      <div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span className="sr-only">Error:</span>
        Failure during registration {page.lib.sign_up_errors[window.location.toString().split("err=")[1]]}
      </div>
      <a href="/sign_up" className='btn btn-danger'>Register</a>
    </div>
  </div>
, register_form_container);