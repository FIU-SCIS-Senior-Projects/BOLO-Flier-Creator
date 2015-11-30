/* jshint node:true */
'use strict';

var multiparty      = require('multiparty');
var Promise         = require('promise');
var router          = require('express').Router();
var validate        = require('validate.js');

var config          = require('../config.js');
var userService     = new config.UserService( new config.UserRepository() );

var passwordUtil    = require('../lib/password-util');

var GFERR           = config.const.GFERR;
var GFMSG           = config.const.GFMSG;


function parseFormData ( req ) {
    return new Promise( function ( resolve, reject ) {
        var form = new multiparty.Form();
        var files = [];
        var fields = {};
        var result = { 'files': files, 'fields': fields };

        form.on( 'error', function ( error ) { reject( error ); } );
        form.on( 'close', function () { resolve( result ); } );

        form.on( 'field', function ( field, value ) { fields[field] = value; } );
        form.on( 'file' , function ( name, file) {
            files.push({
                'name': file.originalFilename,
                'content_type': file.headers['content-type'],
                'path': file.path
            });
        });

        form.parse( req );
    });
}

var validatePassword = passwordUtil.validatePassword;


module.exports = router;


/**
 * GET /account
 * Responds with a the account home page.
 */
router.get( '/account', function ( req, res ) {
    var data = {
        'account_nav': 'account-home',
        'user': req.user
    };
    res.render( 'account-details', data );
});

/**
 * GET /admin/password
 * Responds with the change password form page.
 */
router.get( '/account/password', function ( req, res ) {
    var data = {
        'account_nav': 'account-password',
        'form_errors': req.flash( 'form-errors' )
    };

    res.render( 'account-password', data );
});

/**
 * POST /account/password
 * Process form data from the change password form page.
 */
router.post( '/account/password', function ( req, res ) {
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
});
