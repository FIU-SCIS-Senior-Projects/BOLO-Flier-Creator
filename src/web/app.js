/* jshint node: true */
'use strict';

/*
 * BOLO Version 3.0 Web Component
 */

var express = require('express');
var http = require('http');
var path = require('path');
var _ = require('lodash');

var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var expressSession = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
var methodOverride = require('method-override');

var config = require('./config');
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
app.locals._ = _;

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

app.use( flash() );
app.use( auth.passport.initialize() );
app.use( auth.passport.session() );


/*
 * Routes
 */
var isAuthenticated = function ( req, res, next ) {
    if ( req.isAuthenticated() ) {
        next();
    } else {
        req.session.login_redirect = req.originalUrl;
        res.redirect( '/login' );
    }
};

app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( function ( req, res, next ) {
    if ( req.user ) res.locals.userLoggedIn = true;
    next();
});

app.use( function ( req, res, next ) {
    res.locals.g_err = req.flash( config.const.GFERR );
    res.locals.g_msg = req.flash( config.const.GFMSG );
    next();
});

app.use( auth.router );
app.use( isAuthenticated, routes.bolos );
app.use( isAuthenticated, routes.account );
app.use( isAuthenticated, routes.admin );
app.get( '/', isAuthenticated, function ( req, res, next ) {
    res.redirect( '/bolo' );
});


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
