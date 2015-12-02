/* jshint node:true */
'use strict';

var Promise         = require('promise');
var router          = require('express').Router();
var validate        = require('validate.js');

var config          = require('../config.js');
var userService     = new config.UserService( new config.UserRepository() );
var agencyService   = new config.AgencyService( new config.AgencyRepository() );

var formUtil        = require('../lib/form-util');
var passwordUtil    = require('../lib/password-util');

var GFERR           = config.const.GFERR;
var GFMSG           = config.const.GFMSG;

var parseFormData       = formUtil.parseFormData;
var validatePassword    = passwordUtil.validatePassword;


module.exports = router;
router.get(  '/account'                 , getAccountDetails );
router.get(  '/account/password'        , getChangePassword );
router.post( '/account/password'        , postChangePassword );
router.get(  '/account/notifications'   , getUserNotifications );
router.post( '/account/notifications/unsubscribe'   , postUnsubscribeNotifications );
router.get(  '/account/notifications/subscribe'     , getAvailableAgencyNotifications );
router.post( '/account/notifications/subscribe'     , postSubscribeNotifications );


/**
 * Responds with a the account home page.
 */
function getAccountDetails ( req, res ) {
    var data = {
        'account_nav': 'account-home',
        'user': req.user
    };
    res.render( 'account-details', data );
}

/**
 * Responds with the change password form page.
 */
function getChangePassword ( req, res ) {
    var data = {
        'account_nav': 'account-password',
        'form_errors': req.flash( 'form-errors' )
    };

    res.render( 'account-password', data );
}

/**
 * Process form data from the change password form page.
 */
function postChangePassword ( req, res ) {
    parseFormData( req ).then( function ( formDTO ) {
        var validationErrors = validatePassword(
            formDTO.fields.pass_new, formDTO.fields.pass_conf
        );

        if ( validationErrors ) {
            req.flash( 'form-errors', validationErrors );
            res.redirect( 'back' );
        } else {
            return userService.resetPassword( req.user.id, formDTO.fields.pass_new );
        }
    })
    .then( function ( result ) {
        req.flash( GFMSG, 'Password change successful.' );
        res.redirect( '/account' );
    })
    .catch( function ( error ) {
        console.error( 'Error at /account/password >>> ', error.message );
        req.flash( GFERR, 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
}

/**
 * Respond with a form to manage notifications.
 */
function getUserNotifications ( req, res ) {
    var data = {
        'account_nav': 'account-notification'
    };

    agencyService.getAgencies( req.user.notifications  )
    .then( function ( agencies ) {
        data.agencies = agencies;
        res.render( 'account-notifications', data );
    });
}

/**
 * Repond with a list of available agencies to subscribe to.
 */
function getAvailableAgencyNotifications ( req, res ) {
    var data = { 'account_nav': 'account-notification' };

    agencyService.getAgencies().then( function ( agencies ) {
        data.agencies = agencies;
        res.render( 'account-notifications-add', data );
    })
    .catch( function ( error ) {
        console.error( 'Error at ', req.originalUrl, ' >>> ', error.message );
        req.flash( GFERR, 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
}

/**
 * Process form data to unsubscribe the user from the requested agency
 * notifications.
 */
function postUnsubscribeNotifications ( req, res ) {
    parseFormData( req ).then( function ( formDTO ) {
        var selected = formDTO.fields['agencies[]'] || [];

        if ( ! selected.length ) {
            return null;
        }

        return userService.removeNotifications( req.user.id, selected );
    })
    .then( function ( user ) {
        if ( ! user ) {
            req.flash( GFERR, 'Subscriptions update error occured.' );
        } else {
            req.flash( GFMSG, 'Subscriptions successfully updated.' );
        }
        res.redirect( 'back' );
    })
    .catch( function ( error ) {
        console.error( 'Error at ', req.originalUrl, ' >>> ', error.message );
        req.flash( GFERR, 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
}

/**
 * Process form data to subscribe the user to the requested agency
 * notifications
 */
function postSubscribeNotifications ( req, res ) {
    parseFormData( req ).then( function ( formDTO ) {
        var selected = formDTO.fields['agencies[]'] || [];

        if ( ! selected.length ) {
            return req.user;
        }

        return userService.addNotifications(
            req.user.id, formDTO.fields['agencies[]']
        );
    })
    .then( function ( user ) {
        if ( ! user ) {
            req.flash( GFERR, 'Subscriptions update error occured.' );
        } else {
            req.flash( GFMSG, 'Subscriptions successfully updated.' );
        }
        res.redirect( '/account/notifications' );
    })
    .catch( function ( error ) {
        console.error( 'Error at ', req.originalUrl, ' >>> ', error.message );
        req.flash( GFERR, 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
}
