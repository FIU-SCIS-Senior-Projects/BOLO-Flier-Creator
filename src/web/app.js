/*
 * BOLO Version 3.0 API Server
 *
 * @author David Vizcaino <david.e.vizcaino@gmail.com>
 *
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

// Require Route Modules
var UsersEndpoints = require('./routes/users'),
    BolosEndpoints = require('./routes/bolos'),
    AgencyEndpoints = require('./routes/agency');

// Required Third Party Middleware
var expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    errorHandler = require('errorhandler');

// Initialize
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
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.get('/', function ( req, res ) {
  res.render( 'index' );
});

// router middleware to authenticate user before doing any action(s)
//app.use(['/bolo', '/agency'], function(request, response, next) {
//    //AUTHENTICATE USER HERE
//    if (request.cookies.boloUsername) {
//        //if user is logged in, then continue
//        console.log("User authenticated!\n");
//        next();
//    }
//    else {
//        //otherwise, give an error
//        response.json({Result: 'Failure', Message : 'Please log in to continue'});
//    }
//});

app.use("/users", UsersEndpoints);
app.use('/bolo', BolosEndpoints);
app.use('/agency', AgencyEndpoints);

// error handlers

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

//LAUNCH THE SERVER!!!
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
