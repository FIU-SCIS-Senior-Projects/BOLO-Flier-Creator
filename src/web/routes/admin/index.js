/* jshint node:true */
'use strict';

var router  = require('express').Router();
var users   = require('./users');
var agency  = require('./agency');

var config  = require('../../config');
var User    = require('../../../core/domain/user');

module.exports = router;

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
    function ( req, res, next ) {
        if ( req.user.tier !== User.ADMINISTRATOR ) {
            req.flash(
                config.const.GFERR,
                'You are not authorized to access the administrator dashboard.'
            );
            res.redirect( '/' );
        } else {
            next();
        }
    },
    function ( req, res ) {
        res.render( 'admin' );
    }
);
