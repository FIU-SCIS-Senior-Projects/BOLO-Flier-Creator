/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var uuid = require('node-uuid');

var OStore = require( path.resolve( __dirname, '../../lib/ibm-object-storage' ) );


module.exports = ObjectStorageMediaAdapter;


/* Static Connection Objects */
var account = null;
var container = null;
var ready;


/**
 * Create a new ObjectStorageMediaAdapter object.
 *
 * @class
 * @memberof module:core/adapters
 * @classdesc The ObjectStorageMediaAdapter implements the Media Port interface
 * exposing operations for storing media files to an Object Storage service.
 * @implements {MediaPort}
 */
function ObjectStorageMediaAdapter () {
    if ( ! account && ! container )
        module_init();
}


/**
 * Put files into the object storage.
 *
 * @param {String|Array} - Array of file paths to store
 * @returns {Promise|Object|Array} Resolves to an array containing meta data
 * for stored files.
 */
ObjectStorageMediaAdapter.prototype.put = function ( fileArray ) {
    if ( ! fileArray || 0 === fileArray.length ) {
        return Promise.resolve( [] );
    }

    return ready
        .then( function ( container ) {
            return Promise.all( fileArray.map( storeFile ) );
        });
};


/*
 * Helpers
 */
function module_init () {
    ready =  OStore.connect( 'bolo-app' )
        .then( function ( _account ) {
            account = _account;
            return account.useContainer( 'uploads' );
        })
        .then( function ( _container ) {
            container = _container;
            return Promise.resolve( 'a' );
        }, function ( error ) {
            return account.createContainer( 'uploads' );
        })
        .catch( function ( error ) {
            throw new Error( 'ibm-object-store-media-adapter: init failure' );
        });
}

function storeFile ( file ) {
    var fileMeta = {
        uuid : uuid.v4(),
        filename : path.basename( file )
    };

   return container
        .createObject(
            fileMeta.uuid,
            fs.createReadStream( file ),
            fileMeta.name
        )
        .then( function ( value ) {
            return fileMeta;
        });
}

