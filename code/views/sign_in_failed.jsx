var React = require('react');
var DefaultLayout = require('./layouts/default');

var sign_in_failed = React.createClass({
  render: function() {
    return (
      <DefaultLayout {...this.props}>
      <div id="register_form_container"></div>
      </DefaultLayout>
    );
  }
});

module.exports = sign_in_failed;