/* jshint node: true */
'use strict';

var _               = require('lodash');
var fs              = require('fs');
var multiparty      = require('multiparty');
var path            = require('path');
var Promise         = require('promise');
var router          = require('express').Router();

var config          = require( '../../config' );

var userRepository  = new config.UserRepository();
var userService     = new config.UserService( userRepository );


var FERR = 'Flash Subject - User Route Errors';
var FMSG = 'Flash Subject - User Route Messages';

var MIN_PASS_LENGTH = config.constants.MIN_PASS_LENGTH;


module.exports = router;


/** @todo Extract into a common library */
function cleanTemporaryFiles ( files ) {
    files.forEach( function ( file ) {
        fs.unlink( file.path );
    });
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

router.use( function ( req, res, next ) {
    res.locals.admin_nav = 'admin-users';
    next();
});


/**
 * GET /users/create
 * Responds with a form to create a new user.
 */
router.get( '/users/create', function ( req, res ) {
    var data = {
        'roles': userService.getRoleNames(),
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR )
    };
    res.render( 'user-create-form', data );
});

/**
 * POST /users/create
 * Process data to create a user, respond with the result.
 */
router.post( '/users/create', function ( req, res ) {
    var data = {
        'roles': userService.getRoleNames(),
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR )
    };

    parseFormData( req ).then( function ( formDTO ) {
        formDTO.fields.tier = formDTO.fields.role;
        var userDTO = userService.formatDTO( formDTO.fields );
        return userService.registerUser( userDTO );
    }, function ( error ) {
        console.error( 'Error at /users/create >>> ', error.message );
        req.flash( FERR, 'Error processing form, please try again.' );
        res.redirect( 'back' );
    })
    .then( function ( response ) {
        req.flash( FMSG, 'Successfully registered user.' );
        res.redirect( '/admin/users' );
    })
    .catch( function ( error ) {
        /** @todo inform of duplicate registration errors */
        console.error( 'Error at /users/create >>> ', error.message );
        req.flash( FERR, 'Error saving new user, please try again.' );
        res.redirect( 'back' );
    });
});

/**
 * GET /users
 * Responds with a list of all system users.
 *
 * @todo implement sorting, filtering, and paging
 */
router.get( '/users', function ( req, res ) {
    var data = {
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR )
    };

    userService.getUsers().then( function ( users ) {
        data.users = users.filter( function ( oneUser ) {
            return oneUser.id !== req.user.id;
        });
        res.render( 'user-list', data);
    })
    .catch( function ( error ) {
        console.error( 'Error at /users >>> ', error.message );
        req.flash( FERR, 'Unable to retrieve user directory, please try ' +
                'again or contact the system administrator' );
        res.redirect( 'back' );
    });
});

/**
 * GET /users/:id
 * Responds with account information for a specified user.
 */
router.get( '/users/:id', function ( req, res ) {
    var data = {
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR )
    };

    userService.getUser( req.params.id ).then( function ( user ) {
        data.user = user;
        res.render( 'user-details', data );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id >>> ', error.message );
        req.flash( FERR, 'Unable to get user information, please try again.' );
        res.redirect( 'back' );
    });
});

/**
 * GET /users/:id/reset-password
 * Responds with a form to reset a user's password
 */
router.get( '/users/:id/reset-password', function( req, res ) {
    var data = {
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR )
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
        var fields = formDTO.fields;

        /** @todo develop a password helper module */
        if ( fields.pass_new !== fields.pass_conf ) {
            req.flash( FERR, 'Passwords must match.' );
            res.redirect( 'back' );
        } else if ( _.trim( fields.pass_new ).length < MIN_PASS_LENGTH ) {
            var min_length = MIN_PASS_LENGTH.toString();
            req.flash( FERR, 'Password must be at least ' + min_length + ' characters.' );
            res.redirect( 'back' );
        } else {
            return userService.resetPassword( userID, formDTO.fields.pass_new );
        }
    }, function( error ) {
        console.error( 'Error at /users/:id/reset-password >>> ', error.message );
        req.flash( FERR, 'Error processing form, please try again.' );
        res.redirect( 'back' );
    })
    .then( function ( ) {
        req.flash( FMSG, 'Password reset successful.' );
        res.redirect( '/admin/users/' + userID );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id/reset-password >>> ', error.message );
        req.flash( FERR, 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

/**
 * GET /users/:id/edit-details
 * Responds with a form for editing a user's details.
 */
router.get( '/users/:id/edit-details', function ( req, res ) {
    var data = {
        'roles': userService.getRoleNames(),
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR )
    };

    /** @todo Fix this temporary thing **/
    data.roles = data.roles.map( function ( role ) {
        return _.snakeCase( role ).toUpperCase();
    });

    userService.getUser( req.params.id ).then( function ( user ) {
        data.user = user;
        res.render( 'user-edit-details', data );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id/edit-details >>> ', error.message );
        req.flash( FERR, 'Unkown error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

/**
 * POST /users/:id/edit-details
 * Process a request to update a user's details.
 */
router.post( '/users/:id/edit-details', function ( req, res ) {
    var id = req.params.id;

    parseFormData( req ).then( function ( formDTO ) {
        formDTO.fields.tier = formDTO.fields.role;
        var userDTO = userService.formatDTO( formDTO.fields );
        return userService.updateUser( id, userDTO );
    }, function ( error ) {
        console.error( 'Error at /users/:id/edit-details >>> ', error.message );
        req.flash( FERR, 'Unable to process form, please try again.' );
        res.redirect( 'back' );
    })
    .then( function ( success ) {
        req.flash( FMSG, 'User update successful.' );
        res.redirect( '/admin/users/' + id );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id/edit-details >>> ', error.message );
        req.flash( FERR, 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

/**
 * GET /users/delete/:id
 * Attempts to delete user with the given id
 */
router.get( '/users/:id/delete', function ( req, res ) {
    userService.removeUser( req.params.id ).then(
        function ( result ) {
            req.flash( FMSG, 'Successfully deleted user.' );
            res.redirect( '/admin/users' );
        },
        function ( error ) {
            req.flash( FERR, 'Unable to delete, please try again.' );
            res.redirect( '/admin/users' );
        }
    );
});

