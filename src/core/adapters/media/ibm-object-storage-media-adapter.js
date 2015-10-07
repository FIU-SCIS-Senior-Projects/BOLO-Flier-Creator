/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var uuid = require('node-uuid');
var OStore = require( path.resolve( __dirname, '../../lib/ibm-object-storage' ) );

/** @module
 *
 * Media Storage Adapter using the IBM Object Storage library
 */
module.exports = IBMObjStore;


/* Module Global Connection */
var account = null;
var container = null;
var ready;


/**
 * IBM Object Store Media Adapter
 *
 * @constructor
 */
function IBMObjStore () {
    if ( ! account && ! container )
        module_init();
}


/**
 * #put
 *
 * @param {Array} fileArray - Array of file paths to store
 */
IBMObjStore.prototype.put = function ( fileArray ) {
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

