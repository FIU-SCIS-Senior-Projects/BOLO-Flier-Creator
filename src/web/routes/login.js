/* jshint node: true */
'use strict';


var router = require('express').Router();


module.exports = router;


/*
 * GET /
 *
 * Respond with the login page
 */
router.get( '/', function ( req, res ) {
    res.render( 'login' );
});

