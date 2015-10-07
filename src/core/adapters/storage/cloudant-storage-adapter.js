/* jshint node: true */
'use strict';

var cloudant = require('../../lib/cloudant-connection.js');


module.exports = CloudantStorageAdapter;


/**
 * Create a new CloudantStorageAdapter object.
 *
 * @class
 * @memberof module:core/adapters
 * @classdesc Implements the interface for a Storage Port to expose operations
 * which interact with th Cloudant Database service.
 */
function CloudantStorageAdapter () {
    // constructor stub
}


/**
 * Insert data on the Cloudant Database
 *
 * @param {Object} - Data to store
 */
CloudantStorageAdapter.prototype.insert = function ( data ) {
    var db = cloudant.db.use('bolo');

    db.insert( data, function ( err, body ) {
        if ( err ) console.log( "cloudant-storage-adapter error: " +  err );
    });
};
