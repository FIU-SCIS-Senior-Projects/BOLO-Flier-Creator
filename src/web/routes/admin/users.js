/* jshint node: true */
'use strict';

var fs              = require('fs');
var multiparty      = require('multiparty');
var path            = require('path');
var Promise         = require('promise');
var router          = require('express').Router();

var config          = require( '../../config' );

var userRepository  = new config.UserRepository();
var userService     = new config.UserService( userRepository );

module.exports = router;

/** @todo Extract into a common library */
function cleanTemporaryFiles ( files ) {
    files.forEach( function ( file ) {
        fs.unlink( file.path );
    });
}

function setUserData ( fields ) {
    return {
        'username'      : fields.username || '',
        'email'         : fields.email || '',
        'fname'         : fields.fname || '',
        'lname'         : fields.lname || '',
        'password'      : fields.password,
        'tier'          : fields.role || null,
        'badge'         : fields.badge || '',
        'secunit'       : fields.secunit || '',
        'ranktitle'     : fields.ranktitle || ''
    };
}

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

/**
 * GET /createuser
 * Responds with a form to create a new user.
 */
router.get( '/createuser', function ( req, res ) {
    res.render( 'create-user-form', {
        'roles': userService.getRoleNames()
    });
});

/**
 * POST /createuser
 * Process data to create a user, respond with the result.
 */
router.post( '/createuser', function ( req, res ) {
    var userRoles = userService.getRoleNames();

    parseFormData( req )
        .then( function ( formDTO ) {
            var userDTO = setUserData( formDTO.fields );
            if ( userDTO.tier ) {
                userDTO.tier = userService.getRole( userDTO.tier );
            }
            var result = userService.registerUser( userDTO, formDTO.files );
            return Promise.all([ result, formDTO ]);
        })
        .then( function ( pData ) {
            if ( pData[1].files.length ) cleanTemporaryFiles( pData[1].files );
            res.render( 'create-user-form', {
                'msg': 'Successfully registered user.',
                'roles': userRoles
            });
        })
        .catch( function ( error ) {
            res.render( 'create-user-form', {
                'error': error,
                'roles': userRoles
            });
        });
});

/**
 * GET /users
 * Responds with a list of all system users.
 */
router.get( '/users', function ( req, res ) {
    userService.getUsers().then( function ( users ) {
        var templateData = {
            'users': users,
            'msg': req.flash( 'msg' ),
            'err': req.flash( 'error' )
        };
        res.render( 'user-list', templateData );
    })
    .catch( function ( error ) {
        console.error( '/admin/users route error: ', error );
        res.status( 500 );
    });
});

/**
 * GET /users/delete/:id
 * Attempts to delete user with the given id
 */
router.get( '/users/:id/delete', function ( req, res ) {
    userService.removeUser( req.params.id ).then(
        function ( result ) {
            req.flash( 'msg', 'Successfully deleted user.' );
            res.redirect( '/admin/users' );
        },
        function ( error ) {
            req.flash( 'error', 'Unable to delete, please try again.' );
            res.redirect( '/admin/users' );
        }
    );
});

/**
 * GET /users/:id
 * Responds with account information for a specified user.
 */
router.get( '/users/:id', function ( req, res ) {
    userService.getUser( req.params.id ).then( function ( user ) {
        var data = {
            'user': user,
            'msg': req.flash( 'msg' ),
            'err': req.flash( 'error' )
        };

        res.render( 'user-details', data );
    })
    .catch( function ( error ) {
        console.error( 'ERROR: At /admin/users/:id >>> ', error.message );
        req.flash( 'error', 'Unable to get user information, please try again.' );
        res.redirect( 'back' );
    });
});
