var RegisterImg = React.createClass({
      render: function() {
        return <img src="images/logo.png" className="img-responsive center-block logo space_top"/>;
      }
  })
  , FullName = React.createClass({
      render: function() {
        return <div className="input-group space_top">
            <span className="input-group-addon glyphicon glyphicon-user" style={{'verticalAlign':'middle'}} id="pre_full_name"></span>
            <input type="text" name="name" className="form-control" placeholder="Full Name" aria-describedby="pre_full_name"/>
          </div>;
      }
  })
  , PhoneNumber = React.createClass({
      render: function() {
        return <div className="input-group space_top">
            <span className="input-group-addon" id="pre_tel">+44</span>
            <input type="tel" name="phone" className="form-control" placeholder="Phone Number" aria-describedby="pre_tel"/>
          </div>;
      }
  })
  , SubmitButton = React.createClass({
      render: function() {
        return <button type="submit" className="form-control btn btn-danger space_top">Join In</button>;
      }
  })
  , MainContainer = React.createClass({
      render: function() {
        return <div className="container-fluid">
          <div className="col-md-6 col-sm-6 col-sm-offset-3">
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
      }
   })
  , register_form_container = document.getElementById('register_form_container')
  , afterRender = function () {
    console.log('render-ready');
    $(document).ready(page.lib.ready);
  };

ReactDOM.render(<MainContainer />, register_form_container, afterRender);