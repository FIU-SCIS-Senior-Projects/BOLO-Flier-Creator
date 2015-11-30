/* jshint node:true */
'use strict';

var router  = require('express').Router();
var users   = require('./users');
var agency  = require('./agency');

var config  = require('../../config');
var User    = require('../../../core/domain/user');

var GFERR   = config.const.GFERR;
var GFMSG   = config.const.GFMSG;

module.exports = router;

router.use( function ( req, res, next ) {
    if ( req.user.tier !== User.ADMINISTRATOR ) {
        req.flash( GFERR, 'Access to the admin area is restricted.' );
        res.redirect( 'back' );
    } else {
        next();
    }
});

router.use( users );
router.use( '/agency', agency );

router.use( function ( req, res, next ) {
    res.locals.admin_nav = 'admin-index';
    next();
});

/**
 * GET /
 * Responds with the root admin template.
 */
router.get( '/',
    function ( req, res ) {
        res.render( 'admin' );
    }
);
