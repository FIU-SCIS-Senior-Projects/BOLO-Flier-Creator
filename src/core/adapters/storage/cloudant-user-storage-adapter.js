/* jshint node:true */
'use strict';

var Promise = require('promise');

var cloudant = require('../../lib/cloudant-connection');
var User = require('../../domain/user.js');

var DOCTYPE = 'user';

module.exports = CloudantUserStorageAdapter;

/**
 * Create a new CloudantUserStorageAdapter object
 *
 * @class
 * @memberof module:core/adapters
 * @classdesc Implements the interface for a User Storage Port to expose
 * operations which interact wht the Cloudant Database service.
 */
function CloudantUserStorageAdapter () {
    // contructor stub
}

/**
 * Insert a User into the repository
 */
CloudantUserStorageAdapter.prototype.insert = function ( user ) {
    var newuser = new User( user.data );
    newuser.data.doctype = DOCTYPE;

    return db.insert( newuser.data )
        .then( function ( response ) {
            if ( !response.ok ) throw new Error( 'Problem adding user' );

            delete newuser.data.doctype;
            newuser.data.id = response.id;

            return Promise.resolve( newuser );
        })
        .catch( function ( error ) {
            return Promise.reject( error );
        });
};

CloudantUserStorageAdapter.prototype.getById = function ( id ) {
    return db.get( id )
        .then( function ( data ) {
            if ( !data._id ) throw new Error( data );

            data.id = data._id;
            delete data._id;
            delete data._rev;
            delete data.doctype;

            return Promise.resolve( new User( data ) );
        })
        .catch( function ( error ) {
            return Promise.reject(
                new Error( "Failed to get user by id: " + error )
            );
        });
};

CloudantUserStorageAdapter.prototype.remove = function ( id ) {
    // **UNDOCUMENTED OPERATION** cloudant/nano library destroys the database
    // if a null/undefined argument is passed into the `docname` argument for
    // db.destroy( docname, callback )
    if ( !id ) throw new Error( 'id cannot be null or undefined' );

    return db.get( id )
        .then( function ( user ) {
            return db.destroy( user._id, user._rev );
        })
        .catch( function ( error ) {
            return Promise.reject( 
                new Error( "Failed to delete user: " + error )
            );
        });
};


var bolodb = cloudant.db.use('bolo');

/*
 * Wrapper for the cloudant db methods which take advantage of Promises.
 */
var db = {
    'insert' : function ( doc ) {
        return new Promise( function ( resolve, reject ) {
            bolodb.insert( doc, function ( err, body ) {
                if ( !err ) resolve( body );
                reject( err );
            });
        });
    },

    'get' : function ( docname ) {
        return new Promise( function ( resolve, reject ) {
            bolodb.get( docname, function ( err, body ) {
                if ( !err ) resolve( body );
                reject( err );
            });
        });
    },

    'destroy' : function ( docname, rev ) {
        return new Promise( function ( resolve, reject ) {
            bolodb.destroy( docname, rev, function ( err, body ) {
                if ( !err ) resolve( body );
                reject( err );
            });
        });
    }
};
