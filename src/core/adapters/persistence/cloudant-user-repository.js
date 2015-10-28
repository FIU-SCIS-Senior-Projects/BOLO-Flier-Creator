/* jshint node:true */
'use strict';

var Promise = require('promise');

var db = require('../../lib/cloudant-promise').db.use('bolo');
var User = require('../../domain/user.js');

var DOCTYPE = 'user';

module.exports = CloudantUserRepository;

/**
 * Create a new CloudantUserRepository object
 *
 * @class
 * @memberof module:core/adapters
 * @classdesc Implements the interface for a User Storage Port to expose
 * operations which interact wht the Cloudant Database service.
 */
function CloudantUserRepository () {
    // contructor stub
}

/**
 * Insert a User into the repository
 */
CloudantUserRepository.prototype.insert = function ( user ) {
    var newuser = new User( user.data );
    newuser.data.Type = DOCTYPE;

    return db.insert( newuser.data )
        .then( function ( response ) {
            if ( !response.ok ) throw new Error( 'Problem adding user' );

            delete newuser.data.Type;
            newuser.data.id = response.id;

            return newuser;
        })
        .catch( function ( error ) {
            return error;
        });
};

CloudantUserRepository.prototype.getById = function ( id ) {
    return db.get( id )
        .then( function ( data ) {
            if ( !data._id ) throw new Error( data );
            userTransform( data );
            return new User( data );
        })
        .catch( function ( error ) {
            return Promise.reject(
                new Error( "Failed to get user by id: " + error )
            );
        });
};

CloudantUserRepository.prototype.getByUsername = function ( id ) {
    return db
        .view( 'users', 'by_username', {
            'key': id,
            'include_docs': true
        })
        .then( function ( found ) {
            if ( !found.rows.length ) return Promise.resolve( null );
            userTransform( found.rows[0].doc );
            return new User( found.rows[0].doc );
        })
        .catch( function ( error ) {
            return new Error( "Failed to get user by username" );
        });
};

CloudantUserRepository.prototype.remove = function ( id ) {
    // **UNDOCUMENTED OPERATION** cloudant/nano library destroys the database
    // if a null/undefined argument is passed into the `docname` argument for
    // db.destroy( docname, callback )
    if ( !id ) throw new Error( 'id cannot be null or undefined' );

    return db.get( id )
        .then( function ( user ) {
            return db.destroy( user._id, user._rev );
        })
        .catch( function ( error ) {
            return new Error( "Failed to delete user: " + error );
        });
};


/**
 * Transform the user doc to a suitable format for the User entity object.
 * @private
 */
function userTransform ( data ) {
    data.id = data._id;
    delete data._id;
    delete data._rev;
    delete data.Type;
}
