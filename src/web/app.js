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
var auth = require('./lib/auth.js');


/*
 * Express Initialization
 */
var app = express();


/*
 * Express Settings
 */
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

var isDev = ( 'development' == app.get('env') );
var secretKey = new Buffer( process.env.SESSION_SECRET || 'pw0rd' ).toString();


/*
 * Global Middleware
 */
if ( isDev ) {
    app.use( logger('dev') );
    app.use( errorHandler() );
}
app.use( methodOverride() );
app.use( cookieParser( secretKey) );
app.use( expressSession({
    'secret': secretKey,
    'resave': true, /** @todo Confim this option */
    'saveUninitialized': true, /** @todo Confirm this option */
    // 'cookie': { secure: true }
    /**
     * @todo Uncomment the above option before going to production. HTTPS is
     * required for this option or the cookie will not be set per the
     * documentation.
     */
}));

app.use( auth.passport.initialize() );
app.use( auth.passport.session() );


/*
 * Routes
 */
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( '/login', auth.router );
app.use( '/bolo', routes.bolos );
// app.use( '/agency', routes.agency );
// app.use( "/users", routes.agency );
app.get( '/', function ( req, res ) { res.render( 'index' ); } );


/*
 * Error Handling
 */
if ( isDev ) {
    app.use( function( err, req, res, next ) {
        res.status( err.status || 500 );
        res.render( 'error', { message: err.message, error: err } );
    });
}

app.use( function( err, req, res, next ) {
    res.status( err.status || 500 );
    res.render( 'error', { message: err.message, error: {} } );
});


/*
 * Server Start
 */
http.createServer( app ).listen( app.get( 'port' ), function() {
    console.log( 'Express server listening on port ' + app.get( 'port' ) );
});
