var React = require('react');
var html_lib = require('../../lib/html_lib.js');

var DefaultLayout = React.createClass({
  render: function() {
    function getHeadTag (props) {
      var head = ''
        , title = '<title>' + props.title + '</title>'
        , shim_js = '<script>(function(){ var ef = function(){}; window.console = window.console || {log:ef,warn:ef,error:ef,dir:ef}; }());</script>'
        , metas = [
          '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">'
        ]
        , front_end_includes_shim = [
          '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js'
        , '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js'
        , '//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.js'
        , '//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-sham.js'
        ]
        ;

      head += title;
      head += metas.join();
      head += '<!--[if lt IE 9]>' + shim_js + html_lib.getScriptsTagHtml(front_end_includes_shim) + '<![endif]-->';
      head += props.front_end_css_includes ? html_lib.getScriptsTagHtml(props.front_end_css_includes, '<link rel="stylesheet" href="', '">') : '';
      head += props.front_end_includes ? html_lib.getScriptsTagHtml(props.front_end_includes, '<script src="', '"></script>') : '';
      head += props.front_end_embedded_scripts ? html_lib.getScriptsTagHtml(props.front_end_embedded_scripts, '<script  type="text/javascript">', '</script>') : '';
      head += props.front_end_babel_includes ? html_lib.getScriptsTagHtml(props.front_end_babel_includes, '<script type="text/babel" src="', '"></script>') : '';
      return head;
    }

    return (
      <html>
        <head dangerouslySetInnerHTML={{__html: getHeadTag(this.props)}}></head>
        <body>
          {this.props.children}
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;