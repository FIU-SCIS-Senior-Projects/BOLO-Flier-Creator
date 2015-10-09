/* jshint node: true */
'use strict';


var bodyParser = require('body-parser');
var router = require('express').Router();


module.exports = router;


/*
 * Login, Global Middleware
 */
router.use( bodyParser.urlencoded({ extended: true }) );

/*
 * GET /
 *
 * Respond with the login page
 */
router.get( '/', function ( req, res ) {
    res.render( 'login' );
});

