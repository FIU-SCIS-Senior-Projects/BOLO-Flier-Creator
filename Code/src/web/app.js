/* jshint node: true */
'use strict';

var _               = require('lodash');
var http            = require('http');
var path            = require('path');

var express         = require('express');

var cookieParser    = require('cookie-parser');
var errorHandler    = require('errorhandler');
var expressSession  = require('express-session');
var favicon         = require('serve-favicon');
var flash           = require('connect-flash');
var logger          = require('morgan');
var methodOverride  = require('method-override');

var config          = require('./config');
var routes          = require('./routes');
var auth            = require('./lib/auth.js');

var GFMSG           = config.const.GFMSG;
var GFERR           = config.const.GFERR;

/*
 * Express Init and Config
 */
var app = express();
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );
app.disable( 'x-powered-by' ); /** https://www.youtube.com/watch?v=W-8XeQ-D1RI **/

var inDevelopmentMode = ( 'development' == app.get( 'env' ) );
var secretKey = new Buffer( process.env.SESSION_SECRET || 'pw0rd' ).toString();


/*
 * Global Middleware
 */
if ( inDevelopmentMode ) {
    app.use( logger( 'dev' ) );
    app.use( errorHandler() );
}

app.use( favicon( path.join( __dirname, '/public/favicon.ico' ) ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( methodOverride() );
app.use( cookieParser( secretKey ) );
app.use( expressSession({
    'secret': secretKey,
    /** @todo confirm the next two options **/
    'resave': true,
    'saveUninitialized': true,

    /**
     * @todo Uncomment the below option before going to production. HTTPS is
     * required for this option or the cookie will not be set per the
     * documentation.
     */
    // 'cookie': { secure: true }
}));

app.use( flash() );
app.use( auth.passport.initialize() );
app.use( auth.passport.session() );


/*
 * Application Locals
 */
app.locals._ = _;
app.locals.config_bootstrap = config.bootstrap;


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


app.use( function ( req, res, next ) {
    if ( req.user ) {
        res.locals.userLoggedIn = true;
        res.locals.username = req.user.username;
    }
    next();
});

app.use( function ( req, res, next ) {
    res.locals.g_err = req.flash( GFERR );
    res.locals.g_msg = req.flash( GFMSG );
    next();
});

/** https://www.youtube.com/watch?v=W-8XeQ-D1RI **/
app.use( function ( req, res, next ) {
    res.setHeader( 'X-Frame-Options', 'sameorigin' );
    next();
});

app.get( '/', isAuthenticated, function ( req, res, next ) {
    res.redirect( '/bolo' );
});

app.use( auth.router );
app.get( '/bolo/asset/:boloid/:attname', routes.bolos.getAttachment );
app.use( isAuthenticated, routes.bolos );
app.use( isAuthenticated, routes.account );
app.use( isAuthenticated, routes.agency );
app.use( isAuthenticated, routes.admin );
app.use( function( req, res, next ) {
    console.error(
        '404 encountered at %s, request ip = %s', req.originalUrl, req.ip
    );
    res.status(404).render( '404' );
});

/*
 * Error Handling
 */
if ( inDevelopmentMode ) {
    app.use( function( err, req, res, next ) {
        console.error( 'Error occurred at %s >>> %s', req.originalUrl, err.message );
        res.render( 'error', { message: err.message, error: err } );
    });
} else {
    app.use( function( err, req, res, next ) {
        console.error( 'Error occurred at %s >>> %s', req.originalUrl, err.message );
        req.flash( GFERR, 'Internal server error occurred, please try again' );
        res.redirect( 'back' );
    });
}


/*
 * Server Start
 */
http.createServer( app ).listen( app.get( 'port' ), function() {
    console.log( 'Express server listening on port ' + app.get( 'port' ) );
});
