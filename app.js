var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routing = require('resource-routing');
var engine = require('ejs-locals');

//var routes = require('./routes/index');
//var animals = require('./routes/animals');

var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, strict: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routing
var controller_dir = path.resolve("./controllers");
routing.root(app, controller_dir, "index", "home");
routing.resources(app, controller_dir, "events", {
  exclude: ["new", "edit", "show"],
  collection: [
    ["post", "search", "search"],
    ["post", "export_event"]
]});
//route for oauth callback (googleapis access token)
routing.get(app, controller_dir, "/oauth2callback", "events#oauth2callback")
routing.expose_routing_table(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
