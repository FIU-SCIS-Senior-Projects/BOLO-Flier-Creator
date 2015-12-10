/* jshint node: true */
'use strict';

var _               = require('lodash');
var Promise         = require('promise');

var config          = require('../../config');
var userService     = new config.UserService( new config.UserRepository() );
var agencyService   = new config.AgencyService( new config.AgencyRepository() );

var formUtil        = require('../../lib/form-util');
var passwordUtil    = require('../../lib/password-util');

var FERR = config.const.GFERR;
var FMSG = config.const.GFMSG;

var parseFormData = formUtil.parseFormData;
var cleanTemporaryFiles = formUtil.cleanTempFiles;
var FormError = formUtil.FormError;


/**
 * Responds with a form to create a new user.
 */
module.exports.getCreateForm = function ( req, res, next ) {
    var data = {
        'roles': userService.getRoleNames(),
        'form_errors': req.flash( 'form-errors' )
    };

    agencyService.getAgencies().then( function ( agencies ) {
        data.agencies = agencies;
        data.user = req.user;
        res.render( 'user-create-form', data );
    }).catch( next );
};


/**
 * Process data to create a user, respond with the result.
 */
module.exports.postCreateForm = function ( req, res ) {
    var data = {
        'roles': userService.getRoleNames(),
    };

    parseFormData( req ).then( function ( formDTO ) {
        var validationErrors = passwordUtil.validatePassword(
            formDTO.fields.password, formDTO.fields.confirm
        );

        /** @todo validate the rest of the form **/

        if ( validationErrors ) {
            req.flash( 'form-errors', validationErrors );
            throw new FormError();
        }

        formDTO.fields.tier = formDTO.fields.role;
        formDTO.fields.agency = formDTO.fields.agency || req.user.agency;
        formDTO.fields.notifications = [ formDTO.fields.agency ];
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
        if ( 'FormError' !== error.name ) throw error;
        res.redirect( 'back' );
    })
    .catch( function ( error ) {
        if ( ! /already registered/i.test( error.message ) ) throw error;
            req.flash( FERR, 'User already registered.' );
            res.redirect( 'back' );
    })
    .catch( function ( error ) {
        /** @todo inform of duplicate registration errors */
        console.error( 'Error at /users/create >>> ', error.message );
        req.flash( FERR, 'Error saving new user, please try again.' );
        res.redirect( 'back' );
    });
};

/**
 * Responds with a list of all system users.
 *
 * @todo implement sorting, filtering, and paging
 */
module.exports.getList = function ( req, res ) {
    var data = {};

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
};

/**
 * Responds with account information for a specified user.
 */
module.exports.getDetails = function ( req, res, next ) {
    var data = {};

    userService.getUser( req.params.id ).then( function ( user ) {
        data.user = user;
        return agencyService.getAgency( user.agency );
    }).then( function ( agency ) {
        data.agency = agency;
        res.render( 'user-details', data );
    }).catch( function ( error ) {
        req.flash( FERR, 'Unable to get user information, please try again.' );
        next( error );
    });
};

/**
 * Responds with a form to reset a user's password
 */
module.exports.getPasswordReset = function ( req, res ) {
    var data = {
        'form_errors': req.flash( 'form-errors' )
    };

    userService.getUser( req.params.id ).then( function ( user ) {
        data.user = user;
        res.render( 'user-reset-password', data );
    });
};

/**
 * Process a request to reset a user's password.
 */
module.exports.postPasswordReset = function ( req, res ) {
    var userID = req.params.id;

    parseFormData( req ).then( function ( formDTO ) {
        var validationErrors = passwordUtil.validatePassword(
            formDTO.fields.password, formDTO.fields.confirm
        );

        if ( validationErrors ) {
            req.flash( 'form-errors', validationErrors );
            throw new FormError();
        }

        return userService.resetPassword( userID, formDTO.fields.password );
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
        if ( 'FormError' !== error.name ) throw error;
        res.redirect( 'back' );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id/reset-password >>> ', error.message );
        req.flash( FERR, 'Unknown error occurred, please try again.' );
        res.redirect( 'back' );
    });
};

/**
 * Responds with a form for editing a user's details.
 */
module.exports.getEditDetails = function ( req, res ) {
    var data = {
        'roles': userService.getRoleNames()
    };

    var promises = Promise.all([
        userService.getUser( req.params.id ),
        agencyService.getAgencies()
    ]);

    promises.then( function ( _data ) {
        data.user = _data[0];
        data.agencies = _data[1];
        console.log( 'roles', JSON.stringify( data, null, 4 ) );
        res.render( 'user-edit-details', data );
    })
    .catch( function ( error ) {
        console.error( 'Error at /users/:id/edit-details >>> ', error.message );
        req.flash( FERR, 'Unkown error occurred, please try again.' );
        res.redirect( 'back' );
    });
};

/**
 * Process a request to update a user's details.
 */
module.exports.postEditDetails = function ( req, res ) {
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
};

/**
 * Attempts to delete user with the given id
 */
module.exports.getDelete = function ( req, res ) {
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
};

