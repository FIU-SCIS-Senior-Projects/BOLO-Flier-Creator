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
 * GET /users/create
 * Responds with a form to create a new user.
 */
router.get( '/users/create', function ( req, res ) {
    var data = {
        'roles': userService.getRoleNames(),
        'msg': req.flash( 'msg' ),
        'err': req.flash( 'error' )
    };
    console.log( data );
    res.render( 'user-create-form', data );
});

/**
 * POST /users/create
 * Process data to create a user, respond with the result.
 */
router.post( '/users/create', function ( req, res ) {
    var data = {
        'roles': userService.getRoleNames(),
        'msg': req.flash( 'msg' ),
        'err': req.flash( 'error' )
    };

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
            if ( pData[1].files.length ) {
                cleanTemporaryFiles( pData[1].files );
            }
            data.msg.push( 'Successfully registered user.' );
            res.render( 'user-create-form', data );
        })
        .catch( function ( error ) {
            data.err.push( error.message );
            res.render( 'user-create-form', data );
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

/**
 * GET /users/:id/reset-password
 * Responds with a form to reset a user's password
 */
router.get( '/users/:id/reset-password', function( req, res ) {
    var data = {
        'msg': req.flash( 'msg' ),
        'err': req.flash( 'error' )
    };

    userService.getUser( req.params.id ).then( function ( user ) {
        data.user = user;
        res.render( 'user-reset-password', data );
    });
});

/**
 * POST /users/:id/reset-password
 * Process a request to reset a user's password.
 */
router.post( '/users/:id/reset-password', function( req, res ) {
    var userID = req.params.id;

    parseFormData( req ).then( function ( formDTO ) {
        if ( formDTO.fields.pass_new !== formDTO.fields.pass_conf ) {
            req.flash( 'error', 'Passwords must match.' );
            res.redirect( 'back' );
        } else {
            return userService.resetPassword( userID, formDTO.fields.pass_new );
        }
    }, function( error ) {
        console.error( 'Error at /users/:id/reset-password >>> ', error.message );
        req.flash( 'error', 'Error processing form, please try again.' );
        res.redirect( 'back' );
    })
    .then( function ( ) {
        req.flash( 'msg', 'Password reset successful.' );
        res.redirect( '/admin/users/' + userID );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id/reset-password >>> ', error.message );
        req.flash( 'error', 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

/**
 * GET /users/:id/edit-details
 * Responds with a form for editing a user's details.
 */
router.get( '/users/:id/edit-details', function ( req, res ) {
    var data = {
        'msg': req.flash( 'msg' ),
        'err': req.flash( 'error' )
    };

    userService.getUser( req.params.id ).then( function ( user ) {
        data.user = user;
        res.render( 'user-edit-details', data );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id/edit-details >>> ', error.message );
        req.flash( 'error', 'Unkown error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

/**
 * POST /users/:id/edit-details
 * Process a request to update a user's details.
 */
router.post( '/users/:id/edit-details', function ( req, res ) {
    req.flash( 'error', 'Submition processing not implemented yet.' );
    res.redirect( 'back' );
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

