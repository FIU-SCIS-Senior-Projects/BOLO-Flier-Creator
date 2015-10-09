/* jshint node: true */
'use strict';


var bodyParser = require('body-parser');
var csrf = require('csurf');
var router = require('express').Router();


module.exports = router;


/*
 * Middleware Setup
 */
var _csrf = csrf({ cookie: true });
var _bodyparser = bodyParser.urlencoded({ extended: true });

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
router.post( '/', _bodyparser, _csrf, function ( req, res ) {
    res.redirect( '/' );
});
