/*
 * Cloudant Storage Adapter
 *
 * Implements required interface for a Bolo Domain Storage Port for the
 * Cloudant Database.
 */

var cloudant = require('../../lib/cloudant-connection.js');

var adapter = function () {};

adapter.prototype.insert = function ( data ) {
    var db = cloudant.db.use('bolo');

    db.insert( data, function ( err, body ) {
        if ( err ) console.log( "cloudant-storage-adapter error: " +  err );
    });
};

module.exports = adapter;
