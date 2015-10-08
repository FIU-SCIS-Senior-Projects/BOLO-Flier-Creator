/* jshint node: true */
'use strict';

var cloudant = require('../../lib/cloudant-connection.js');
var _ = require('lodash');
var Bolo = require('../../domain/bolo.js');
var db = cloudant.db.use('bolo');

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
    db.insert(data, function (err, body) {
        if (err) console.log("cloudant-storage-adapter error: " + err);
    });
};

CloudantStorageAdapter.prototype.getBolos = function (callback) {
    db.list({include_docs: true},function (err, body) {
        if (err) {
            console.log("cloudant-storage-adapter error: " + err);
        }
        else
        {
            callback(body.rows);
        }
    });
};

CloudantStorageAdapter.prototype.getBolo = function (id, callback) {
    db.get( id,function (err, body) {
        if (err) {
            console.log("cloudant-storage-adapter error: " + err);
        }
        else
        {
            var bolo = new Bolo();
            callback( _.defaultsDeep(bolo, body));
        }
    });
};
