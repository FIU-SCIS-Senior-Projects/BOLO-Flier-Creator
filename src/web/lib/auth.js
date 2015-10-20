/* jshint node: true */
'use strict';

var bodyParser = require('body-parser');
var csrf = require('csurf');
var router = require('express').Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var _csrf = csrf({ 'cookie': true });
var _bodyparser = bodyParser.urlencoded({ 'extended': true });


passport.use( new LocalStrategy(
    function ( username, password, done ) {
        if ( username != 'superuser' && password != 'superuser' ) {
            return done( null, false, { 'message': 'Invalid credentials.' } );
        }

        return done( null, { 'id': 'superuser' } );
    }
));

passport.serializeUser( function ( user, done ) {
    done( null, user.id );
});

passport.deserializeUser( function ( id, done ) {
    done( null, { 'id': id } );
});


/*
 * GET /
 *
 * Respond with the login page
 */
router.get( '/', _csrf, function ( req, res ) {
    res.render( 'login', { loginToken: req.csrfToken() } );
});


/*
 * POST /
 *
 * Process Username and Password for Login.
 */
router.post( '/',
    _bodyparser,
    _csrf,
    passport.authenticate( 'local', {
        'successRedirect': '/',
        'failureRedirect': '/login'
    })
);



module.exports.passport = passport;
module.exports.router = router;
