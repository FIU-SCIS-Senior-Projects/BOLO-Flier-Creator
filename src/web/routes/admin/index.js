/* jshint node:true */
'use strict';

var router  = require('express').Router();
var users   = require('./users');

module.exports = router;

router.use( users );

/**
 * GET /
 * Responds with the root admin template.
 */
router.get( '/', function ( req, res ) {
    res.render( 'admin' );
});
