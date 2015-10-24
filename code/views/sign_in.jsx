var React = require('react');
var DefaultLayout = require('./layouts/default');

var sign_in = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Hello {this.props.name}</div>
      </DefaultLayout>
    );
  }
});

module.exports = sign_in;