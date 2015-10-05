/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var uuid = require('node-uuid');
var ObjectStorage = require( path.join( __dirname, '../../lib/object-storage-connection.js' ) );

/*
 * Helpers
 */

function storeFile ( file ) {
    var storeFilePromise;

    var fileMeta = {
        uuid : uuid.v4(),
        name : path.basename( file )
    };

    storeFilePromise = ObjectStorage
        .objectCreate(
            fileMeta.uuid,
            fs.createReadStream( file ),
            fileMeta.name
        );

    return storeFilePromise
        .then( function ( value ) {
            return fileMeta;
        });
}


/**
 * IBM Object Store Media Adapter
 *
 * @constructor
 */
function IBMObjStore () {}

/**
 * #put
 *
 * @param {Array} fileArray - Array of file paths to store
 */
IBMObjStore.prototype.put = function ( fileArray ) {
    if ( ! fileArray || 0 === fileArray.length ) {
        return Promise.resolve( [] );
    }

    return ObjectStorage.init()
        .then( function ( value ) {
            return Promise.all( fileArray.map( storeFile ) );
        });
};

module.exports = IBMObjStore;