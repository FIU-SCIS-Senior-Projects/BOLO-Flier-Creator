/* jshint node:true */
'use strict';

var _ = require('lodash');
var Promise = require('promise');

var db = require('../../lib/cloudant-promise').db.use('bolo');
var User = require('../../domain/user.js');

var DOCTYPE = 'user';

/** Export the repository as a module **/
module.exports = CloudantUserRepository;


/**
 * Transform the cloudant doc into a suitable format for the User entity object.
 *
 * @param {Object} - the doc to transform to a user object
 * @returns {User} a user in the generic User entity format
 * @private
 */
function fromCloudant ( doc ) {
    var user = new User( doc );

    user.data.id = user.data._id;
    delete user.data._id;
    delete user.data._rev;
    delete user.data.Type;

    return user;
}

/**
 * Transform the user object to a format suitable for Cloudant.
 *
 * @param {User} - the user to transform
 * @returns {Object} user data in the Cloudant doc format
 * @private
 */
function toCloudant ( user ) {
    var dto = _.assign( {}, user.data );

    dto.Type = DOCTYPE;

    if ( dto.id ) {
        dto._id = dto.id;
        delete dto.id;
    }

    return dto;
}


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
    var userDTO = toCloudant( user );

    return db.insert( userDTO )
        .then( function ( response ) {
            if ( !response.ok ) throw new Error( 'Problem adding user' );

            userDTO._id = response.id;
            return fromCloudant( userDTO );
        })
        .catch( function ( error ) {
            return error;
        });
};

CloudantUserRepository.prototype.update = function ( user ) {
    var newdoc = toCloudant( user );

    return db.get( user.data.id ).then( function ( doc ) {
        newdoc._rev = doc._rev;
        return db.insert( newdoc );
    })
    .then( function ( response ) {
        if ( !response.ok ) {
            throw new Error( 'Unable to update User' );
        }
        return fromCloudant( newdoc );
    })
    .catch( function ( error ) {
        console.log( error );
        throw error;
    });
};

CloudantUserRepository.prototype.getAll = function () {
    return db.view( 'users', 'by_username', { 'include_docs': true } )
        .then( function ( docs ) {
            if ( ! docs.rows.length ) return Promise.resolve( null );

            return docs.rows.map( function ( row ) {
                return fromCloudant( row.doc );
            });
        })
        .catch( function ( error ) {
            return error;
        });
};

CloudantUserRepository.prototype.getById = function ( id ) {
    return db.get( id )
        .then( function ( doc ) {
            if ( !doc._id ) { return null; }
            return fromCloudant( doc );
        })
        .catch( function ( error ) {
            var msg = error.reason || error.mesage || error;
            throw new Error( "Unable to retrieve user data: " + msg );
        });
};

CloudantUserRepository.prototype.getByUsername = function ( id ) {
    return db.view( 'users', 'by_username', {
        'key': id,
        'include_docs': true
    })
    .then( function ( found ) {
        if ( !found.rows.length ) { return null; }
        return fromCloudant( found.rows[0].doc );
    })
    .catch( function ( error ) {
        var msg = error.reason || error.mesage || error;
        throw new Error( "Unable to retrive user data: " + msg );
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

