exports.sign_up_failed = function(req, res){
    var page_props = {
      name     : 'John'
    , title    : 'Sign Up'
    , front_end_css_includes : [
      "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
    , "https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css"
    , "css/sign_up.css"
    ]
    , front_end_includes: [
       "//cdnjs.cloudflare.com/ajax/libs/react/0.14.0/react.js"
     , "//cdnjs.cloudflare.com/ajax/libs/react/0.14.0/react-dom.js"
     , "//cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"
     , "//cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"
     , "//code.jquery.com/jquery-1.11.3.min.js"
     , "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"
     , "scripts/sign_up_main.js"
    ]
    , front_end_embedded_scripts: []
    , front_end_babel_includes: [
      "scripts/sign_up_failed_components.js"
    ]
  };
  res.render('sign_up_failed', page_props);
};