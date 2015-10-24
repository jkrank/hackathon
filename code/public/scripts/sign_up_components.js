var RegisterImg = React.createClass({
      render: function() {
        return <img src="images/logo.png" className="img-responsive center-block logo space_top"/>;
      }
  })
  , FullName = React.createClass({
      render: function() {
        return <input type="text" className="form-control space_top" placeholder="Full Name"/>;
      }
  })
  , PhoneNumber = React.createClass({
      render: function() {
        return <input type="tel" className="form-control space_top" placeholder="Phone Number"/>;
      }
  })
  , SubmitButton = React.createClass({
      render: function() {
        return <button type="submit" className="form-control btn btn-danger space_top">Join In</button>;
      }
  })
  , register_form_container = document.getElementById('register_form_container');

ReactDOM.render(
  <div className="container-fluid">
    <div className="col-md-6 col-sm-6 col-sm-offset-3  ">
      <RegisterImg />
      <form id="register_form" method="post" action="register" className="col-md-10 col-sm-10 col-sm-offset-1 col-md-offset-1">
        <FullName />
        <PhoneNumber />
        <div className="col-xs-6 col-xs-offset-3">
          <SubmitButton />
        </div>
      </form>
    </div>
  </div>
, register_form_container);