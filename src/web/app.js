/* jshint node: true */
'use strict';

/*
 * BOLO Version 3.0 Web Component
 */

var express = require('express');
var http = require('http');
var path = require('path');

var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var expressSession = require('express-session');
var logger = require('morgan');
var methodOverride = require('method-override');

var routes = require('./routes');


/*
 * Express Initialization
 */
var app = express();

// Application settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Development Specific Middleware
app.use(logger('dev'));

//use express for setting and tracking cookies
app.use(cookieParser('Passw0rd'));
app.use(expressSession({
    secret: 'Passw0rd',
    cookie: { secure: true }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(errorHandler());
}


/*
 * Routes
 */
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( '/bolo', routes.bolos );
// app.use( '/agency', routes.agency );
// app.use( "/users", routes.agency );

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
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


/*
 * Server Start
 */
http.createServer( app ).listen( app.get( 'port' ), function() {
    console.log( 'Express server listening on port ' + app.get( 'port' ) );
});
