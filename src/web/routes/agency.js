/* jshint node: true */
'use strict';

var _                   = require('lodash');
var Promise             = require('promise');
var router              = require('express').Router();

var config              = require('../config');
var agencyRepository    = new config.AgencyRepository();
var agencyService       = new config.AgencyService( agencyRepository );

var GFERR               = config.const.GFERR;
var GFMSG               = config.const.GFMSG;


module.exports = router;
router.get( '/agency', getListing );


/**
 * Respond with a list of active agencies registered with the system.
 */
function getListing ( req, res ) {
    var data = {
        'agencies': []
    };

    agencyService.getAgencies().then( function ( agencies ) {
        data.agencies = agencies;
        res.render('agency-list', data );
    }).catch( function ( error ) {
        console.error( 'Error at %s >> %s', req.originalUrl, error.message );
        req.flash( GFERR, 'Internal server error occurred. Please try again.' );
        req.redirect( 'back' );
    });
}
