/* jshint node:true */
'use strict';

var multiparty      = require('multiparty');
var Promise         = require('promise');
var router          = require('express').Router();
var validate        = require('validate.js');

var config          = require('../config.js');
var userService     = new config.UserService( new config.UserRepository() );

var FERR            = config.const.GFERR;
var FMSG            = config.const.GFMSG;


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

function validatePassword ( pass, conf ) {
        var constraints = {
            'password': config.validation.password,
            'confirmation': {
                'equality': {
                    'attribute': 'password',
                    'message': ' should match password field.'
                }
            }
        };

        return validate( {
            'password': pass,
            'confirmation': conf
        }, constraints );
}

module.exports = router;


router.get( '/', function ( req, res ) {
    var data = {
        'account_nav': 'account-home',
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR ),
        'user': req.user
    };
    res.render( 'account-details', data );
});

router.get( '/password', function ( req, res ) {
    var data = {
        'account_nav': 'account-password',
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR ),
        'form_errors': req.flash( 'form-errors' )
    };

    res.render( 'account-password', data );
});

router.post( '/password', function ( req, res ) {
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
        req.flash( FMSG, 'Password change successful.' );
        res.redirect( '/account' );
    })
    .catch( function ( error ) {
        console.error( 'Error at /account/password >>> ', error.message );
        req.flash( FERR, 'Unknow error occurred, please try again.' );
        res.redirect( 'back' );
    });
});
