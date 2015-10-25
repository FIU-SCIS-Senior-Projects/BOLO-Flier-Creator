/* jshint node: true */
'use strict';

var bodyParser = require('body-parser');
var csrf = require('csurf');
var path = require('path');
var passport = require('passport');
var router = require('express').Router();
var LocalStrategy = require('passport-local').Strategy;

var core = path.resolve( __dirname, '../../core' );
var UserService = require( path.join( core, 'service/user-service' ) );
var AdapterFactory = require( path.join( core, 'adapters' ) );
var userRepository = AdapterFactory.create( 'persistence', 'cloudant-user-repository' );
var userService = new UserService( userRepository );

var _csrf = csrf({ 'cookie': true });
var _bodyparser = bodyParser.urlencoded({ 'extended': true });


passport.use( new LocalStrategy(
    function ( username, password, done ) {
        userService.authenticate( username, password )
        .then( function( account ) {
            if ( !account ) {
                var msg = 'Either username or password is incorrect.';
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
 * GET /login
 *
 * Respond with the login page
 */
router.get( '/login',
    _csrf,
    function ( req, res, next ) {
        if ( req.isAuthenticated() ) {
            req.session.message = "Already logged in.";
            res.redirect( '/' );
        }
        next();
    },
    function ( req, res ) {
        res.render( 'login', {
            'loginToken': req.csrfToken(),
            'error': req.flash( 'error' ),
            'messages': req.flash( 'messages' )
        });
    });


/*
 * POST /login
 *
 * Process Username and Password for Login.
 */
router.post( '/login',
    _bodyparser,
    _csrf,
    passport.authenticate( 'local', {
        'successRedirect': '/',
        'failureRedirect': '/login',
        'failureFlash': true
    }));


/*
 * GET /logout
 *
 * Destory any sessions belonging to the requesting client.
 */
router.get( '/logout',
    function ( req, res ) {
        req.logout();
        req.flash( 'messages', 'Successfully logged out.' );
        res.redirect( '/login' );
    });


module.exports.passport = passport;
module.exports.router = router;
