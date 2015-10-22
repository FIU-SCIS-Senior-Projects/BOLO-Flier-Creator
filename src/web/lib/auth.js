/* jshint node: true */
'use strict';

var bodyParser = require('body-parser');
var csrf = require('csurf');
var path = require('path');
var passport = require('passport');
var router = require('express').Router();
var LocalStrategy = require('passport-local').Strategy;

var core = path.resolve( __dirname, '../../core' );
var UserService = require( path.join( core, 'ports/user-service-port' ) );
var AdapterFactory = require( path.join( core, 'adapters' ) );

var _csrf = csrf({ 'cookie': true });
var _bodyparser = bodyParser.urlencoded({ 'extended': true });

var userRepository = AdapterFactory.create( 'storage', 'cloudant-user' );
var userService = new UserService( userRepository );

passport.use( new LocalStrategy(
    function ( username, password, done ) {
        userService.authenticate( username, password )
        .then( function( account ) {
            if ( !account ) {
                var msg = 'Invalid credentials';
                return done( null, false, { 'message': msg } );
            }

            return done( null, account );
        });
    }
));

passport.serializeUser( function ( user, done ) {
    done( null, user.data.id );
});

passport.deserializeUser( function ( id, done ) {
    userService.deserializeId( id )
    .then( function ( account ) {
        if ( account ) done( null, account );
    });
});


/*
 * GET /
 *
 * Respond with the login page
 */
router.get( '/login', _csrf, function ( req, res ) {
    res.render( 'login', { loginToken: req.csrfToken() } );
});


/*
 * POST /
 *
 * Process Username and Password for Login.
 */
router.post( '/login',
    _bodyparser,
    _csrf,
    passport.authenticate( 'local', {
        'successRedirect': '/',
        'failureRedirect': '/login'
    })
);



module.exports.passport = passport;
module.exports.router = router;
