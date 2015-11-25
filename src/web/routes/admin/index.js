/* jshint node:true */
'use strict';

var router  = require('express').Router();
var users   = require('./users');

module.exports = router;

router.use( users );

router.use( function ( req, res, next ) {
    res.locals.admin_nav = 'admin-index';
    next();
});

/**
 * GET /
 * Responds with the root admin template.
 */
router.get( '/', function ( req, res ) {
    res.render( 'admin' );
});
