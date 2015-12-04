/* jshint node: true */
'use strict';

var bodyParser = require('body-parser');
var csrf = require('csurf');
var passport = require('passport');
var router = require('express').Router();
var LocalStrategy = require('passport-local').Strategy;

var config = require('../config');
var userRepository = new config.UserRepository();
var userService = new config.UserService( userRepository );

var _csrf = csrf({ 'cookie': true });
var _bodyparser = bodyParser.urlencoded({ 'extended': true });

passport.use( new LocalStrategy(
    function ( username, password, done ) {
        userService.authenticate( username, password )
        .then( function ( account ) {
            if ( account ) {
                return done( null, account );
            }
            return done( null, false, {
                'message': 'Invalid login credentials.'
            });
        });
    }
));

passport.serializeUser( function ( user, done ) {
    done( null, user.id );
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
    _bodyparser, _csrf,
    passport.authenticate( 'local', {
        'failureRedirect': '/login',
        'failureFlash': true
    }),
    function ( req, res ) {
        var login_redirect = null;
        if ( req.session.login_redirect ) {
            login_redirect = req.session.login_redirect;
            req.session.login_redirect = null;
        }
        res.redirect( login_redirect || '/' );
    }
);


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
